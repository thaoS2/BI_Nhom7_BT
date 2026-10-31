import pandas as pd
import matplotlib.pyplot as plt

print("Đang xử lý dữ liệu để mô phỏng chiến lược...")
# 1. Đọc dữ liệu
df = pd.read_csv('Global Superstore.csv', encoding='latin1')

# 2. Lọc lấy Nội thất (Furniture) tại APAC
apac_df = df[df['Market'] == 'APAC']
furn = apac_df[apac_df['Category'] == 'Furniture']

# 3. Tính toán Lợi nhuận hiện tại và Lợi nhuận kỳ vọng
current_profit = furn['Profit'].sum()

# Mô phỏng: Giả sử cắt bỏ khoản lỗ từ các đơn hàng bị lạm dụng chiết khấu > 20%
loss_from_high_discount = furn[furn['Discount'] > 0.2]['Profit'].sum() # Con số này đang bị âm sâu
target_profit = current_profit - loss_from_high_discount 

# 4. Vẽ biểu đồ KPI mô phỏng (Data-ink ratio chuẩn)
fig, ax = plt.subplots(figsize=(10, 4))

categories = ['Lợi nhuận Thực tế\n(Hiện tại)', 'Lợi nhuận Kỳ vọng\n(Nếu áp trần chiết khấu 20%)']
values = [current_profit, target_profit]
# Dùng màu Đỏ báo động cho hiện tại, màu Xanh lá cho mục tiêu giải quyết
colors = ['#d9534f', '#5cb85c'] 

bars = ax.barh(categories, values, color=colors, height=0.5)

# 5. Điền số tiền trực tiếp lên cột (Ghi chú KPI)
for bar in bars:
    ax.text(bar.get_width() - 5000, bar.get_y() + bar.get_height()/2, 
             f'${int(bar.get_width()):,}', 
             va='center', ha='right', color='white', fontweight='bold', fontsize=14)

# 6. Format dọn dẹp viền và trục (Triệt tiêu mực in thừa)
plt.title('Mô phỏng Lợi nhuận ngành Nội thất khi áp dụng "Trần chiết khấu 20%"', 
          fontsize=16, fontweight='bold', color='#333333', pad=25)

# Xóa toàn bộ 4 cạnh viền
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.spines['left'].set_visible(False)
ax.spines['bottom'].set_visible(False)

# Ẩn luôn trục X (vì đã ghi số trên cột rồi) và ẩn các vạch chia độ (ticks)
ax.xaxis.set_visible(False)
plt.tick_params(axis='y', length=0, labelsize=12)

# 7. Lưu và hiển thị
plt.tight_layout()
plt.savefig('BieuDo_TV5_KPI.png', dpi=300, transparent=True)
print("Đã vẽ xong! File ảnh 'BieuDo_TV5_KPI.png' đã sẵn sàng.")
plt.show()