// stores/player.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  // 播放器状态
  const isPlaying = ref(false)
  const isExpanded = ref(false)
  const isLiked = ref(false)
  const isMuted = ref(false)
  const isFullscreen = ref(false)
  const progress = ref(0)
  const volume = ref(70)
  const currentTime = ref('0:00')
  const duration = ref('3:45')

  // 当前播放曲目
  const currentTrack = ref({
    id: 1,
    name: '歌曲名称',
    artist: '歌手名称',
    album: '专辑名称',
    cover: 'https://picsum.photos/150/150?artist1',
    duration: 225 // 秒
  })

  // 当前歌词
  const currentLyric = ref('这是当前播放的歌词内容...')

  // 计算属性
  const progressStyle = computed(() => {
    return { width: progress.value + '%' }
  })

  // 操作方法
  const togglePlay = () => {
    isPlaying.value = !isPlaying.value
  }

  const toggleLike = () => {
    isLiked.value = !isLiked.value
  }

  const toggleMute = () => {
    isMuted.value = !isMuted.value
  }

  const toggleExpanded = () => {
    isExpanded.value = !isExpanded.value
  }

  const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value
  }

  const previousTrack = () => {
    console.log('上一首')
  }

  const nextTrack = () => {
    console.log('下一首')
  }

  const changeVolume = (value: number) => {
    volume.value = value
  }

  const seekTrack = (percentage: number) => {
    progress.value = Math.min(Math.max(0, percentage * 100), 100)
    // 更新当前时间显示
    const minutes = Math.floor((progress.value / 100) * currentTrack.value.duration / 60)
    const seconds = Math.floor((progress.value / 100) * currentTrack.value.duration % 60)
    currentTime.value = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`
  }

  // 模拟播放进度更新
  const startProgressSimulation = () => {
    return setInterval(() => {
      if (isPlaying.value && progress.value < 100) {
        progress.value += (100 / currentTrack.value.duration) * 0.1
        const minutes = Math.floor((progress.value / 100) * currentTrack.value.duration / 60)
        const seconds = Math.floor((progress.value / 100) * currentTrack.value.duration % 60)
        currentTime.value = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`
      }
    }, 100)
  }

  return {
    // 状态
    isPlaying,
    isExpanded,
    isLiked,
    isMuted,
    isFullscreen,
    progress,
    volume,
    currentTime,
    duration,
    currentTrack,
    currentLyric,

    // 计算属性
    progressStyle,

    // 方法
    togglePlay,
    toggleLike,
    toggleMute,
    toggleExpanded,
    toggleFullscreen,
    previousTrack,
    nextTrack,
    changeVolume,
    seekTrack,
    startProgressSimulation
  }
})