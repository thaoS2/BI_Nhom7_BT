const mongoose = require('mongoose');
const Fashion = require('./models/Fashion');

const MONGO_URI = 'mongodb://localhost:27017/FashionData';

const sampleData = [
  // Style: Casual
  {
    tieude: 'Áo thun basic trắng',
    chitiet: '<p><strong>Áo thun basic màu trắng</strong> là item không thể thiếu trong tủ đồ của bất kỳ ai. Chất liệu cotton 100%, thoáng mát, phù hợp mặc hàng ngày.</p><ul><li>Chất liệu: Cotton 100%</li><li>Màu sắc: Trắng, Đen, Xám</li><li>Size: XS - XL</li></ul>',
    thumbnail: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    style: 'Casual',
    ngaytao: new Date('2024-01-15')
  },
  {
    tieude: 'Quần jeans slim fit',
    chitiet: '<p>Quần <em>jeans slim fit</em> năng động, phong cách. Phù hợp đi chơi, đi học hoặc đi làm.</p><p>Thiết kế ôm sát nhẹ, tôn dáng hiệu quả.</p>',
    thumbnail: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    style: 'Casual',
    ngaytao: new Date('2024-01-20')
  },
  {
    tieude: 'Áo hoodie oversized',
    chitiet: '<p>Áo hoodie oversized đang là xu hướng hot nhất hiện nay. Phong cách streetwear, thoải mái và cá tính.</p>',
    thumbnail: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400',
    style: 'Casual',
    ngaytao: new Date('2024-02-01')
  },
  {
    tieude: 'Váy sundress hoa nhí',
    chitiet: '<p>Váy sundress họa tiết hoa nhí nhỏ, duyên dáng và nữ tính. Chất liệu voan mỏng, phù hợp mặc mùa hè.</p>',
    thumbnail: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400',
    style: 'Casual',
    ngaytao: new Date('2024-02-10')
  },
  // Style: Formal
  {
    tieude: 'Vest công sở nam',
    chitiet: '<p><strong>Bộ vest công sở nam</strong> sang trọng, lịch lãm. Được may từ chất liệu cao cấp, phù hợp cho các buổi họp, sự kiện quan trọng.</p><ul><li>Chất liệu: Wool blend</li><li>Màu: Đen, Navy, Xám</li></ul>',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    style: 'Formal',
    ngaytao: new Date('2024-01-10')
  },
  {
    tieude: 'Áo sơ mi trắng công sở nữ',
    chitiet: '<p>Áo sơ mi trắng thanh lịch, phong cách công sở chuyên nghiệp. Chất liệu lụa mềm mại, thoáng mát.</p>',
    thumbnail: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4685?w=400',
    style: 'Formal',
    ngaytao: new Date('2024-01-25')
  },
  {
    tieude: 'Chân váy bút chì công sở',
    chitiet: '<p>Chân váy bút chì dài qua gối, thanh lịch và chuyên nghiệp. Phù hợp mặc đi làm văn phòng.</p>',
    thumbnail: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400',
    style: 'Formal',
    ngaytao: new Date('2024-02-05')
  },
  {
    tieude: 'Đầm dự tiệc dáng A',
    chitiet: '<p><strong>Đầm dự tiệc dáng A</strong> sang trọng, quyến rũ. Thiết kế tinh tế với họa tiết ren섬세 trên thân váy. Phù hợp cho các buổi tiệc, sự kiện trang trọng.</p>',
    thumbnail: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
    style: 'Formal',
    ngaytao: new Date('2024-02-15')
  },
  // Style: Streetwear
  {
    tieude: 'Áo bomber jacket',
    chitiet: '<p>Áo <strong>bomber jacket</strong> phong cách streetwear cực chất. Phù hợp cho các bạn yêu thích phong cách năng động, cá tính.</p>',
    thumbnail: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    style: 'Streetwear',
    ngaytao: new Date('2024-01-05')
  },
  {
    tieude: 'Quần cargo pants',
    chitiet: '<p>Quần cargo pants với nhiều túi tiện dụng, phong cách military streetwear đang rất hot.</p>',
    thumbnail: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=400',
    style: 'Streetwear',
    ngaytao: new Date('2024-01-18')
  },
  {
    tieude: 'Sneakers chunky sole',
    chitiet: '<p>Giày sneakers đế chunky cao, phong cách Y2K đang làm mưa làm gió trong giới thời trang.</p>',
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    style: 'Streetwear',
    ngaytao: new Date('2024-02-08')
  },
  {
    tieude: 'Áo crop top graphic',
    chitiet: '<p>Áo crop top với graphic print độc đáo, kết hợp cùng quần cargo hoặc jeans baggy.</p>',
    thumbnail: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400',
    style: 'Streetwear',
    ngaytao: new Date('2024-02-20')
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Đã kết nối MongoDB');

    await Fashion.deleteMany({});
    console.log('Đã xóa dữ liệu cũ');

    const inserted = await Fashion.insertMany(sampleData);
    console.log(`Đã thêm ${inserted.length} fashion mẫu`);

    console.log('\nDữ liệu đã được nhập:');
    inserted.forEach(f => console.log(`  - [${f.style}] ${f.tieude}`));

    await mongoose.disconnect();
    console.log('\nHoàn tất seed dữ liệu!');
  } catch (err) {
    console.error('Lỗi:', err.message);
    process.exit(1);
  }
}

seedDatabase();

