<template>
  <Header />
  <div class="discover-page">
    <!-- 导航栏 -->
    <!-- 轮播图区域 -->
    <section class="banner-section">
      <div class="banner-container">
        <div class="banner-card" v-for="(banner, index) in banners" :key="index">
          <img :src="banner.image" :alt="banner.title" class="banner-image">
          <div class="banner-info">
            <h3>{{ banner.title }}</h3>
            <p>{{ banner.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 推荐歌单 -->
    <section class="section">
      <div class="section-header">
        <h2>推荐歌单</h2>
        <router-link to="/playlists" class="view-all">查看全部</router-link>
      </div>
      <div class="playlist-grid">
        <div class="playlist-card" v-for="playlist in recommendedPlaylists" :key="playlist.id">
          <div class="playlist-cover">
            <img :src="playlist.cover" :alt="playlist.name">
            <div class="play-count">
              <i class="icon-headphones"></i> {{ playlist.playCount }}
            </div>
            <button class="play-button">
              <i class="icon-play"></i>
            </button>
          </div>
          <div class="playlist-info">
            <h3>{{ playlist.name }}</h3>
            <p>{{ playlist.creator }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 热门歌曲 -->
    <section class="section">
      <div class="section-header">
        <h2>热门歌曲</h2>
        <router-link to="/hot-songs" class="view-all">查看全部</router-link>
      </div>
      <div class="song-list">
        <div class="song-item" v-for="(song, index) in hotSongs" :key="song.id">
          <div class="song-number">{{ index + 1 }}</div>
          <div class="song-info">
            <h3>{{ song.name }}</h3>
            <p>{{ song.artist }}</p>
          </div>
          <div class="song-album">{{ song.album }}</div>
          <div class="song-duration">{{ song.duration }}</div>
          <div class="song-actions">
            <button class="icon-button">
              <i class="icon-heart"></i>
            </button>
            <button class="icon-button">
              <i class="icon-download"></i>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 新歌首发 -->
    <section class="section">
      <div class="section-header">
        <h2>新歌首发</h2>
        <router-link to="/new-songs" class="view-all">查看全部</router-link>
      </div>
      <div class="new-songs-grid">
        <div class="new-song-card" v-for="song in newSongs" :key="song.id">
          <div class="song-cover">
            <img :src="song.cover" :alt="song.name">
            <button class="play-button">
              <i class="icon-play"></i>
            </button>
          </div>
          <div class="song-details">
            <h3>{{ song.name }}</h3>
            <p>{{ song.artist }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 推荐歌手 -->
    <section class="section">
      <div class="section-header">
        <h2>推荐歌手</h2>
        <router-link to="/artists" class="view-all">查看全部</router-link>
      </div>
      <div class="artists-grid">
        <div class="artist-card" v-for="artist in recommendedArtists" :key="artist.id">
          <div class="artist-avatar">
            <img :src="artist.avatar" :alt="artist.name">
          </div>
          <h3>{{ artist.name }}</h3>
          <p>{{ artist.genre }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from '../../components/header.vue'

// 轮播图数据
const banners = ref([
  {
    image: 'https://picsum.photos/1200/400?random=1',
    title: '夏日清凉特辑',
    description: '为你带来清爽一夏的音乐'
  },
  {
    image: 'https://picsum.photos/1200/400?random=2',
    title: '2023年度热歌',
    description: '今年最受欢迎的歌曲合集'
  },
  {
    image: 'https://picsum.photos/1200/400?random=3',
    title: '经典老歌回顾',
    description: '重温那些年的经典旋律'
  }
])

// 推荐歌单
const recommendedPlaylists = ref([
  { id: 1, name: '每日推荐', creator: 'MusicHub', cover: 'https://picsum.photos/300/300?random=11', playCount: '1.2万' },
  { id: 2, name: '工作学习必备', creator: 'MusicHub', cover: 'https://picsum.photos/300/300?random=12', playCount: '8.5千' },
  { id: 3, name: '深夜emo合集', creator: 'MusicHub', cover: 'https://picsum.photos/300/300?random=13', playCount: '5.3万' },
  { id: 4, name: '运动健身能量', creator: 'MusicHub', cover: 'https://picsum.photos/300/300?random=14', playCount: '3.7万' },
  { id: 5, name: '欧美流行热榜', creator: 'MusicHub', cover: 'https://picsum.photos/300/300?random=15', playCount: '2.9万' },
  { id: 6, name: '华语金曲精选', creator: 'MusicHub', cover: 'https://picsum.photos/300/300?random=16', playCount: '4.1万' }
])

// 热门歌曲
const hotSongs = ref([
  { id: 1, name: '歌曲名称1', artist: '歌手A', album: '专辑X', duration: '3:45' },
  { id: 2, name: '歌曲名称2', artist: '歌手B', album: '专辑Y', duration: '4:12' },
  { id: 3, name: '歌曲名称3', artist: '歌手C', album: '专辑Z', duration: '3:28' },
  { id: 4, name: '歌曲名称4', artist: '歌手D', album: '专辑W', duration: '2:56' },
  { id: 5, name: '歌曲名称5', artist: '歌手E', album: '专辑V', duration: '3:15' }
])

// 新歌推荐
const newSongs = ref([
  { id: 1, name: '新歌1', artist: '歌手A', cover: 'https://picsum.photos/200/200?random=21' },
  { id: 2, name: '新歌2', artist: '歌手B', cover: 'https://picsum.photos/200/200?random=22' },
  { id: 3, name: '新歌3', artist: '歌手C', cover: 'https://picsum.photos/200/200?random=23' },
  { id: 4, name: '新歌4', artist: '歌手D', cover: 'https://picsum.photos/200/200?random=24' },
  { id: 5, name: '新歌5', artist: '歌手E', cover: 'https://picsum.photos/200/200?random=25' },
  { id: 6, name: '新歌6', artist: '歌手F', cover: 'https://picsum.photos/200/200?random=26' }
])

// 推荐歌手
const recommendedArtists = ref([
  { id: 1, name: '歌手A', genre: '流行', avatar: 'https://picsum.photos/150/150?random=31' },
  { id: 2, name: '歌手B', genre: '摇滚', avatar: 'https://picsum.photos/150/150?random=32' },
  { id: 3, name: '歌手C', genre: '电子', avatar: 'https://picsum.photos/150/150?random=33' },
  { id: 4, name: '歌手D', genre: 'R&B', avatar: 'https://picsum.photos/150/150?random=34' },
  { id: 5, name: '歌手E', genre: '民谣', avatar: 'https://picsum.photos/150/150?random=35' },
  { id: 6, name: '歌手F', genre: '嘻哈', avatar: 'https://picsum.photos/150/150?random=36' }
])
</script>


<style scoped>
.discover-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 轮播图样式 */
.banner-section {
  margin-bottom: 30px;
}

.banner-container {
  display: flex;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 12px var(--shadow-color);
}

.banner-card {
  position: relative;
  min-width: 100%;
}

.banner-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.banner-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
}

.banner-info h3 {
  margin: 0 0 5px 0;
  font-size: 1.5rem;
}

.banner-info p {
  margin: 0;
  opacity: 0.9;
}

/* 分区标题样式 */
.section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
}

.section-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.view-all {
  color: var(--link-color);
  font-size: 0.9rem;
}

/* 推荐歌单样式 */
.playlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.playlist-card {
  background-color: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
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
}

.play-button {
  position: absolute;
  bottom: 15px;
  right: 15px;
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
  transition: opacity 0.3s, transform 0.3s;
  cursor: pointer;
}

.playlist-card:hover .play-button {
  opacity: 1;
  transform: scale(1.1);
}

.playlist-info {
  padding: 12px;
}

.playlist-info h3 {
  margin: 0 0 5px 0;
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

/* 热门歌曲列表样式 */
.song-list {
  background-color: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
}

.song-item {
  display: grid;
  grid-template-columns: 50px 1fr 1fr 80px 100px;
  align-items: center;
  padding: 12px 15px;
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
  text-align: center;
  color: var(--text-color);
  opacity: 0.7;
  font-weight: bold;
}

.song-info {
  padding: 0 10px;
}

.song-info h3 {
  margin: 0 0 5px 0;
  font-size: 1rem;
}

.song-info p {
  margin: 0;
  font-size: 0.8rem;
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

/* 新歌首发样式 */
.new-songs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
}

.new-song-card {
  background-color: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.new-song-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px var(--shadow-color);
}

.song-cover {
  position: relative;
  padding-top: 100%;
  overflow: hidden;
}

.song-cover img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.song-cover .play-button {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  opacity: 0;
}

.new-song-card:hover .play-button {
  opacity: 1;
}

.song-details {
  padding: 12px;
}

.song-details h3 {
  margin: 0 0 5px 0;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-details p {
  margin: 0;
  font-size: 0.8rem;
  opacity: 0.7;
}

/* 推荐歌手样式 */
.artists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
}

.artist-card {
  text-align: center;
  transition: transform 0.3s;
}

.artist-card:hover {
  transform: translateY(-5px);
}

.artist-avatar {
  width: 120px;
  height: 120px;
  margin: 0 auto 15px;
  border-radius: 50%;
  overflow: hidden;
}

.artist-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.artist-card h3 {
  margin: 0 0 5px 0;
  font-size: 1rem;
}

.artist-card p {
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

.icon-play::before {
  content: "▶";
}

.icon-heart::before {
  content: "❤";
}

.icon-download::before {
  content: "⏬";
}
</style>