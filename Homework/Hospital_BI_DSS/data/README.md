# Nguồn dữ liệu

`data/raw/` không được đưa lên Git. Mỗi thành viên tải dữ liệu về máy theo bảng dưới.

| File | Nguồn | Ghi chú |
|---|---|---|
| `Hospital_Emergency_Room_Data_Raw.csv` | Bộ "Hospital Emergency Room" (Kaggle hoặc Maven Analytics) | Dán link, giấy phép, ngày tải |
| `patients.csv`, `encounters.csv`, `providers.csv`, `organizations.csv` | Synthea, bản mẫu "1,000 Sample Synthetic Patient Records, CSV" (SyntheticMass) | Dán link, giấy phép, ngày tải |
| (tùy chọn) file điều trị lâm sàng | Do giảng viên cung cấp | Chỉ dùng khi được phép; phải ẩn danh trước khi đưa vào repo |

## Cần điền
- Link tải chính thức, giấy phép sử dụng, ngày tải của từng nguồn.
- Khoảng thời gian của dữ liệu và số dòng sau khi tải.

## Lưu ý
- Dữ liệu gốc có các trường giống định danh (mã bệnh nhân, họ tên, SSN...). Dù là dữ liệu giả lập, chỉ làm việc tiếp từ `data/anonymized/` sau khi chạy notebook 02.
