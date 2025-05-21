<template>
  <BackComo :backname="'歌单详情'" />
  <div class="music-container">
    <main class="main-content">
      <!-- 歌单封面和描述 -->
      <section class="playlist-header">
        <div class="playlist-cover">
          <img :src="playlist.coverUrl" alt="歌单封面" class="cover-img">
          <div class="play-count">
            <i class="icon">▶️</i> {{ playlist.playCount }} 次播放
          </div>
        </div>
        <div class="playlist-info">
          <div class="playlist-tag">{{ playlist.tag }}</div>
          <h2 class="playlist-title">{{ playlist.title }}</h2>
          <p class="playlist-creator">
            <img :src="playlist.creator.avatarUrl" alt="创建者头像" class="creator-avatar">
            <span class="creator-name">{{ playlist.creator.name }}</span>
          </p>
          <p class="playlist-desc">{{ playlist.description }}</p>
          <div class="playlist-actions">
            <button class="play-btn"><i class="icon">▶️</i> 播放全部</button>
            <button class="collect-btn"><i class="icon">❤️</i> 收藏</button>
            <button class="share-btn"><i class="icon">↗️</i> 分享</button>
          </div>
        </div>
      </section>

      <!-- 歌曲列表 -->
      <section class="song-list">
        <div class="list-header">
          <h3 class="list-title">歌曲列表</h3>
          <span class="song-count">{{ playlist.song_count }}首歌曲</span>
        </div>
        <table class="songs-table">
          <thead>
            <tr>
              <th class="index-col">#</th>
              <th class="title-col">歌曲标题</th>
              <th class="artist-col">歌手</th>
              <th class="album-col">专辑</th>
              <th class="duration-col">时长</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(song, index) in songs" :key="song.id" @click="playSong(song)">
              <td class="index-col">
                <span class="song-index">{{ index + 1 }}</span>
                <button class="play-icon" @click.stop="playSong(song)">▶️</button>
              </td>
              <td class="title-col">
                <div class="song-title">{{ song.title }}</div>
                <div class="song-alias" v-if="song.alias">{{ song.alias }}</div>
              </td>
              <td class="artist-col">{{ song.artist }}</td>
              <td class="album-col">{{ song.album }}</td>
              <td class="duration-col">{{ song.duration }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- 相似歌单推荐 -->
      <section class="recommendations">
        <h3 class="section-title">相似歌单</h3>
        <div class="recommendation-list">
          <div class="recommendation-card" v-for="rec in recommendations" :key="rec.id">
            <img :src="rec.cover" :alt="rec.title" class="rec-cover">
            <div class="rec-info">
              <h4 class="rec-title">{{ rec.title }}</h4>
              <p class="rec-creator">by {{ rec.creator }}</p>
              <p class="rec-count">{{ rec.count }}首</p>
            </div>
          </div>
        </div>
      </section>
      <CommentsSection :playlist-id="playlistId" />
    </main>

    <!-- 底部播放器 -->
    <!-- <footer class="player-bar">
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
    </footer> -->

  </div>

</template>

<script setup lang="ts">
import { inject, ref, onMounted } from 'vue'
import { ThemeSymbol } from '../theme-context'
import Header from '../components/header.vue'
import { getPlaylistsDetailsApi } from '../api/test.ts'
import BackComo from '../components/backComo.vue'
import CommentsSection from '../components/commentsSection.vue'
import { ElMessage } from 'element-plus'
import { defineProps } from 'vue'

import { usePlayerStore } from '../stores/usePlayerStore.ts'
const player = usePlayerStore()
import { useApiStore } from '../stores/userApiUrl.ts'
const apiStore = useApiStore()
const apiBaseUrl = apiStore.apiBaseUrl
const props = defineProps({
  playlistId: {
    type: [Number],
    required: true
  }
})

console.log(props.playlistId);

const themeContext = inject(ThemeSymbol)

if (!themeContext) {
  throw new Error('Theme context not provided')
}

const { theme, toggleTheme } = themeContext


const playlist = ref({
  coverUrl: 'https://picsum.photos/300/300',
  playCount: 1234567,
  tag: '精品歌单',
  title: '深夜工作学习专注音乐',
  description: '这是一张适合深夜工作、学习时听的专注音乐歌单，包含轻音乐、钢琴曲和环境音乐，帮助你集中注意力，提高工作效率。',
  creator: {
    name: '音乐达人',
    avatarUrl: 'https://picsum.photos/50/50'
  },
  song_count: 20,
})

// 模拟歌曲数据
const songs = ref([
  { id: 1, title: '深夜钢琴曲', artist: '钢琴家A', album: '深夜钢琴集', duration: '3:45', alias: 'Piano Night' }

])

// 模拟推荐歌单
const recommendations = ref([
  { id: 1, title: '工作学习必备轻音乐', creator: '学习音乐', cover: 'https://picsum.photos/150/150?1', count: 25 }
])

const playSong = (song: any) => {
  // console.log('播放歌曲:', song.id)
  player.changeTrack(song.id)

  // 实际应用中这里会触发播放逻辑
}

const handlePageData = async (data: any) => {

  const baseUrl = apiBaseUrl; // 替换为你真实的后端 URL

  playlist.value = {
    coverUrl: baseUrl + data.cover_url,
    playCount: data.play_count,
    tag: data.tags || '精品歌单',
    title: data.name,
    description: data.description || '暂无简介',
    creator: {
      name: data.username || '匿名用户',
      avatarUrl: data.avatar_url || 'https://picsum.photos/50/50'
    },
    song_count: data.song_count
  };

  songs.value = (data.songs || []).map((song: any) => ({
    id: song.id,
    title: song.title_zh || song.title,
    artist: song.artist_name_zh || song.artist_name || '未知艺术家',
    album: song.album_name_zh || song.album_name || '未知专辑',
    duration: formatDuration(song.duration),
    alias: song.title || ''
  }));
};

// 工具函数：格式化秒为 mm:ss
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

const loadPageData = async () => {
  try {
    const [
      getPlaylistsDetails
    ] = await Promise.all([
      getPlaylistsDetailsApi(props.playlistId)
    ])
    console.log(getPlaylistsDetails, 'getPlaylistsDetails');
    handlePageData(getPlaylistsDetails.data)
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
.music-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-color);
}


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

/* 歌单头部样式 */
.playlist-header {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.playlist-cover {
  position: relative;
  flex-shrink: 0;
}

.cover-img {
  width: 250px;
  height: 250px;
  border-radius: 8px;
  box-shadow: 0 4px 12px var(--shadow-color);
  object-fit: cover;
}

.play-count {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.playlist-info {
  flex: 1;
}

.playlist-tag {
  display: inline-block;
  background-color: var(--button-bg);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}

.playlist-title {
  font-size: 2rem;
  margin: 0.5rem 0;
}

.playlist-creator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.creator-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.creator-name {
  color: var(--link-color);
  font-size: 0.9rem;
}

.playlist-desc {
  color: var(--text-color);
  opacity: 0.8;
  line-height: 1.5;
  margin: 1rem 0;
}

.playlist-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.play-btn,
.collect-btn,
.share-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  font-weight: 500;
  transition: all 0.2s;
}

.play-btn {
  background-color: var(--button-bg);
  color: var(--button-text-color);
}

.play-btn:hover {
  background-color: #3e8e41;
  transform: scale(1.05);
}

.collect-btn,
.share-btn {
  background-color: var(--card-bg);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.collect-btn:hover,
.share-btn:hover {
  background-color: var(--hover-bg);
}

/* 歌曲列表样式 */
.song-list {
  margin-top: 3rem;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.list-title {
  font-size: 1.5rem;
  margin: 0;
}

.song-count {
  color: var(--text-color);
  opacity: 0.7;
  font-size: 0.9rem;
}

.songs-table {
  width: 100%;
  border-collapse: collapse;
}

.songs-table th {
  text-align: left;
  padding: 0.75rem 1rem;
  font-weight: 500;
  color: var(--text-color);
  opacity: 0.7;
  border-bottom: 1px solid var(--border-color);
}

.songs-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
}

.songs-table tr:hover {
  background-color: var(--hover-bg);
  cursor: pointer;
  color: var(--link-color);
}

.index-col {
  width: 50px;
  text-align: center;
}

.song-index {
  display: inline-block;
  width: 20px;
  text-align: center;
}

.play-icon {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--button-bg);
}

.songs-table tr:hover .song-index {
  /* display: none; */

}

.songs-table tr:hover .play-icon {
  /* display: inline-block; */
}

.title-col {
  width: 40%;
}

.song-title {
  font-weight: 500;
}

.song-alias {
  font-size: 0.8rem;
  color: var(--text-color);
  opacity: 0.7;
  margin-top: 0.25rem;
}

.artist-col,
.album-col {
  width: 25%;
}

.duration-col {
  width: 10%;
}

/* 推荐歌单样式 */
.recommendations {
  margin-top: 3rem;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.recommendation-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.recommendation-card {
  background-color: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
}

.recommendation-card:hover {
  transform: translateY(-5px);
}

.rec-cover {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.rec-info {
  padding: 1rem;
}

.rec-title {
  font-size: 1rem;
  margin: 0 0 0.5rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rec-creator,
.rec-count {
  font-size: 0.8rem;
  color: var(--text-color);
  opacity: 0.7;
  margin: 0.25rem 0;
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
  .playlist-header {
    flex-direction: column;
  }

  .cover-img {
    width: 100%;
    height: auto;
    aspect-ratio: 1/1;
  }

  .recommendation-list {
    grid-template-columns: repeat(2, 1fr);
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