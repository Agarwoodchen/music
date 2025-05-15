<template>
  <Header />
  <div class="artist-container">
    <!-- 顶部导航 -->
    <!-- <header class="header">
      <div class="header-content">
        <h1 class="logo">音乐天堂</h1>
        <nav class="nav">
          <a href="#" class="nav-link">首页</a>
          <a href="#" class="nav-link">歌单</a>
          <a href="#" class="nav-link">排行榜</a>
          <a href="#" class="nav-link active">歌手</a>
        </nav>
        <div class="user-actions">
          <button class="search-btn">
            <i class="icon">🔍</i>
          </button>
          <button @click="toggleTheme" class="theme-toggle">
            {{ theme === 'light' ? '🌙' : '☀️' }}
          </button>
          <button class="user-btn">
            <i class="icon">👤</i>
          </button>
        </div>
      </div>
    </header> -->

    <!-- 主要内容 -->
    <main class="main-content">
      <!-- 歌手筛选 -->
      <section class="artist-filter">
        <div class="filter-group">
          <h3 class="filter-title">语种</h3>
          <div class="filter-options">
            <button v-for="lang in languages" :key="lang" :class="['filter-btn', { active: selectedLanguage === lang }]"
              @click="selectLanguage(lang)">
              {{ lang }}
            </button>
          </div>
        </div>
        <div class="filter-group">
          <h3 class="filter-title">分类</h3>
          <div class="filter-options">
            <button v-for="cat in categories" :key="cat" :class="['filter-btn', { active: selectedCategory === cat }]"
              @click="selectCategory(cat)">
              {{ cat }}
            </button>
          </div>
        </div>
        <div class="filter-group">
          <h3 class="filter-title">字母</h3>
          <div class="filter-options">
            <button v-for="letter in letters" :key="letter"
              :class="['filter-btn', { active: selectedLetter === letter }]" @click="selectLetter(letter)">
              {{ letter }}
            </button>
          </div>
        </div>
      </section>

      <!-- 热门歌手 -->
      <section class="popular-artists">
        <div class="section-header">
          <h2 class="section-title">热门歌手</h2>
          <a href="#" class="view-all">查看全部 ></a>
        </div>
        <div class="artist-grid">
          <div class="artist-card" v-for="artist in popularArtists" :key="artist.id" @click="viewArtist(artist)">
            <div class="artist-cover">
              <img :src="artist.avatar" :alt="artist.name" class="artist-img">
              <div class="artist-rank" v-if="artist.rank <= 3">
                <span class="rank-badge">{{ artist.rank }}</span>
              </div>
            </div>
            <div class="artist-info">
              <h3 class="artist-name">{{ artist.name }}</h3>
              <p class="artist-fans">{{ artist.fans }}粉丝</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 歌手分类列表 -->
      <section class="artist-categories">
        <div class="category-section" v-for="category in artistCategories" :key="category.id">
          <h2 class="category-title">{{ category.name }}</h2>
          <div class="artist-list">
            <div class="artist-item" v-for="artist in category.artists" :key="artist.id" @click="viewArtist(artist)">
              <img :src="artist.avatar" :alt="artist.name" class="artist-avatar">
              <div class="artist-details">
                <h3 class="artist-name">{{ artist.name }}</h3>
                <p class="artist-albums">{{ artist.albums }}张专辑 · {{ artist.songs }}首歌曲</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 底部播放器 -->
    <footer class="player-bar">
      <div class="player-content">
        <div class="now-playing">
          <img src="https://picsum.photos/50/50" alt="当前播放" class="now-playing-cover">
          <div class="now-playing-info">
            <div class="now-playing-title">歌曲名称</div>
            <div class="now-playing-artist">歌手名称</div>
          </div>
          <button class="like-btn">❤️</button>
        </div>
        <div class="player-controls">
          <button class="control-btn">⏮️</button>
          <button class="play-btn">▶️</button>
          <button class="control-btn">⏭️</button>
        </div>
        <div class="progress-bar">
          <div class="progress-time">1:23</div>
          <div class="progress-track">
            <div class="progress-filled" style="width: 30%"></div>
          </div>
          <div class="progress-time">4:56</div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import { ThemeSymbol } from '../../theme-context'
import Header from '../../components/header.vue'
import { ElMessage } from 'element-plus'
import {
  getArtistsListApi
} from '../../api/test.ts'


const themeContext = inject(ThemeSymbol)

if (!themeContext) {
  throw new Error('Theme context not provided')
}

const { theme, toggleTheme } = themeContext

