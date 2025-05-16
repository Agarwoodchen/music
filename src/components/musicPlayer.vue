<template>
  <div class="player-bar" :class="theme">
    <div class="player-container">
      <!-- 当前播放信息 -->
      <div class="now-playing">
        <div class="track-cover" @click="player.toggleExpanded">
          <img :src="player.currentTrack.cover" :alt="player.currentTrack.name" class="cover-image">
          <div class="cover-overlay" v-if="player.isPlaying">
            <div class="equalizer">
              <span class="bar"></span>
              <span class="bar"></span>
              <span class="bar"></span>
            </div>
          </div>
        </div>
        <div class="track-info">
          <div class="track-title">{{ player.currentTrack.name }}</div>
          <div class="track-artist">{{ player.currentTrack.artist }}</div>
        </div>
        <button class="like-btn" @click="player.toggleLike" :class="{ liked: player.isLiked }">
          <i class="icon-heart"></i>
        </button>
      </div>

      <!-- 播放控制 -->
      <div class="player-controls">
        <div class="control-buttons">
          <button class="control-btn" @click="player.previousTrack">
            <i class="icon-previous"></i>
          </button>
          <button class="play-btn" @click="player.togglePlay">
            <i :class="player.isPlaying ? 'icon-pause' : 'icon-play'"></i>
          </button>
          <button class="control-btn" @click="player.nextTrack">
            <i class="icon-next"></i>
          </button>
        </div>
        <div class="progress-container">
          <div class="progress-time">{{ player.currentTime }}</div>
          <div class="progress-bar" @click="handleSeek">
            <div class="progress-track" ref="progressTrack">
              <div class="progress-fill" :style="player.progressStyle"></div>
              <div class="progress-thumb" :style="{ left: player.progress + '%' }"></div>
            </div>
          </div>
          <div class="progress-time">{{ player.duration }}</div>
        </div>
      </div>

      <!-- 右侧控制 -->
      <div class="player-actions">
        <button class="action-btn" @click="player.toggleMute">
          <i :class="player.isMuted ? 'icon-volume-mute' : 'icon-volume'"></i>
        </button>
        <div class="volume-control" v-show="!player.isMuted">
          <input type="range" min="0" max="100" :value="player.volume" @input="handleVolumeChange"
            class="volume-slider">
        </div>
        <button class="action-btn" @click="togglePlaylist">
          <i class="icon-playlist"></i>
        </button>
        <button class="action-btn" @click="handleFullscreen">
          <i :class="player.isFullscreen ? 'icon-fullscreen-exit' : 'icon-fullscreen'"></i>
        </button>
      </div>

      <!-- 扩展的播放器视图 -->
      <transition name="slide-up">
        <div class="expanded-player" v-if="player.isExpanded">
          <div class="expanded-content">
            <div class="expanded-cover">
              <img :src="player.currentTrack.cover" :alt="player.currentTrack.name" class="cover-image-large">
              <div class="vinyl" :class="{ rotating: player.isPlaying }"></div>
            </div>
            <div class="expanded-info">
              <h3 class="expanded-title">{{ player.currentTrack.name }}</h3>
              <p class="expanded-artist">{{ player.currentTrack.artist }}</p>
              <p class="expanded-album">{{ player.currentTrack.album }}</p>
              <div class="expanded-lyrics">
                <p>{{ player.currentLyric }}</p>
              </div>
            </div>
          </div>
          <button class="close-expanded" @click="player.toggleExpanded">
            <i class="icon-close"></i>
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { usePlayerStore } from '../stores/usePlayerStore.ts'
import { inject } from 'vue'
import { ThemeSymbol } from '../theme-context'
import router from '../router'

const player = usePlayerStore()

const themeContext = inject(ThemeSymbol)
if (!themeContext) {
  throw new Error('Theme context not provided')
}
const { theme, toggleTheme } = themeContext

// 处理音量变化
const handleVolumeChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  player.changeVolume(parseInt(target.value))
}

// 处理进度条点击
const handleSeek = (e: MouseEvent) => {
  const progressTrack = e.currentTarget as HTMLElement
  const rect = progressTrack.getBoundingClientRect()
  const seekPosition = (e.clientX - rect.left) / rect.width
  player.seekTrack(seekPosition)
}

// 处理全屏/路由跳转
const handleFullscreen = () => {
  player.toggleFullscreen()
  router.push('/PlayMusci')
}

// 播放列表逻辑
const togglePlaylist = () => {
  console.log('显示播放列表')
}

// 模拟播放进度
// let progressInterval: number
let progressInterval
onMounted(() => {
  progressInterval = player.startProgressSimulation()
})

onUnmounted(() => {
  clearInterval(progressInterval)
})
</script>

<!-- 保留原有的样式部分 -->
<style scoped>
/* ... 原有的样式保持不变 ... */
</style>
<style scoped>
.player-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background-color: var(--card-bg);
  border-top: 1px solid var(--border-color);
  box-shadow: 0 -2px 10px var(--shadow-color);
  z-index: 100;
  transition: all 0.3s ease;
}

.player-container {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  position: relative;
}

/* 当前播放信息 */
.now-playing {
  display: flex;
  align-items: center;
  gap: 15px;
  width: 25%;
  min-width: 250px;
}

