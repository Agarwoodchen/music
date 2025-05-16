<template>
  <div v-if="loading" class="loading-box">
    <p>正在加载...</p>
  </div>
  <div v-else class="artist-container" :class="theme">
    <!-- 添加顶部导航栏 -->
    <!-- <header class="page-header">
      <button class="back-button" @click="goBack">
        <i class="icon">⬅️</i> 返回
      </button>
      <h1 class="page-title">歌手详情</h1>
    </header> -->
    <!-- 歌手头部信息 -->
    <div class="artist-header">
      <div class="header-background"
        :style="{ backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3), var(--card-bg)), url(https://source.unsplash.com/random/1600x400/?music,singer)' }">
        <div class="header-content">
          <div class="artist-avatar">
            <img :src="artistInfomation.avatar" alt="歌手头像">
          </div>
          <div class="artist-info">
            <h1 class="artist-name">{{ artistInfomation.name }}</h1>
            <p class="artist-genre">{{ artistInfomation.country }}</p>
            <div class="artist-stats">
              <span class="stat-item"><i class="icon-headphones"></i> {{ artistInfomation.playCount }}播放</span>
              <span class="stat-item"><i class="icon-fans"></i> {{ artistInfomation.followers }}粉丝</span>
              <span class="stat-item"><i class="icon-music"></i> 156首歌曲</span>
            </div>
            <div class="artist-actions">
              <button class="follow-btn">
                <i class="icon-plus"></i> 关注
              </button>
              <button class="play-all-btn">
                <i class="icon-play"></i> 播放全部
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区 -->
    <main class="artist-main">
      <!-- 导航标签 -->
      <!-- 导航标签 - 添加点击事件和动态active类 -->
      <div class="artist-tabs">
        <button v-for="tab in tabs" :key="tab.id" class="tab-btn" :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id">
          {{ tab.name }}
        </button>
      </div>

      <!-- 根据activeTab显示不同内容 -->
      <div v-show="activeTab === 'songs'" class="tab-content">
        <!-- 热门歌曲列表 -->
        <!-- 热门歌曲列表 -->
        <div class="song-list">
          <div class="list-header">
            <span class="header-number">#</span>
            <span class="header-title">歌曲标题</span>
            <span class="header-album">专辑</span>
            <span class="header-duration">时长</span>
          </div>
          <div class="list-item" v-for="(song, index) in songs" :key="song.id">
            <div class="item-number">{{ index + 1 }}</div>
            <div class="item-info">
              <div class="item-title">{{ song.title }}</div>
              <div class="item-artist">{{ song.artist }}</div>
            </div>
            <div class="item-album">{{ song.album }}</div>
            <div class="item-duration">{{ song.duration }}</div>
            <div class="item-actions">
              <button class="action-btn"><i class="icon-play"></i></button>
              <button class="action-btn"><i class="icon-add"></i></button>
              <button class="action-btn"><i class="icon-download"></i></button>
            </div>
          </div>
        </div>
      </div>

      <div v-show="activeTab === 'albums'" class="tab-content">
        <div class="section-title">
          <h2>全部专辑</h2>
          <span class="album-count">{{ allAlbums.length }}张专辑</span>
        </div>

        <div class="album-grid">
          <div class="album-card" v-for="album in allAlbums" :key="album.id" @click="viewAlbum(album)">
            <div class="album-cover">
              <img :src="album.cover || `https://source.unsplash.com/random/300x300/?album,${album.name}`"
                :alt="album.name" class="cover-image">
              <div class="album-meta">
                <span class="song-count">{{ album.songCount }}首</span>
                <span class="album-year">{{ album.year }}</span>
              </div>
              <button class="play-button" @click.stop="playAlbum(album)">
                <i class="icon-play"></i>
              </button>
            </div>
            <div class="album-info">
              <h3 class="album-title">{{ album.name }}</h3>
              <p class="album-type">{{ album.type || '录音室专辑' }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-show="activeTab === 'videos'" class="tab-content">
        <!-- 相关MV内容 -->
        <div class="section-title">
          <h2>相关MV</h2>
        </div>
        <div class="video-grid">
          <div class="video-card" v-for="video in mvList" :key="video.id">
            <img :src="video.cover" :alt="video.title" class="video-cover">
            <div class="video-info">
              <h3>{{ video.title }}</h3>
              <p>{{ video.playCount }}次播放</p>
            </div>
          </div>
        </div>
      </div>

      <div v-show="activeTab === 'about'" class="tab-content">
        <!-- 歌手介绍内容 -->
        <div class="artist-bio">
          <h2 class="section-title">歌手介绍</h2>
          <div class="bio-content">
            <p>{{ artistBio }}</p>
          </div>
        </div>
      </div>


      <!-- 专辑展示 -->
      <div class="section-title">
        <h2>热门专辑</h2>
        <router-link to="/artist/albums" class="view-all">查看全部 ></router-link>
      </div>
      <div class="album-grid">
        <div class="album-card" v-for="album in albums" :key="album.id">
          <div class="album-cover">
            <img :src="`https://picsum.photos/150/150?random=${album.id}`" :alt="album.name">
            <button class="play-btn"><i class="icon-play"></i></button>
          </div>
          <div class="album-info">
            <h3 class="album-name">{{ album.name }}</h3>
            <p class="album-year">{{ album.year }} · {{ album.songCount }}首</p>
          </div>
        </div>
      </div>

      <!-- 相似歌手 -->
      <div class="section-title">
        <h2>相似歌手</h2>
      </div>
      <div class="artist-grid">
        <div class="artist-card" v-for="artist in similarArtists" :key="artist.id">
          <div class="artist-avatar">
            <img :src="'https://randomuser.me/api/portraits/women/' + artist.id + '.jpg'" :alt="artist.name">
          </div>
          <h3 class="artist-name">{{ artist.name }}</h3>
          <p class="artist-fans">{{ artist.fans }}粉丝</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// import { inject, ref } from 'vue'
import { inject, onMounted, ref } from 'vue'
import { ThemeSymbol } from '../theme-context.ts'
import { useRouter } from 'vue-router'
const router = useRouter()
import {
  getArtistDetailsMUALMApi
} from '../api/test.ts'
import { ElMessage } from 'element-plus'

import { defineProps } from 'vue'

const props = defineProps({
  artistId: {
    type: [String, Number],
    required: true
  }
})

const loading = ref(true)
const artistInfomation = ref<any>(null)
// 示例：打印接收到的 id
console.log('接收到 artistId:', props.artistId)


const themeContext = inject(ThemeSymbol)

if (!themeContext) {
  throw new Error('Theme context not provided')
}

const { theme, toggleTheme } = themeContext

// 模拟数据
const songs = [
  { id: 1, title: 'Love Story', artist: 'Taylor Swift', album: 'Fearless', duration: '3:55' },
  { id: 2, title: 'Blank Space', artist: 'Taylor Swift', album: '1989', duration: '3:51' },
  { id: 3, title: 'Cardigan', artist: 'Taylor Swift', album: 'Folklore', duration: '3:59' },
  { id: 4, title: 'Shake It Off', artist: 'Taylor Swift', album: '1989', duration: '3:39' },
  { id: 5, title: 'You Belong With Me', artist: 'Taylor Swift', album: 'Fearless', duration: '3:51' }
]

const albums = [
  { id: 1, name: 'Folklore', year: 2020, songCount: 16 },
  { id: 2, name: '1989', year: 2014, songCount: 13 },
  { id: 3, name: 'Lover', year: 2019, songCount: 18 },
  { id: 4, name: 'Reputation', year: 2017, songCount: 15 }
]

const similarArtists = [
  { id: 21, name: 'Adele', fans: '1200万' },
  { id: 22, name: 'Ed Sheeran', fans: '1500万' },
  { id: 23, name: 'Billie Eilish', fans: '980万' },
  { id: 24, name: 'Shawn Mendes', fans: '860万' }
]



// 定义标签数据
const tabs = [
  { id: 'songs', name: '热门歌曲' },
  { id: 'albums', name: '全部专辑' },
  { id: 'videos', name: '相关MV' },
  { id: 'about', name: '歌手介绍' }
]

// 当前激活的标签
const activeTab = ref('songs')

// 模拟MV数据
const mvList = ref([
  { id: 1, title: 'Love Story MV', cover: 'https://picsum.photos/150/150?random=1', playCount: '1.2亿' },
  { id: 2, title: 'Blank Space MV', cover: 'https://picsum.photos/150/150?random=2', playCount: '9800万' },
  { id: 3, title: 'Cardigan MV', cover: 'https://picsum.photos/150/150?random=3', playCount: '8600万' }
])

// 模拟歌手介绍
const artistBio = ref('泰勒·斯威夫特（Taylor Swift），1989年12月13日出生于美国宾夕法尼亚州，美国女歌手、词曲作者、音乐制作人、演员。2006年发行首张录音室专辑《Taylor Swift》，获美国唱片业协会认证5倍白金唱片。2008年发行第二张录音室专辑《Fearless》，在美国公告牌专辑榜上获11周冠军，是2009年全美最畅销专辑，认证7倍白金唱片，专辑获第52届格莱美奖年度专辑，使泰勒成为获此奖项的最年轻歌手...')
// 完整的专辑数据
const allAlbums = ref([
  {
    id: 1,
    name: 'Folklore',
    year: '2020',
    cover: 'https://source.unsplash.com/random/300x300/?folklore',
    songCount: 16,
    type: '录音室专辑'
  },
  {
    id: 2,
    name: 'Evermore',
    year: '2020',
    cover: 'https://source.unsplash.com/random/300x300/?evermore',
    songCount: 15,
    type: '录音室专辑'
  },
  {
    id: 3,
    name: 'Lover',
    year: '2019',
    cover: 'https://source.unsplash.com/random/300x300/?lover,album',
    songCount: 18,
    type: '录音室专辑'
  },
  {
    id: 4,
    name: 'Reputation',
    year: '2017',
    cover: 'https://source.unsplash.com/random/300x300/?reputation',
    songCount: 15,
    type: '录音室专辑'
  },
  {
    id: 5,
    name: '1989',
    year: '2014',
    cover: 'https://source.unsplash.com/random/300x300/?1989,album',
    songCount: 13,
    type: '录音室专辑'
  },
  {
    id: 6,
    name: 'Red (Taylor\'s Version)',
    year: '2021',
    cover: 'https://source.unsplash.com/random/300x300/?red,album',
    songCount: 30,
    type: '重录专辑'
  },
  {
    id: 7,
    name: 'Fearless (Taylor\'s Version)',
    year: '2021',
    cover: 'https://source.unsplash.com/random/300x300/?fearless',
    songCount: 26,
    type: '重录专辑'
  },
  {
    id: 8,
    name: 'Speak Now',
    year: '2010',
    cover: 'https://source.unsplash.com/random/300x300/?speaknow',
    songCount: 14,
    type: '录音室专辑'
  }
])

const viewAlbum = (album: any) => {
  console.log('查看专辑:', album.name)
  router.push({ name: 'AlbumDatalis', params: { id: album.id } })
}

const playAlbum = (album: any) => {
  console.log('播放专辑:', album.name)
  // 这里可以触发播放专辑的逻辑
}


const goBack = () => {
  router.go(-1) // 返回上一页
}

const handArtistsListData = (data) => {
  if (!data || typeof data !== 'object' || !data.artist || typeof data.artist !== 'object') {
    console.warn('数据格式不正确:', data);
    return;
  }

  console.log('原始数据:', data);

  const artist = data.artist;

  const isValidDate = (dateStr) => typeof dateStr === 'string' && !isNaN(Date.parse(dateStr));

  const isNonNegativeInteger = (value) =>
    typeof value === 'number' && Number.isInteger(value) && value >= 0;

  const formatNumber = (num) => {
    if (!isNonNegativeInteger(num)) return 0;
    if (num < 1000) return num;
    if (num < 10000) return (num / 1000).toFixed(1) + 'k';
    return (num / 10000).toFixed(1) + 'w';
  };

  // 歌手信息
  artistInfomation.value = {
    name: artist.name_zh?.trim() || artist.name?.trim() || '未知歌手',
    avatar: 'https://picsum.photos/150/150?random=2',
    birthDate: isValidDate(artist.birth_date) ? artist.birth_date.slice(0, 10) : '未知',
    followers: formatNumber(artist.followers),
    playCount: formatNumber(artist.play_count),
    likesCount: formatNumber(artist.likes_count),
    country:
      typeof artist.country === 'string' && artist.country.trim()
        ? artist.country
        : '未知'
  };

  // 专辑信息
  if (Array.isArray(data.albums)) {
    allAlbums.value = data.albums.map((album, index = 0) => ({
      id: album.id,
      name: album.name_zh?.trim() || album.name?.trim() || '未知专辑',
      cover: `https://picsum.photos/150/150?random=${index}`,
      year: album.release_year || '未知',
      songCount: Array.isArray(album.songs) ? album.songs.length : 0,
      type: '录音室专辑'
    }));
  } else {
    allAlbums.value = [];
  }
};




const loadPageData = async () => {
  try {
    const [
      getArtistDetailsMUALM
    ] = await Promise.all([
      getArtistDetailsMUALMApi(props.artistId)
    ])
    handArtistsListData(getArtistDetailsMUALM)
    // console.log(getArtistDetailsMUALM, 'getArtistDetailsMUALM');
    console.log(artistInfomation.value);

  } catch (error) {
    console.error(error)
    ElMessage.error('请求数据失败')
  } finally {
    loading.value = false
  }
}


onMounted(() => {
  loadPageData()
})
</script>

<style scoped>
.artist-container {
  background-color: var(--bg-color);
  color: var(--text-color);
  min-height: 100vh;
  transition: all 0.3s ease;
}

.artist-header {
  position: relative;
  margin-bottom: 30px;
}

.header-background {
  height: 300px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  padding-bottom: 30px;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 0 20px;
  display: flex;
  align-items: flex-end;
  gap: 30px;
}

.artist-avatar {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  border: 5px solid var(--card-bg);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.artist-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.artist-info {
  flex: 1;
  color: var(--text-color);
}

.artist-name {
  font-size: 2.5rem;
  margin: 0 0 10px;
}

.artist-genre {
  font-size: 1.1rem;
  margin: 0 0 15px;
  opacity: 0.9;
}

.artist-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.95rem;
}

.artist-actions {
  display: flex;
  gap: 15px;
}

.follow-btn,
.play-all-btn {
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.follow-btn {
  background-color: var(--button-bg);
  color: var(--button-text-color);
  border: none;
}

.play-all-btn {
  background-color: var(--button-bg);
  color: var(--button-text-color);
  border: 1px solid var(--border-color);
}

.follow-btn:hover {
  filter: brightness(0.9);
}

.play-all-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.artist-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 40px;
}

.artist-tabs {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
}

.tab-btn {
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1rem;
  padding: 8px 16px;
  cursor: pointer;
  position: relative;
  opacity: 0.7;
  transition: all 0.2s ease;
}

.tab-btn.active {
  opacity: 1;
  font-weight: 600;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -11px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--link-color);
}