// 筛选选项
const languages = ref(['全部', '华语', '欧美', '日本', '韩国', '其他'])
const categories = ref(['全部', '男歌手', '女歌手', '乐队组合'])
const letters = ref(['热门', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'])

const selectedLanguage = ref('全部')
const selectedCategory = ref('全部')
const selectedLetter = ref('热门')

const selectLanguage = (lang: string) => {
  selectedLanguage.value = lang
  // 这里可以添加筛选逻辑
}

const selectCategory = (cat: string) => {
  selectedCategory.value = cat
  // 这里可以添加筛选逻辑
}

const selectLetter = (letter: string) => {
  selectedLetter.value = letter
  // 这里可以添加筛选逻辑
}

// 模拟热门歌手数据
const popularArtists = ref([
  { id: 1, name: '周杰伦', avatar: 'https://picsum.photos/150/150?artist1', fans: '1.2亿', rank: 1 },
  { id: 2, name: 'Taylor Swift', avatar: 'https://picsum.photos/150/150?artist2', fans: '9800万', rank: 2 },
  { id: 3, name: 'BTS', avatar: 'https://picsum.photos/150/150?artist3', fans: '8500万', rank: 3 },
  { id: 4, name: '林俊杰', avatar: 'https://picsum.photos/150/150?artist4', fans: '7500万', rank: 4 },
  { id: 5, name: 'Adele', avatar: 'https://picsum.photos/150/150?artist5', fans: '6800万', rank: 5 },
  { id: 6, name: '五月天', avatar: 'https://picsum.photos/150/150?artist6', fans: '6200万', rank: 6 },
  { id: 7, name: 'Ed Sheeran', avatar: 'https://picsum.photos/150/150?artist7', fans: '5800万', rank: 7 },
  { id: 8, name: '邓紫棋', avatar: 'https://picsum.photos/150/150?artist8', fans: '5500万', rank: 8 }
])

// 模拟歌手分类数据
const artistCategories = ref([
  {
    id: 1,
    name: '华语男歌手',
    artists: [
      { id: 101, name: '周杰伦', avatar: 'https://picsum.photos/100/100?artist101', albums: 15, songs: 200 },
      { id: 102, name: '林俊杰', avatar: 'https://picsum.photos/100/100?artist102', albums: 12, songs: 180 },
      { id: 103, name: '陈奕迅', avatar: 'https://picsum.photos/100/100?artist103', albums: 20, songs: 250 },
      { id: 104, name: '薛之谦', avatar: 'https://picsum.photos/100/100?artist104', albums: 8, songs: 120 },
      { id: 105, name: '李荣浩', avatar: 'https://picsum.photos/100/100?artist105', albums: 7, songs: 90 },
      { id: 106, name: '王力宏', avatar: 'https://picsum.photos/100/100?artist106', albums: 18, songs: 220 }
    ]
  },
  {
    id: 2,
    name: '华语女歌手',
    artists: [
      { id: 201, name: '邓紫棋', avatar: 'https://picsum.photos/100/100?artist201', albums: 9, songs: 150 },
      { id: 202, name: '蔡依林', avatar: 'https://picsum.photos/100/100?artist202', albums: 14, songs: 190 },
      { id: 203, name: '张惠妹', avatar: 'https://picsum.photos/100/100?artist203', albums: 20, songs: 280 },
      { id: 204, name: '孙燕姿', avatar: 'https://picsum.photos/100/100?artist204', albums: 13, songs: 170 },
      { id: 205, name: '田馥甄', avatar: 'https://picsum.photos/100/100?artist205', albums: 5, songs: 80 },
      { id: 206, name: '王菲', avatar: 'https://picsum.photos/100/100?artist206', albums: 22, songs: 300 }
    ]
  },
  {
    id: 3,
    name: '欧美歌手',
    artists: [
      { id: 301, name: 'Taylor Swift', avatar: 'https://picsum.photos/100/100?artist301', albums: 10, songs: 180 },
      { id: 302, name: 'Ed Sheeran', avatar: 'https://picsum.photos/100/100?artist302', albums: 7, songs: 120 },
      { id: 303, name: 'Adele', avatar: 'https://picsum.photos/100/100?artist303', albums: 5, songs: 90 },
      { id: 304, name: 'Bruno Mars', avatar: 'https://picsum.photos/100/100?artist304', albums: 4, songs: 70 },
      { id: 305, name: 'Billie Eilish', avatar: 'https://picsum.photos/100/100?artist305', albums: 3, songs: 60 },
      { id: 306, name: 'Justin Bieber', avatar: 'https://picsum.photos/100/100?artist306', albums: 8, songs: 150 }
    ]
  }
])

const viewArtist = (artist: any) => {
  console.log('查看歌手:', artist.name)
  // 实际应用中这里会跳转到歌手详情页
}

const handArtistsListData = (data: any[]) => {
  return data.map((item: any, index: number) => ({
    id: item.id,
    name: item.name,
    avatar: `https://picsum.photos/150/150?random=${index}`, // 每个 index 不同
    fans: '8500w',
    rank: index + 1,
  }));
};



const loadPageData = async () => {
  try {
    const [
      ArtistsList
    ] = await Promise.all([
      getArtistsListApi()
    ])
    console.log(ArtistsList, 'ArtistsList');
    // console.log(handArtistsListData(ArtistsList.data));
    popularArtists.value = handArtistsListData(ArtistsList.data)
    // console.log(handRecentStudyLogsData(studyLogs));
  } catch (error) {
    console.error(error)
    ElMessage.error('请求数据失败')
  }
}

onMounted(() => {
  loadPageData()
})

</script>

<style scoped>
.artist-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-color);
}

