<template>
  <div class="modal-overlay" v-if="visible" @click.self="close">
    <div class="add-to-playlist-modal">
      <div class="modal-header">
        <h3 class="modal-title">添加到歌单</h3>
        <button class="close-btn" @click="close">×</button>
      </div>

      <div class="modal-content">
        <div class="search-section">
          <input type="text" class="search-input" placeholder="搜索我的歌单..." v-model="searchQuery">
        </div>

        <div class="playlist-list">
          <div class="playlist-item" v-for="playlist in filteredPlaylists" :key="playlist.id"
            @click="selectPlaylist(playlist)">
            <div class="playlist-cover">
              <img :src="apiBaseUrl + playlist.cover" :alt="playlist.name" class="cover-img">
              <div class="selected-overlay" v-if="selectedPlaylistId === playlist.id">
                ✓
              </div>
            </div>
            <div class="playlist-info">
              <h4 class="playlist-name">{{ playlist.name }}</h4>
              <p class="playlist-stats">{{ playlist.trackCount }}首 · {{ playlist.playCount }}次播放</p>
            </div>
          </div>

          <div class="create-new" @click="createNewPlaylist">
            <div class="new-playlist-icon">+</div>
            <span class="new-playlist-text">新建歌单</span>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="cancel-btn" @click="close">取消</button>
        <button class="confirm-btn" :disabled="!selectedPlaylistId" @click="confirmAdd">
          确认添加
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, computed, onMounted } from 'vue'
import { ThemeSymbol } from '../theme-context'
import { getUserPlaylistsApi } from '../api/test.ts'
import { ElMessage } from 'element-plus'
import { useApiStore } from '../stores/userApiUrl.ts'
const apiStore = useApiStore()
const apiBaseUrl = apiStore.apiBaseUrl
const themeContext = inject(ThemeSymbol)

if (!themeContext) {
  throw new Error('Theme context not provided')
}

const { theme, toggleTheme } = themeContext

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  song: {
    type: Object,
    default: () => ({ id: null, title: '' })
  }
})

const emit = defineEmits(['close', 'add-to-playlist', 'create-new-playlist'])

// 搜索查询
const searchQuery = ref('')

// 选中的歌单ID
const selectedPlaylistId = ref<number | null>(null)

// 模拟用户歌单数据
const playlists = ref([
  {
    id: 1,
    name: '我的最爱',
    cover: 'https://picsum.photos/150/150?playlist1',
    trackCount: 42,
    playCount: '1.2万'
  }
])

// 过滤后的歌单列表
const filteredPlaylists = computed(() => {
  if (!searchQuery.value) return playlists.value
  return playlists.value.filter(playlist =>
    playlist.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// 选择歌单
const selectPlaylist = (playlist: any) => {
  selectedPlaylistId.value = playlist.id
}

// 创建新歌单
const createNewPlaylist = () => {
  emit('create-new-playlist', props.song)
  close()
}

// 确认添加到歌单
const confirmAdd = () => {
  if (!selectedPlaylistId.value) return

  const playlist = playlists.value.find(p => p.id === selectedPlaylistId.value)
  emit('add-to-playlist', {
    song: props.song,
    playlist: playlist
  })
  close()
}

// 关闭弹窗
const close = () => {
  searchQuery.value = ''
  selectedPlaylistId.value = null
  emit('close')
}

const handlePlaylistData = async (data: any) => {
  return data.map((item: any) => ({
    id: item.id,
    name: item.name,
    cover: item.cover_url,
    trackCount: item.song_count,
    playCount: item.play_count
  }))
}


const loadPageData = async () => {
  const userJson = localStorage.getItem('user')
  const user = userJson ? JSON.parse(userJson) : null
  try {
    const [
      getUserPlaylists
    ] = await Promise.all([
      getUserPlaylistsApi(user.id)
    ])
    // console.log(getUserPlaylists)
    // 这里需要根据API返回的数据结构更新favoritePlaylists和createdPlaylists
    // 例如：

    // favoritePlaylists.value = getUserPlaylists.data.favoritedPlaylists
    const createdPlaylists = getUserPlaylists.data.createdPlaylists
    console.log(createdPlaylists, 111111111);

    // handlePlaylistData(createdPlaylists)
    playlists.value = await handlePlaylistData(createdPlaylists);

    // console.log(handlePlaylistData(createdPlaylists), 'rere');

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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.add-to-playlist-modal {
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  background-color: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 8px 24px var(--shadow-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-color);
  opacity: 0.7;
  padding: 0.25rem;
  line-height: 1;
}

.close-btn:hover {
  opacity: 1;
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.5rem;
}

.search-section {
  margin-bottom: 1.5rem;
}

.search-input {
  width: 96%;
  /* padding: 0.75rem 1rem; */
  padding: 0.75rem 2%;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--input-bg);
  color: var(--input-text);
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: var(--button-bg);
}

.playlist-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.playlist-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.playlist-item:hover {
  background-color: var(--hover-bg);
}

.playlist-cover {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.selected-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(76, 175, 80, 0.7);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
}

.playlist-info {
  flex: 1;
  min-width: 0;
}

.playlist-name {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.playlist-stats {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-color);
  opacity: 0.7;
}

.create-new {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 0.5rem;
}

.create-new:hover {
  background-color: var(--hover-bg);
}

.new-playlist-icon {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  background-color: var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: var(--text-color);
  flex-shrink: 0;
}

.new-playlist-text {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-color);
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-btn {
  background-color: transparent;
  color: var(--text-color);
  border: 1px solid var(--border-color);
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background-color: var(--hover-bg);
}

.confirm-btn {
  background-color: var(--button-bg);
  color: var(--button-text-color);
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.confirm-btn:hover:not(:disabled) {
  background-color: #3e8e41;
}

.confirm-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 滚动条样式 */
.playlist-list::-webkit-scrollbar {
  width: 6px;
}

.playlist-list::-webkit-scrollbar-track {
  background: var(--scrollbar-bg);
}

.playlist-list::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 3px;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .add-to-playlist-modal {
    width: 95%;
    max-height: 85vh;
  }

  .modal-content {
    padding: 0.75rem 1rem;
  }

  .playlist-cover,
  .new-playlist-icon {
    width: 50px;
    height: 50px;
  }
}
</style>