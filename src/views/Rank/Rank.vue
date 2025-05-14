<template>
  <Header />
  <div class="ranking-page">

    <!-- 顶部标题 -->
    <div class="page-header">
      <h1>排行榜</h1>
      <p>发现最受欢迎的音乐</p>
    </div>

    <!-- 榜单分类 -->
    <div class="ranking-categories">
      <button v-for="category in categories" :key="category.id" :class="{ active: activeCategory === category.id }"
        @click="activeCategory = category.id">
        {{ category.name }}
      </button>
    </div>

    <!-- 主要榜单区域 -->
    <div class="ranking-container">
      <!-- 热门榜单 -->
      <section class="top-ranking-section" v-if="activeCategory === 'hot'">
        <div class="top-ranking-card">
          <div class="ranking-header">
            <h2>热门歌曲榜</h2>
            <span class="update-time">更新于: {{ lastUpdate }}</span>
          </div>
          <div class="song-list">
            <div class="song-item" v-for="(song, index) in hotSongs" :key="song.id" @click="playSong(song)">
              <div class="song-rank" :class="getRankClass(index + 1)">
                {{ index + 1 }}
              </div>
              <div class="song-cover">
                <img :src="song.cover" :alt="song.name">
              </div>
              <div class="song-info">
                <h3>{{ song.name }}</h3>
                <p>{{ song.artist }}</p>
              </div>
              <div class="song-duration">{{ song.duration }}</div>
              <div class="song-actions">
                <button class="icon-button" @click.stop="toggleLike(song)">
                  <i :class="song.liked ? 'icon-heart-filled' : 'icon-heart'"></i>
                </button>
                <button class="icon-button" @click.stop="addToPlaylist(song)">
                  <i class="icon-add"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 新歌榜 -->
      <section class="new-ranking-section" v-if="activeCategory === 'new'">
        <div class="ranking-grid">
          <div class="ranking-card" v-for="ranking in newRankings" :key="ranking.id">
            <div class="card-header">
              <h3>{{ ranking.name }}</h3>
              <router-link :to="ranking.link" class="view-more">更多</router-link>
            </div>
            <div class="song-list">
              <div class="song-item" v-for="(song, index) in ranking.songs" :key="song.id" @click="playSong(song)">
                <div class="song-rank">{{ index + 1 }}</div>
                <div class="song-info">
                  <h4>{{ song.name }}</h4>
                  <p>{{ song.artist }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 特色榜 -->
      <section class="feature-ranking-section" v-if="activeCategory === 'feature'">
        <div class="ranking-grid">
          <div class="feature-ranking-card" v-for="ranking in featureRankings" :key="ranking.id"
            @click="viewRanking(ranking)">
            <div class="ranking-cover">
              <img :src="ranking.cover" :alt="ranking.name">
              <div class="play-count">
                <i class="icon-headphones"></i> {{ ranking.playCount }}
              </div>
            </div>
            <div class="ranking-info">
              <h3>{{ ranking.name }}</h3>
              <p>{{ ranking.updateFrequency }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from '../../components/header.vue'

// 当前分类
const activeCategory = ref('hot')

// 分类列表
const categories = [
  { id: 'hot', name: '热门' },
  { id: 'new', name: '新歌' },
  { id: 'feature', name: '特色榜' }
]

// 更新时间
const lastUpdate = '今天 08:00'

// 热门歌曲
const hotSongs = ref([
  { id: 1, name: '热门歌曲1', artist: '歌手A', cover: 'https://picsum.photos/80/80?random=1', duration: '3:45', liked: true },
  { id: 2, name: '热门歌曲2', artist: '歌手B', cover: 'https://picsum.photos/80/80?random=2', duration: '4:12', liked: false },
  { id: 3, name: '热门歌曲3', artist: '歌手C', cover: 'https://picsum.photos/80/80?random=3', duration: '3:28', liked: false },
  { id: 4, name: '热门歌曲4', artist: '歌手D', cover: 'https://picsum.photos/80/80?random=4', duration: '2:56', liked: true },
  { id: 5, name: '热门歌曲5', artist: '歌手E', cover: 'https://picsum.photos/80/80?random=5', duration: '3:15', liked: false },
  { id: 6, name: '热门歌曲6', artist: '歌手F', cover: 'https://picsum.photos/80/80?random=6', duration: '3:42', liked: false },
  { id: 7, name: '热门歌曲7', artist: '歌手G', cover: 'https://picsum.photos/80/80?random=7', duration: '4:05', liked: false },
  { id: 8, name: '热门歌曲8', artist: '歌手H', cover: 'https://picsum.photos/80/80?random=8', duration: '3:20', liked: true },
  { id: 9, name: '热门歌曲9', artist: '歌手I', cover: 'https://picsum.photos/80/80?random=9', duration: '2:48', liked: false },
  { id: 10, name: '热门歌曲10', artist: '歌手J', cover: 'https://picsum.photos/80/80?random=10', duration: '3:55', liked: false }
])

// 新歌榜/飙升榜/原创榜
const newRankings = [
  {
    id: 1,
    name: '新歌榜',
    link: '/ranking/new',
    songs: [
      { id: 11, name: '新歌1', artist: '歌手K' },
      { id: 12, name: '新歌2', artist: '歌手L' },
      { id: 13, name: '新歌3', artist: '歌手M' },
      { id: 14, name: '新歌4', artist: '歌手N' },
      { id: 15, name: '新歌5', artist: '歌手O' }
    ]
  },
  {
    id: 2,
    name: '飙升榜',
    link: '/ranking/rising',
    songs: [
      { id: 16, name: '飙升歌曲1', artist: '歌手P' },
      { id: 17, name: '飙升歌曲2', artist: '歌手Q' },
      { id: 18, name: '飙升歌曲3', artist: '歌手R' },
      { id: 19, name: '飙升歌曲4', artist: '歌手S' },
      { id: 20, name: '飙升歌曲5', artist: '歌手T' }
    ]
  },
  {
    id: 3,
    name: '原创榜',
    link: '/ranking/original',
    songs: [
      { id: 21, name: '原创歌曲1', artist: '歌手U' },
      { id: 22, name: '原创歌曲2', artist: '歌手V' },
      { id: 23, name: '原创歌曲3', artist: '歌手W' },
      { id: 24, name: '原创歌曲4', artist: '歌手X' },
      { id: 25, name: '原创歌曲5', artist: '歌手Y' }
    ]
  }
]

// 特色榜
const featureRankings = [
  { id: 1, name: '电音榜', cover: 'https://picsum.photos/200/200?random=21', playCount: '1.2亿', updateFrequency: '每周五更新' },
  { id: 2, name: '说唱榜', cover: 'https://picsum.photos/200/200?random=22', playCount: '9800万', updateFrequency: '每周一更新' },
  { id: 3, name: '民谣榜', cover: 'https://picsum.photos/200/200?random=23', playCount: '5600万', updateFrequency: '每周三更新' },
  { id: 4, name: '影视原声榜', cover: 'https://picsum.photos/200/200?random=24', playCount: '7500万', updateFrequency: '每周二更新' },
  { id: 5, name: 'KTV热歌榜', cover: 'https://picsum.photos/200/200?random=25', playCount: '1.5亿', updateFrequency: '每周四更新' },
  { id: 6, name: '网络热歌榜', cover: 'https://picsum.photos/200/200?random=26', playCount: '2.3亿', updateFrequency: '每日更新' }
]

// 获取排名的类名
const getRankClass = (rank) => {
  return rank <= 3 ? `rank-${rank}` : ''
}

// 播放歌曲
const playSong = (song) => {
  console.log('播放歌曲:', song.name)
  // 实际播放逻辑调用播放器 API
}

// 切换喜欢状态
const toggleLike = (song) => {
  song.liked = !song.liked
  console.log(song.liked ? '已喜欢' : '已取消喜欢', song.name)
}

// 添加到播放列表
const addToPlaylist = (song) => {
  console.log('添加到播放列表:', song.name)
}

// 查看榜单详情
const viewRanking = (ranking) => {
  console.log('查看榜单:', ranking.name)
  // 实际跳转逻辑，比如 router.push(ranking.link)
}
</script>


<style scoped>
.ranking-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 页面标题样式 */
.page-header {
  margin-bottom: 30px;
  text-align: center;
}

.page-header h1 {
  font-size: 2rem;
  margin: 0 0 10px 0;
  color: var(--text-color);
}

.page-header p {
  margin: 0;
  color: var(--text-color);
  opacity: 0.7;
  font-size: 1rem;
}

/* 分类标签样式 */
.ranking-categories {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.ranking-categories button {
  padding: 8px 20px;
  background-color: transparent;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.ranking-categories button:hover {
  background-color: var(--hover-bg);
}

.ranking-categories button.active {
  background-color: var(--button-bg);
  color: var(--button-text-color);
  border-color: var(--button-bg);
}

/* 榜单容器样式 */
.ranking-container {
  background-color: var(--card-bg);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px var(--shadow-color);
}

/* 热门榜单样式 */
.top-ranking-card {
  margin-bottom: 30px;
}

.ranking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
}

.ranking-header h2 {
  margin: 0;
  font-size: 1.3rem;
}

.update-time {
  font-size: 0.8rem;
  opacity: 0.7;
}

.song-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.song-item {
  display: grid;
  grid-template-columns: 50px 60px 1fr 80px 100px;
  align-items: center;
  padding: 12px 15px;
  border-radius: 6px;
  transition: background-color 0.2s;
  cursor: pointer;
}

.song-item:hover {
  background-color: var(--hover-bg);
}

.song-rank {
  text-align: center;
  font-weight: bold;
  font-size: 1.1rem;
}

.rank-1 {
  color: #ff4d4f;
}

.rank-2 {
  color: #fa8c16;
}

.rank-3 {
  color: #faad14;
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
  padding: 0 15px;
}

.song-info h3 {
  margin: 0 0 5px 0;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-info p {
  margin: 0;
  font-size: 0.8rem;
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-duration {
  font-size: 0.9rem;
  opacity: 0.7;
  text-align: center;
}

.song-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.icon-button {
  background: none;
  border: none;
  color: var(--text-color);
  opacity: 0.7;
  cursor: pointer;
  transition: opacity 0.2s;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.icon-button:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.05);
}

/* 新歌榜样式 */
.ranking-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.ranking-card {
  background-color: var(--bg-color);
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.card-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.view-more {
  font-size: 0.8rem;
  color: var(--link-color);
}

.ranking-card .song-item {
  grid-template-columns: 30px 1fr;
  padding: 8px 0;
}

.ranking-card .song-rank {
  font-size: 0.9rem;
  opacity: 0.7;
}

.ranking-card .song-info h4 {
  font-size: 0.9rem;
  margin: 0 0 2px 0;
}

.ranking-card .song-info p {
  font-size: 0.8rem;
}

/* 特色榜样式 */
.feature-ranking-card {
  background-color: var(--bg-color);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-ranking-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px var(--shadow-color);
}

.ranking-cover {
  position: relative;
  padding-top: 100%;
  overflow: hidden;
}

.ranking-cover img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-count {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 5px;
}

.ranking-info {
  padding: 15px;
}

.ranking-info h3 {
  margin: 0 0 5px 0;
  font-size: 1rem;
}

.ranking-info p {
  margin: 0;
  font-size: 0.8rem;
  opacity: 0.7;
}

/* 图标样式 */
[class^="icon-"] {
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  display: inline-block;
}

.icon-headphones::before {
  content: "🎧";
}

.icon-heart::before {
  content: "♡";
}

.icon-heart-filled::before {
  content: "❤";
  color: var(--error-color);
}

.icon-add::before {
  content: "+";
  font-weight: bold;
}
</style>