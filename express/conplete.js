import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import xlsx from 'xlsx';

const app = express();
const PORT = 12138;

import { fileURLToPath } from 'url';

// 兼容 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(process.cwd(), 'server/uploads')));
app.use('/music', express.static(path.join(__dirname, 'public/music')));
// 创建上传目录
const avatarDir = path.join(process.cwd(), 'server/uploads/avatars');
if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, avatarDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.floor(Math.random() * 10000)}${ext}`;
    cb(null, filename);
  }
});
const upload = multer({ storage });

// 使用 mysql2 的 promise 风格连接数据库
let db;
(async () => {
  try {
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '1234',
      database: 'music',
    });
    console.log('成功连接到数据库');
  } catch (err) {
    console.error('数据库连接失败:', err);
  }
})();

// 获取所有用户
app.get('/users', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM users');
    res.json(results);
  } catch (err) {
    res.status(500).send('查询失败');
  }
});

// 用户注册
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email)
    return res.status(400).json({ success: false, message: '用户名、密码和邮箱不能为空' });

  const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64);
  const sql = 'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)';
  try {
    await db.query(sql, [username, email, hashedPassword]);
    res.status(201).json({ success: true, message: '用户注册成功' });
  } catch (err) {
    res.status(500).json({ success: false, message: '注册失败，用户名或邮箱可能已存在' });
  }
});

// 用户登录
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: '邮箱和密码不能为空' });

  try {
    const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (results.length === 0)
      return res.status(400).json({ success: false, message: '该邮箱未注册' });

    const user = results[0];
    const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64);
    if (hashedPassword !== user.password_hash)
      return res.status(400).json({ success: false, message: '密码错误' });

    const token = jwt.sign(
      { userId: user.user_id, username: user.username, email: user.email },
      'your_jwt_secret',
      { expiresIn: '1h' }
    );

    res.status(200).json({
      success: true,
      message: '登录成功',
      token,
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 上传头像接口
app.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
  const file = req.file;
  const userId = req.body.userId;

  if (!file || !userId) {
    return res.status(400).json({ error: '缺少头像或用户ID' });
  }

  const avatarUrl = `/uploads/avatars/${file.filename}`;
  const sql = 'UPDATE users SET avatar_url = ? WHERE user_id = ?';

  try {
    await db.query(sql, [avatarUrl, userId]);
    res.json({ message: '上传成功', avatarUrl });
  } catch (err) {
    res.status(500).json({ error: '数据库更新失败' });
  }
});

// 获取用户头像
app.get('/user/:id/avatar', async (req, res) => {
  const userId = req.params.id;
  const sql = 'SELECT avatar_url FROM users WHERE user_id = ?';

  try {
    const [results] = await db.query(sql, [userId]);
    if (results.length === 0) {
      return res.status(404).json({ error: '用户未找到' });
    }

    const avatarUrl = results[0].avatar_url;
    res.json({ userId, avatarUrl });
  } catch (err) {
    res.status(500).json({ error: '查询失败' });
  }
});













// 获取歌手列表
app.get('/api/artists', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM artists ORDER BY name');
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error('Error fetching artists:', err);
    res.status(500).json({ success: false, message: '服务器错误，无法获取歌手列表' });
  }
});

// 获取专辑列表
app.get('/api/albums/:artistId', async (req, res) => {
  const { artistId } = req.params;

  if (isNaN(artistId)) {
    return res.status(400).json({ success: false, message: '无效的歌手 ID' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM albums WHERE artist_id = ?', [artistId]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: '没有找到该歌手的专辑' });
    }

    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error('Error fetching albums:', err);
    res.status(500).json({ success: false, message: '服务器错误，无法获取专辑列表' });
  }
});

// 获取歌曲列表
app.get('/api/songs/:albumId', async (req, res) => {
  const { albumId } = req.params;

  if (isNaN(albumId)) {
    return res.status(400).json({ success: false, message: '无效的专辑 ID' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM songs WHERE album_id = ?', [albumId]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: '没有找到该专辑的歌曲' });
    }

    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error('Error fetching songs:', err);
    res.status(500).json({ success: false, message: '服务器错误，无法获取歌曲列表' });
  }
});



// 获取歌手的专辑和歌曲信息
app.get('/api/artist-details/:artistId', async (req, res) => {
  const artistId = req.params.artistId;

  try {
    // 查询歌手信息
    const [artistRows] = await db.query(
      'SELECT * FROM artists WHERE id = ?',
      [artistId]
    );

    if (artistRows.length === 0) {
      return res.status(404).json({ error: '歌手不存在' });
    }

    const artist = artistRows[0];

    // 查询该歌手的所有专辑
    const [albums] = await db.query(
      'SELECT id, name, name_zh, release_year, cover_path FROM albums WHERE artist_id = ?',
      [artistId]
    );

    // 查询每张专辑下的所有歌曲
    const albumsWithSongs = await Promise.all(
      albums.map(async (album) => {
        const [songs] = await db.query(
          'SELECT id, title, title_zh, duration, track_number, file_path FROM songs WHERE album_id = ?',
          [album.id]
        );
        return {
          ...album,
          songs
        };
      })
    );

    // 返回数据
    res.json({
      artist,
      albums: albumsWithSongs
    });
  } catch (error) {
    console.error('获取歌手详情失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});



// GET /api/album/:id - 查询专辑和其所有歌曲
app.get('/api/album/:id', async (req, res) => {
  const albumId = parseInt(req.params.id, 10);

  if (isNaN(albumId)) {
    return res.status(400).json({ error: '无效的专辑 ID' });
  }

  try {
    const [albumRows] = await db.query(
      `SELECT 
        a.id AS album_id,
        a.name AS album_name,
        a.name_zh AS album_name_zh,
        a.release_year,
        a.cover_path,
        a.created_at AS album_created_at,
        ar.id AS artist_id,
        ar.name_zh AS artist_name_zh
      FROM albums a
      LEFT JOIN artists ar ON a.artist_id = ar.id
      WHERE a.id = ?`,
      [albumId]
    );

    if (albumRows.length === 0) {
      return res.status(404).json({ error: '未找到该专辑' });
    }

    const album = albumRows[0];

    const [songRows] = await db.query(
      `SELECT 
        id AS song_id,
        title,
        title_zh,
        file_path,
        duration,
        track_number,
        created_at
      FROM songs
      WHERE album_id = ?`,
      [albumId]
    );

    res.json({
      album,
      songs: songRows
    });
  } catch (err) {
    console.error('数据库查询出错:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 获取指定歌曲详情
app.get('/api/songsBySongId/:id', async (req, res) => {
  const songId = parseInt(req.params.id, 10);

  if (isNaN(songId)) {
    return res.status(400).json({ error: '无效的歌曲 ID' });
  }

  try {
    const [rows] = await db.query(
      `SELECT 
          s.id AS song_id,
          s.title_zh AS song_title_zh,
          s.title AS song_title,
          s.file_path,
          s.duration,
          s.track_number,
          s.created_at AS song_created_at,
          
          al.id AS album_id,
          al.name_zh AS album_name_zh,
          al.name AS album_name,
          al.release_year,
          al.cover_path,
          
          ar.id AS artist_id,
          ar.name_zh AS artist_name_zh,
          ar.name AS artist_name
        FROM songs s
        JOIN albums al ON s.album_id = al.id
        JOIN artists ar ON al.artist_id = ar.id
        WHERE s.id = ?`,
      [songId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: '未找到该歌曲' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('查询歌曲失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

//根据用户 ID 获取该用户 自己创建的歌单 以及 收藏的歌单
app.get('/api/user/:userId/playlists', async (req, res) => {
  const userId = parseInt(req.params.userId);
  if (isNaN(userId)) {
    return res.status(400).json({ message: '无效的用户ID' });
  }

  try {
    // 获取自己创建的歌单，包含歌曲数
    const [createdPlaylists] = await db.execute(
      `SELECT p.*, 'created' AS source, COUNT(s.id) AS song_count
       FROM playlists p
       LEFT JOIN songs s ON s.album_id = p.id
       WHERE p.user_id = ?
       GROUP BY p.id`,
      [userId]
    );

    // 获取收藏的歌单（排除自己创建的），包含歌曲数
    const [favoritedPlaylists] = await db.execute(
      `SELECT p.*, 'favorited' AS source, COUNT(s.id) AS song_count
       FROM playlists p
       INNER JOIN playlist_favorites f ON p.id = f.playlist_id
       LEFT JOIN songs s ON s.album_id = p.id
       WHERE f.user_id = ? AND (p.user_id IS NULL OR p.user_id != ?)
       GROUP BY p.id`,
      [userId, userId]
    );

    res.json({
      createdPlaylists,
      favoritedPlaylists
    });

  } catch (err) {
    console.error('获取用户歌单失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});


// POST /api/playlists/create
app.post('/api/playlists/create', async (req, res) => {
  const {
    name,
    description,
    cover_url,
    user_id,
    is_public = 1,
    tags,
    category
  } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ message: '歌单名称不能为空' });
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO playlists (name, description, cover_url, user_id, is_public, tags, category)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, description, cover_url, user_id || null, is_public, tags, category]
    );

    res.json({
      success: true,
      message: '歌单创建成功',
      playlist_id: result.insertId
    });
  } catch (err) {
    console.error('创建歌单失败:', err);
    res.status(500).json({ success: false, message: '服务器错误，创建歌单失败' });
  }
});



// 创建歌单封面上传目录
const playlistCoverDir = path.join(process.cwd(), 'server/uploads/playlists/covers');
if (!fs.existsSync(playlistCoverDir)) {
  fs.mkdirSync(playlistCoverDir, { recursive: true });
}

const playlistCoverStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, playlistCoverDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.floor(Math.random() * 10000)}${ext}`;
    cb(null, filename);
  }
});
// 允许上传的图片类型
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// 修改 multer 配置，限制文件大小，比如最大 5MB
const playlistCoverUpload = multer({
  storage: playlistCoverStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件(jpg, png, gif, webp)'));
    }
  }
});

