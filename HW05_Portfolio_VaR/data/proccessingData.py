import pandas as pd
import numpy as np
import os

# ==========================================
# 1. Xác định đường dẫn
# ==========================================

current_dir = os.path.dirname(os.path.abspath(__file__))

raw_file = os.path.join(
    current_dir,
    'raw_portfolio_2023_2024.csv'
)

processed_file = os.path.join(
    current_dir,
    'processed_portfolio_2023_2024.csv'
)

# ==========================================
# 2. Đọc dữ liệu thô
# ==========================================

print("Đang đọc dữ liệu thô...")

data = pd.read_csv(
    raw_file,
    index_col=0,
    parse_dates=True
)

# Đặt tên cho cột thời gian
data.index.name = 'Date'

print("\nKÍCH THƯỚC DỮ LIỆU BAN ĐẦU:")
print(data.shape)

print("\n5 DÒNG DỮ LIỆU ĐẦU TIÊN:")
print(data.head())

# ==========================================
# 3. Kiểm tra dữ liệu thiếu
# ==========================================

print("\nSỐ LƯỢNG GIÁ TRỊ THIẾU:")
print(data.isnull().sum())

# ==========================================
# 4. Làm sạch dữ liệu
# ==========================================

# Loại bỏ các dòng không có đủ dữ liệu
data_clean = data.dropna()

print("\nKÍCH THƯỚC SAU KHI LÀM SẠCH:")
print(data_clean.shape)

print("\nSỐ LƯỢNG GIÁ TRỊ THIẾU SAU KHI LÀM SẠCH:")
print(data_clean.isnull().sum())

# ==========================================
# 5. Tính Log Return
# ==========================================

print("\nĐang tính Log Return...")

log_returns = np.log(
    data_clean / data_clean.shift(1)
)

# Dòng đầu tiên không có ngày trước đó
log_returns = log_returns.dropna()

# ==========================================
# 6. Đổi tên cột
# ==========================================

log_returns.columns = [
    'BTC_Return',
    'GLD_Return',
    'SPY_Return'
]

# ==========================================
# 7. Kiểm tra kết quả
# ==========================================

print("\n5 DÒNG LOG RETURN ĐẦU TIÊN:")
print(log_returns.head())

print("\nTHỐNG KÊ MÔ TẢ:")
print(log_returns.describe())

print("\nKÍCH THƯỚC DATASET SAU XỬ LÝ:")
print(log_returns.shape)

# ==========================================
# 8. Lưu dataset đã xử lý
# ==========================================

log_returns.to_csv(processed_file)

print("\nĐÃ LƯU DATASET ĐÃ XỬ LÝ TẠI:")
print(processed_file)