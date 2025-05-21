<template>
  <Header />
  <div class="playlist-square" :class="theme">
    <!-- 顶部导航 -->
    <header class="square-header">
      <h1>歌单广场</h1>
      <div class="header-actions">
        <div class="search-box">
          <input type="text" placeholder="搜索歌单..." class="search-input" v-model="searchQuery">
          <button class="search-btn">
            <i class="icon-search">🔍</i>
          </button>
        </div>
        <button class="theme-toggle" @click="toggleTheme">
          <i :class="theme === 'dark' ? 'icon-sun' : 'icon-moon'">
            {{ theme === 'dark' ? '☀️' : '🌙' }}
          </i>
          {{ theme === 'dark' ? '亮色模式' : '暗色模式' }}
        </button>
      </div>
    </header>

    <!-- 分类筛选 -->
    <div class="category-filter">
      <div class="filter-tabs">
        <button v-for="category in categories" :key="category.id" :class="{ active: activeCategory === category.id }"
          @click="activeCategory = category.id">
          {{ category.name }}
        </button>
      </div>
      <div class="filter-tags">
        <span v-for="tag in popularTags" :key="tag" :class="{ active: activeTags.includes(tag) }"
          @click="toggleTag(tag)">
          #{{ tag }}
        </span>
      </div>
    </div>

    <!-- 推荐歌单 -->
    <section class="featured-playlists" v-if="!searchQuery">
      <h2 class="section-title">
        <span>精选推荐</span>
        <router-link to="/featured" class="see-all">查看全部</router-link>
      </h2>
      <div class="playlist-grid">
        <div class="playlist-card featured" v-for="playlist in featuredPlaylists" :key="playlist.id"
          @click="viewPlaylist(playlist.id)">
          <div class="cover-container">
            <img :src="playlist.cover" :alt="playlist.name" class="cover-image">
            <div class="play-overlay">
              <button class="play-btn">▶</button>
            </div>
            <div class="play-count">
              <i class="icon-headphones">🎧</i> {{ playlist.playCount }}
            </div>
          </div>
          <div class="playlist-info">
            <h3 class="playlist-name">{{ playlist.name }}</h3>
            <p class="playlist-creator">{{ playlist.creator }}</p>
            <div class="playlist-tags">
              <span v-for="tag in playlist.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 全部歌单 -->
    <section class="all-playlists">
      <h2 class="section-title">
        <span>{{ searchQuery ? '搜索结果' : '全部歌单' }}</span>
        <div class="sort-options">
          <span>排序:</span>
          <select v-model="sortBy" class="sort-select">
            <option value="hot">最热</option>
            <option value="new">最新</option>
          </select>
        </div>
      </h2>
      <div class="playlist-grid">
        <div class="playlist-card" v-for="playlist in filteredPlaylists" :key="playlist.id"
          @click="viewPlaylist(playlist.id)">
          <div class="cover-container">
            <img :src="playlist.cover" :alt="playlist.name" class="cover-image">
            <div class="play-overlay">
              <button class="play-btn">▶</button>
            </div>
            <div class="play-count">
              <i class="icon-headphones">🎧</i> {{ playlist.playCount }}
            </div>
          </div>
          <div class="playlist-info">
            <h3 class="playlist-name">{{ playlist.name }}</h3>
            <p class="playlist-creator">{{ playlist.creator }}</p>
          </div>
        </div>
      </div>
      <div class="load-more" v-if="!searchQuery">
        <button v-if="hasMore" class="load-more-btn" @click="loadMore">加载更多</button>
      </div>
    </section>

    <!-- 底部 -->
    <footer class="square-footer">
      <p>© 2023 音乐平台 - 发现好音乐</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, computed, onMounted } from 'vue'
import { ThemeSymbol } from '../../theme-context'
import Header from '../../components/header.vue'
import { ElMessage } from 'element-plus'
import { getRecommendationPlayListApi, getAllPlaylistsApi } from '../../api/test.ts'
import { useApiStore } from '../../stores/userApiUrl.ts'
import router from '../../router/index.ts'
const apiStore = useApiStore()
const apiBaseUrl = apiStore.apiBaseUrl

const themeContext = inject(ThemeSymbol)

if (!themeContext) {
  throw new Error('Theme context not provided')
}

const pageSize = ref(8)
const page = ref(1)
const { theme, toggleTheme } = themeContext

// 搜索查询
const searchQuery = ref('')