.tab-btn:hover {
  opacity: 1;
}

.song-list {
  background-color: var(--card-bg);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 40px;
  box-shadow: 0 2px 10px var(--shadow-color);
}

.list-header {
  display: grid;
  grid-template-columns: 50px 3fr 2fr 80px;
  padding: 15px 20px;
  font-weight: 500;
  color: var(--text-color);
  opacity: 0.7;
  border-bottom: 1px solid var(--border-color);
}

.list-item {
  display: grid;
  grid-template-columns: 50px 3fr 2fr 80px;
  padding: 15px 20px;
  align-items: center;
  transition: background-color 0.2s ease;
  position: relative;
}

.list-item:hover {
  background-color: var(--hover-bg);
}

.list-item:hover .item-actions {
  opacity: 1;
}

.item-number {
  font-size: 1rem;
  color: var(--text-color);
  opacity: 0.7;
  text-align: center;
}

.item-info {
  display: flex;
  flex-direction: column;
}

.item-title {
  font-weight: 500;
  margin-bottom: 5px;
}

.item-artist {
  font-size: 0.9rem;
  color: var(--text-color);
  opacity: 0.7;
}

.item-album {
  font-size: 0.95rem;
}

.item-duration {
  font-size: 0.95rem;
  color: var(--text-color);
  opacity: 0.7;
}

