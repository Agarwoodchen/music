<template>
  <Header />
  <div class="playlist-container" :class="theme">
    <!-- 头部区域 -->
    <header class="playlist-header">
      <h1>我的歌单</h1>
      <div class="header-actions">
        <button class="create-btn" @click="showCreateDialog = true">
          <i class="icon-plus"></i> 新建歌单
        </button>
        <button class="theme-toggle" @click="toggleTheme">
          <i :class="theme === 'dark' ? 'icon-sun' : 'icon-moon'"></i>
          {{ theme === 'dark' ? '亮色模式' : '暗色模式' }}
        </button>
      </div>
    </header>

    <!-- 主要内容区 -->
    <main class="playlist-main">
      <!-- 收藏的歌单 -->
      <section class="playlist-section">
        <h2 class="section-title">收藏的歌单</h2>
        <div class="playlist-grid">
          <div class="playlist-card" v-for="playlist in favoritePlaylists" :key="playlist.id">
            <router-link :to="`/playlist/${playlist.id}`" class="playlist-link">
              <div class="playlist-cover">
                <img :src="playlist.cover" :alt="playlist.name" class="cover-image">
                <div class="play-count">
                  <i class="icon-headphones"></i> {{ playlist.playCount }}
                </div>
                <div class="play-btn">
                  <i class="icon-play"></i>
                </div>
              </div>
              <div class="playlist-info">
                <h3 class="playlist-name">{{ playlist.name }}</h3>
                <p class="playlist-desc">{{ playlist.trackCount }}首歌曲 · {{ playlist.creator }}</p>
              </div>
            </router-link>
            <button class="more-btn">
              <i class="icon-more"></i>
            </button>
          </div>
        </div>
      </section>

      <!-- 创建的歌单 -->
      <section class="playlist-section">
        <h2 class="section-title">创建的歌单</h2>
        <div class="playlist-grid">
          <div class="playlist-card" v-for="playlist in createdPlaylists" :key="playlist.id">
            <router-link :to="`/playlist/${playlist.id}`" class="playlist-link">
              <div class="playlist-cover">
                <img :src="apiBaseUrl + playlist.cover_url" :alt="playlist.name" class="cover-image">
                <div class="play-count">
                  <i class="icon-headphones"></i> {{ playlist.play_count }}
                </div>
                <div class="play-btn">
                  <i class="icon-play"></i>
                </div>
              </div>
              <div class="playlist-info">
                <h3 class="playlist-name">{{ playlist.name }}</h3>
                <p class="playlist-desc">{{ playlist.song_count }}首歌曲</p>
              </div>
            </router-link>
            <button class="more-btn">
              <i class="icon-more"></i>
            </button>
          </div>

          <!-- 新建歌单卡片 -->
          <div class="playlist-card add-playlist" @click="showCreateDialog = true">
            <div class="add-icon">
              <i class="icon-plus"></i>
            </div>
            <div class="add-text">新建歌单</div>
          </div>
        </div>
      </section>
    </main>

    <!-- 新建歌单对话框 -->
    <el-dialog v-model="showCreateDialog" title="新建歌单" width="500px" :close-on-click-modal="false">
      <el-form :model="newPlaylistForm" :rules="playlistRules" ref="playlistFormRef">
        <el-form-item label="歌单名称" prop="name">
          <el-input v-model="newPlaylistForm.name" placeholder="请输入歌单名称" />
        </el-form-item>
        <el-form-item label="歌单描述" prop="description">
          <el-input v-model="newPlaylistForm.description" type="textarea" :rows="3" placeholder="请输入歌单描述" />
        </el-form-item>
        <el-form-item label="封面图片" prop="cover_url">
          <el-upload action="#" :auto-upload="false" :show-file-list="false" :on-change="handleCoverChange">
            <template #trigger>
              <el-button type="primary">选择封面</el-button>
            </template>
            <template #tip>
              <div class="el-upload__tip">
                {{ newPlaylistForm.cover_url ? '已选择封面' : '未选择封面' }}
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="公开歌单">
          <el-switch v-model="newPlaylistForm.is_public" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-select v-model="newPlaylistForm.tags" multiple filterable allow-create placeholder="请选择或输入标签"
            style="width: 100%">
            <el-option v-for="tag in popularTags" :key="tag" :label="tag" :value="tag" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="newPlaylistForm.category" placeholder="请选择分类" style="width: 100%">
            <el-option v-for="category in categories" :key="category.value" :label="category.label"
              :value="category.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="handleCreatePlaylist" :loading="creating">
          创建
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import Header from '../../components/header.vue'
import { inject, onMounted, ref } from 'vue'
import { ThemeSymbol } from '../../theme-context'
import { ElMessage, type FormInstance, type UploadFile } from 'element-plus'
import { getUserPlaylistsApi, createPlaylistApi, uploadCoverImageApi } from '../../api/test.ts'
import { useApiStore } from '../../stores/userApiUrl.ts'
const apiStore = useApiStore()
const apiBaseUrl = apiStore.apiBaseUrl
const themeContext = inject(ThemeSymbol)

