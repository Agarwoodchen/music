import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { parseFile } from 'music-metadata';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_ID = process.env.API_ID || '88888888';
const API_KEY = process.env.API_KEY || '88888888';
const imageLimit = 1;
const pageNumber = 1;
const rootDir = path.join(__dirname, './express/public/music');

async function getImageUrls(keyword, limit = 1, page = 1, retries = 300) {
  const cleanKeyword = keyword.replace(/[\u0000-\u001F\u007F]/g, '').trim();
  const searchKeyword = `专辑 《${cleanKeyword}》`;
  const url = `https://cn.apihz.cn/api/img/apihzimgbaidu.php?id=${API_ID}&key=${API_KEY}&limit=${limit}&page=${page}&words=${encodeURIComponent(searchKeyword)}`;
  console.log(searchKeyword);
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.code === 200 && Array.isArray(data.res) && data.res.length > 0) {
        return data.res;
      }
      throw new Error(`API 返回错误: ${JSON.stringify(data)}`);
    } catch (err) {
      console.warn(`⚠️ 第 ${attempt} 次尝试失败: ${err.message}`);
      if (attempt === retries) throw err;
      await new Promise(res => setTimeout(res, 2000));
    }
  }
}

async function downloadImage(imageUrl, savePath, retries = 300) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(imageUrl);
      if (!res.ok) throw new Error(`下载失败，状态码: ${res.status}`);
      const dest = fs.createWriteStream(savePath);
      return new Promise((resolve, reject) => {
        res.body.pipe(dest);
        res.body.on('error', reject);
        dest.on('finish', resolve);
        dest.on('error', reject);
      });
    } catch (err) {
      console.warn(`⚠️ 第 ${attempt} 次下载失败: ${err.message}`);
      if (attempt === retries) throw err;
      await new Promise(res => setTimeout(res, 2000));
    }
  }
}

function findAlbumDirs(dir) {
  const albumDirs = [];
  const artists = fs.readdirSync(dir, { withFileTypes: true });

  for (const artist of artists) {
    if (artist.isDirectory()) {
      const artistPath = path.join(dir, artist.name);
      const albums = fs.readdirSync(artistPath, { withFileTypes: true });

      for (const album of albums) {
        if (album.isDirectory()) {
          const albumPath = path.join(artistPath, album.name);
          const files = fs.readdirSync(albumPath);
          if (files.some(f => f.toLowerCase().endsWith('.flac'))) {
            albumDirs.push({ path: albumPath, name: album.name });
          }
        }
      }
    }
  }

  return albumDirs;
}

// 新增：从专辑文件夹中读取任意一个 .flac 文件，解析元数据获取专辑名
async function getAlbumNameFromFlac(folderPath) {
  const files = fs.readdirSync(folderPath);
  const flacFile = files.find(f => f.toLowerCase().endsWith('.flac'));
  if (!flacFile) return null;

  try {
    const metadata = await parseFile(path.join(folderPath, flacFile));
    return metadata.common.album || null;
  } catch (err) {
    console.warn(`⚠️ 解析 ${flacFile} 元数据失败: ${err.message}`);
    return null;
  }
}

(async () => {
  try {
    const albums = findAlbumDirs(rootDir);

    for (const album of albums) {
      const coverPath = path.join(album.path, 'cover.jpg');
      if (fs.existsSync(coverPath)) {
        console.log(`📀 ${album.name} 已存在封面，跳过`);
        continue;
      }

      // 从 flac 文件元数据获取专辑名，没取到用文件夹名
      const albumName = (await getAlbumNameFromFlac(album.path)) || album.name;

      console.log(`🔍 搜索 "${albumName}" 的封面...`);
      try {
        const imageUrls = await getImageUrls(albumName, imageLimit, pageNumber);
        if (imageUrls.length > 0) {
          console.log(`⬇️ 下载 ${albumName} 封面: ${imageUrls[0]}`);
          await downloadImage(imageUrls[0], coverPath);
          console.log(`✅ 保存成功: ${coverPath}`);
        } else {
          console.warn(`🚫 未找到 ${albumName} 的封面`);
        }
      } catch (err) {
        console.error(`❌ 下载 ${albumName} 封面失败: ${err.message}`);
      }

      await new Promise(res => setTimeout(res, 500));
    }
  } catch (err) {
    console.error('❌ 程序出错:', err.message);
  }
})();