// 上传歌单封面接口
app.post('/api/upload/playlist-cover', (req, res) => {
  playlistCoverUpload.single('cover')(req, res, (err) => {
    if (err) {
      // multer 错误
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: '文件大小不能超过5MB' });
        }
        return res.status(400).json({ message: err.message });
      }
      // 其他错误（比如 fileFilter 报的错）
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: '未上传文件' });
    }

    const coverUrl = `/uploads/playlists/covers/${req.file.filename}`;
    res.json({ coverUrl });
  });
});

app.use('/uploads', express.static(path.join(process.cwd(), 'server/uploads')));

// 获取推荐歌单接口
app.get('/api/recommended/playlists', async (req, res) => {
  try {
    // 获取歌单列表，并根据喜欢数和播放量综合评分排序
    const [recommendedPlaylists] = await db.execute(
      `SELECT id, name, cover_url, user_id, is_public, play_count, likes_count,
              (likes_count * 0.6 + play_count * 0.4) AS score
       FROM playlists
       WHERE is_public = 1  -- 只考虑公开歌单
       ORDER BY score DESC  -- 根据综合评分排序
       LIMIT 4`  // 获取前四个
    );

    // 返回推荐歌单数据
    res.json({
      success: true,
      data: recommendedPlaylists
    });
  } catch (err) {
    console.error('获取推荐歌单失败:', err);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});




// Excel 上传占位接口
app.post('/upload-excel', (req, res) => {
  res.json({ message: 'Excel 处理未实现' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器正在运行在 http://localhost:${PORT}`);
});
