# Hospital BI/DSS – Kho dữ liệu và Dashboard hỗ trợ quản trị bệnh viện tư nhân

Dự án cuối kỳ môn **Trí tuệ doanh nghiệp và Hệ hỗ trợ ra quyết định** (Đề tài 3) – **Nhóm 7**.

## Mục tiêu
Xây dựng hai Data Mart theo Kimball (Star Schema), quy trình ETL, thao tác OLAP và Executive Dashboard cho Giám đốc bệnh viện; ẩn danh hóa dữ liệu bệnh nhân; trả lời câu hỏi quản trị về thời gian chờ và cân bằng chi phí với chất lượng.

## Dữ liệu (xem `data/README.md`)
- **Hospital Emergency Room**: dữ liệu cấp cứu giả lập, 9.216 lượt, 04/2023 đến 10/2024 → Mart 1 (vận hành cấp cứu).
- **Synthea (1.000 bệnh nhân mẫu, CSV)**: dữ liệu bệnh nhân tổng hợp → Mart 2 (chi phí lượt khám).
- (Tùy chọn) bảng điều trị lâm sàng do giảng viên gợi ý (oxy, kháng sinh), chỉ dùng khi được cung cấp đầy đủ.

**Giới hạn cần nêu trong báo cáo:** cả hai nguồn là dữ liệu giả lập; hai bộ không trùng thời gian; dữ liệu ER gần như phẳng theo giờ.

## Cấu trúc thư mục
| Thư mục | Nội dung | Medallion |
|---|---|---|
| `data/raw/` | dữ liệu gốc, **không commit** | Bronze |
| `data/anonymized/` | dữ liệu sau ẩn danh hóa (đầu ra notebook 02) | Silver |
| `data/processed/` | bảng Fact và Dim của hai mart | Gold |
| `notebook/` | các notebook theo thứ tự chạy | |
| `sql/` | DDL Star Schema, truy vấn OLAP | |
| `dashboard/` | file Power BI hoặc Tableau | |
| `docs/` | báo cáo, slide, sơ đồ schema | |
| `figures/` | ảnh chụp dashboard và hình minh họa | |

## Thứ tự chạy notebook
1. `01_data_quality_eda.ipynb`: khảo sát và kiểm tra chất lượng.
2. `01b_clinical_unpivot_optional.ipynb`: unpivot dữ liệu lâm sàng (tùy chọn).
3. `02_anonymization.ipynb`: ẩn danh hóa (đọc `data/raw`, ghi `data/anonymized`).
4. `03_etl_er_mart.ipynb` và `04_etl_cost_mart.ipynb`: ETL cho hai mart (chỉ đọc `data/anonymized`, ghi `data/processed`).
5. `05_analysis.ipynb`: phân tích phục vụ dashboard và báo cáo.

## Bảng đầu ra dự kiến trong `data/processed/`
`Fact_ER_Visit`, `Fact_Care_Cost`, `Dim_Patient_ER`, `Dim_Patient_Cost`, `Dim_Doctor`, `Dim_Department`, `Dim_EncounterClass`, `Dim_Date`, `Dim_Time`, và `Dim_Hospital` (nếu dùng `organizations.csv`).

## Cài đặt
```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # rồi đặt ANON_SALT thật
```
Đặt dữ liệu gốc vào `data/raw/` theo hướng dẫn trong `data/README.md`.

## Quy ước làm việc nhóm
Xem chi tiết trong [`CONTRIBUTING.md`](CONTRIBUTING.md): luật đọc ghi theo Medallion, đặt tên, quy trình Git, checklist Pull Request.
