const express = require('express');
const router = express.Router();
const Fashion = require('../models/Fashion');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Cấu hình multer lưu ảnh
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// GET /api/fashions - Trả về toàn bộ Fashion, sắp xếp theo ngày tạo giảm dần
router.get('/', async (req, res) => {
  try {
    const fashions = await Fashion.find().sort({ ngaytao: -1 });
    res.json({ success: true, data: fashions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/fashions/style/:style - Lọc Fashion theo Style
router.get('/style/:style', async (req, res) => {
  try {
    const style = decodeURIComponent(req.params.style);
    const fashions = await Fashion.find({ style: { $regex: new RegExp('^' + style + '$', 'i') } }).sort({ ngaytao: -1 });
    res.json({ success: true, data: fashions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/fashions/styles - Trả về danh sách các Style duy nhất
router.get('/styles', async (req, res) => {
  try {
    const styles = await Fashion.distinct('style');
    res.json({ success: true, data: styles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/fashions/:id - Trả về một Fashion theo id
router.get('/:id', async (req, res) => {
  try {
    const fashion = await Fashion.findById(req.params.id);
    if (!fashion) return res.status(404).json({ success: false, message: 'Không tìm thấy Fashion' });
    res.json({ success: true, data: fashion });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/fashions - Thêm mới Fashion
router.post('/', upload.single('thumbnail'), async (req, res) => {
  try {
    const { tieude, chitiet, style, ngaytao } = req.body;
    let thumbnail = req.body.thumbnail || '';
    if (req.file) {
      thumbnail = '/uploads/' + req.file.filename;
    }
    const fashion = new Fashion({ tieude, chitiet, thumbnail, style, ngaytao: ngaytao || Date.now() });
    const saved = await fashion.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/fashions/:id - Cập nhật Fashion
router.put('/:id', upload.single('thumbnail'), async (req, res) => {
  try {
    const { tieude, chitiet, style, ngaytao } = req.body;
    const updateData = { tieude, chitiet, style };
    if (ngaytao) updateData.ngaytao = ngaytao;
    if (req.file) {
      updateData.thumbnail = '/uploads/' + req.file.filename;
    } else if (req.body.thumbnail !== undefined) {
      updateData.thumbnail = req.body.thumbnail;
    }
    const fashion = await Fashion.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!fashion) return res.status(404).json({ success: false, message: 'Không tìm thấy Fashion' });
    res.json({ success: true, data: fashion });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/fashions/:id - Xóa Fashion
router.delete('/:id', async (req, res) => {
  try {
    const fashion = await Fashion.findByIdAndDelete(req.params.id);
    if (!fashion) return res.status(404).json({ success: false, message: 'Không tìm thấy Fashion' });
    res.json({ success: true, message: 'Đã xóa Fashion thành công' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

