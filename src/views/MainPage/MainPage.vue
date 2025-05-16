<template>
  <div class="music-app" :class="theme">
    <!-- 顶部导航栏 -->
    <!-- 顶部导航栏 -->
    <Header />
    <!-- <header class="header">
      <div class="header-content">
        <h1 class="logo">Music<span>Hub</span></h1>
        <div class="search-bar">
          <input type="text" placeholder="搜索歌曲、歌手或专辑...">
          <button class="search-button">
            <i class="icon-search"></i>
          </button>
        </div>
        <nav class="nav-links">
         
          <router-link to="Discover" class="discover">发现</router-link>
          <a href="#">歌单</a>
          <a href="#">排行榜</a>
          <a href="#">歌手</a>
        </nav>
        <div class="user-actions">
          <button class="theme-toggle" @click="toggleTheme">
            <i :class="theme === 'dark' ? 'icon-sun' : 'icon-moon'"></i>
            {{ theme === 'dark' ? '亮色模式' : '暗色模式' }}
          </button>
          <div class="user-dropdown">
            <button class="user-button">
              <i class="icon-user"></i>
            </button>
            <div class="dropdown-menu">
              <button class="dropdown-item" @click="logout">
                <i class="icon-logout"></i> 退出登录
              </button>
            </div>
          </div>
        </div>
      </div>
    </header> -->

    <!-- 主要内容区 -->
    <main class="main-content">
      <!-- 推荐歌单 -->
      <section class="section">
        <h2 class="section-title">推荐歌单</h2>
        <div class="playlist-grid">
          <div class="playlist-card" v-for="i in 6" :key="`playlist-${i}`">
            <div class="playlist-cover">
              <img :src="`https://picsum.photos/300/300?random=${i}`" alt="歌单封面">
              <div class="play-button">
                <i class="icon-play"></i>
              </div>
              <div class="play-count">
                <i class="icon-headphones"></i> {{ Math.floor(Math.random() * 10000).toLocaleString() }}
              </div>
            </div>
            <div class="playlist-info">
              <h3>每日推荐 {{ i }}</h3>
              <p>{{ ['流行', '摇滚', '电子', '古典', '爵士', '民谣'][i - 1] }} · {{ Math.floor(Math.random() * 50) + 10 }}首</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 最新音乐 -->
      <section class="section">
        <h2 class="section-title">最新音乐</h2>
        <div class="song-list">
          <div class="song-item" v-for="i in 5" :key="`song-${i}`">
            <div class="song-number">{{ i }}</div>
            <div class="song-cover">
              <img :src="`https://picsum.photos/80/80?random=${i + 10}`" alt="歌曲封面">
            </div>
            <div class="song-info">
              <h3 class="song-title">歌曲标题 {{ i }}</h3>
              <p class="song-artist">歌手 {{ ['A', 'B', 'C', 'D', 'E'][i - 1] }}</p>
            </div>
            <div class="song-album">专辑 {{ ['X', 'Y', 'Z', 'W', 'V'][i - 1] }}</div>
            <div class="song-duration">3:{{ 10 + i }}</div>
            <div class="song-actions">
              <button class="icon-button">
                <i class="icon-heart"></i>
              </button>
              <button class="icon-button">
                <i class="icon-download"></i>
              </button>
              <button class="icon-button">
                <i class="icon-more"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 热门歌手 -->
      <section class="section">
        <h2 class="section-title">热门歌手</h2>
        <div class="artist-grid">
          <div class="artist-card" v-for="i in 6" :key="`artist-${i}`">
            <div class="artist-avatar">
              <img :src="`https://picsum.photos/150/150?random=${i + 20}`" alt="歌手头像">
            </div>
            <h3 class="artist-name">歌手 {{ ['Taylor', 'Ed', 'Adele', 'Bruno', 'Billie', 'BTS'][i - 1] }}</h3>
          </div>
        </div>
      </section>
    </main>

    <!-- 底部播放器 -->
    <!-- <footer class="player-bar">
      <div class="player-content">
        <div class="now-playing">
          <router-link to="/PlayMusci">
            <div class="now-playing-cover">
              <img src="https://picsum.photos/60/60?random=100" alt="当前播放封面" />
            </div>
          </router-link>
          <div class="now-playing-info">
            <h3 class="now-playing-title">当前播放歌曲</h3>
            <p class="now-playing-artist">当前播放歌手</p>
          </div>
          <button class="icon-button">
            <i class="icon-heart"></i>
          </button>
        </div>

        <div class="player-controls">
          <div class="control-buttons">
            <button class="icon-button">
              <i class="icon-shuffle"></i>
            </button>
            <button class="icon-button">
              <i class="icon-prev"></i>
            </button>
            <button class="play-button">
              <i class="icon-play"></i>
            </button>
            <button class="icon-button">
              <i class="icon-next"></i>
            </button>
            <button class="icon-button">
              <i class="icon-repeat"></i>
            </button>
          </div>
          <div class="progress-bar">
            <span class="time-current">0:45</span>
            <div class="progress-track">
              <div class="progress-fill" style="width: 30%"></div>
            </div>
            <span class="time-total">3:45</span>
          </div>
        </div>

        <div class="player-actions">
          <button class="icon-button">
            <i class="icon-volume"></i>
          </button>
          <div class="volume-bar">
            <div class="volume-track">
              <div class="volume-fill" style="width: 70%"></div>
            </div>
          </div>
          <button class="icon-button">
            <i class="icon-list"></i>
          </button>
        </div>
      </div>
    </footer> -->
    <!-- <musicPlayer /> -->
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted } from 'vue'
import { ThemeSymbol } from '../../theme-context'
import { useRouter } from 'vue-router'
import Header from '../../components/header.vue'
import config from '../../api/config.js';
import { ElMessage } from 'element-plus'
import {
  getArtistsListApi
} from '../../api/test.js'
import musicPlayer from '../../components/musicPlayer.vue'

