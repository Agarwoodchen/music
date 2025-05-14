import express from 'express';
import mysql from 'mysql2';  // 导入 MySQL 依赖
import cors from 'cors';     // 允许跨域请求
import jwt from 'jsonwebtoken';  // 使用 JWT 进行身份验证
import CryptoJS from 'crypto-js';  // 加密模块（示例中没有实际应用）
import { fileURLToPath } from 'url';  // 处理文件路径
import path from 'path';        // 处理路径
import axios from 'axios';      // 发送 HTTP 请求
import xlsx from 'xlsx';       // 处理 Excel 文件

const app = express();
const PORT = 12138;

// 使用中间件
app.use(cors());  // 启用跨域请求
app.use(express.json());  // 解析 JSON 请求体

// 连接到 MySQL 数据库
const db = mysql.createConnection({
  host: 'localhost',   // 数据库主机
  user: 'root',        // 数据库用户名
  password: '1234', // 数据库密码
  database: 'music', // 你要连接的数据库名称
});

// 检查数据库连接
db.connect((err) => {
  if (err) {
    console.error('数据库连接失败: ', err);
    return;
  }
  console.log('成功连接到数据库');
});

// 路由示例: 获取所有用户
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users'; // 查询所有用户
  db.query(query, (err, results) => {
    if (err) {
      console.error('查询失败: ', err);
      return res.status(500).send('查询失败');
    }
    res.json(results); // 返回用户数据
  });
});

// 路由示例: 注册一个新用户
app.post('/register', (req, res) => {
  const { username, password, email } = req.body;

  // 基本校验（可扩展）
  if (!username || !password || !email) {
    return res.status(400).json({
      success: false,
      message: '用户名、密码和邮箱不能为空'
    });
  }

  // 加密密码
  const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64);

  const query = 'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)';
  db.query(query, [username, email, hashedPassword], (err, results) => {
    if (err) {
      console.error('注册失败: ', err);
      return res.status(500).json({
        success: false,
        message: '注册失败，用户名或邮箱可能已存在'
      });
    }

    return res.status(201).json({
      success: true,
      message: '用户注册成功'
    });
  });
});

// 路由示例: 登录并返回 JWT
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  // console.log();
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: '邮箱和密码不能为空'
    });
  }

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('查询失败: ', err);
      return res.status(500).json({
        success: false,
        message: '服务器错误，请稍后再试'
      });
    }

    if (results.length === 0) {
      return res.status(400).json({
        success: false,
        message: '该邮箱未注册'
      });
    }

    const user = results[0];

    // 验证密码（与注册时加密方式一致）
    const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64);
    if (hashedPassword !== user.password_hash) {
      return res.status(400).json({
        success: false,
        message: '密码错误'
      });
    }

    // 创建 JWT
    const token = jwt.sign(
      { userId: user.user_id, username: user.username, email: user.email },
      'your_jwt_secret', // 应从环境变量读取
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      success: true,
      message: '登录成功',
      token,
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email
      }
    });
  });
});


// 示例: 读取并解析 Excel 文件
app.post('/upload-excel', (req, res) => {
  const file = req.files.file;  // 获取上传的文件
  const workbook = xlsx.readFile(file.path);  // 解析 Excel 文件
  const sheetNames = workbook.SheetNames;     // 获取工作表名
  const sheet = workbook.Sheets[sheetNames[0]]; // 获取第一个工作表
  const data = xlsx.utils.sheet_to_json(sheet);  // 将工作表转换为 JSON

  res.json(data);  // 返回转换后的 JSON 数据
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器正在运行在 http://localhost:${PORT}`);
});