.item-actions {
  position: absolute;
  right: 20px;
  display: flex;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.action-btn {
  background: none;
  border: none;
  color: var(--text-color);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background-color: var(--button-bg);
  color: var(--button-text-color);
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title h2 {
  font-size: 1.5rem;
  margin: 0;
}

.view-all {
  font-size: 0.95rem;
  color: var(--link-color);
}

.album-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 25px;
  margin-bottom: 50px;
}

.album-card {
  background-color: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.album-card:hover {
  transform: translateY(-5px);
}

.album-cover {
  position: relative;
  aspect-ratio: 1/1;
}

.album-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-btn {
  position: absolute;
  bottom: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--button-bg);
  color: var(--button-text-color);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s ease;
}

.album-card:hover .play-btn {
  opacity: 1;
  transform: translateY(-5px);
}

.album-info {
  padding: 15px;
}

.album-name {
  margin: 0 0 5px;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.album-year {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-color);
  opacity: 0.7;
}

.artist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 25px;
}

.artist-card {
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.artist-card:hover {
  transform: translateY(-5px);
}

.artist-card .artist-avatar {
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 15px;
  position: relative;
  border: none;
  box-shadow: 0 4px 15px var(--shadow-color);
}

.artist-card .artist-avatar img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.artist-card .artist-name {
  font-size: 1rem;
  margin: 0 0 5px;
  color: var(--text-color);
}

.artist-card .artist-fans {
  font-size: 0.85rem;
  margin: 0;
  color: var(--text-color);
  opacity: 0.7;
}

/* 图标样式 */
[class^="icon-"]::before,
[class*=" icon-"]::before {
  display: inline-block;
  font-style: normal;
  font-weight: normal;
  line-height: 1;
}

.icon-headphones::before {
  content: "🎧";
}

.icon-fans::before {
  content: "❤️";
}

.icon-music::before {
  content: "🎵";
}

.icon-plus::before {
  content: "+";
}

.icon-play::before {
  content: "▶";
}

.icon-add::before {
  content: "➕";
}

.icon-download::before {
  content: "⏬";
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding-bottom: 20px;
  }

  .artist-avatar {
    width: 150px;
    height: 150px;
    margin-top: -50px;
  }

  .artist-info {
    text-align: center;
  }

  .artist-stats {
    justify-content: center;
  }

  .artist-actions {
    justify-content: center;
  }

  .list-header {
    grid-template-columns: 40px 3fr 80px;
    display: none;
  }

  .list-item {
    grid-template-columns: 40px 1fr 80px;
    padding: 10px 15px;
  }

  .item-album {
    display: none;
  }

  .album-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .artist-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}