const router = useRouter()
const themeContext = inject(ThemeSymbol)

if (!themeContext) {
  throw new Error('Theme context not provided')
}

const { theme, toggleTheme } = themeContext



const logout = () => {
  // 清除本地存储中的 token
  localStorage.removeItem('token');

  // 跳转到登录页面
  router.push('/login');

  // 可选：输出日志或提示用户已退出
  console.log('用户已退出登录');

  // 你还可以添加一些其他操作，例如清除全局状态（如 Vuex 中的用户数据）
};

const loadPageData = async () => {
  try {
    const [
      ArtistsList
    ] = await Promise.all([
      getArtistsListApi()
    ])
    console.log(ArtistsList, 'ArtistsList');

    // console.log(handRecentStudyLogsData(studyLogs));
  } catch (error) {
    console.error(error)
    ElMessage.error('请求数据失败')
  }
}


onMounted(() => {
  try {
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;

    if (user) {
      console.log('当前登录用户:', user);
    } else {
      console.warn('未找到登录用户信息');
    }

    const apiBaseUrl = localStorage.getItem('API_BASE_URL');
    if (apiBaseUrl) {
      console.log('API 地址:', apiBaseUrl);
    } else {
      console.warn('API 地址未设置');
    }

  } catch (error) {
    console.error('读取 localStorage 时出错:', error);
  }

  // loadPageData()
});



</script>

<style scoped>
.music-app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
}

/* 头部样式 */
.header {
  background-color: var(--header-bg);
  padding: 1rem 0;
  box-shadow: 0 2px 4px var(--shadow-color);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.logo {
  font-size: 1.8rem;
  font-weight: bold;
  margin-right: 2rem;
  color: var(--text-color);
}

.logo span {
  color: var(--button-bg);
}

.search-bar {
  display: flex;
  flex-grow: 1;
  max-width: 500px;
  margin-right: 2rem;
}

.search-bar input {
  flex-grow: 1;
  padding: 0.5rem 1rem;
  border: 1px solid var(--input-border);
  border-radius: 20px 0 0 20px;
  background-color: var(--input-bg);
  color: var(--input-text);
  outline: none;
}

.search-button {
  background-color: var(--button-bg);
  color: var(--button-text-color);
  border: none;
  padding: 0 1rem;
  border-radius: 0 20px 20px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  margin-right: auto;
}

.nav-links a {
  color: var(--text-color);
  font-weight: 500;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: var(--link-color);
}

.user-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.theme-toggle {
  background-color: transparent;
  color: var(--text-color);
  border: 1px solid var(--border-color);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.theme-toggle:hover {
  background-color: var(--hover-bg);
}

.user-button {
  background-color: transparent;
  color: var(--text-color);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-button:hover {
  background-color: var(--hover-bg);
}

/* 主要内容区样式 */
.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 2rem auto;
  padding: 0 1rem;
}

.section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

/* 歌单网格 */
.playlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.playlist-card {
  background-color: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.playlist-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px var(--shadow-color);
}

.playlist-cover {
  position: relative;
  padding-top: 100%;
  overflow: hidden;
}

.playlist-cover img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-button {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  background-color: var(--button-bg);
  color: var(--button-text-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s, transform 0.2s;
}

.playlist-card:hover .play-button {
  opacity: 1;
  transform: scale(1.1);
}

.play-count {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.playlist-info {
  padding: 1rem;
}

.playlist-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.playlist-info p {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-color);
  opacity: 0.7;
}

/* 歌曲列表 */
.song-list {
  background-color: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
}

.song-item {
  display: grid;
  grid-template-columns: 50px 60px 2fr 1fr 80px 120px;
  align-items: center;
  padding: 0.8rem 1rem;
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.2s;
}

.song-item:last-child {
  border-bottom: none;
}

.song-item:hover {
  background-color: var(--hover-bg);
}

.song-number {
  color: var(--text-color);
  opacity: 0.6;
  text-align: center;
}

.song-cover {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  overflow: hidden;
}

.song-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.song-info {
  padding: 0 1rem;
}

.song-title {
  margin: 0 0 0.2rem 0;
  font-size: 1rem;
}

.song-artist {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-color);
  opacity: 0.7;
}

.song-album {
  font-size: 0.9rem;
  opacity: 0.8;
}

.song-duration {
  font-size: 0.9rem;
  opacity: 0.7;
}

.song-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

/* 歌手网格 */
.artist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem;
}

.artist-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.artist-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 1rem;
  transition: transform 0.2s;
}

