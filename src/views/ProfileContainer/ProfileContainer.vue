<template>
  <Header />
  <div class="profile-container">
    <!-- 用户信息卡片 -->
    <div class="user-profile-card" v-if="!isLoading">
      <div class="user-avatar-container">
        <img :src="user.avatar" class="user-avatar" alt="用户头像">
        <button class="edit-avatar-btn">编辑头像</button>
      </div>
      <div class="user-info">
        <h1 class="username">{{ user.username }}</h1>
        <p class="user-bio">{{ user.bio || '这个人很懒，什么都没留下~' }}</p>
        <div class="user-stats">
          <div class="stat-item">
            <span class="stat-number">{{ user.followers }}</span>
            <span class="stat-label">粉丝</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ user.following }}</span>
            <span class="stat-label">关注</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ user.playlists }}</span>
            <span class="stat-label">歌单</span>
          </div>
        </div>
        <button class="edit-profile-btn" @click="showEditModal = true">编辑资料</button>
      </div>
    </div>

    <!-- 骨架屏 -->
    <div class="user-profile-card skeleton" v-else>
      <div class="user-avatar-container">
        <div class="user-avatar skeleton-box"></div>
        <div class="edit-avatar-btn skeleton-box btn-placeholder"></div>
      </div>
      <div class="user-info">
        <div class="username skeleton-box"></div>
        <div class="user-bio skeleton-box" style="height: 20px; width: 60%;"></div>
        <div class="user-stats">
          <div class="stat-item skeleton-box" v-for="i in 3" :key="i">
            <div class="stat-number"></div>
            <div class="stat-label"></div>
          </div>
        </div>
        <div class="edit-profile-btn skeleton-box btn-placeholder"></div>
      </div>
    </div>

    <!-- 标签导航 -->
    <div class="tab-nav">
      <button v-for="tab in tabs" :key="tab.id" :class="['tab-btn', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id">
        {{ tab.label }}
      </button>
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <!-- 收藏的歌曲 -->
      <div class="section" v-show="activeTab === 'favorite-songs'">
        <h2 class="section-title">收藏的歌曲 <span class="count">({{ favoriteSongs.length }})</span></h2>
        <div class="song-list">
          <div class="song-item" v-for="(song, index) in favoriteSongs" :key="song.id" @click="playSong(song)">
            <span class="song-index">{{ index + 1 }}</span>
            <img :src="song.cover" class="song-cover" alt="歌曲封面">
            <div class="song-info">
              <h3 class="song-title">{{ song.title }}</h3>
              <p class="song-artist">{{ song.artist }}</p>
            </div>
            <div class="song-duration">{{ song.duration }}</div>
            <button class="song-action-btn" @click.stop="toggleFavorite(song)">
              ♥
            </button>
          </div>
        </div>
      </div>

      <!-- 收藏的专辑 -->
      <div class="section" v-show="activeTab === 'favorite-albums'">
        <h2 class="section-title">收藏的专辑 <span class="count">({{ favoriteAlbums.length }})</span></h2>
        <div class="album-grid">
          <div class="album-card" v-for="album in favoriteAlbums" :key="album.id" @click="viewAlbum(album)">
            <img :src="album.cover" class="album-cover" alt="专辑封面">
            <div class="album-info">
              <h3 class="album-name">{{ album.name }}</h3>
              <p class="album-artist">{{ album.artist }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 收藏的歌单 -->
      <div class="section" v-show="activeTab === 'favorite-playlists'">
        <h2 class="section-title">收藏的歌单 <span class="count">({{ favoritePlaylists.length }})</span></h2>
        <div class="playlist-grid">
          <div class="playlist-card" v-for="playlist in favoritePlaylists" :key="playlist.id"
            @click="viewPlaylist(playlist)">
            <img :src="playlist.cover" class="playlist-cover" alt="歌单封面">
            <div class="playlist-info">
              <h3 class="playlist-name">{{ playlist.name }}</h3>
              <p class="playlist-creator">by {{ playlist.creator }}</p>
              <p class="playlist-stats">{{ playlist.trackCount }}首 · {{ playlist.playCount }}次播放</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 创建的歌单 -->
      <div class="section" v-show="activeTab === 'my-playlists'">
        <div class="section-header">
          <h2 class="section-title">创建的歌单 <span class="count">({{ myPlaylists.length }})</span></h2>
          <button class="create-playlist-btn" @click="createPlaylist">+ 新建歌单</button>
        </div>
        <div class="playlist-grid">
          <div class="playlist-card" v-for="playlist in myPlaylists" :key="playlist.id" @click="viewPlaylist(playlist)">
            <img :src="playlist.cover" class="playlist-cover" alt="歌单封面">
            <div class="playlist-info">
              <h3 class="playlist-name">{{ playlist.name }}</h3>
              <p class="playlist-stats">{{ playlist.trackCount }}首 · {{ playlist.playCount }}次播放</p>
              <div class="playlist-actions">
                <button class="action-btn" @click.stop="editPlaylist(playlist)">编辑</button>
                <button class="action-btn" @click.stop="deletePlaylist(playlist.id)">删除</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 最近播放 -->
      <div class="section" v-show="activeTab === 'recently-played'">
        <h2 class="section-title">最近播放</h2>
        <div class="recent-items">
          <div class="recent-item" v-for="item in recentlyPlayed" :key="item.id + item.type"
            @click="playRecentItem(item)">
            <img :src="item.cover" class="recent-cover" alt="封面">
            <div class="recent-info">
              <h3 class="recent-name">{{ item.name }}</h3>
              <p class="recent-meta">
                <span class="recent-type">{{ getTypeName(item.type) }}</span>
                <span class="recent-time">{{ formatTime(item.time) }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <EditProfileModal v-if="showEditModal" :user-data="currentUser" @close="showEditModal = false"
      @save="handleSaveProfile" />
  </div>
  <div style="width: 100%;height: 5vh;"> </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { inject } from 'vue'
import { ThemeSymbol } from '../../theme-context'
import Header from '../../components/header.vue'
import { getUserFavoriteSongsApi, getUserDetailDataApi, updateUsersDetailDataApi } from '../../api/test.ts'
import { ElMessage } from 'element-plus'
import EditProfileModal from '../../components/editProfilePopups.vue'
import { useApiStore } from '../../stores/userApiUrl.ts'
import { usePlayerStore } from '../../stores/usePlayerStore.ts'
const player = usePlayerStore()
const apiStore = useApiStore()
const apiBaseUrl = apiStore.apiBaseUrl
const userJson = localStorage.getItem('user');
const userflag = userJson ? JSON.parse(userJson) : null;
const isLoading = ref(true)

const themeContext = inject(ThemeSymbol)

if (!themeContext) {
  throw new Error('Theme context not provided')
}

const { theme, toggleTheme } = themeContext

// 当前激活的标签页
const activeTab = ref('favorite-songs')

// 标签页导航
const tabs = ref([
  { id: 'favorite-songs', label: '收藏歌曲' },
  { id: 'favorite-albums', label: '收藏专辑' },
  { id: 'favorite-playlists', label: '收藏歌单' },
  { id: 'my-playlists', label: '我的歌单' },
  { id: 'recently-played', label: '最近播放' }
])

// 用户信息
const user = ref({
  username: 'Achengrusd',
  avatar: 'https://picsum.photos/150/150?user',
  bio: 'passionate for music',
  followers: 123,
  following: 45,
  playlists: 8
})

// 收藏的歌曲
const favoriteSongs = ref([
  { id: 10, title: '夜曲1', artist: '周杰伦', cover: 'https://picsum.photos/100/100?song1', duration: '3:45' },
  { id: 2, title: '七里香', artist: '周杰伦', cover: 'https://picsum.photos/100/100?song2', duration: '4:12' },
  { id: 3, title: '青花瓷', artist: '周杰伦', cover: 'https://picsum.photos/100/100?song3', duration: '3:58' },
  { id: 40, title: '晴天', artist: '周杰伦', cover: 'https://picsum.photos/100/100?song4', duration: '4:29' }
])

// 收藏的专辑
const favoriteAlbums = ref([
  { id: 1, name: '十一月的萧邦', artist: '周杰伦', cover: 'https://picsum.photos/200/200?album1' },
  { id: 2, name: '我很忙', artist: '周杰伦', cover: 'https://picsum.photos/200/200?album2' },
  { id: 3, name: '叶惠美', artist: '周杰伦', cover: 'https://picsum.photos/200/200?album3' }
])

// 收藏的歌单
const favoritePlaylists = ref([
  { id: 1, name: '深夜工作学习必备', creator: '音乐达人', cover: 'https://picsum.photos/200/200?playlist1', trackCount: 35, playCount: 12456 },
  { id: 2, name: '华语经典老歌', creator: '怀旧音乐', cover: 'https://picsum.photos/200/200?playlist2', trackCount: 50, playCount: 23456 }
])

// 创建的歌单
const myPlaylists = ref([
  { id: 1, name: '我的最爱', cover: 'https://picsum.photos/200/200?myplaylist1', trackCount: 25, playCount: 3456 },
  { id: 2, name: '健身动力', cover: 'https://picsum.photos/200/200?myplaylist2', trackCount: 15, playCount: 1234 }
])

// 最近播放
const recentlyPlayed = ref([
  { id: 1, name: '夜曲', type: 'song', cover: 'https://picsum.photos/100/100?recent1', time: new Date(Date.now() - 3600000) },
  { id: 2, name: '十一月的萧邦', type: 'album', cover: 'https://picsum.photos/100/100?recent2', time: new Date(Date.now() - 86400000) },
  { id: 3, name: '深夜工作学习必备', type: 'playlist', cover: 'https://picsum.photos/100/100?recent3', time: new Date(Date.now() - 172800000) }
])

// 方法
const playSong = (song: any) => {
  console.log('播放歌曲:', song.title)
  player.changeTrack(song.id)

}

const toggleFavorite = (song: any) => {
  console.log('切换收藏状态:', song.title)
  const index = favoriteSongs.value.findIndex(s => s.id === song.id)
  if (index !== -1) {
    favoriteSongs.value.splice(index, 1)
  }
}

const viewAlbum = (album: any) => {
  console.log('查看专辑:', album.name)
}

const viewPlaylist = (playlist: any) => {
  console.log('查看歌单:', playlist.name)
}

const createPlaylist = () => {
  console.log('创建新歌单')
  const newId = Math.max(...myPlaylists.value.map(p => p.id)) + 1
  myPlaylists.value.unshift({
    id: newId,
    name: '新建歌单' + newId,
    cover: 'https://picsum.photos/200/200?new',
    trackCount: 0,
    playCount: 0
  })
}

const editPlaylist = (playlist: any) => {
  console.log('编辑歌单:', playlist.name)
}

const deletePlaylist = (id: number) => {
  if (confirm('确定要删除这个歌单吗？')) {
    myPlaylists.value = myPlaylists.value.filter(p => p.id !== id)
  }
}

const playRecentItem = (item: any) => {
  console.log('播放最近项目:', item.name, item.type)
}

const getTypeName = (type: string) => {
  const typeNames: Record<string, string> = {
    song: '歌曲',
    album: '专辑',
    playlist: '歌单'
  }
  return typeNames[type] || type
}

const formatTime = (time: Date) => {
  const now = new Date()
  const diff = now.getTime() - time.getTime()
  const hours = Math.floor(diff / 3600000)

  if (hours < 1) {
    return '刚刚'
  } else if (hours < 24) {
    return `${hours}小时前`
  } else {
    const days = Math.floor(hours / 24)
    return `${days}天前`
  }
}



const showEditModal = ref(false)

const currentUser = ref({
  user_id: 1,
  username: 'musiclover',
  email: 'user@example.com',
  avatar_url: 'https://example.com/avatar.jpg',
  // 其他字段...
})

const handleSaveProfile = async (updatedData) => {
  // console.log(updatedData, '更新数据');
  // console.log(notSeverAddressAvatarUrl.value, updatedData.email, userflag.id, updatedData.username);

  try {
    let res = await updateUsersDetailDataApi(userflag.id, updatedData)

    if (res.success) {
      // console.log('保存成功:', res);
      await loadPageData()
      localStorage.setItem('user', JSON.stringify({
        avatar_url: notSeverAddressAvatarUrl.value,
        email: updatedData.email,
        id: userflag.id,
        username: updatedData.username
      }));
      ElMessage.success('保存成功')
    } else {
      ElMessage.error('保存失败')
    }
  } catch (error) {
    console.error('保存失败:', error)
  }
  console.log('保存数据:', updatedData)
  showEditModal.value = false
}

// function handleSaveProfile(updatedData) {
//   // 这里可以调用 API 保存数据，比如 await api.updateUser(updatedData)
//   try {
//     let res = await updateUsersDetailDataApi(updatedData)
//   } catch (error) {

//   }
//   console.log('保存数据:', updatedData)
//   showEditModal.value = false
// }

const handleUserData = (data: any) => {
  user.value = {
    username: data.nickname,
    avatar: apiBaseUrl + data.avatar_url,
    bio: data.bio,
    followers: 123,
    following: 43,
    playlists: 8
  }
}

const formatDuration = (seconds: number): string => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
};

const handleUserFavoriteSongs = (data: any) => {
  favoriteSongs.value = data.map((song: any) => ({
    id: song.song_id,
    title: song.song_title_zh,
    artist: song.artist_name_zh,  // 修复这里 key 写成 artists_name_zh 了
    cover: apiBaseUrl + song.cover_path,
    duration: formatDuration(song.duration)  // 格式化秒为 mm:ss
  }));
};

const notSeverAddressAvatarUrl = ref()

const loadPageData = async () => {
  try {
    // await new Promise(resolve => setTimeout(resolve, 200))
    const [

      getUserFavoriteSongs,
      getUserDetailData
    ] = await Promise.all([
      getUserFavoriteSongsApi(userflag.id),
      getUserDetailDataApi(userflag.id)
    ])
    const UserDetailData = getUserDetailData.data
    // console.log(getUserDetailData.data.avatar_url);
    handleUserData(UserDetailData)
    handleUserFavoriteSongs(getUserFavoriteSongs.data)
    currentUser.value = UserDetailData
    currentUser.value.avatar_url = UserDetailData.avatar_url
    notSeverAddressAvatarUrl.value = UserDetailData.avatar_url
    currentUser.value.avatar_url = apiBaseUrl + currentUser.value.avatar_url

    // console.log(userflag, 'userflag');

    // console.log(getUserDetailData);

    if (getUserFavoriteSongs) {
      isLoading.value = false
    }
    // console.log(getUserFavoriteSongs);

  } catch (error) {
    console.error(error)
    ElMessage.error('请求数据失败')
  } finally {

  }
}

onMounted(() => {
  // console.log(props.albumtId);

  loadPageData()
})


</script>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
}

