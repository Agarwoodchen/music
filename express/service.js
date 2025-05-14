import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';
import path from 'path';
import multer from 'multer';   // ✅ 新增：处理文件上传
import fs from 'fs';           // ✅ 创建文件夹用
import xlsx from 'xlsx';

const app = express();
const PORT = 12138;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态资源托管（可以访问头像）
app.use('/uploads', express.static(path.join(process.cwd(), 'server/uploads')));

// 创建上传目录（如不存在）
const avatarDir = path.join(process.cwd(), 'server/uploads/avatars');
if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true });
}

// Multer 配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, avatarDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.floor(Math.random() * 10000)}${ext}`;
    cb(null, filename);
  }
});
const upload = multer({ storage });

// 数据库连接
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'music',
});

db.connect((err) => {
  if (err) return console.error('数据库连接失败: ', err);
  console.log('成功连接到数据库');
});

// 获取所有用户
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).send('查询失败');
    res.json(results);
  });
});

// 用户注册
app.post('/register', (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email)
    return res.status(400).json({ success: false, message: '用户名、密码和邮箱不能为空' });

  const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64);
  const sql = 'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)';
  db.query(sql, [username, email, hashedPassword], (err) => {
    if (err) return res.status(500).json({ success: false, message: '注册失败，用户名或邮箱可能已存在' });
    res.status(201).json({ success: true, message: '用户注册成功' });
  });
});

// 用户登录
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: '邮箱和密码不能为空' });

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: '服务器错误' });
    if (results.length === 0) return res.status(400).json({ success: false, message: '该邮箱未注册' });

    const user = results[0];
    const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64);
    if (hashedPassword !== user.password_hash)
      return res.status(400).json({ success: false, message: '密码错误' });

    const token = jwt.sign({ userId: user.user_id, username: user.username, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });
    res.status(200).json({
      success: true,
      message: '登录成功',
      token,
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url
      }
    });
  });
});

// ✅ 上传头像接口（重点）
app.post('/upload-avatar', upload.single('avatar'), (req, res) => {
  const file = req.file;
  const userId = req.body.userId;

  if (!file || !userId) {
    return res.status(400).json({ error: '缺少头像或用户ID' });
  }

  const avatarUrl = `/uploads/avatars/${file.filename}`;
  const sql = 'UPDATE users SET avatar_url = ? WHERE user_id = ?';

  db.query(sql, [avatarUrl, userId], (err) => {
    if (err) return res.status(500).json({ error: '数据库更新失败' });
    res.json({ message: '上传成功', avatarUrl });
  });
});


// 获取用户头像接口（或用户信息）
app.get('/user/:id/avatar', (req, res) => {
  const userId = req.params.id;

  const sql = 'SELECT avatar_url FROM users WHERE user_id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: '查询失败' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: '用户未找到' });
    }

    const avatarUrl = results[0].avatar_url;
    res.json({ userId, avatarUrl });
  });
});




// 示例 Excel 接口（保持不变）
app.post('/upload-excel', (req, res) => {
  res.json({ message: 'Excel 处理未实现' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器正在运行在 http://localhost:${PORT}`);
});
