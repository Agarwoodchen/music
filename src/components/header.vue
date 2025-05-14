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
      <nav class="nav-links">
        <router-link to="/" class="nav-link" exact-active-class="active">首页</router-link>
        <router-link to="/discover" class="nav-link" active-class="active">发现</router-link>
        <router-link to="/playlist" class="nav-link" active-class="active">歌单</router-link>
        <router-link to="/rank" class="nav-link" active-class="active">排行榜</router-link>
        <router-link to="/artists" class="nav-link" active-class="active">歌手</router-link>
      </nav>

      <div class="user-actions">
        <button class="theme-toggle" @click="toggleTheme">
          <i :class="theme === 'dark' ? 'icon-sun' : 'icon-moon'"></i>
          {{ theme === 'dark' ? '亮色模式' : '暗色模式' }}
        </button>
        <div class="user-dropdown">
          <router-link to="Mine">
            <button class="user-button">
              <i class="icon-user"></i>
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
import { inject } from 'vue'
import { ThemeSymbol } from '../theme-context'
import { useRouter } from 'vue-router'

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
</style>