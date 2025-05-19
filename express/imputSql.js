// importToDb.js
import fs from 'fs';
import path, { dirname } from 'path';
import mysql from 'mysql2/promise';
import { parseFile } from 'music-metadata';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticMusicDir = path.join(__dirname, './express/public/music');

const db = await mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'music',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function extractChineseMetadata(flacFilePath) {
  try {
    const metadata = await parseFile(flacFilePath);
    return {
      artist_zh: metadata.common.artist || '',
      album_zh: metadata.common.album || '',
      title_zh: metadata.common.title || '',
    };
  } catch (err) {
    console.warn(`❌ 解析中文元数据失败：${flacFilePath}`, err.message);
    return { artist_zh: '', album_zh: '', title_zh: '' };
  }
}

async function insertArtist(name_en, name_zh = '') {
  name_en = name_en?.trim() || 'Unknown';
  name_zh = name_zh?.trim() || '';

  try {
    const [rows] = await db.query('SELECT id FROM artists WHERE name = ?', [name_en]);
    if (rows.length) return rows[0].id;

    const [result] = await db.query(
      'INSERT INTO artists (name, name_zh) VALUES (?, ?)',
      [name_en, name_zh]
    );
    return result.insertId;
  } catch (err) {
    console.error(`❌ 插入 artist 失败：${name_en} - ${err.message}`);
    return null;
  }
}

async function insertAlbum(artistId, albumName_en, albumName_zh = '') {
  if (!artistId) return null;

  albumName_en = albumName_en?.trim() || 'Unknown';
  albumName_zh = albumName_zh?.trim() || '';

  try {
    const [rows] = await db.query(
      'SELECT id FROM albums WHERE artist_id = ? AND name = ?',
      [artistId, albumName_en]
    );
    if (rows.length) return rows[0].id;

    const [result] = await db.query(
      'INSERT INTO albums (artist_id, name, name_zh) VALUES (?, ?, ?)',
      [artistId, albumName_en, albumName_zh]
    );
    return result.insertId;
  } catch (err) {
    console.error(`❌ 插入 album 失败：${albumName_en} - ${err.message}`);
    return null;
  }
}

async function updateAlbumCover(albumId, coverUrlPath) {
  if (!albumId) return;
  await db.query('UPDATE albums SET cover_path = ? WHERE id = ?', [coverUrlPath, albumId]);
}

async function insertOrUpdateSong(albumId, title_en, fileUrlPath, title_zh = '', duration = null, track_number = null) {
  title_en = title_en?.trim() || 'Unknown';
  title_zh = title_zh?.trim() || '';
  fileUrlPath = fileUrlPath?.trim() || '/music/unknown.flac';
  duration = typeof duration === 'number' && duration >= 0 ? duration : 0;
  track_number = Number.isInteger(track_number) ? track_number : null;

  try {
    const [rows] = await db.query(
      'SELECT id, file_path FROM songs WHERE album_id = ? AND title = ?',
      [albumId, title_en]
    );

    if (rows.length) {
      if (rows[0].file_path !== fileUrlPath) {
        await db.query(
          'UPDATE songs SET file_path = ?, duration = ?, track_number = ? WHERE id = ?',
          [fileUrlPath, duration, track_number, rows[0].id]
        );
        console.log(`🟡 更新路径和元信息：${title_en} → ${fileUrlPath}`);
      }
      return rows[0].id;
    } else {
      const [result] = await db.query(
        'INSERT INTO songs (album_id, title, title_zh, file_path, duration, track_number) VALUES (?, ?, ?, ?, ?, ?)',
        [albumId, title_en, title_zh, fileUrlPath, duration, track_number]
      );
      console.log(`🟢 新增歌曲：${title_en} (${title_zh}) → ${fileUrlPath}`);
      return result.insertId;
    }
  } catch (err) {
    console.error(`❌ 插入/更新歌曲失败：${title_en} - ${err.message}`);
    return null;
  }
}

function parseSongTitle(filename) {
  const name = path.basename(filename, path.extname(filename));
  const parts = name.split('_');
  return parts.length >= 2 ? parts.slice(1).join('_') : name;
}

async function updateCoverFromExistingFile(albumDir, albumId) {
  const possibleNames = ['cover.jpg', 'cover.png', 'folder.jpg', 'folder.png'];
  let coverFile = null;

  for (const name of possibleNames) {
    const filePath = path.join(albumDir, name);
    if (fs.existsSync(filePath)) {
      coverFile = filePath;
      break;
    }
  }

  const urlCoverPath = coverFile
    ? `/music/${path.relative(staticMusicDir, coverFile).replace(/\\/g, '/')}`
    : '/music/default-cover.jpg';

  await updateAlbumCover(albumId, urlCoverPath);
  console.log(`🖼️ 设置封面：${urlCoverPath}`);
}

async function processMusicLibrary(baseDir) {
  const artists = fs.readdirSync(baseDir).filter(f =>
    fs.statSync(path.join(baseDir, f)).isDirectory()
  );

  for (const artistName of artists) {
    const artistDir = path.join(baseDir, artistName);
    let artistName_zh = '';

    const albums = fs.readdirSync(artistDir).filter(f =>
      fs.statSync(path.join(artistDir, f)).isDirectory()
    );

    for (const albumName of albums) {
      const albumDir = path.join(artistDir, albumName);
      const flacFiles = fs.readdirSync(albumDir).filter(f => f.toLowerCase().endsWith('.flac'));
      if (flacFiles.length > 0) {
        const meta = await extractChineseMetadata(path.join(albumDir, flacFiles[0]));
        artistName_zh = meta.artist_zh || '';
        break;
      }
    }

    const artistId = await insertArtist(artistName, artistName_zh);
    if (!artistId) continue;

    for (const albumName of albums) {
      const albumDir = path.join(artistDir, albumName);
      const flacFiles = fs.readdirSync(albumDir).filter(f => f.toLowerCase().endsWith('.flac'));

      let albumName_zh = '';
      if (flacFiles.length > 0) {
        const meta = await extractChineseMetadata(path.join(albumDir, flacFiles[0]));
        albumName_zh = meta.album_zh || '';
      }

      const albumId = await insertAlbum(artistId, albumName, albumName_zh);
      if (!albumId) continue;

      await updateCoverFromExistingFile(albumDir, albumId);

      for (const fileName of flacFiles) {
        const filePath = path.join(albumDir, fileName);
        const songTitle = parseSongTitle(fileName);

        const { title_zh } = await extractChineseMetadata(filePath);
        const songMetadata = await parseFile(filePath);
        const duration = Math.round(songMetadata.format.duration || 0);
        const trackNumber = songMetadata.common.track?.no || null;

        const relativePath = path.relative(staticMusicDir, filePath).replace(/\\/g, '/');
        const urlPath = `/music/${relativePath}`;

        await insertOrUpdateSong(albumId, songTitle, urlPath, title_zh, duration, trackNumber);
      }
    }
  }

  console.log('✅ 所有音乐文件与封面已成功导入数据库');
}

const musicRootDir = staticMusicDir;

processMusicLibrary(musicRootDir).catch(err => {
  console.error('❌ 导入失败:', err);
});