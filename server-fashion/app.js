const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 4000;
const MONGO_URI = 'mongodb://localhost:27017/FashionData';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Phục vụ file ảnh tĩnh
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Kết nối MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Đã kết nối MongoDB - FashionData'))
  .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err.message));

// Routes
const fashionRoutes = require('./routes/fashion');
app.use('/api/fashions', fashionRoutes);

// Route mặc định
app.get('/', (req, res) => {
  res.json({
    message: 'Fashion API Server đang chạy',
    port: PORT,
    endpoints: [
      'GET  /api/fashions           - Toàn bộ fashion (giảm dần ngày tạo)',
      'GET  /api/fashions/styles    - Danh sách styles',
      'GET  /api/fashions/style/:style - Lọc theo style',
      'GET  /api/fashions/:id       - Chi tiết fashion',
      'POST /api/fashions           - Thêm mới fashion',
      'PUT  /api/fashions/:id       - Cập nhật fashion',
      'DELETE /api/fashions/:id     - Xóa fashion'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});

