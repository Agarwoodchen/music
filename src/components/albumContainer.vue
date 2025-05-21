<template>
  <div v-if="loading" class="loading-box">
    <p>正在加载...</p>
  </div>
  <div v-else class="album-container" :class="theme">
    <!-- 添加顶部导航栏 -->
    <!-- <header class="page-header">
      <button class="back-button" @click="goBack">
        <i class="icon">⬅️</i> 返回
      </button>
      <h1 class="page-title">歌手详情</h1>
    </header> -->
    <!-- 专辑头部信息 -->
    <div class="album-header">
      <div class="header-background"
        :style="{ backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3), var(--card-bg)), url()' }">
        <div class="header-content">
          <div class="album-cover">
            <img :src="apiBaseUrl + albumInfo.cover || 'https://picsum.photos/150/150?artist1'" alt="专辑封面">
          </div>
          <div class="album-info">
            <h1 class="album-title">{{ albumInfo.name }}</h1>
            <p class="album-artist">{{ albumInfo.artist }}</p>
            <div class="album-meta">
              <span class="meta-item">{{ albumInfo.releaseYear }}</span>
              <span class="meta-item">{{ songs.length }}首歌曲</span>
              <span class="meta-item">42分钟</span>
            </div>
            <p class="album-desc">这是Taylor Swift的第十张录音室专辑，探索了她在午夜时分思考的各种主题...</p>
            <div class="album-actions">
              <button class="play-all-btn">
                <i class="icon-play"></i> 播放全部
              </button>
              <button class="favorite-btn">
                <i class="icon-heart"></i> 收藏
              </button>
              <button class="share-btn">
                <i class="icon-share"></i> 分享
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区 -->
    <main class="album-main">
      <!-- 歌曲列表 -->
      <div class="song-list-section">
        <h2 class="section-title">歌曲列表</h2>
        <div class="song-list">
          <div class="list-header">
            <span class="header-number">#</span>
            <span class="header-title">歌曲标题</span>
            <span class="header-duration">时长</span>
          </div>
          <div class="list-item" v-for="(song, index) in songs" :key="song.id" @click="playSong(song)">
            <div class="item-number">{{ index + 1 }}</div>
            <div class="item-info">
              <div class="item-title">{{ song.title }}</div>
              <div class="item-artist">{{ song.artist }}</div>
            </div>
            <div class="item-duration">{{ song.duration }}</div>
            <div class="item-actions">
              <button class="action-btn" @click="openAddToPlaylistModal(song)">
                <i class="icon-favorite"></i>
              </button>
              <button class="action-btn" @click.stop="addToPlaylist(song)">
                <i class="icon-add"></i>
              </button>
              <button class="action-btn" @click.stop="downloadSong(song)">
                <i class="icon-download"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 专辑介绍 -->
      <div class="album-desc-section">
        <h2 class="section-title">专辑介绍</h2>
        <div class="description-content">
          <p>《Midnights》是Taylor Swift于2022年10月21日通过Republic
            Records发行的第十张录音室专辑。这张专辑标志着Swift回归流行音乐，与她2020年的另类民谣专辑《Folklore》和《Evermore》形成鲜明对比。</p>
          <p>专辑概念围绕"午夜时分"的13个不眠之夜展开，探讨了Swift生活中的焦虑、不安、幻想和心碎时刻。音乐上，《Midnights》融合了电子、流行和R&B元素，制作主要由Swift的长期合作者Jack
            Antonoff完成。</p>
          <p>专辑发行后获得广泛好评，乐评人称赞其制作、歌词和Swift的演唱。商业上，《Midnights》打破多项纪录，成为2022年最畅销的专辑之一。</p>
        </div>
      </div>

      <!-- 相关推荐 -->
      <div class="related-section">
        <h2 class="section-title">你可能也喜欢</h2>
        <div class="related-albums">
          <div class="album-card" v-for="album in relatedAlbums" :key="album.id">
            <div class="album-cover">
              <img :src="'https://source.unsplash.com/random/300x300/?album&' + album.id" :alt="album.name">
              <button class="play-btn" @click="playAlbum(album)">
                <i class="icon-play"></i>
              </button>
            </div>
            <div class="album-info">
              <h3 class="album-name">{{ album.name }}</h3>
              <p class="album-artist">{{ album.artist }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
  <!-- 添加到歌单弹窗组件 -->
  <AddSongToPlaylistPopups :visible="showAddToPlaylistModal" :song="selectedSong" @close="closeAddToPlaylistModal"
    @add-to-playlist="handleAddToPlaylist" @create-new-playlist="handleCreateNewPlaylist" />
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import { ThemeSymbol } from '../theme-context'
import { getAllAlbumAndSongApi, addSongToPlaylistApi } from '../api/test.ts'
const themeContext = inject(ThemeSymbol)
import { useRouter } from 'vue-router'
import { usePlayerStore } from '../stores/usePlayerStore.ts'
import AddSongToPlaylistPopups from '../components/addSongToPlaylistPopups.vue'
import { useApiStore } from '../stores/userApiUrl.ts'
const userJson = localStorage.getItem('user');
const user = userJson ? JSON.parse(userJson) : null;
const apiStore = useApiStore()
const apiBaseUrl = apiStore.apiBaseUrl
const albumCover = ref('')
const player = usePlayerStore()
const router = useRouter()
const goBack = () => {
  router.go(-1) // 返回上一页
}
if (!themeContext) {
  throw new Error('Theme context not provided')
}

const { theme, toggleTheme } = themeContext

// 模拟数据
const songs = ref([
  { id: 1, title: 'Lavender Haze', artist: 'Taylor Swift', duration: '3:22' },
  { id: 2, title: 'Maroon', artist: 'Taylor Swift', duration: '3:38' },
  { id: 3, title: 'Anti-Hero', artist: 'Taylor Swift', duration: '3:20' },
  { id: 4, title: 'Snow On The Beach (feat. Lana Del Rey)', artist: 'Taylor Swift', duration: '4:16' },
  { id: 5, title: 'You\'re On Your Own, Kid', artist: 'Taylor Swift', duration: '3:14' },
  { id: 6, title: 'Midnight Rain', artist: 'Taylor Swift', duration: '2:54' },
  { id: 7, title: 'Question...?', artist: 'Taylor Swift', duration: '3:30' },
  { id: 8, title: 'Vigilante Shit', artist: 'Taylor Swift', duration: '2:44' },
  { id: 9, title: 'Bejeweled', artist: 'Taylor Swift', duration: '3:14' },
  { id: 10, title: 'Labyrinth', artist: 'Taylor Swift', duration: '4:07' },
  { id: 11, title: 'Karma', artist: 'Taylor Swift', duration: '3:24' },
  { id: 12, title: 'Sweet Nothing', artist: 'Taylor Swift', duration: '3:08' },
  { id: 13, title: 'Mastermind', artist: 'Taylor Swift', duration: '3:11' }
])

const relatedAlbums = [
  { id: 101, name: 'Folklore', artist: 'Taylor Swift' },
  { id: 102, name: 'Evermore', artist: 'Taylor Swift' },
  { id: 103, name: '1989', artist: 'Taylor Swift' },
  { id: 104, name: 'Melodrama', artist: 'Lorde' },
  { id: 104, name: 'Melodrama', artist: 'Lorde' }
]

const playSong = (song: any) => {
  console.log('播放歌曲:1111', song)
  player.changeTrack(song.id)

}

const addToPlaylist = (song: any) => {
  console.log('添加到播放列表:', song.title)
  // 实际应用中这里会调用播放列表API
}

const downloadSong = (song: any) => {
  console.log('下载歌曲:', song.title)
  // 实际应用中这里会调用下载API
}

const playAlbum = (album: any) => {
  console.log('播放专辑:', album.name)
  // 实际应用中这里会调用播放器API
}

const favoriteSong = (song: any) => {
  console.log('收藏歌曲:', song.title);

}


// 控制弹窗显示的状态
const showAddToPlaylistModal = ref(false)
// 当前选中的歌曲
const selectedSong = ref<any>(null)

// 打开弹窗
const openAddToPlaylistModal = (song: any) => {
  selectedSong.value = song
  showAddToPlaylistModal.value = true
}

// 关闭弹窗
const closeAddToPlaylistModal = () => {
  showAddToPlaylistModal.value = false
  selectedSong.value = null
}

// 处理添加到歌单事件
const handleAddToPlaylist = async (data: { song: any; playlist: any }) => {
  console.log(`将歌曲 ${data.song.id} 添加到歌单 ${data.playlist.id}`)
  // 这里可以调用API将歌曲添加到歌单
  // 例如: api.addSongToPlaylist(data.song.id, data.playlist.id)
  try {
    let res = await addSongToPlaylistApi(data.playlist.id, data.song.id, user.id)
    console.log(res);

    if (res.success) {
      ElMessage.success(`已添加 "${data.song.title}" 到 "${data.playlist.name}"`)
    } else {
      ElMessage.error(`添加失败 "${data.song.title}" 到 "${data.playlist.name}" ${res.message}`)
    }
  } catch (error) {
    console.log(error);

  }
  // 可以添加一些用户反馈

  // alert(`已添加 "${data.song.title}" 到 "${data.playlist.name}"`)
}

// 处理创建新歌单事件
const handleCreateNewPlaylist = (song: any) => {
  console.log(`为歌曲 ${song.title} 创建新歌单`)
  // 这里可以跳转到创建歌单页面，或者打开另一个弹窗
  // 例如: router.push('/playlist/new?songId=' + song.id)

  alert(`将为您创建新歌单并添加 "${song.title}"`)
}

import { ElMessage } from 'element-plus'
import { defineProps } from 'vue'

const props = defineProps({
  albumtId: {
    type: [String, Number],
    required: true
  }
})

const handleAllAlbumAndSongData = (data) => {
  if (!data || typeof data !== 'object' || !data.album || !Array.isArray(data.songs)) {
    console.warn('数据结构错误', data);
    return { albumInfo: null, songs: [] };
  }

  const albumRaw = data.album;

  const albumInfo = {
    id: albumRaw.album_id,
    name: albumRaw.album_name_zh || albumRaw.album_name || '未知专辑',
    artist: albumRaw.artist_name_zh || '未知歌手',
    releaseYear: albumRaw.release_year || '未知',
    cover: albumRaw.cover_path || 'https://via.placeholder.com/300x300.png?text=No+Cover'
  };

  const formatDuration = (seconds) => {
    if (!Number.isFinite(seconds)) return '未知';
    const mins = Math.floor(seconds / 60);
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const songs = data.songs.map((song) => ({
    id: song.song_id,
    title: song.title_zh || song.title || '未知歌曲',
    artist: albumInfo.artist,
    duration: formatDuration(song.duration)
  }));

  return { albumInfo, songs };
};
const albumInfo = ref()


const loading = ref(true)
const loadPageData = async () => {
  try {
    const [
      getAllAlbumAndSong
    ] = await Promise.all([
      getAllAlbumAndSongApi(props.albumtId)
    ])
    console.log(handleAllAlbumAndSongData(getAllAlbumAndSong));
    // console.log(apiStore.apiBaseUrl);

    songs.value = handleAllAlbumAndSongData(getAllAlbumAndSong).songs;
    albumInfo.value = handleAllAlbumAndSongData(getAllAlbumAndSong).albumInfo;


  } catch (error) {
    console.error(error)
    ElMessage.error('请求数据失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // console.log(props.albumtId);

  loadPageData()
})

</script>

<style scoped>
.album-container {
  background-color: var(--bg-color);
  color: var(--text-color);
  min-height: 100vh;
  transition: all 0.3s ease;
}

.album-header {
  position: relative;
  margin-bottom: 30px;
}

.header-background {
  height: 350px;
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

.album-cover {
  width: 250px;
  height: 250px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
}

.album-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.album-info {
  flex: 1;
  color: white;
}

.album-title {
  font-size: 2.5rem;
  margin: 0 0 10px;
}

.album-artist {
  font-size: 1.2rem;
  margin: 0 0 15px;
  opacity: 0.9;
}

.album-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.meta-item {
  font-size: 0.95rem;
  opacity: 0.9;
}

.album-desc {
  max-width: 600px;
  margin: 0 0 25px;
  font-size: 0.95rem;
  line-height: 1.6;
  opacity: 0.9;
}

.album-actions {
  display: flex;
  gap: 15px;
}

.play-all-btn,
.favorite-btn,
.share-btn {
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.play-all-btn {
  background-color: var(--button-bg);
  color: var(--button-text-color);
  border: none;
}

.favorite-btn,
.share-btn {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.play-all-btn:hover {
  filter: brightness(0.9);
}

.favorite-btn:hover,
.share-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.album-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 40px;
}

.section-title {
  font-size: 1.5rem;
  margin: 0 0 20px;
  color: var(--text-color);
}

.song-list-section {
  margin-bottom: 40px;
}

.song-list {
  background-color: var(--card-bg);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px var(--shadow-color);
}

.list-header {
  display: grid;
  grid-template-columns: 50px 1fr 80px;
  padding: 15px 20px;
  font-weight: 500;
  color: var(--text-color);
  opacity: 0.7;
  border-bottom: 1px solid var(--border-color);
}

.list-item {
  display: grid;
  grid-template-columns: 50px 1fr 80px;
  padding: 15px 20px;
  align-items: center;
  transition: background-color 0.2s ease;
  position: relative;
  cursor: pointer;
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

.album-desc-section {
  margin-bottom: 40px;
}

.description-content {
  background-color: var(--card-bg);
  border-radius: 10px;
  padding: 20px;
  line-height: 1.7;
  box-shadow: 0 2px 10px var(--shadow-color);
}

.description-content p {
  margin: 0 0 15px;
}

.description-content p:last-child {
  margin-bottom: 0;
}

.related-section {
  margin-bottom: 40px;
}

.related-albums {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 25px;
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

.album-card .album-cover {
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  position: relative;
}

.album-card .album-cover img {
  position: absolute;
  top: 0;
  left: 0;
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

.album-card .album-info {
  padding: 15px;
  color: var(--text-color);
}

.album-card .album-name {
  margin: 0 0 5px;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.album-card .album-artist {
  margin: 0;
  font-size: 0.85rem;
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

.icon-play::before {
  content: "▶";
  font-size: 0.8rem;
}

.icon-heart::before {
  content: "❤";
}

.icon-share::before {
  content: "↗";
}

.icon-add::before {
  content: "+";
}

/* 现代双箭头向下 */
.icon-download::before {
  content: "⇩";
}

.icon-favorite::before {
  content: "☆";
}

.icon-favorite.active::before {
  content: "★";
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding-bottom: 20px;
  }

  .album-cover {
    width: 200px;
    height: 200px;
    margin-top: -50px;
  }

  .album-info {
    text-align: center;
  }

  .album-meta {
    justify-content: center;
  }

  .album-actions {
    justify-content: center;
  }

  .album-desc {
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }

  .list-header {
    grid-template-columns: 40px 1fr 60px;
    padding: 10px 15px;
  }

  .list-item {
    grid-template-columns: 40px 1fr 60px;
    padding: 10px 15px;
  }

  .related-albums {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}

@media (max-width: 480px) {
  .album-title {
    font-size: 2rem;
  }

  .album-actions {
    flex-wrap: wrap;
    justify-content: center;
  }

  .play-all-btn,
  .favorite-btn,
  .share-btn {
    padding: 8px 15px;
    font-size: 0.9rem;
  }

  .related-albums {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 15px;
  }
}
</style>