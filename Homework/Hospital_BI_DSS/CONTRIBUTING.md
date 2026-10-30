# Quy ước làm việc nhóm – Hospital_BI_DSS (Nhóm 7)

Tài liệu này là quy ước chung của nhóm. Đọc hết một lần trước khi viết dòng code đầu tiên. Cần đổi quy ước thì báo cả nhóm và sửa file này qua Pull Request.

## 1. Cấu trúc Medallion và luật đọc, ghi

| Tầng | Thư mục | Nội dung | Notebook ghi vào | Commit lên Git? |
|---|---|---|---|---|
| Bronze | `data/raw/` | Dữ liệu gốc, giữ nguyên | Không ai ghi (chỉ tải về) | **Không** (đã chặn trong `.gitignore`) |
| Silver | `data/anonymized/` | Dữ liệu đã làm sạch và ẩn danh hóa | `02a_clean_anonymize_er`, `02b_clean_anonymize_synthea` | Chỉ sau khi kiểm tra ẩn danh xong (mục 6) |
| Gold | `data/processed/` | Bảng Fact và Dim của hai Data Mart | `03_etl_er_mart`, `04_etl_cost_mart` | Có |

Ba luật bắt buộc:

1. **Mỗi notebook chỉ đọc tầng ngay trước nó và chỉ ghi tầng của mình.** ETL (03, 04) chỉ đọc `data/anonymized/`, không đọc `data/raw/`.
2. **Không sửa tay file CSV** trong `anonymized/` và `processed/`. Mọi thay đổi phải đến từ code để chạy lại là ra cùng kết quả.
3. **Mỗi file đầu ra chỉ do một notebook ghi.** Bảng dưới đây là nguồn sự thật:

| Notebook | File được ghi |
|---|---|
| `02a_clean_anonymize_er` | `data/anonymized/`: các file của nguồn ER |
| `02b_clean_anonymize_synthea` | `data/anonymized/`: các file của nguồn Synthea |
| `03_etl_er_mart` | `data/processed/`: `Fact_ER_Visit`, `Dim_Patient_ER`, `Dim_Department`, `Dim_Date`, `Dim_Time` |
| `04_etl_cost_mart` | `data/processed/`: `Fact_Care_Cost`, `Dim_Patient_Cost`, `Dim_Doctor`, `Dim_Hospital`, `Dim_EncounterClass` |

`Dim_Date` và `Dim_Time` là chiều dùng chung: **chỉ notebook 03 sinh ra**, notebook 04 chỉ đọc lại. Nhờ vậy hai mart luôn dùng cùng một lịch. Hai notebook 02a và 02b phải dùng **cùng muối `ANON_SALT` và cùng quy tắc ẩn danh**; Thành viên 1 giữ quy tắc chung.

## 2. Ai sở hữu phần nào

Mỗi file có một người sở hữu. Người khác muốn sửa thì làm trên nhánh riêng và gửi Pull Request cho chủ sở hữu duyệt, không sửa thẳng. Bảng theo sheet Timeline; thay bằng tên thật khi đã chốt.

| Phần | Chủ sở hữu |
|---|---|
| `notebook/01a_*`, `02a_*`, `02c_*`, `05a_*` | Data Engineer (Thành viên 1) |
| `notebook/03_*`, `sql/` (DDL, OLAP), sơ đồ schema, mô phỏng | Data Architect (Thành viên 2) |
| `dashboard/` (trang Tổng quan, trang Vận hành), `figures/` | BI Developer (Thành viên 3) |
| `docs/` báo cáo, `README.md`, `CONTRIBUTING.md`, `.gitignore` | Project Manager (Thành viên 4) |
| `notebook/01b_*`, `02b_*`, `04_*`, `05b_*`, slide trong `docs/` | Data Engineer 2 (Thành viên 5) |

Riêng file `.pbix`: Thành viên 3 sở hữu, nhưng trang Chi phí do Thành viên 5 làm. Hai người chỉ sửa **lần lượt**: người đang sửa báo trong nhóm, push xong thì báo người kia.

## 3. Quy ước đặt tên

**Nhánh:** `feature/<tv>-<việc>`, `fix/<tv>-<việc>`, `docs/<tv>-<việc>`. Ví dụ `feature/tv2-etl-cost-mart`. Chữ thường, không dấu, nối bằng dấu gạch ngang.

**Commit:** `<loại>(<phạm vi>): <mô tả ngắn>`

| Loại | Dùng khi |
|---|---|
| `feat` | thêm chức năng hoặc bảng mới |
| `fix` | sửa lỗi |
| `data` | thay đổi liên quan dữ liệu đã xử lý |
| `docs` | báo cáo, README, tài liệu |
| `refactor` | sắp xếp lại code, không đổi kết quả |
| `chore` | việc lặt vặt (cấu hình, dọn dẹp) |

Ví dụ: `feat(etl): thêm Dim_Date phủ 2011 đến 2024`, `fix(anonymization): bỏ cột họ tên còn sót`.

**Notebook:** `NN_ten_mo_ta.ipynb`, số thứ tự cố định, không đổi số khi đã có người dùng. Không tạo bản sao kiểu `03_etl_final_v2.ipynb`; muốn thử nghiệm thì làm trên nhánh.

