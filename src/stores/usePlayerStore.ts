// stores/player.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getDirectSongDetailApi, toggleFavoritesSongApi } from '../api/test.ts'
import { ElMessage } from 'element-plus';
const storedApiUrl = import.meta.env.VITE_API_TEST_URL || '';
const userJson = localStorage.getItem('user');
const user = userJson ? JSON.parse(userJson) : null;


export const usePlayerStore = defineStore('player', () => {
  const isPlaying = ref(false)
  const isExpanded = ref(false)
  const isLiked = ref(false)
  const isMuted = ref(false)
  const isFullscreen = ref(false)
  const progress = ref(0)          // 进度百分比0-100
  const volume = ref(70)           // 0-100
  const currentTime = ref('0:00')
  const duration = ref('0:00')

  interface Track {
    id: number
    name: string
    artist: string
    album: string
    cover: string
    duration: number
    filePath?: string
    is_favorite: boolean

  }
  const currentTrack = ref<Track>({
    id: -1,
    name: '歌曲名称',
    artist: '歌手名称',
    album: '专辑名称',
    cover: 'https://picsum.photos/150/150?artist1',
    duration: 225,
    filePath: '',
    is_favorite: false
  })

  const currentLyric = ref('这是当前播放的歌词内容...')

  const progressStyle = computed(() => {
    return { width: progress.value + '%' }
  })

  // ———— audio对象初始化 ————
  const audio = new Audio()
  audio.volume = volume.value / 100

  // 监听音频进度更新
  audio.ontimeupdate = () => {
    if (audio.duration) {
      progress.value = (audio.currentTime / audio.duration) * 100
      currentTime.value = formatDuration(audio.currentTime)
      duration.value = formatDuration(audio.duration)
    }
  }
  // 播放结束处理
  audio.onended = () => {
    isPlaying.value = false
    // 这里可以自动下一首或其他逻辑
  }

  // 格式化时间
  function formatDuration(seconds: number): string {
    const min = Math.floor(seconds / 60)
    const sec = Math.floor(seconds % 60)
    return `${min}:${sec < 10 ? '0' : ''}${sec}`
  }

  // ———— 方法 ————

  // 播放/暂停
  const togglePlay = () => {
    if (!audio.src) {
      // 若没设置音频，尝试设置当前曲目路径
      if (currentTrack.value.filePath) {
        audio.src = currentTrack.value.filePath
        audio.load()
      } else {
        return
      }
    }
    if (isPlaying.value) {
      audio.pause()
      isPlaying.value = false
    } else {
      audio.play()
      isPlaying.value = true
    }
  }

  // 静音切换
  const toggleMute = () => {
    isMuted.value = !isMuted.value
    audio.muted = isMuted.value
  }

  // 音量变化
  const changeVolume = (value: number) => {
    volume.value = value
    audio.volume = value / 100
    if (audio.volume === 0) isMuted.value = true
    else isMuted.value = false
  }

  // 跳转进度，percentage 是0~1的小数
  const seekTrack = (percentage: number) => {
    if (audio.duration) {
      audio.currentTime = percentage * audio.duration
      progress.value = percentage * 100
    }
  }

  // 切换歌曲（异步获取详情并播放）
  const changeTrack = async (id: number) => {
    const songData = await getSongDetail(id)
    if (songData) {
      // 重置进度
      progress.value = 0
      currentTime.value = '0:00'

      // 设置 audio 源，播放新曲
      if (currentTrack.value.filePath) {
        audio.src = currentTrack.value.filePath
        audio.load()
        audio.play()
        isPlaying.value = true
      }
    } else {
      isPlaying.value = false
    }
  }

  // 获取歌曲详情并更新 currentTrack
  const getSongDetail = async (id: number) => {
    if (!id || typeof id !== 'number' || id <= 0) {
      console.error('无效的歌曲ID:', id)
      return null
    }
    try {
      const response = await getDirectSongDetailApi(id, user.id)
      console.log(response, 'casascascascsacascsa');

      if (!response || !response.success || !response.data || !response.data.song_id) {
        console.error('歌曲数据无效或获取失败', response)
        return null
      }
      const song = response.data
      currentTrack.value = {
        id: song.song_id,
        name: song.song_title_zh || song.song_title || '未知歌曲',
        artist: song.artist_name_zh || song.artist_name || '未知歌手',
        album: song.album_name_zh || song.album_name || `专辑ID: ${song.album_id}`,
        cover: storedApiUrl + song.cover_path || `https://picsum.photos/150/150?random=${song.song_id}`,
        duration: song.duration || 0,
        filePath: storedApiUrl + song.file_path,
        is_favorite: song.is_favorited === 1 ? true : false
      }
      console.log(currentTrack.value);
      isLiked.value = currentTrack.value.is_favorite
      duration.value = formatDuration(currentTrack.value.duration)
      return song
    } catch (error) {
      console.error('获取歌曲详情失败:', error)
      return null
    }
  }

  // 其他简单开关
  const toggleLike = async () => {
    if (currentTrack.value.id === -1) {
      ElMessage.error('请先选择歌曲');
      return;
    }

    try {
      const res = await toggleFavoritesSongApi(user.id, currentTrack.value.id);
      // console.log(res);

      if (res.success) {
        isLiked.value = res.data.favorited; // 根据接口实际返回更新收藏状态

        if (res.data.favorited) {
          ElMessage.success('收藏成功');
        } else {
          ElMessage.success('已取消收藏');
        }
      } else {
        ElMessage.error(res.message || '操作失败');
      }
    } catch (error: any) {
      ElMessage.error(error?.message || '操作失败');
    }
  };

  const toggleExpanded = () => {
    isExpanded.value = !isExpanded.value
  }
  const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value
  }
  const previousTrack = () => {
    console.log('上一首逻辑待实现')
  }
  const nextTrack = () => {
    console.log('下一首逻辑待实现')
  }

  // 返回
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
    startProgressSimulation: () => { },  // 你原来的模拟进度可以不再使用
    changeTrack,
  }
})