// 分类筛选
const categories = ref([
  { id: 'all', name: '全部' },
  { id: 'jazz', name: '爵士' },
  { id: 'pop', name: '流行' },
  { id: 'rock', name: '摇滚' },
  { id: 'electronic', name: '电子' },
  { id: 'folk', name: '民谣' },
  { id: 'classical', name: '古典' },
])
// const categories = ref([
//   { id: 'all', name: '全部' },
//   { id: 'recommend', name: '推荐' },
//   { id: 'pop', name: '流行' },
//   { id: 'rock', name: '摇滚' },
//   { id: 'electronic', name: '电子' },
//   { id: 'hiphop', name: '嘻哈' }
// ])
const activeCategory = ref('all')

// 标签筛选
const popularTags = ref(['华语', '欧美', '日语', '韩语', '治愈', '运动', '学习', '工作'])
const activeTags = ref<string[]>([])

const toggleTag = (tag: string) => {
  const index = activeTags.value.indexOf(tag)
  if (index > -1) {
    activeTags.value.splice(index, 1)
  } else {
    activeTags.value.push(tag)
  }
}

// 排序
const sortBy = ref('hot')

// 模拟数据 - 推荐歌单
const featuredPlaylists = ref([
  {
    id: 1,
    name: '2023年度热门歌曲',
    cover: '',
    playCount: '1.2亿',
    creator: '音乐平台官方',
    tags: ['热门', '年度']
  }
])

// 模拟数据 - 全部歌单
const allPlaylists = ref(Array.from({ length: 12 }, (_, i) => ({
  id: i + 4,
  name: `精选歌单 ${i + 1}`,
  cover: `https://source.unsplash.com/random/300x300/?music,${i + 4}`,
  playCount: `${Math.floor(Math.random() * 9000) + 1000}万`,
  creator: ['音乐达人', '官方推荐', '用户创作'][Math.floor(Math.random() * 3)],
  category: ['pop', 'rock', 'electronic', 'hiphop'][Math.floor(Math.random() * 4)],
  tags: ['华语', '欧美', '日语', '韩语'].slice(0, Math.floor(Math.random() * 3) + 1)
})))

// 过滤后的歌单
const filteredPlaylists = computed(() => {
  let result = [...allPlaylists.value]

  // 搜索过滤
  if (searchQuery.value) {
    result = result.filter(p =>
      p.name.includes(searchQuery.value) ||
      p.creator.includes(searchQuery.value) ||
      p.tags.some(tag => tag.includes(searchQuery.value))
    )
  }

  // 分类过滤
  if (activeCategory.value !== 'all') {
    result = result.filter(p => p.category === activeCategory.value)
  }

  // 标签过滤
  if (activeTags.value.length > 0) {
    result = result.filter(p =>
      activeTags.value.some(tag => p.tags.includes(tag)))
  }

  // 排序
  if (sortBy.value === 'hot') {
    result.sort((a, b) =>
      parseFloat(b.playCount) - parseFloat(a.playCount))
  } else {
    result.sort((a, b) => b.id - a.id)
  }

  return result
})

// 是否还有更多数据
const hasMore = ref(true);

// 加载更多
const loadMore = async () => {
  if (!hasMore.value) return;

  try {
    const response = await getAllPlaylistsApi(++page.value, pageSize.value);

    if (response.success) {
      const newData = handlePlayListData(response);

      // 如果返回数据小于 pageSize，说明已经到底
      if (newData.length < pageSize.value) {
        hasMore.value = false;
      }

      allPlaylists.value.push(...newData);
    } else {
      ElMessage.error(response.message || '全部歌单获取失败');
    }
  } catch (error) {
    console.log(error);
    ElMessage.error('请求失败');
  }
};


const formatPlayCount = (count: number) => {
  if (count >= 1e8) return (count / 1e8).toFixed(1) + '亿';
  if (count >= 1e4) return (count / 1e4).toFixed(1) + '万';
  return count.toString();
};

const handlePlayListData = (PlaylistsAfter: any) => {
  console.log(PlaylistsAfter, 'sacacacascacac');

  const result = PlaylistsAfter.data.map((item: any) => ({
    id: item.id,
    name: item.name,
    cover: item.cover_url.startsWith('/uploads')
      ? apiBaseUrl + item.cover_url
      : item.cover_url,
    playCount: formatPlayCount(item.play_count),
    creator: item.user_id ? `用户ID：${item.username}` : '音乐平台官方',
    tags: (() => {
      try {
        return item.tags ? JSON.parse(item.tags) : [];
      } catch {
        return [];
      }
    })(),
    category: item.category
  }));
  return result;
}


