<template>
  <div class="profile-container">
    <!-- 顶部导航 -->
    <header class="profile-header">
      <div class="header-content">
        <h1>个人中心</h1>
        <button class="theme-toggle" @click="toggleTheme">
          {{ theme === 'light' ? '🌙 暗色模式' : '☀️ 亮色模式' }}
        </button>
      </div>
    </header>

    <!-- 主要内容区 -->
    <main class="profile-main">
      <!-- 个人信息卡片 -->
      <div class="profile-card">
        <div class="profile-banner"></div>
        <div class="profile-info">
          <div class="avatar-container">
            <img :src="fullAvatarUrl" alt="用户头像" class="profile-avatar">
            <button class="edit-avatar-btn">✏️</button>
          </div>
          <div class="user-details">
            <h2 class="username">音乐爱好者</h2>
            <p class="user-bio">🎵 热爱音乐，喜欢分享 🎵</p>
            <div class="user-stats">
              <div class="stat-item">
                <span class="stat-number">128</span>
                <span class="stat-label">关注</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">356</span>
                <span class="stat-label">粉丝</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">1,024</span>
                <span class="stat-label">喜欢</span>
              </div>
            </div>
          </div>
          <button class="edit-profile-btn">编辑资料</button>
        </div>
      </div>

      <!-- 个人资料部分 -->
      <div class="details-section">
        <div class="detail-card">
          <h3 class="detail-title">基本信息</h3>
          <ul class="detail-list">
            <li class="detail-item">
              <span class="detail-label">昵称</span>
              <span class="detail-value">音乐达人</span>
            </li>
            <li class="detail-item">
              <span class="detail-label">性别</span>
              <span class="detail-value">女</span>
            </li>
            <li class="detail-item">
              <span class="detail-label">地区</span>
              <span class="detail-value">北京</span>
            </li>
            <li class="detail-item">
              <span class="detail-label">注册时间</span>
              <span class="detail-value">2020年5月</span>
            </li>
          </ul>
        </div>

        <div class="detail-card">
          <h3 class="detail-title">音乐偏好</h3>
          <div class="preference-tags">
            <span class="tag">流行</span>
            <span class="tag">摇滚</span>
            <span class="tag">电子</span>
            <span class="tag">爵士</span>
            <span class="tag">古典</span>
          </div>
          <div class="preference-chart">
            <div class="chart-bar" style="--width: 70%; --color: var(--success-color);">
              <span>流行</span>
            </div>
            <div class="chart-bar" style="--width: 50%; --color: var(--warning-color);">
              <span>摇滚</span>
            </div>
            <div class="chart-bar" style="--width: 40%; --color: var(--error-color);">
              <span>电子</span>
            </div>
            <div class="chart-bar" style="--width: 30%; --color: var(--link-color);">
              <span>爵士</span>
            </div>
            <div class="chart-bar" style="--width: 20%; --color: #9b59b6;">
              <span>古典</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 最近活动 -->
      <div class="activity-section">
        <h3 class="section-title">最近活动</h3>
        <div class="activity-list">
          <div class="activity-item">
            <div class="activity-icon">🎵</div>
            <div class="activity-content">
              <p>收藏了歌曲 <a href="#" class="highlight">《夏日微风》</a></p>
              <span class="activity-time">2小时前</span>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-icon">❤️</div>
            <div class="activity-content">
              <p>点赞了 <a href="#" class="highlight">@音乐小站</a> 的歌单</p>
              <span class="activity-time">昨天</span>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-icon">📝</div>
            <div class="activity-content">
              <p>发布了评论: "这首歌的前奏太棒了！"</p>
              <span class="activity-time">3天前</span>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-icon">🎧</div>
            <div class="activity-content">
              <p>创建了歌单 <a href="#" class="highlight">《工作学习背景音乐》</a></p>
              <span class="activity-time">1周前</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 创建的歌单 -->
      <div class="playlists-section">
        <div class="section-header">
          <h3 class="section-title">创建的歌单</h3>
          <button class="view-all-btn">查看全部</button>
        </div>
        <div class="playlist-grid">
          <div class="playlist-card">
            <div class="playlist-cover" style="background-image: url('https://picsum.photos/300/300?random=1')">
              <div class="play-count">1.2k播放</div>
            </div>
            <div class="playlist-info">
              <h4 class="playlist-title">清晨唤醒</h4>
              <p class="playlist-count">32首歌曲</p>
            </div>
          </div>
          <div class="playlist-card">
            <div class="playlist-cover" style="background-image: url('https://picsum.photos/300/300?random=2')">
              <div class="play-count">856播放</div>
            </div>
            <div class="playlist-info">
              <h4 class="playlist-title">深夜工作</h4>
              <p class="playlist-count">28首歌曲</p>
            </div>
          </div>
          <div class="playlist-card">
            <div class="playlist-cover" style="background-image: url('https://picsum.photos/300/300?random=3')">
              <div class="play-count">2.4k播放</div>
            </div>
            <div class="playlist-info">
              <h4 class="playlist-title">周末放松</h4>
              <p class="playlist-count">45首歌曲</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="profile-footer">
      <p>© 2023 音乐平台 - 个人中心</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import { ThemeSymbol } from '../../theme-context'
import { getUserAvatarApi } from '../../api/authService.js'


const themeContext = inject(ThemeSymbol)

