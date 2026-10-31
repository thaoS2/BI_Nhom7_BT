"""Hàm và hằng số dùng chung cho notebook 02a (ER), 02b (Synthea) và 02c (lâm sàng).

Chủ sở hữu: Người 1. Các notebook chỉ import file này, không tự định nghĩa lại
muối, hàm băm, ngưỡng k hay cách chia nhóm tuổi, để hai nguồn không bị lệch nhau.
"""
from pathlib import Path
import os
import re
import json
import hmac
import hashlib
from datetime import datetime, timezone

import numpy as np
import pandas as pd


def find_root():
    """Tìm thư mục gốc của repo: thư mục chứa src/anon_common.py."""
    here = Path.cwd().resolve()
    for p in [here, *here.parents]:
        if (p / 'src' / 'anon_common.py').exists():
            return p
    raise RuntimeError('Không tìm thấy thư mục gốc repo (cần có src/anon_common.py).')


ROOT = find_root()
RAW = ROOT / 'data' / 'raw'
ANON = ROOT / 'data' / 'anonymized'
PROC = ROOT / 'data' / 'processed'
ANON.mkdir(parents=True, exist_ok=True)

# ---- Hằng số dùng chung ----
K_MIN = 5                                   # ngưỡng k-anonymity của nhóm
REF_DATE = pd.Timestamp('2021-12-31')       # mốc tính tuổi cho Synthea (dữ liệu kết thúc 11/2021)
AGE_BINS = [0, 18, 45, 65, 200]
AGE_LABELS = ['0-17', '18-44', '45-64', '65+']   # dùng chung cho cả hai mart

PLACEHOLDER_SALT = 'doi_thanh_chuoi_ngau_nhien_dai'


def _read_env_file(path):
    """Đọc .env đơn giản (KEY=VALUE) khi chưa cài python-dotenv."""
    values = {}
    if path.exists():
        for line in path.read_text(encoding='utf-8').splitlines():
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                k, v = line.split('=', 1)
                values[k.strip()] = v.strip().strip('"').strip("'")
    return values


def get_salt():
    """Lấy muối từ biến môi trường ANON_SALT (hoặc file .env). Dừng nếu thiếu, còn giá trị mẫu hoặc quá ngắn.

    Muối yếu làm phép băm có thể bị dò ngược: mã ER có dạng ###-##-#### chỉ có khoảng 10^9 khả năng.
    """
    salt = os.getenv('ANON_SALT') or _read_env_file(ROOT / '.env').get('ANON_SALT')
    assert salt, 'Thiếu ANON_SALT: sao chép .env.example thành .env và đặt muối thật.'
    assert salt != PLACEHOLDER_SALT, 'ANON_SALT vẫn là giá trị mẫu.'
    assert len(salt) >= 16, 'ANON_SALT quá ngắn (cần tối thiểu 16 ký tự).'
    return salt


def pseudonymize(value, salt=None):
    """HMAC-SHA256 có khóa là muối; lấy 16 ký tự hex đầu (64 bit).

    Cùng một mã gốc luôn cho cùng một mã băm, ở mọi bảng và mọi notebook dùng chung muối,
    nên các bảng trong cùng một nguồn vẫn nối được với nhau.
    """
    salt = salt or get_salt()
    return hmac.new(salt.encode(), str(value).encode(), hashlib.sha256).hexdigest()[:16]


def sha256_file(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(1 << 20), b''):
            h.update(chunk)
    return h.hexdigest()


class Auditor:
    """Ghi nhật ký chạy cho một notebook. Mỗi notebook ghi một file riêng để mỗi file chỉ có một chủ sở hữu."""

    def __init__(self, notebook):
        self.record = {'notebook': notebook, 'inputs': {}, 'outputs': {}, 'dropped_columns': {}}

    def read_csv(self, name, folder=None, **kw):
        path = (folder or RAW) / name
        df = pd.read_csv(path, **kw)
        self.record['inputs'][name] = {'sha256': sha256_file(path), 'bytes': path.stat().st_size, 'rows': len(df)}
        return df

    def write_csv(self, df, name):
        path = ANON / name
        df.to_csv(path, index=False)
        self.record['outputs'][name] = {'sha256': sha256_file(path), 'bytes': path.stat().st_size,
                                        'rows': len(df), 'columns': list(df.columns)}

    def save(self, filename):
        """Thêm một dòng vào file .jsonl. Không ghi muối hay dữ liệu bệnh nhân.

        Người chạy lấy từ biến môi trường RUN_BY (mã thành viên, ví dụ TV1), không dùng tên đăng nhập hệ điều hành.
        """
        salt = get_salt()
        rec = {'run_utc': datetime.now(timezone.utc).isoformat(timespec='seconds'),
               'run_by': os.getenv('RUN_BY', 'unknown'),
               'salt_configured': True, 'salt_length': len(salt), 'k_threshold': K_MIN, **self.record}
        with open(ANON / filename, 'a', encoding='utf-8') as f:
            f.write(json.dumps(rec, ensure_ascii=False) + '\n')


def class_sizes(df, cols):
    """Kích thước nhóm tương đương của từng dòng theo bộ thuộc tính gián tiếp."""
    return df.groupby(cols)[cols[0]].transform('size')


def k_report(df, cols, dataset, label):
    """k = kích thước nhóm tương đương nhỏ nhất theo bộ thuộc tính gián tiếp."""
    sizes = df.groupby(cols).size()
    per_row = class_sizes(df, cols)
    return {
        'dataset': dataset, 'qi_set': label, 'qi_columns': '+'.join(cols),
        'k_min': int(sizes.min()), 'equivalence_classes': int(len(sizes)),
        'records_in_class_lt_k': int((per_row < K_MIN).sum()),
        'pct_records_in_class_lt_k': round(100 * (per_row < K_MIN).mean(), 1),
        'unique_records': int((per_row == 1).sum()),
    }


SSN_PATTERN = re.compile(r'\b\d{3}-\d{2}-\d{4}\b')


def scan_leftovers(outputs, raw_ids, forbidden_cols):
    """Quét sót định danh: mẫu số an sinh xã hội, mã gốc, và cột định danh còn lại trong các bảng đầu ra."""
    problems = []
    for name, df in outputs.items():
        for col in df.columns:
            if not (pd.api.types.is_object_dtype(df[col]) or pd.api.types.is_string_dtype(df[col])):
                continue
            n = int(df[col].astype(str).str.contains(SSN_PATTERN).sum())
            if n:
                problems.append((name, col, n))
    leaked = {name: int(df['patient_hash'].isin(raw_ids).sum())
              for name, df in outputs.items() if 'patient_hash' in df.columns}
    leftover = [(n, c) for n, d in outputs.items() for c in d.columns if c in forbidden_cols]
    assert not problems, f'Còn mẫu SSN: {problems}'
    assert all(v == 0 for v in leaked.values()), f'Mã gốc lọt sang đầu ra: {leaked}'
    assert not leftover, f'Còn cột định danh: {leftover}'