/* 用户信息卡片 */
.user-profile-card {
  display: flex;
  gap: 2rem;
  padding: 1.5rem;
  background-color: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 4px 12px var(--shadow-color);
  margin-bottom: 2rem;
}

.user-avatar-container {
  position: relative;
  flex-shrink: 0;
}

.user-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--button-bg);
}

.edit-avatar-btn {
  opacity: 0;
  /* 默认透明 */
  visibility: hidden;
  /* 不可见，但仍保留布局信息 */
  transition: opacity 0.3s ease, visibility 0.3s ease;
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(39, 39, 39, 0.7);
  color: white;
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  cursor: pointer;
}

/* 悬停显示，带淡入效果 */
.user-avatar-container:hover .edit-avatar-btn {
  opacity: 1;
  visibility: visible;
}

/* .user-avatar:hover .edit-avatar-btn {
  display: block;
} */

.user-info {
  flex: 1;
}

.username {
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
}

.user-bio {
  margin: 0 0 1rem 0;
  color: var(--text-color);
  opacity: 0.8;
}

.user-stats {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 1.25rem;
  font-weight: 600;
}

.stat-label {
  font-size: 0.85rem;
  color: var(--text-color);
  opacity: 0.7;
}

.edit-profile-btn {
  background-color: var(--button-bg);
  color: var(--button-text-color);
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  cursor: pointer;
}