**File dữ liệu:** `Fact_<Ten>.csv`, `Dim_<Ten>.csv`, viết hoa chữ đầu mỗi từ, nối bằng dấu gạch dưới. Tên cố định, không thêm ngày hay số phiên bản.

**Cột dữ liệu:** `snake_case`, không dấu.

| Loại cột | Quy ước | Ví dụ |
|---|---|---|
| Khóa thay thế | `<ten>_key` | `patient_key` |
| Mã gốc từ nguồn | `<ten>_id` | `encounter_id` |
| Cờ đúng/sai | `is_<ten>` | `is_admitted` |
| Ngày | `<ten>_date` | `visit_date` |
| Số đo kèm đơn vị | hậu tố đơn vị | `wait_time_min`, `total_cost_usd` |

## 4. Quy trình Git từng bước

**Cài đặt một lần**
```bash
git config --global user.name "Họ Tên"
git config --global user.email "email@example.com"
git config --global core.autocrlf true    # chỉ máy Windows
git clone <link repo của nhóm>
cd BI_Nhom7_BT/Homework/Hospital_BI_DSS
python -m venv .venv
.venv\Scripts\activate                    # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env                      # rồi đặt ANON_SALT do nhóm thống nhất
```
Đặt dữ liệu gốc vào `data/raw/` theo `data/README.md`.

**Mỗi lần bắt đầu một việc**
```bash
git switch main
git pull origin main
git switch -c feature/tv2-etl-cost-mart     # tạo nhánh mới từ main mới nhất
```

**Trong lúc làm việc, commit nhỏ và thường xuyên**
```bash
git status                                  # luôn xem trước khi add
git add notebook/04_etl_cost_mart.ipynb     # add đúng file, tránh "git add ."
git commit -m "feat(etl): dựng Dim_Doctor và Dim_Hospital"
git push -u origin feature/tv2-etl-cost-mart   # lần đầu; các lần sau chỉ cần git push
```

**Khi main có thay đổi mới trong lúc đang làm**
```bash
git switch main
git pull origin main
git switch feature/tv2-etl-cost-mart
git merge main
```
Nếu Git báo xung đột, mở file có dấu `<<<<<<<`, giữ phần đúng, xóa các dấu, rồi `git add` và `git commit`. Xung đột ở notebook thì hỏi chủ sở hữu thay vì tự chọn.

**Hoàn thành việc:** vào GitHub, tạo Pull Request từ nhánh vào `main`, gán chủ sở hữu file làm người duyệt. Chỉ gộp khi đã có ít nhất một người xem.

**Không bao giờ:**
- push thẳng lên `main`;
- dùng `git push --force`;
- commit `data/raw/`, `.env` hoặc muối băm.

## 5. Quy ước viết notebook

- Chạy lại toàn bộ từ trên xuống (Restart and Run All) trước khi commit, đảm bảo không lỗi.
- **Xóa output** trước khi commit (Edit → Clear Outputs of All Cells) để tránh xung đột khi gộp. Có thể dùng `nbstripout` để tự động.
- Dùng đường dẫn tính từ `ROOT` (đã có sẵn ở ô đầu notebook), không dùng đường dẫn tuyệt đối như `C:\Users\...`.
- Muối băm lấy từ `ANON_SALT` trong `.env`, không viết vào code.
- Ghi ở ô đầu: mục đích, file đọc vào, file ghi ra.

## 6. Quyền riêng tư và dữ liệu

Trước khi commit bất kỳ file nào trong `data/anonymized/` hoặc `data/processed/`:

- [ ] Không còn mã bệnh nhân gốc, họ tên, số giấy tờ, địa chỉ, tọa độ.
- [ ] Mã bệnh nhân đã được thay bằng khóa thay thế (đã băm có muối).
- [ ] Tuổi đã nhóm, không còn ngày sinh đầy đủ.
- [ ] Kết quả kiểm tra k-anonymity đã được ghi trong notebook 02.

Nếu lỡ commit dữ liệu thô hoặc `.env` lên GitHub: báo ngay cho cả nhóm. Đừng tự xóa lịch sử một mình, vì sẽ làm hỏng nhánh của người khác.

## 7. File nhị phân (`.pbix`, `.docx`, `.pptx`)

Git không gộp được các file này. Quy tắc: tại một thời điểm chỉ một người sửa, báo trong nhóm trước khi mở và sau khi push xong. Báo cáo nên viết trên Google Docs (link ở sheet Timeline) rồi xuất ra `docs/` ở bản chốt, đừng commit mỗi lần sửa.

## 8. Checklist trước khi tạo Pull Request

- [ ] Nhánh đặt tên đúng quy ước và đã merge `main` mới nhất.
- [ ] Notebook chạy từ trên xuống không lỗi, đã xóa output.
- [ ] Chỉ ghi vào file mình sở hữu (mục 1 và 2).
- [ ] Tên file và tên cột đúng quy ước (mục 3).
- [ ] `git status` không có `data/raw/`, `.env`, file tạm.
- [ ] Mô tả Pull Request nói rõ đã thay đổi gì và ảnh hưởng đến bảng nào.
