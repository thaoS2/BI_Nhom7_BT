# Nguồn dữ liệu

`data/raw/` không được đưa lên Git. Mỗi thành viên tải dữ liệu về máy theo bảng dưới. Cả hai nguồn là dữ liệu **giả lập**, không phải dữ liệu bệnh viện thật.

| File | Nguồn | Giấy phép | Ngày tải |
|---|---|---|---|
| `Hospital Emergency Room Data Raw.csv` | Bộ "Hospital Emergency Room Data" lưu hành trên các nền tảng dữ liệu công khai (Maven Analytics, Kaggle). Chưa xác định được đơn vị phát hành gốc. **Link nhóm đã tải: [điền]** | **[điền]**. Chưa xác minh được; không ghi giấy phép nếu chưa đọc được trên trang tải | **[điền]** |
| `patients.csv`, `encounters.csv`, `providers.csv`, `organizations.csv` | Synthea, bản mẫu "1,000 Sample Synthetic Patient Records, CSV" (SyntheticMass, MITRE): https://synthea.mitre.org/downloads | Phần mềm Synthea theo Apache-2.0; dữ liệu mẫu do MITRE phát hành như dữ liệu tổng hợp mở.| 24/05/2017|
| (tùy chọn) file điều trị lâm sàng | Do giảng viên cung cấp | Chỉ dùng khi được phép; phải ẩn danh trước khi đưa vào repo | Chưa nhận |

## Thống kê sau khi tải (đã kiểm tra)

| File | Số dòng | Khoảng thời gian | Ghi chú |
|---|---|---|---|
| `Hospital Emergency Room Data Raw.csv` | 9.216 | 01/04/2023 đến 30/10/2024 | 12 cột, trong đó `Patient Admission Flag` xuất hiện hai lần |
| `patients.csv` | 1.163 | sinh 1911 đến 2021 | 1.000 người còn sống và 163 người đã mất |
| `encounters.csv` | 61.459 | 1912 đến 19/11/2021 | 34.640 dòng từ năm 2011 trở đi |
| `providers.csv` | 5.056 | | Mọi nhà cung cấp có chuyên khoa `GENERAL PRACTICE` |
| `organizations.csv` | 1.127 | | `REVENUE` bằng 0 ở mọi dòng |

Khóa nối của Synthea (`PATIENT`, `PROVIDER`, `ORGANIZATION`) khớp 100%.

## Cách xử lý (xem `notebook/02_anonymization.ipynb`)

- Chạy notebook 02 trước mọi bước khác. Notebook đọc `data/raw/` và ghi `data/anonymized/` (5 file `*_anon.csv`, bảng kê trường định danh, báo cáo k-anonymity, nhật ký chạy).
- Cần `ANON_SALT` trong `.env` (tối thiểu 16 ký tự, cả nhóm dùng **cùng một muối** để mã băm khớp nhau giữa các lần chạy). Không commit muối.
- Cạm bẫy: nhãn `None` ở `Department Referral` nghĩa là *không chuyển khoa*. Đọc CSV bằng `keep_default_na=False, na_values=['']`, nếu không pandas sẽ coi 5.400 dòng này là thiếu dữ liệu.

## Lưu ý
- Dữ liệu gốc có các trường giống định danh (mã bệnh nhân dạng số an sinh xã hội, họ tên, địa chỉ). Dù là dữ liệu giả lập, chỉ làm việc tiếp từ `data/anonymized/` sau khi chạy notebook 02.
- Trước khi commit `data/anonymized/`, xem mục 6 của `CONTRIBUTING.md` và kiểm tra `k_anonymity_report.csv` đạt k ≥ 5 cho bộ nhân khẩu học.
