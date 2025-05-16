import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';
import multer from 'multer';
import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 兼容 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App 初始化
const app = express();
const PORT = 9111;
const SECRET_KEY = 'your_jwt_secret'; // JWT 密钥

app.use(cors());
app.use(express.json());

// 数据库连接池
const db = await mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'song',
  waitForConnections: true,
  connectionLimit: 10
});

// 🔐 密码加密
function encryptPassword(password) {
  return CryptoJS.SHA256(password).toString();
}


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




// 启动服务
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