if (!themeContext) {
  throw new Error('Theme context not provided')
}

const { theme, toggleTheme } = themeContext





const avatarUrl = ref('');
const fullAvatarUrl = ref('');

// 封装请求逻辑
// 封装请求逻辑
const fetchUserAvatar = async () => {
  const userStr = localStorage.getItem('user');
  const storedApiUrl = localStorage.getItem('API_BASE_URL');

  if (!userStr) {
    console.warn('未找到本地用户信息');
    return;
  }

  const user = JSON.parse(userStr);
  try {
    const result = await getUserAvatarApi(user.id);
    if (result.avatarUrl) {
      avatarUrl.value = result.avatarUrl;

      // 拼接完整头像 URL（兼容 http/https 或相对路径）
      fullAvatarUrl.value = result.avatarUrl.startsWith('http')
        ? result.avatarUrl
        : storedApiUrl.replace(/\/$/, '') + result.avatarUrl;


      console.log(avatarUrl.value, fullAvatarUrl.value);

    } else {
      console.warn('头像信息为空');
    }
  } catch (err) {
    console.error('获取头像失败', err);
  }
};


// 生命周期挂载时调用
onMounted(() => {
  fetchUserAvatar();
});
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.profile-header {
  background-color: var(--header-bg);
  padding: 1rem 0;
  box-shadow: 0 2px 4px var(--shadow-color);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-header h1 {
  font-size: 1.5rem;
  margin: 0;
}

.theme-toggle {
  background-color: var(--button-bg);
  color: var(--button-text-color);
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  filter: brightness(0.9);
}

.profile-main {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  width: 100%;
}

.profile-card {
  background-color: var(--card-bg);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px var(--shadow-color);
  margin-bottom: 30px;
}

.profile-banner {
  height: 150px;
  background: linear-gradient(135deg, #4CAF50, #2196F3);
  position: relative;
}

.profile-info {
  padding: 0 20px 20px;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.avatar-container {
  position: relative;
  margin-top: -50px;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid var(--card-bg);
  object-fit: cover;
  background-color: var(--bg-color);
}

.edit-avatar-btn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: var(--button-bg);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
}

.user-details {
  flex: 1;
  min-width: 200px;
}

.username {
  margin: 10px 0 5px;
  font-size: 1.5rem;
}

.user-bio {
  margin: 0 0 15px;
  color: var(--text-color);
  opacity: 0.8;
}

.user-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 1.2rem;
  font-weight: bold;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-color);
  opacity: 0.7;
}

.edit-profile-btn {
  align-self: flex-start;
  background-color: transparent;
  color: var(--button-bg);
  border: 1px solid var(--button-bg);
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  margin-left: auto;
}

.edit-profile-btn:hover {
  background-color: var(--button-bg);
  color: var(--button-text-color);
}

.details-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.detail-card {
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.detail-title {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.2rem;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
}

.detail-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.detail-item {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-color);
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  width: 100px;
  color: var(--text-color);
  opacity: 0.7;
}

.detail-value {
  flex: 1;
}

.preference-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.tag {
  background-color: var(--hover-bg);
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
}

.preference-chart {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chart-bar {
  height: 30px;
  display: flex;
  align-items: center;
  position: relative;
}

.chart-bar::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: var(--width);
  background-color: var(--color);
  border-radius: 15px;
  opacity: 0.7;
}

.chart-bar span {
  position: relative;
  z-index: 1;
  padding-left: 10px;
  color: white;
  font-size: 0.9rem;
}

.activity-section {
  margin-bottom: 30px;
}

.section-title {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.2rem;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
}

.activity-list {
  background-color: var(--card-bg);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.activity-item {
  display: flex;
  padding: 15px 20px;
  border-bottom: 1px solid var(--border-color);
  align-items: center;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  font-size: 1.2rem;
  margin-right: 15px;
  width: 30px;
  text-align: center;
}

.activity-content {
  flex: 1;
}

.activity-content p {
  margin: 0 0 5px;
}

.highlight {
  color: var(--link-color);
  font-weight: 500;
}

.activity-time {
  font-size: 0.8rem;
  color: var(--text-color);
  opacity: 0.6;
}

.playlists-section {
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.view-all-btn {
  background: none;
  border: none;
  color: var(--link-color);
  cursor: pointer;
  font-size: 0.9rem;
  padding: 5px 10px;
}

.playlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.playlist-card {
  background-color: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px var(--shadow-color);
  transition: transform 0.3s ease;
}

.playlist-card:hover {
  transform: translateY(-5px);
}

.playlist-cover {
  height: 0;
  padding-bottom: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
}

.play-count {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 5px 10px;
  font-size: 0.8rem;
  text-align: right;
}

.playlist-info {
  padding: 15px;
}

.playlist-title {
  margin: 0 0 5px;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.playlist-count {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-color);
  opacity: 0.7;
}

.profile-footer {
  background-color: var(--footer-bg);
  padding: 20px;
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-color);
  opacity: 0.7;
}

@media (min-width: 768px) {
  .details-section {
    grid-template-columns: 1fr 1fr;
  }

  .profile-banner {
    height: 200px;
  }

  .profile-avatar {
    width: 120px;
    height: 120px;
  }
}

@media (min-width: 992px) {
  .profile-info {
    flex-wrap: nowrap;
  }

  .playlist-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>