/* 标签导航 */
.tab-nav {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 1.5rem;
  overflow-x: auto;
}

.tab-btn {
  background: none;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  color: var(--text-color);
  opacity: 0.7;
  cursor: pointer;
  position: relative;
  white-space: nowrap;
}

.tab-btn.active {
  opacity: 1;
  font-weight: 500;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 3px;
  background-color: var(--button-bg);
}

/* 内容区域 */
.section {
  margin-bottom: 2rem;
}

.section-title {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
}

.count {
  font-size: 0.9rem;
  color: var(--text-color);
  opacity: 0.7;
  margin-left: 0.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.create-playlist-btn {
  background-color: var(--button-bg);
  color: var(--button-text-color);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

/* 歌曲列表 */
.song-list {
  background-color: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
}

.song-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: background-color 0.2s;
}

.song-item:hover {
  background-color: var(--hover-bg);
}

.song-index {
  width: 30px;
  text-align: center;
  color: var(--text-color);
  opacity: 0.7;
}

.song-cover {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  margin-right: 1rem;
  object-fit: cover;
}

.song-info {
  flex: 1;
  min-width: 0;
}

.song-title {
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-artist {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-color);
  opacity: 0.7;
}

.song-duration {
  margin: 0 1rem;
  color: var(--text-color);
  opacity: 0.7;
}

.song-action-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--error-color);
  cursor: pointer;
  padding: 0.5rem;
}