/* 标签导航样式保持不变 */
.artist-tabs {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
}

.tab-btn {
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1rem;
  padding: 8px 16px;
  cursor: pointer;
  position: relative;
  opacity: 0.7;
  transition: all 0.2s ease;
}

.tab-btn.active {
  opacity: 1;
  font-weight: 600;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -11px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--link-color);
}

.tab-btn:hover {
  opacity: 1;
}

/* 内容区域样式 */
.tab-content {
  margin-bottom: 40px;
}

/* MV网格样式 */
.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.video-card {
  background-color: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.video-card:hover {
  transform: translateY(-5px);
}

.video-cover {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.video-info {
  padding: 15px;
}

.video-info h3 {
  margin: 0 0 5px;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.video-info p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-color);
  opacity: 0.7;
}

/* 歌手介绍样式 */
.artist-bio {
  background-color: var(--card-bg);
  border-radius: 10px;
  padding: 20px;
}

.bio-content {
  line-height: 1.6;
}

.bio-content p {
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .artist-tabs {
    overflow-x: auto;
    padding-bottom: 5px;
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE/Edge */
  }

  .artist-tabs::-webkit-scrollbar {
    display: none;
    /* Chrome/Safari */
  }

  .tab-btn {
    flex-shrink: 0;
  }

  .video-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
}

/* 添加顶部导航栏样式 */
.page-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: var(--header-bg);
  border-bottom: 1px solid var(--border-color);
}