const loadPageData = async () => {
  let user = null;
  try {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      user = JSON.parse(userJson);
    }
  } catch (e) {
    console.warn('解析用户信息失败', e);
  }
  try {
    const [
      getRecommendationPlayList,
      getAllPlaylists
    ] = await Promise.all([
      getRecommendationPlayListApi(),
      getAllPlaylistsApi(page.value, pageSize.value)
    ]);

    if (getRecommendationPlayList.success) {
      featuredPlaylists.value = getRecommendationPlayList.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        cover: item.cover_url.startsWith('/uploads')
          ? apiBaseUrl + item.cover_url
          : item.cover_url,
        playCount: formatPlayCount(item.play_count),
        creator: item.user_id ? `用户ID：${item.username}` : '音乐平台官方',
        tags: item.tags?.split(',') || []
      }));
    } else {
      ElMessage.error(getRecommendationPlayList.message || '推荐歌单获取失败');
    }
    // console.log(getAllPlaylists);

    if (getAllPlaylists.success) {

      allPlaylists.value = handlePlayListData(getAllPlaylists)
      console.log(allPlaylists.value);
    } else {
      ElMessage.error(getAllPlaylists.message || '全部歌单获取失败');
    }

    // console.log('全部歌单:', allPlaylists.value);


  } catch (error) {
    console.error(error);
    ElMessage.error('请求数据失败');
  }
};

const viewPlaylist = (playlistId: number) => {
  router.push({ name: 'Playlist', params: { id: playlistId } });
}

onMounted(() => {
  loadPageData()
})

</script>

<style scoped>
.playlist-square {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
}

/* 头部样式 */
.square-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border-color);
}

.square-header h1 {
  margin: 0;
  font-size: 2rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-box {
  display: flex;
  align-items: center;
  background-color: var(--input-bg);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid var(--input-border);
}

.search-input {
  padding: 8px 15px;
  border: none;
  background-color: transparent;
  color: var(--input-text);
  min-width: 200px;
  outline: none;
}

.search-btn {
  background-color: transparent;
  border: none;
  padding: 8px 15px;
  cursor: pointer;
  color: var(--text-color);
}

.theme-toggle {
  background-color: var(--button-bg);
  color: var(--button-text-color);
  border: none;
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s;
}

.theme-toggle:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

/* 分类筛选样式 */
.category-filter {
  margin-bottom: 30px;
}

.filter-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.filter-tabs button {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  background-color: var(--card-bg);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s;
}

.filter-tabs button.active {
  background-color: var(--button-bg);
  color: var(--button-text-color);
  border-color: var(--button-bg);
}

.filter-tabs button:hover:not(.active) {
  background-color: var(--hover-bg);
}

.filter-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-tags span {
  padding: 6px 12px;
  border-radius: 15px;
  background-color: var(--card-bg);
  color: var(--text-color);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.filter-tags span.active {
  background-color: var(--link-color);
  color: white;
}

.filter-tags span:hover:not(.active) {
  background-color: var(--hover-bg);
}

/* 歌单部分样式 */
.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30px 0 20px;
  font-size: 1.5rem;
}

.see-all {
  font-size: 1rem;
  color: var(--link-color);
}

.sort-options {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
}

.sort-select {
  padding: 5px 10px;
  border-radius: 4px;
  border: 1px solid var(--input-border);
  background-color: var(--input-bg);
  color: var(--input-text);
}

/* 歌单网格布局 */
.playlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
}

/* 歌单卡片样式 */
.playlist-card {
  background-color: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
  box-shadow: 0 4px 8px var(--shadow-color);
  cursor: pointer;
}

.playlist-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px var(--shadow-color);
}

.playlist-card.featured {
  grid-column: span 1;
}

.cover-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1/1;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.playlist-card:hover .cover-image {
  transform: scale(1.05);
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.playlist-card:hover .play-overlay {
  opacity: 1;
}

.play-btn {
  background-color: var(--button-bg);
  color: var(--button-text-color);
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s;
}

.play-btn:hover {
  transform: scale(1.1);
}

.play-count {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 5px;
}

.playlist-info {
  padding: 15px;
}

.playlist-name {
  margin: 0 0 5px 0;
  font-size: 1.1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.playlist-creator {
  margin: 0;
  color: var(--text-color);
  opacity: 0.7;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.playlist-tags {
  display: flex;
  gap: 5px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.playlist-tags span {
  background-color: var(--hover-bg);
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
}

/* 加载更多按钮 */
.load-more {
  text-align: center;
  margin: 30px 0;
}

.load-more-btn {
  background-color: var(--button-bg);
  color: var(--button-text-color);
  border: none;
  padding: 10px 25px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.load-more-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

/* 底部样式 */
.square-footer {
  text-align: center;
  padding: 30px 0;
  margin-top: auto;
  color: var(--text-color);
  opacity: 0.7;
  font-size: 0.9rem;
  border-top: 1px solid var(--border-color);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .square-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
    gap: 10px;
  }

  .search-box {
    width: 100%;
  }

  .playlist-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 480px) {
  .playlist-grid {
    grid-template-columns: 1fr 1fr;
  }

  .section-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>