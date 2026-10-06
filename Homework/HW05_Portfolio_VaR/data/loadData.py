import yfinance as yf
import os

# ==========================================
# 1. Khai báo danh mục tài sản
# ==========================================

tickers = ['BTC-USD', 'GLD', 'SPY']

start_date = '2023-01-01'
end_date = '2025-01-01'   # Yahoo Finance không bao gồm ngày end_date

# ==========================================
# 2. Tải dữ liệu thô từ Yahoo Finance
# ==========================================

print("Đang tiến hành tải dữ liệu thô từ Yahoo Finance...")

data = yf.download(
    tickers,
    start=start_date,
    end=end_date,
    auto_adjust=False
)

# Lấy giá Adjusted Close
raw_data = data['Adj Close']

# ==========================================
# 3. Xác định thư mục data hiện tại
# ==========================================

current_dir = os.path.dirname(os.path.abspath(__file__))

file_path = os.path.join(
    current_dir,
    'raw_portfolio_2023_2024.csv'
)

# ==========================================
# 4. Lưu dữ liệu thô
# ==========================================

raw_data.to_csv(file_path)

print("\nKÍCH THƯỚC DỮ LIỆU THÔ:")
print(raw_data.shape)

print("\nCÁC TÀI SẢN:")
print(raw_data.columns.tolist())

print("\nĐÃ TẢI VÀ LƯU DỮ LIỆU THÔ TẠI:")
print(file_path)