.artist-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.artist-card:hover .artist-avatar {
  transform: scale(1.05);
}

.artist-name {
  margin: 0;
  font-size: 1rem;
  text-align: center;
}

/* 播放器样式 */
/* .player-bar {
  background-color: var(--card-bg);
  border-top: 1px solid var(--border-color);
  padding: 0.5rem 0;
  position: sticky;
  bottom: 0;
}

.player-content {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.now-playing {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.now-playing-cover {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
}

.now-playing-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.now-playing-info {
  flex-grow: 1;
}

.now-playing-title {
  margin: 0 0 0.2rem 0;
  font-size: 1rem;
}

.now-playing-artist {
  margin: 0;
  font-size: 0.8rem;
  opacity: 0.7;
}

.player-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.control-buttons {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.play-button {
  width: 40px;
  height: 40px;
  background-color: var(--button-bg);
  color: var(--button-text-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.progress-track {
  flex-grow: 1;
  height: 4px;
  background-color: var(--border-color);
  border-radius: 2px;
  position: relative;
  cursor: pointer;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: var(--button-bg);
  border-radius: 2px;
}

.time-current,
.time-total {
  font-size: 0.8rem;
  opacity: 0.7;
}

.player-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
}

.volume-bar {
  width: 80px;
}

.volume-track {
  height: 4px;
  background-color: var(--border-color);
  border-radius: 2px;
  position: relative;
  cursor: pointer;
}

.volume-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: var(--button-bg);
  border-radius: 2px;
} */

/* 图标按钮 */
.icon-button {
  background-color: transparent;
  color: var(--text-color);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.icon-button:hover {
  background-color: var(--hover-bg);
}

/* 图标样式 (使用伪元素模拟) */
[class^="icon-"]::before,
[class*=" icon-"]::before {
  font-family: 'Material Icons';
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  display: inline-block;
}

.icon-search::before {
  content: "🔍";
}

.icon-sun::before {
  content: "☀️";
}

.icon-moon::before {
  content: "🌙";
}

.icon-user::before {
  content: "👤";
}

.icon-play::before {
  content: "▶️";
}

.icon-headphones::before {
  content: "🎧";
}

.icon-heart::before {
  content: "❤️";
}

.icon-download::before {
  content: "⏬";
}

.icon-more::before {
  content: "⋯";
}

.icon-shuffle::before {
  content: "🔀";
}

.icon-prev::before {
  content: "⏮";
}

.icon-next::before {
  content: "⏭";
}

.icon-repeat::before {
  content: "🔁";
}

.icon-volume::before {
  content: "🔊";
}

.icon-list::before {
  content: "📋";
}


/* 新增的样式 */
.user-dropdown {
  position: relative;
  display: inline-block;
}

.user-button {
  background-color: transparent;
  color: var(--text-color);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-button:hover {
  background-color: var(--hover-bg);
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  background-color: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 4px 12px var(--shadow-color);
  min-width: 160px;
  z-index: 100;
  display: none;
  padding: 0.5rem 0;
}

.user-dropdown:hover .dropdown-menu {
  display: block;
}

.dropdown-item {
  width: 100%;
  padding: 0.8rem 1rem;
  background: none;
  border: none;
  text-align: left;
  color: var(--text-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.dropdown-item:hover {
  background-color: var(--hover-bg);
}

/* 图标样式 */
.icon-logout::before {
  content: "🚪";
}
</style>