if (!themeContext) {
  throw new Error('Theme context not provided')
}

const { theme, toggleTheme } = themeContext


// 模拟数据
const favoritePlaylists = ref([
  {
    id: 1,
    name: '每日推荐',
    cover: 'https://source.unsplash.com/random/300x300/?music,playlist,1',
    playCount: '1.2万',
    trackCount: 30,
    creator: '系统推荐'
  }
])

const createdPlaylists = ref({
  id: 4,
  name: '我的最爱',
  cover: 'https://source.unsplash.com/random/300x300/?music,playlist,4',
  playCount: '2.1万',
  trackCount: 45
})

// 表单引用
const playlistFormRef = ref<FormInstance>()

// 对话框状态
const showCreateDialog = ref(false)
const creating = ref(false)

// 新建歌单表单
const newPlaylistForm = ref({
  name: '',
  description: '',
  cover_url: '',
  is_public: 1,
  tags: [],
  category: ''
})

// 表单验证规则
const playlistRules = {
  name: [
    { required: true, message: '请输入歌单名称', trigger: 'blur' },
    { max: 30, message: '长度不超过30个字符', trigger: 'blur' }
  ],
  description: [
    { max: 200, message: '长度不超过200个字符', trigger: 'blur' }
  ]
}

// 标签和分类选项
const popularTags = ref(['华语', '欧美', '日语', '韩语', '治愈', '运动', '学习', '工作'])
// const popularTags = ref(['流行', '摇滚', '电子', '古典', '爵士', '民谣', 'R&B', '嘻哈'])
const categories = ref([
  { value: 'pop', label: '流行' },
  { value: 'rock', label: '摇滚' },
  { value: 'electronic', label: '电子' },
  { value: 'classical', label: '古典' },
  { value: 'jazz', label: '爵士' },
  { value: 'folk', label: '民谣' }
])

// 处理封面图片选择
const handleCoverChange = async (file: UploadFile) => {
  // 先本地预览
  if (file.raw) {
    const reader = new FileReader();
    reader.onload = (e) => {
      newPlaylistForm.value.cover_url = e.target?.result as string; // 本地预览用
    };
    reader.readAsDataURL(file.raw);

    // 上传到服务器
    const result = await uploadCoverImageApi(file.raw);
    if (result.success) {
      // 替换为服务器上的图片 URL，后续提交时用这个
      newPlaylistForm.value.cover_url = result.coverUrl;
    } else {
      console.error('上传封面失败:', result.message);
      // 可以给用户提示上传失败
    }
  }
};

// 创建歌单
const handleCreatePlaylist = async () => {
  if (!playlistFormRef.value) return

  try {
    await playlistFormRef.value.validate()
    creating.value = true

    const userJson = localStorage.getItem('user')
    const user = userJson ? JSON.parse(userJson) : null

    const playlistData = {
      ...newPlaylistForm.value,
      user_id: user?.id
    }

    const result = await createPlaylistApi(playlistData)

    if (result.success) {
      ElMessage.success('歌单创建成功')
      showCreateDialog.value = false
      // 刷新歌单列表
      loadPageData()
      // 重置表单
      resetPlaylistForm()
    } else {
      ElMessage.error(result.message || '创建歌单失败')
    }
  } catch (error) {
    console.error('创建歌单失败:', error)
    ElMessage.error('创建歌单失败')
  } finally {
    creating.value = false
  }
}

// 重置表单
const resetPlaylistForm = () => {
  newPlaylistForm.value = {
    name: '',
    description: '',
    cover_url: '',
    is_public: 1,
    tags: [],
    category: ''
  }
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

    favoritePlaylists.value = getUserPlaylists.data.favoritedPlaylists
    createdPlaylists.value = getUserPlaylists.data.createdPlaylists

    console.log(createdPlaylists.value);

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
.playlist-container {
  background-color: var(--bg-color);
  color: var(--text-color);
  min-height: 100vh;
  padding: 20px;
  transition: all 0.3s ease;
}

.playlist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border-color);
}