.back-button {
  background: none;
  border: none;
  color: var(--link-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
}

.back-button:hover {
  background-color: var(--hover-bg);
}

.page-title {
  margin: 0 auto;
  font-size: 1.2rem;
}


.section-content {
  margin-bottom: 40px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title h2 {
  font-size: 1.5rem;
  margin: 0;
}

.album-count {
  font-size: 0.9rem;
  color: var(--text-color);
  opacity: 0.7;
}

.album-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 25px;
}

.album-card {
  background-color: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.album-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px var(--shadow-color);
}

.album-cover {
  position: relative;
  aspect-ratio: 1/1;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.album-card:hover .cover-image {
  transform: scale(1.05);
}

.album-meta {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px 12px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
}

.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background-color: var(--button-bg);
  color: var(--button-text-color);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
  cursor: pointer;
  z-index: 2;
}

.album-card:hover .play-button {
  opacity: 1;
}

.play-button:hover {
  transform: translate(-50%, -50%) scale(1.1);
}

.album-info {
  padding: 12px;
}

.album-title {
  font-size: 1rem;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.album-type {
  font-size: 0.8rem;
  margin: 0;
  color: var(--text-color);
  opacity: 0.7;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .album-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  }

  .album-info {
    padding: 10px;
  }

  .album-title {
    font-size: 0.9rem;
  }

  .album-type {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .album-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}

/* 图标样式 */
.icon-play::before {
  content: "▶";
  display: inline-block;
  font-size: 0.8rem;
  margin-left: 2px;
}
</style>