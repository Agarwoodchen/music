import fs from 'fs';
import path from 'path';
import { parseFile } from 'music-metadata';
import pinyinModule from 'pinyin';

const pinyin = pinyinModule.default || pinyinModule;

// 将中文转换为拼音，并清理非法路径字符
function toPinyinSafe(str) {
  const safeStr = str.replace(/[<>:"/\\|?*\x00-\x1F]/g, ''); // 清除非法文件名字符
  const py = pinyin(safeStr, {
    style: pinyin.STYLE_NORMAL,
    heteronym: false,
    segment: true
  }).flat().map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');

  if (/^\d+$/.test(py)) return 'Album' + py;
  return py.replace(/\.+$/, '') || 'Unknown'; // 防止空字符串
}

// 音轨号补零
function formatTrackNumber(num) {
  return num && Number.isInteger(num) ? num.toString().padStart(2, '0') : '00';
}

// 生成目标文件名
function generateFileName(trackNum, title, ext = 'flac') {
  const titlePinyin = toPinyinSafe(title);
  return `${formatTrackNumber(trackNum)}_${titlePinyin}.${ext}`;
}

// 拷贝封面图
function copyCoverImage(srcDir, destDir) {
  const candidates = ['cover.jpg', 'folder.jpg', 'Cover.jpg', 'Folder.jpg'];
  for (const name of candidates) {
    const src = path.join(srcDir, name);
    if (fs.existsSync(src)) {
      const dest = path.join(destDir, name);
      try {
        fs.copyFileSync(src, dest);
        console.log(`🖼️  复制封面图：${name} → ${destDir}`);
      } catch (err) {
        console.warn(`⚠️ 拷贝封面失败：${src} → ${dest}，错误：${err.message}`);
      }
      return;
    }
  }
}

// 处理单个 FLAC 文件
async function processFlac(filePath, outputBaseDir = './output') {
  try {
    const metadata = await parseFile(filePath);

    const artist = metadata.common.artist || 'UnknownArtist';
    const album = metadata.common.album || 'UnknownAlbum';
    const title = metadata.common.title || path.basename(filePath, path.extname(filePath));
    const ext = path.extname(filePath).slice(1);
    const trackNum = metadata.common.track?.no || 0;

    const artistDir = toPinyinSafe(artist);
    const albumDir = toPinyinSafe(album);
    const outputDir = path.join(outputBaseDir, artistDir, albumDir);

    try {
      fs.mkdirSync(outputDir, { recursive: true });
    } catch (err) {
      console.error(`❌ 创建目录失败：${outputDir} - ${err.message}`);
      return;
    }

    const newFileName = generateFileName(trackNum, title, ext);
    let targetPath = path.join(outputDir, newFileName);
    let count = 1;

    while (fs.existsSync(targetPath)) {
      const nameWithoutExt = path.basename(newFileName, '.' + ext);
      const newName = `${nameWithoutExt}_${count}.${ext}`;
      targetPath = path.join(outputDir, newName);
      count++;
    }

    try {
      fs.copyFileSync(filePath, targetPath);
      console.log(`✅ ${path.basename(filePath)} → ${targetPath}`);
    } catch (err) {
      console.error(`❌ 拷贝失败：${filePath} → ${targetPath} - ${err.message}`);
      return;
    }

    copyCoverImage(path.dirname(filePath), outputDir);

  } catch (err) {
    console.error(`❌ 无法处理文件 ${filePath}: ${err.message}`);
  }
}

// 递归处理文件夹
async function processAllFlacs(inputDir, outputBaseDir = './output') {
  if (!fs.existsSync(inputDir)) {
    console.error(`❌ 输入目录不存在：${inputDir}`);
    return;
  }

  let entries;
  try {
    entries = fs.readdirSync(inputDir);
  } catch (err) {
    console.error(`❌ 无法读取目录 ${inputDir}: ${err.message}`);
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(inputDir, entry);
    try {
      const stats = fs.statSync(fullPath);
      if (stats.isFile() && path.extname(entry).toLowerCase() === '.flac') {
        await processFlac(fullPath, outputBaseDir);
      } else if (stats.isDirectory()) {
        await processAllFlacs(fullPath, outputBaseDir);
      }
    } catch (err) {
      console.error(`⚠️ 读取文件失败 ${fullPath}: ${err.message}`);
    }
  }
}

// ✅ 输入输出路径
const inputDir = './汪苏笼无损Flac合集';
const outputDir = './express/public/music';

processAllFlacs(inputDir, outputDir).then(() => {
  console.log('🎉 所有音乐文件处理完毕');
}).catch(err => {
  console.error(`❌ 发生未捕获的错误：${err.message}`);
});

