<template>
  <div class="music-app" :class="theme">
    <div class="app-container">
      <!-- 顶部导航 -->
      <nav class="app-nav">
        <div class="nav-brand">
          <svg class="music-icon" viewBox="0 0 24 24">
            <path fill="currentColor"
              d="M12,3V12.26C11.5,12.09 11,12 10.5,12C8,12 6,14 6,16.5C6,19 8,21 10.5,21C13,21 15,19 15,16.5V6H19V3H12Z" />
          </svg>
          <span>Melody</span>
        </div>
        <div class="nav-actions">
          <button class="theme-toggle" @click="toggleTheme">
            <svg v-if="theme === 'light'" viewBox="0 0 24 24">
              <path fill="currentColor"
                d="M12,18C11.11,18 10.26,17.8 9.5,17.45C11.56,16.5 13,14.42 13,12C13,9.58 11.56,7.5 9.5,6.55C10.26,6.2 11.11,6 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31L23.31,12L20,8.69Z" />
            </svg>
            <svg v-else viewBox="0 0 24 24">
              <path fill="currentColor"
                d="M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,15.31L23.31,12L20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31Z" />
            </svg>
          </button>
          <button class="user-btn">
            <svg viewBox="0 0 24 24">
              <path fill="currentColor"
                d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
            </svg>
          </button>
        </div>
      </nav>

      <!-- 主内容区 -->
      <main class="app-main">
        <!-- 专辑封面区 -->
        <div class="album-art">
          <div class="art-container">
            <img src="https://picsum.photos/300/300?random=11" alt="Album Cover" class="art-image">
            <div class="art-overlay">
              <button class="play-large">
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- 歌曲信息 -->
        <div class="song-info">
          <h1 class="song-title">Midnight City</h1>
          <h2 class="artist-name">M83</h2>

          <div class="song-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: 65%"></div>
              <div class="progress-handle" style="left: 65%"></div>
            </div>
            <div class="time-display">
              <span>2:45</span>
              <span>4:23</span>
            </div>
          </div>
        </div>

        <!-- 播放控制 -->
        <div class="player-controls">
          <button class="control-btn shuffle">
            <svg viewBox="0 0 24 24">
              <path fill="currentColor"
                d="M14.83,13.41L13.42,14.82L16.55,17.95L14.5,20H20V14.5L17.96,16.54L14.83,13.41M14.5,4L16.54,6.04L4,18.59L5.41,20L17.96,7.46L20,9.5V4M10.59,9.17L5.41,4L4,5.41L9.17,10.58L10.59,9.17Z" />
            </svg>
          </button>

          <button class="control-btn prev">
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z" />
            </svg>
          </button>

          <button class="control-btn play">
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
            </svg>
          </button>

          <button class="control-btn next">
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M16,18H18V6H16M6,18L14.5,12L6,6V18Z" />
            </svg>
          </button>

          <button class="control-btn repeat">
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M17,17H7V14L3,18L7,22V19H19V13H17M7,7H17V10L21,6L17,2V5H5V11H7V7Z" />
            </svg>
          </button>
        </div>

        <!-- 音量控制 -->
        <div class="volume-control">
          <svg viewBox="0 0 24 24" class="volume-icon">
            <path fill="currentColor"
              d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
          </svg>
          <div class="volume-bar">
            <div class="volume-fill" style="width: 80%"></div>
            <div class="volume-handle" style="left: 80%"></div>
          </div>
        </div>
      </main>

      <!-- 播放列表 -->
      <aside class="playlist-sidebar">
        <div class="sidebar-header">
          <h3>播放队列</h3>
          <span class="queue-count">4首歌曲</span>
        </div>

        <ul class="song-list">
          <li class="song-item active">
            <div class="item-number">1</div>
            <div class="item-info">
              <div class="item-title">Midnight City</div>
              <div class="item-artist">M83</div>
            </div>
            <div class="item-duration">4:23</div>
            <button class="item-more">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor"
                  d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z" />
              </svg>
            </button>
          </li>

          <li class="song-item">
            <div class="item-number">2</div>
            <div class="item-info">
              <div class="item-title">Blinding Lights</div>
              <div class="item-artist">The Weeknd</div>
            </div>
            <div class="item-duration">3:20</div>
            <button class="item-more">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor"
                  d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z" />
              </svg>
            </button>
          </li>

          <li class="song-item">
            <div class="item-number">3</div>
            <div class="item-info">
              <div class="item-title">Levitating</div>
              <div class="item-artist">Dua Lipa</div>
            </div>
            <div class="item-duration">3:45</div>
            <button class="item-more">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor"
                  d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z" />
              </svg>
            </button>
          </li>

          <li class="song-item">
            <div class="item-number">4</div>
            <div class="item-info">
              <div class="item-title">Save Your Tears</div>
              <div class="item-artist">The Weeknd</div>
            </div>
            <div class="item-duration">3:35</div>
            <button class="item-more">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor"
                  d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z" />
              </svg>
            </button>
          </li>
        </ul>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { ThemeSymbol } from '../../theme-context'

