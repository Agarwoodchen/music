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


// 获取用户详细信息接口
app.get('/api/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ error: '无效的用户 ID' });
  }

  try {
    const [rows] = await db.query(`
      SELECT 
        u.user_id,
        u.username,
        u.email,
        u.avatar_url,
        u.created_at,

        up.nickname,
        up.full_name,
        up.gender,
        up.birthdate,
        up.phone_number,
        up.address,
        up.bio

      FROM users u
      LEFT JOIN user_profiles up ON u.user_id = up.user_id
      WHERE u.user_id = ?
    `, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: '未找到该用户' });
    }
    // console.log(rows[0]);
    res.json(rows[0]);
  } catch (error) {
    console.error('查询用户信息失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 更新用户信息接口
app.put('/api/updataUsers/:id', async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ message: '无效的用户ID' });
  }

  const {
    username,
    email,
    nickname,
    full_name,
    gender,
    birthdate,
    phone_number,
    address,
    bio
  } = req.body;

  const birthdateValue = birthdate === '' ? null : birthdate;

  try {
    // 更新 users 表
    await db.query(
      'UPDATE users SET username = ?, email = ? WHERE user_id = ?',
      [username, email, userId]
    );

    // 查询 user_profiles 是否存在
    const [rows] = await db.query(
      'SELECT * FROM user_profiles WHERE user_id = ?',
      [userId]
    );

    if (rows.length > 0) {
      // 更新
      await db.query(
        `UPDATE user_profiles 
         SET nickname = ?, full_name = ?, gender = ?, birthdate = ?, phone_number = ?, address = ?, bio = ?
         WHERE user_id = ?`,
        [nickname, full_name, gender, birthdateValue, phone_number, address, bio, userId]
      );
    } else {
      // 插入
      await db.query(
        `INSERT INTO user_profiles 
         (user_id, nickname, full_name, gender, birthdate, phone_number, address, bio)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, nickname, full_name, gender, birthdateValue, phone_number, address, bio]
      );
    }

    res.json({ success: true, message: '用户信息更新成功' });
  } catch (error) {
    console.error('用户信息更新失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});



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
// 上传头像接口

// POST /upload-avatar
app.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
  const file = req.file
  const userId = req.body.userId

  if (!file || !userId) {
    return res.status(400).json({ error: '缺少头像或用户ID' })
  }

  const avatarUrl = `/uploads/avatars/${file.filename}`  // 用于数据库
  const sqlUpdate = 'UPDATE users SET avatar_url = ? WHERE user_id = ?'
  const sqlSelect = 'SELECT avatar_url FROM users WHERE user_id = ?'

  try {
    // 1. 查询旧头像地址
    const [rows] = await db.query(sqlSelect, [userId])
    const oldAvatarUrl = rows[0]?.avatar_url

    // 2. 更新新头像地址
    await db.query(sqlUpdate, [avatarUrl, userId])

    // 3. 删除旧头像（如果存在且不是默认头像）
    if (
      oldAvatarUrl &&
      !oldAvatarUrl.includes('default') &&
      oldAvatarUrl !== avatarUrl
    ) {
      // 获取旧文件本地路径
      const oldFilePath = path.join(process.cwd(), 'server', oldAvatarUrl) // 拼接绝对路径
      fs.unlink(oldFilePath, (err) => {
        if (err) {
          console.warn('删除旧头像失败:', err.message)
        } else {
          console.log('旧头像已删除:', oldFilePath)
        }
      })
    }

    res.json({ message: '上传成功', avatarUrl })
  } catch (err) {
    console.error('上传失败:', err)
    res.status(500).json({ error: '数据库更新失败' })
  }
})

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
// 获取指定歌曲详情，包含是否收藏信息
// 获取指定歌曲详情，包含是否收藏信息
app.get('/api/songsBySongId/:id', async (req, res) => {
  const songId = parseInt(req.params.id, 10);
  const userId = parseInt(req.query.userId, 10); // 从查询参数中获取用户 ID

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
          ar.name AS artist_name,

          CASE WHEN fs.id IS NOT NULL THEN TRUE ELSE FALSE END AS is_favorited
        FROM songs s
        JOIN albums al ON s.album_id = al.id
        JOIN artists ar ON al.artist_id = ar.id
        LEFT JOIN favorite_songs fs 
          ON fs.song_id = s.id AND fs.user_id = ?
        WHERE s.id = ?`,
      [isNaN(userId) ? 0 : userId, songId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: '未找到该歌曲' });
    }
    // console.log(rows[0]);
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
      `SELECT 
         p.*, 
         'created' AS source, 
         COUNT(ps.song_id) AS song_count
       FROM 
         playlists p
       LEFT JOIN 
         playlist_songs ps ON ps.playlist_id = p.id
       WHERE 
         p.user_id = ?
       GROUP BY 
         p.id`,
      [userId]
    );

    // 获取收藏的歌单（排除自己创建的），包含歌曲数
    const [favoritedPlaylists] = await db.execute(
      `SELECT 
         p.*, 
         'favorited' AS source, 
         COUNT(ps.song_id) AS song_count
       FROM 
         playlists p
       INNER JOIN 
         playlist_favorites f ON p.id = f.playlist_id
       LEFT JOIN 
         playlist_songs ps ON ps.playlist_id = p.id
       WHERE 
         f.user_id = ? 
         AND (p.user_id IS NULL OR p.user_id != ?)
       GROUP BY 
         p.id`,
      [userId, userId]
    );
    // console.log(createdPlaylists);
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
    const [recommendedPlaylists] = await db.execute(
      `SELECT p.id, p.name, p.cover_url, p.user_id, p.is_public, p.play_count, p.likes_count,
              (p.likes_count * 0.6 + p.play_count * 0.4) AS score,
              u.username,
              up.nickname,
              u.avatar_url
       FROM playlists p
       LEFT JOIN users u ON p.user_id = u.user_id
       LEFT JOIN user_profiles up ON u.user_id = up.user_id
       WHERE p.is_public = 1
       ORDER BY score DESC
       LIMIT 4`
    );

    res.json({
      success: true,
      data: recommendedPlaylists
    });
  } catch (err) {
    console.error('获取推荐歌单失败:', err);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});


