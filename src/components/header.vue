<template>
  <header class="header">
    <div class="header-content">
      <h1 class="logo">Music<span>Hub</span></h1>
      <div class="search-bar">
        <input type="text" placeholder="搜索歌曲、歌手或专辑...">
        <button class="search-button">
          <i class="icon-search"></i>
        </button>
      </div>
      <!-- 修改后的水平滚动导航 -->
      <div class="nav-container">
        <button class="scroll-button left" @click="scrollNav(-100)">
          <i class="icon-chevron-left"></i>
        </button>

        <div class="nav-scroller" ref="navScroller">
          <nav class="nav-links">
            <router-link to="/ProfileContainer" class="nav-link" active-class="active">个人主页</router-link>
            <router-link to="/" class="nav-link" exact-active-class="active">首页</router-link>
            <router-link to="/discover" class="nav-link" active-class="active">发现</router-link>

            <router-link to="/PlaylistSquare" class="nav-link" active-class="active">歌单</router-link>
            <router-link to="/rank" class="nav-link" active-class="active">排行榜</router-link>
            <router-link to="/artists" class="nav-link" active-class="active">歌手</router-link>
            <router-link to="/MyPlaylist" class="nav-link" active-class="active">我的歌单</router-link>
            <!-- 可以添加更多导航项 -->
            <router-link to="/new" class="nav-link" active-class="active">新歌</router-link>
            <router-link to="/mv" class="nav-link" active-class="active">MV</router-link>
            <router-link to="/radio" class="nav-link" active-class="active">电台</router-link>
            <router-link to="/live" class="nav-link" active-class="active">直播</router-link>
          </nav>
        </div>

        <button class="scroll-button right" @click="scrollNav(100)">
          <i class="icon-chevron-right"></i>
        </button>
      </div>

      <div class="user-actions">
        <button class="theme-toggle" @click="toggleTheme">
          <i :class="theme === 'dark' ? 'icon-sun' : 'icon-moon'"></i>
          {{ theme === 'dark' ? '亮色模式' : '暗色模式' }}
        </button>
        <div class="user-dropdown">
          <router-link to="/mine">
            <button class="user-button">
              <img :src="apiBaseUrl + userFlag.avatar_url" alt="User Avatar" class="avatar-img" />
            </button>
          </router-link>
          <div class="dropdown-menu">
            <button class="dropdown-item" @click="logout">
              <i class="icon-logout"></i> 退出登录
            </button>
          </div>
        </div>

      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { inject, ref, onMounted } from 'vue'
import { ThemeSymbol } from '../theme-context'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getUserDetailDataApi } from '../api/test.ts'
const router = useRouter()
const themeContext = inject(ThemeSymbol)

if (!themeContext) {
  throw new Error('Theme context not provided')
}

const { theme, toggleTheme } = themeContext
import { useApiStore } from '../stores/userApiUrl'
const userJson = localStorage.getItem('user');
const user = userJson ? JSON.parse(userJson) : null;
const apiStore = useApiStore()
const apiBaseUrl = apiStore.apiBaseUrl
const userFlag = ref({
  avatar_url: ''
})
const logout = () => {
  // 清除本地存储中的 token
  localStorage.removeItem('token');

  // 跳转到登录页面
  router.push('/login');

  // 可选：输出日志或提示用户已退出
  console.log('用户已退出登录');

  // 你还可以添加一些其他操作，例如清除全局状态（如 Vuex 中的用户数据）
};


const navScroller = ref<HTMLElement | null>(null)

const scrollNav = (amount: number) => {
  if (navScroller.value) {
    navScroller.value.scrollBy({
      left: amount,
      behavior: 'smooth'
    })
  }
}

const loadPageData = async () => {
  try {
    // await new Promise(resolve => setTimeout(resolve, 200))
    const [


      getUserDetailData
    ] = await Promise.all([

      getUserDetailDataApi(user.id)
    ])

    userFlag.value = getUserDetailData.data
    console.log(userFlag.value.avatar_url);

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
  /* border: 1px solid var(--border-color); */
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

.nav-link {
  color: var(--text-color);
  text-decoration: none;
  padding: 8px 12px;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #222;
}

.nav-link.active {
  color: var(--link-color);
  /* 高亮颜色，可自定义 */
  font-weight: bold;
  border-bottom: 2px solid var(--link-color);
}


/* 新增的导航容器样式 */
.nav-container {
  display: flex;
  align-items: center;
  margin-right: auto;
  position: relative;
  max-width: 600px;
  /* 根据实际需要调整 */
  overflow: hidden;
}

.nav-scroller {
  flex: 1;
  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  /* 平滑滚动(iOS) */
  scrollbar-width: none;
  /* 隐藏滚动条(Firefox) */
  margin: 0 10px;
}

/* 隐藏滚动条(Chrome/Safari) */
.nav-scroller::-webkit-scrollbar {
  display: none;
}

.nav-links {
  display: flex;
  gap: 1rem;
  padding: 0 1rem;
  white-space: nowrap;
  /* 防止换行 */
}

/* 滚动按钮样式 */
.scroll-button {
  background-color: var(--card-bg);
  color: var(--text-color);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  z-index: 1;
  box-shadow: 0 2px 4px var(--shadow-color);
}

.scroll-button:hover {
  background-color: var(--hover-bg);
  transform: scale(1.1);
}

.scroll-button.left {
  margin-right: -10px;
  /* 部分覆盖导航区域 */
}

.scroll-button.right {
  margin-left: -10px;
  /* 部分覆盖导航区域 */
}

/* 新增的图标样式 */
.icon-chevron-left::before {
  content: "◀";
}

.icon-chevron-right::before {
  content: "▶";
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .search-bar {
    margin-right: 1rem;
    max-width: 300px;
  }

  .nav-container {
    max-width: 400px;
  }
}

@media (max-width: 992px) {
  .header-content {
    flex-wrap: wrap;
    padding-bottom: 0.5rem;
  }

  .search-bar {
    order: 3;
    width: 100%;
    max-width: 100%;
    margin: 0.5rem 0;
  }

  .nav-container {
    order: 2;
    max-width: calc(100% - 120px);
    /* 减去logo和用户操作的宽度 */
    margin-right: 0;
  }

  .user-actions {
    order: 1;
    margin-left: auto;
  }
}

@media (max-width: 576px) {
  .logo {
    font-size: 1.5rem;
    margin-right: 1rem;
  }

  .nav-container {
    max-width: calc(100% - 100px);
  }

  .nav-links {
    gap: 0.75rem;
    padding: 0 0.5rem;
  }

  .nav-link {
    padding: 8px 10px;
    font-size: 0.9rem;
  }

  .scroll-button {
    width: 28px;
    height: 28px;
  }
}

.avatar-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #ccc;
}
</style>