const themeContext = inject(ThemeSymbol)

if (!themeContext) {
  throw new Error('Theme context not provided')
}

const { theme, toggleTheme } = themeContext
</script>

<style scoped>
.music-app {
  --primary-color: var(--button-bg);
  --text-primary: var(--text-color);
  --text-secondary: color-mix(in srgb, var(--text-color) 70%, transparent);
  --bg-primary: var(--bg-color);
  --bg-secondary: var(--card-bg);
  --border-color: var(--border-color);
  --hover-bg: var(--hover-bg);

  background-color: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  transition: all 0.3s ease;
}

.app-container {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas:
    "nav"
    "main"
    "sidebar";
  gap: 20px;
  padding: 20px;
}

.app-nav {
  grid-area: nav;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-color);
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  font-weight: 600;
}

.music-icon {
  width: 28px;
  height: 28px;
}

.nav-actions {
  display: flex;
  gap: 15px;
}

.theme-toggle,
.user-btn {
  background: none;
  border: none;
  color: var(--text-primary);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-toggle:hover,
.user-btn:hover {
  background-color: var(--hover-bg);
}

.theme-toggle svg,
.user-btn svg {
  width: 20px;
  height: 20px;
}

.app-main {
  grid-area: main;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.album-art {
  display: flex;
  justify-content: center;
}

.art-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1/1;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.art-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.art-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.art-container:hover .art-overlay {
  opacity: 1;
}

.art-container:hover .art-image {
  transform: scale(1.05);
}

.play-large {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.play-large:hover {
  transform: scale(1.1);
}

.play-large svg {
  width: 30px;
  height: 30px;
}

.song-info {
  text-align: center;
}

.song-title {
  font-size: 2rem;
  margin-bottom: 5px;
  font-weight: 700;
}

.artist-name {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 25px;
}

.song-progress {
  margin: 25px 0;
}

.progress-bar {
  position: relative;
  height: 4px;
  background-color: color-mix(in srgb, var(--text-primary) 20%, transparent);
  border-radius: 2px;
  margin-bottom: 8px;
  cursor: pointer;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 2px;
}

.progress-handle {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background-color: var(--primary-color);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.progress-bar:hover .progress-handle {
  opacity: 1;
}

.time-display {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.player-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.control-btn {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: none;
  border: none;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background-color: var(--hover-bg);
}

.control-btn svg {
  width: 30px;
  height: 30px;
}

.control-btn.play {
  width: 60px;
  height: 60px;
  background-color: var(--primary-color);
  color: white;
}

.control-btn.play:hover {
  transform: scale(1.05);
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 15px;
  max-width: 300px;
  margin: 0 auto;
}

.volume-icon {
  width: 24px;
  height: 24px;
  color: var(--text-primary);
}

.volume-bar {
  position: relative;
  flex: 1;
  height: 4px;
  background-color: color-mix(in srgb, var(--text-primary) 20%, transparent);
  border-radius: 2px;
  cursor: pointer;
}

.volume-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: var(--text-primary);
  border-radius: 2px;
}

.volume-handle {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background-color: var(--text-primary);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.volume-bar:hover .volume-handle {
  opacity: 1;
}

.playlist-sidebar {
  grid-area: sidebar;
  background-color: var(--bg-secondary);
  border-radius: 12px;
  padding: 20px;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.sidebar-header h3 {
  font-size: 1.2rem;
  font-weight: 600;
}

.queue-count {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.song-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.song-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.song-item:hover {
  background-color: var(--hover-bg);
}

.song-item.active {
  background-color: color-mix(in srgb, var(--primary-color) 15%, transparent);
}

.item-number {
  width: 24px;
  text-align: center;
  margin-right: 15px;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.song-item.active .item-number {
  color: var(--primary-color);
  font-weight: 600;
}

.item-info {
  flex: 1;
  text-align: left;
}

.item-title {
  font-weight: 500;
  margin-bottom: 2px;
}

.item-artist {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.item-duration {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0 15px;
}

.item-more {
  background: none;
  border: none;
  color: var(--text-secondary);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s ease;
}

.song-item:hover .item-more {
  opacity: 1;
}

.item-more:hover {
  background-color: color-mix(in srgb, var(--text-primary) 10%, transparent);
  color: var(--text-primary);
}

.item-more svg {
  width: 18px;
  height: 18px;
}

@media (min-width: 992px) {
  .app-container {
    grid-template-columns: 1fr 300px;
    grid-template-areas:
      "nav nav"
      "main sidebar";
    padding: 30px;
  }
}

@media (min-width: 1200px) {
  .app-container {
    grid-template-columns: 1fr 350px;
  }
}
</style>