// 获取全部歌单（分页）
// 获取全部公开歌单，支持分页，返回每个歌单的歌曲数量
app.get('/api/playlists', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;

  try {
    const [playlists] = await db.execute(`
      SELECT 
        p.*, 
        COUNT(ps.song_id) AS song_count,
        u.username,
        up.nickname,
        u.avatar_url
      FROM playlists p
      LEFT JOIN playlist_songs ps ON p.id = ps.playlist_id
      LEFT JOIN users u ON p.user_id = u.user_id
      LEFT JOIN user_profiles up ON u.user_id = up.user_id
      WHERE p.is_public = 1
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `);

    const [countResult] = await db.execute(
      `SELECT COUNT(*) AS total FROM playlists WHERE is_public = 1`
    );

    res.json({
      success: true,
      data: playlists,
      total: countResult[0].total,
      page,
      pageSize,
    });
  } catch (err) {
    console.error('获取歌单失败:', err);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});




// 获取歌单详情
app.get('/api/playlistsDetails/:id', async (req, res) => {
  const playlistId = parseInt(req.params.id);
  if (isNaN(playlistId)) {
    return res.status(400).json({ success: false, message: '无效的歌单ID' });
  }

  try {
    // 获取歌单 + 创建者信息
    const [playlistInfoResult] = await db.execute(
      `SELECT p.*, u.username, u.avatar_url, up.nickname,
              COUNT(ps.song_id) AS song_count
       FROM playlists p
       LEFT JOIN users u ON p.user_id = u.user_id
       LEFT JOIN user_profiles up ON u.user_id = up.user_id
       LEFT JOIN playlist_songs ps ON p.id = ps.playlist_id
       WHERE p.id = ?
       GROUP BY p.id`,
      [playlistId]
    );

    if (playlistInfoResult.length === 0) {
      return res.status(404).json({ success: false, message: '歌单未找到' });
    }

    // 获取歌单中的歌曲及其歌手、专辑信息
    const [songsResult] = await db.execute(
      `SELECT 
     s.*, 
     a.name AS album_name,
     a.name_zh AS album_name_zh,
     a.cover_path AS album_cover,
     ar.id AS artist_id,
     ar.name AS artist_name,
     ar.name_zh AS artist_name_zh,
     ar.avatar_url AS artist_avatar
   FROM playlist_songs ps
   JOIN songs s ON ps.song_id = s.id
   JOIN albums a ON s.album_id = a.id
   JOIN artists ar ON a.artist_id = ar.id
   WHERE ps.playlist_id = ?
   ORDER BY ps.order_index ASC`,
      [playlistId]
    );


    res.json({
      success: true,
      data: {
        ...playlistInfoResult[0],
        songs: songsResult
      }
    });

  } catch (err) {
    console.error('获取歌单详情失败:', err);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 添加歌曲到歌单的接口
app.post('/api/playlist/add-song', async (req, res) => {
  // console.log(req.body);
  const { playlist_id, song_id, added_by } = req.body;

  // 参数校验
  if (!playlist_id || !song_id || !added_by) {
    return res.status(400).json({ message: '缺少必要参数' });
  }

  try {
    // 判断是否已经存在该歌曲在歌单中
    const [existing] = await db.execute(
      'SELECT 1 FROM playlist_songs WHERE playlist_id = ? AND song_id = ?',
      [playlist_id, song_id]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: '该歌曲已在歌单中' });
    }

    // 插入记录
    await db.execute(
      'INSERT INTO playlist_songs (playlist_id, song_id, added_by) VALUES (?, ?, ?)',
      [playlist_id, song_id, added_by]
    );

    res.status(200).json({ message: '歌曲添加成功' });
  } catch (err) {
    console.error('添加歌曲失败:', err);
    res.status(500).json({ message: '服务器内部错误' });
  }
});








// 获取某个歌单下的评论
// 获取某个歌单下的评论，带点赞状态
app.get('/api/playlists/:playlistId/comments', async (req, res) => {
  // console.log(req.params);
  const { playlistId } = req.params;
  const userId = parseInt(req.query.user_id); // 当前用户 ID

  if (!playlistId || isNaN(userId)) {
    return res.status(400).json({ message: '缺少参数' });
  }

  try {
    const [rows] = await db.query(
      `SELECT 
         c.*, 
         u.username, 
         u.avatar_url,
         EXISTS (
           SELECT 1 FROM playlist_comment_likes l 
           WHERE l.comment_id = c.id AND l.user_id = ?
         ) AS liked
       FROM playlist_comments c
       JOIN users u ON c.user_id = u.user_id
       WHERE c.playlist_id = ?
       ORDER BY c.created_at ASC`,
      [userId, playlistId]
    );

    // 构建树状结构
    const commentMap = {};
    const result = [];

    rows.forEach(row => {
      row.liked = !!row.liked; // 确保是布尔类型
      row.replies = [];
      commentMap[row.id] = row;
    });

    rows.forEach(row => {
      if (row.parent_id) {
        if (commentMap[row.parent_id]) {
          commentMap[row.parent_id].replies.push(row);
        }
      } else {
        result.push(row);
      }
    });

    res.json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: '获取评论失败' });
  }
});