.playlist-header h1 {
  font-size: 1.8rem;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 15px;
}

.create-btn {
  background-color: var(--button-bg);
  color: var(--button-text-color);
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.create-btn:hover {
  filter: brightness(0.9);
}

.theme-toggle {
  background-color: transparent;
  color: var(--text-color);
  border: 1px solid var(--border-color);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-toggle:hover {
  background-color: var(--hover-bg);
}

.playlist-main {
  max-width: 1200px;
  margin: 0 auto;
}

.playlist-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.3rem;
  margin: 0 0 20px;
  color: var(--text-color);
}

.playlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 25px;
}

.playlist-card {
  background-color: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;
  position: relative;
}

.playlist-card:hover {
  transform: translateY(-5px);
}

.playlist-link {
  text-decoration: none;
  color: inherit;
}

.playlist-cover {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  overflow: hidden;
}

.cover-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.playlist-card:hover .cover-image {
  transform: scale(1.05);
}

.play-count {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  gap: 4px;
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
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
}

.playlist-card:hover .play-btn {
  opacity: 1;
  transform: translateY(0);
}

.playlist-info {
  padding: 15px;
}

.playlist-name {
  font-size: 1rem;
  margin: 0 0 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.playlist-desc {
  font-size: 0.8rem;
  margin: 0;
  color: var(--text-color);
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.more-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;
}

.playlist-card:hover .more-btn {
  opacity: 1;
}

.add-playlist {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px dashed var(--border-color);
  background-color: transparent;
  min-height: 240px;
}

.add-playlist:hover {
  background-color: var(--hover-bg);
  transform: none;
}

.add-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--button-bg);
  color: var(--button-text-color);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.add-text {
  font-size: 0.9rem;
  color: var(--text-color);
}

/* 图标样式 */
[class^="icon-"]::before,
[class*=" icon-"]::before {
  display: inline-block;
  font-style: normal;
  font-weight: normal;
  line-height: 1;
}

.icon-plus::before {
  content: "+";
}

.icon-sun::before {
  content: "☀️";
}

.icon-moon::before {
  content: "🌙";
}

.icon-headphones::before {
  content: "🎧";
}

.icon-play::before {
  content: "▶";
}

.icon-more::before {
  content: "⋯";
}

@media (max-width: 768px) {
  .playlist-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .playlist-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .playlist-container {
    padding: 15px;
  }

  .playlist-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }

  .create-btn,
  .theme-toggle {
    padding: 6px 12px;
    font-size: 0.8rem;
  }

  .playlist-info {
    padding: 10px;
  }

  .playlist-name {
    font-size: 0.9rem;
  }

  .playlist-desc {
    font-size: 0.75rem;
  }
}

/* 新建歌单卡片样式 */
.add-playlist {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px dashed var(--border-color);
  background-color: var(--card-bg);
  transition: all 0.3s;
}

.add-playlist:hover {
  border-color: var(--button-bg);
  transform: translateY(-3px);
}

.add-icon {
  font-size: 2rem;
  color: var(--button-bg);
  margin-bottom: 10px;
}

.add-text {
  color: var(--text-color);
  font-weight: 500;
}

/* 对话框样式 */
:deep(.el-dialog) {
  border-radius: 8px;
  background-color: var(--card-bg) !important;
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid var(--border-color);
}

:deep(.el-dialog__title) {
  color: var(--text-color);
}

:deep(.el-form-item__label) {
  color: var(--text-color);
}

:deep(.el-input__wrapper) {
  background-color: var(--input-bg);
}

/* :deep(.el-select__input) {
  background-color: var(--input-bg);
  color: var(--input-text);
} */

:deep(.el-input__inner),
:deep(.el-textarea__inner) {
  background-color: var(--input-bg);
  color: var(--input-text);
  border-color: var(--input-border);
}

:deep(.el-select-dropdown) {
  background-color: var(--card-bg);
  border-color: var(--border-color);
}

:deep(.el-select-dropdown__item) {
  color: var(--text-color);
}

:deep(.el-select-dropdown__item.hover) {
  background-color: var(--hover-bg);
}

/* 上传组件样式 */
:deep(.el-upload__tip) {
  color: var(--text-color);
  opacity: 0.7;
  font-size: 0.8rem;
  margin-top: 5px;
}

.el-dialog {}
</style>