/* 头部样式 */
/* .header {
  background-color: var(--header-bg);
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 4px var(--shadow-color);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--button-bg);
  margin: 0;
}

.nav {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: var(--text-color);
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
}

.nav-link.active {
  color: var(--button-bg);
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--button-bg);
} */

.user-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.search-btn,
.user-btn,
.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color);
}

.search-btn:hover,
.user-btn:hover,
.theme-toggle:hover {
  background-color: var(--hover-bg);
}

/* 主要内容样式 */
.main-content {
  flex: 1;
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* 筛选区域样式 */
.artist-filter {
  background-color: var(--card-bg);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.filter-group {
  margin-bottom: 1.5rem;
}

.filter-group:last-child {
  margin-bottom: 0;
}

.filter-title {
  font-size: 1rem;
  margin: 0 0 0.75rem 0;
  color: var(--text-color);
  opacity: 0.8;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-btn {
  background-color: var(--bg-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  padding: 0.5rem 1rem;
  border-radius: 16px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  background-color: var(--hover-bg);
}

.filter-btn.active {
  background-color: var(--button-bg);
  color: var(--button-text-color);
  border-color: var(--button-bg);
}

/* 热门歌手样式 */
.popular-artists {
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.5rem;
  margin: 0;
}

.view-all {
  color: var(--link-color);
  font-size: 0.9rem;
}

.view-all:hover {
  text-decoration: underline;
}

.artist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
}

.artist-card {
  background-color: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.artist-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px var(--shadow-color);
}

.artist-cover {
  position: relative;
  width: 100%;
  padding-top: 100%;
  /* 保持正方形 */
  overflow: hidden;
}

.artist-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.artist-rank {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
}

.rank-badge {
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  background-color: var(--error-color);
  color: white;
  border-radius: 50%;
  text-align: center;
  line-height: 1.5rem;
  font-size: 0.8rem;
  font-weight: bold;
}

.artist-info {
  padding: 1rem;
}

.artist-name {
  font-size: 1rem;
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.artist-fans {
  font-size: 0.8rem;
  color: var(--text-color);
  opacity: 0.7;
  margin: 0;
}

/* 歌手分类列表样式 */
.artist-categories {
  margin-bottom: 2rem;
}

.category-section {
  margin-bottom: 2.5rem;
}

.category-section:last-child {
  margin-bottom: 0;
}

.category-title {
  font-size: 1.25rem;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.artist-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.artist-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 6px;
  background-color: var(--card-bg);
  transition: background-color 0.2s;
  cursor: pointer;
}

.artist-item:hover {
  background-color: var(--hover-bg);
}

.artist-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 1rem;
  object-fit: cover;
}

.artist-details {
  flex: 1;
  min-width: 0;
}

.artist-name {
  font-size: 1rem;
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.artist-albums {
  font-size: 0.8rem;
  color: var(--text-color);
  opacity: 0.7;
  margin: 0;
}

/* 播放器样式 */
.player-bar {
  background-color: var(--header-bg);
  border-top: 1px solid var(--border-color);
  padding: 0.5rem 1rem;
  position: sticky;
  bottom: 0;
}

.player-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.now-playing {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 25%;
}

.now-playing-cover {
  width: 50px;
  height: 50px;
  border-radius: 4px;
}

.now-playing-info {
  flex: 1;
  min-width: 0;
}

.now-playing-title {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.now-playing-artist {
  font-size: 0.8rem;
  color: var(--text-color);
  opacity: 0.7;
}

.like-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-color);
  opacity: 0.7;
  font-size: 1rem;
}

.like-btn:hover {
  opacity: 1;
  color: var(--error-color);
}

.player-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 25%;
  justify-content: center;
}

.control-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-color);
  font-size: 1rem;
  opacity: 0.7;
}

.control-btn:hover {
  opacity: 1;
}

.play-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--button-bg);
  font-size: 1.5rem;
}

.progress-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 50%;
}

.progress-time {
  font-size: 0.8rem;
  color: var(--text-color);
  opacity: 0.7;
}

.progress-track {
  flex: 1;
  height: 4px;
  background-color: var(--border-color);
  border-radius: 2px;
  cursor: pointer;
}

.progress-filled {
  height: 100%;
  background-color: var(--button-bg);
  border-radius: 2px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .artist-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .artist-list {
    grid-template-columns: 1fr;
  }

  .player-content {
    flex-direction: column;
    gap: 0.5rem;
  }

  .now-playing,
  .player-controls,
  .progress-bar {
    width: 100%;
  }
}
</style>