// 添加评论或子评论
app.post('/api/playlists/:playlistId/comments', async (req, res) => {
  const { playlistId } = req.params;
  const { user_id, content, parent_id = null, reply_to_user_id = null } = req.body;

  if (!user_id || !content) {
    return res.status(400).json({ success: false, message: '用户ID或内容不能为空' });
  }

  let finalReplyToUserId = reply_to_user_id;

  try {
    // 如果是子评论并且前端没有传 reply_to_user_id，则从 parent_id 获取其 user_id
    if (parent_id && !reply_to_user_id) {
      const [parentRows] = await db.query(
        'SELECT user_id FROM playlist_comments WHERE id = ?',
        [parent_id]
      );

      if (parentRows.length === 0) {
        return res.status(400).json({ success: false, message: 'parent_id 对应的评论不存在' });
      }

      finalReplyToUserId = parentRows[0].user_id;
    }

    // 插入评论或子评论
    const [result] = await db.query(
      `INSERT INTO playlist_comments (playlist_id, user_id, content, parent_id, reply_to_user_id)
       VALUES (?, ?, ?, ?, ?)`,
      [playlistId, user_id, content, parent_id, finalReplyToUserId]
    );

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: '评论失败' });
  }
});



// 删除评论（自动级联删除子评论）
app.delete('/api/comments/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM playlist_comments WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: '删除评论失败' });
  }
});