.track-cover {
  width: 56px;
  height: 56px;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.equalizer {
  display: flex;
  align-items: flex-end;
  height: 20px;
  gap: 3px;
}

.equalizer .bar {
  display: inline-block;
  width: 3px;
  background-color: white;
  animation: equalize 1.5s infinite ease-in-out;
}

.equalizer .bar:nth-child(1) {
  height: 60%;
  animation-delay: 0.1s;
}

.equalizer .bar:nth-child(2) {
  height: 80%;
  animation-delay: 0.3s;
}

.equalizer .bar:nth-child(3) {
  height: 40%;
  animation-delay: 0.5s;
}

@keyframes equalize {

  0%,
  100% {
    height: 40%;
  }

  50% {
    height: 80%;
  }
}

.track-info {
  flex: 1;
  min-width: 0;
}

.track-title {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}

.track-artist {
  font-size: 0.8rem;
  color: var(--text-color);
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.like-btn {
  background: none;
  border: none;
  color: var(--text-color);
  opacity: 0.7;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.like-btn:hover {
  opacity: 1;
  background-color: var(--hover-bg);
}

.like-btn.liked {
  color: var(--error-color);
  opacity: 1;
}

/* 播放控制 */
.player-controls {
  flex: 1;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.control-buttons {
  display: flex;
  align-items: center;
  gap: 20px;
}

.control-btn {
  background: none;
  border: none;
  color: var(--text-color);
  opacity: 0.8;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-btn:hover {
  opacity: 1;
  background-color: var(--hover-bg);
}

.play-btn {
  background-color: var(--button-bg);
  color: var(--button-text-color);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.play-btn:hover {
  transform: scale(1.1);
}

.progress-container {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-time {
  font-size: 0.75rem;
  color: var(--text-color);
  opacity: 0.7;
  min-width: 40px;
}

.progress-bar {
  flex: 1;
  height: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.progress-track {
  width: 100%;
  height: 4px;
  background-color: var(--border-color);
  border-radius: 2px;
  position: relative;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: var(--button-bg);
  border-radius: 2px;
  transition: width 0.1s linear;
}

.progress-thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background-color: var(--button-bg);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.progress-bar:hover .progress-thumb {
  opacity: 1;
}

/* 右侧控制 */
.player-actions {
  display: flex;
  align-items: center;
  gap: 15px;
  width: 25%;
  min-width: 200px;
  justify-content: flex-end;
}

.action-btn {
  background: none;
  border: none;
  color: var(--text-color);
  opacity: 0.8;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  opacity: 1;
  background-color: var(--hover-bg);
}

.volume-control {
  width: 100px;
}

.volume-slider {
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  background-color: var(--border-color);
  border-radius: 2px;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.volume-slider:hover {
  opacity: 1;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background-color: var(--button-bg);
  border-radius: 50%;
  cursor: pointer;
}

/* 扩展的播放器视图 */
.expanded-player {
  position: fixed;
  bottom: 80px;
  left: 0;
  right: 0;
  height: 300px;
  background-color: var(--card-bg);
  border-top: 1px solid var(--border-color);
  box-shadow: 0 -5px 15px var(--shadow-color);
  padding: 20px;
  z-index: 99;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.expanded-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 40px;
  height: 100%;
}

.expanded-cover {
  width: 260px;
  height: 260px;
  position: relative;
  flex-shrink: 0;
}

.cover-image-large {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 20px var(--shadow-color);
}

.vinyl {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, #333 30%, #111 70%, #000 100%);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0.9);
  z-index: -1;
  opacity: 0.8;
}

.vinyl::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 30px;
  height: 30px;
  background-color: var(--button-bg);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.rotating {
  animation: rotate 10s linear infinite;
}

@keyframes rotate {
  from {
    transform: translate(-50%, -50%) scale(0.9) rotate(0deg);
  }

  to {
    transform: translate(-50%, -50%) scale(0.9) rotate(360deg);
  }
}

.expanded-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.expanded-title {
  font-size: 1.8rem;
  margin: 0 0 10px;
}

.expanded-artist {
  font-size: 1.2rem;
  color: var(--text-color);
  opacity: 0.9;
  margin: 0 0 5px;
}

.expanded-album {
  font-size: 1rem;
  color: var(--text-color);
  opacity: 0.7;
  margin: 0 0 20px;
}

.expanded-lyrics {
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
}

.expanded-lyrics p {
  font-size: 1.1rem;
  line-height: 1.8;
  margin: 0;
  color: var(--text-color);
  opacity: 0.9;
}

.close-expanded {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: var(--text-color);
  opacity: 0.7;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-expanded:hover {
  opacity: 1;
  background-color: var(--hover-bg);
}

/* 图标样式 */
[class^="icon-"] {
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  display: inline-block;
}

.icon-heart::before {
  content: "❤";
}

.icon-previous::before {
  content: "⏮";
}

.icon-play::before {
  content: "▶";
}

.icon-pause::before {
  content: "⏸";
}

.icon-next::before {
  content: "⏭";
}

.icon-volume::before {
  content: "🔊";
}

.icon-volume-mute::before {
  content: "🔇";
}

.icon-playlist::before {
  content: "⋮";
}

.icon-fullscreen::before {
  content: "⛶";
}

.icon-fullscreen-exit::before {
  content: "⛶";
}

.icon-close::before {
  content: "✕";
}

/* 响应式设计 */
@media (max-width: 768px) {
  .player-container {
    padding: 0 10px;
  }

  .now-playing {
    min-width: auto;
    width: auto;
  }

  .track-info {
    display: none;
  }

  .player-actions {
    min-width: auto;
    width: auto;
  }

  .volume-control {
    display: none;
  }

  .expanded-content {
    flex-direction: column;
    gap: 20px;
    height: auto;
    max-height: calc(100% - 40px);
  }

  .expanded-cover {
    width: 180px;
    height: 180px;
    margin: 0 auto;
  }

  .expanded-title {
    font-size: 1.4rem;
  }

  .expanded-artist {
    font-size: 1rem;
  }
}
</style>