/* 专辑和歌单网格 */
.album-grid,
.playlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.album-card,
.playlist-card {
  background-color: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px var(--shadow-color);
  transition: transform 0.2s;
  cursor: pointer;
}

.album-card:hover,
.playlist-card:hover {
  transform: translateY(-4px);
}

.album-cover,
.playlist-cover {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.album-info,
.playlist-info {
  padding: 1rem;
}

.album-name,
.playlist-name {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.album-artist,
.playlist-creator,
.playlist-stats {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-color);
  opacity: 0.7;
}

.playlist-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.action-btn {
  background-color: var(--hover-bg);
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
}

/* 最近播放 */
.recent-items {
  background-color: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
}

.recent-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: background-color 0.2s;
}

.recent-item:hover {
  background-color: var(--hover-bg);
}

.recent-cover {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  margin-right: 1rem;
  object-fit: cover;
}

.recent-info {
  flex: 1;
  min-width: 0;
}

.recent-name {
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recent-meta {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-color);
  opacity: 0.7;
  display: flex;
  gap: 1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-profile-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .user-stats {
    justify-content: center;
  }

  .album-grid,
  .playlist-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}

@media (max-width: 480px) {
  .tab-nav {
    gap: 0.25rem;
  }

  .tab-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }

  .album-grid,
  .playlist-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}


.skeleton-box {
  background-color: #e0e0e0;
  border-radius: 4px;
  animation: pulse 1.5s infinite;
}

.skeleton .user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.btn-placeholder {
  width: 100px;
  height: 30px;
  margin-top: 10px;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
}
</style>