// 点赞或取消点赞评论
app.post('/api/comment/like', async (req, res) => {
  const { user_id, comment_id } = req.body;

  if (!user_id || !comment_id) {
    return res.status(400).json({ message: '缺少必要参数' });
  }

  try {
    // 检查是否已点赞
    const [existing] = await db.execute(
      'SELECT 1 FROM playlist_comment_likes WHERE user_id = ? AND comment_id = ?',
      [user_id, comment_id]
    );

    if (existing.length > 0) {
      // 已点赞，则取消点赞
      await db.execute(
        'DELETE FROM playlist_comment_likes WHERE user_id = ? AND comment_id = ?',
        [user_id, comment_id]
      );
      await db.execute(
        'UPDATE playlist_comments SET likes_count = likes_count - 1 WHERE id = ? AND likes_count > 0',
        [comment_id]
      );
      return res.json({ success: true, liked: false });
    } else {
      // 未点赞，则执行点赞
      await db.execute(
        'INSERT INTO playlist_comment_likes (user_id, comment_id) VALUES (?, ?)',
        [user_id, comment_id]
      );
      await db.execute(
        'UPDATE playlist_comments SET likes_count = likes_count + 1 WHERE id = ?',
        [comment_id]
      );
      return res.json({ success: true, liked: true });
    }
  } catch (err) {
    console.error('点赞失败:', err);
    return res.status(500).json({ message: '服务器错误' });
  }
});




// 添加收藏歌曲接口
// 切换收藏歌曲接口（已收藏则取消收藏，未收藏则添加）
app.post('/api/favorites/song', async (req, res) => {
  const { user_id, song_id } = req.body;

  if (!user_id || !song_id) {
    return res.status(400).json({ message: 'Missing user_id or song_id' });
  }

  try {
    // 检查是否已收藏
    const [existing] = await db.execute(
      'SELECT id FROM favorite_songs WHERE user_id = ? AND song_id = ?',
      [user_id, song_id]
    );

    if (existing.length > 0) {
      // 已收藏，执行取消收藏
      await db.execute(
        'DELETE FROM favorite_songs WHERE user_id = ? AND song_id = ?',
        [user_id, song_id]
      );
      return res.status(200).json({ message: '取消收藏成功', favorited: false });
    } else {
      // 未收藏，执行添加
      await db.execute(
        'INSERT INTO favorite_songs (user_id, song_id) VALUES (?, ?)',
        [user_id, song_id]
      );
      return res.status(201).json({ message: '收藏成功', favorited: true });
    }
  } catch (error) {
    console.error('收藏操作失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});


// 获取指定用户的所有收藏歌曲
app.get('/api/favorites/songs/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ message: '无效的用户 ID' });
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
          ar.name AS artist_name,

          fs.created_at AS favorited_at
        FROM favorite_songs fs
        JOIN songs s ON fs.song_id = s.id
        JOIN albums al ON s.album_id = al.id
        JOIN artists ar ON al.artist_id = ar.id
        WHERE fs.user_id = ?
        ORDER BY fs.created_at DESC`,
      [userId]
    );

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('获取收藏歌曲失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 获取用户收藏的歌单
app.get('/api/users/:userId/favorite-playlists', async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await db.execute(`
      SELECT 
        p.*,
        COUNT(ps.song_id) AS song_count,
        u.user_id AS creator_user_id,
        u.username AS creator_username,
        u.avatar_url AS creator_avatar,
        up.nickname AS creator_nickname,
        up.full_name AS creator_full_name
      FROM 
        playlist_favorites pf
      JOIN 
        playlists p ON pf.playlist_id = p.id
      LEFT JOIN 
        playlist_songs ps ON p.id = ps.playlist_id
      LEFT JOIN 
        users u ON p.user_id = u.user_id
      LEFT JOIN 
        user_profiles up ON u.user_id = up.user_id
      WHERE 
        pf.user_id = ?
      GROUP BY 
        p.id
    `, [userId]);

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('获取收藏歌单失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误，无法获取收藏的歌单'
    });
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
