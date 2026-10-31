const mongoose = require('mongoose');

const FashionSchema = new mongoose.Schema({
  tieude: {
    type: String,
    required: true,
    trim: true
  },
  chitiet: {
    type: String,
    default: ''
  },
  thumbnail: {
    type: String,
    default: ''
  },
  style: {
    type: String,
    required: true,
    trim: true
  },
  ngaytao: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Fashion', FashionSchema);

