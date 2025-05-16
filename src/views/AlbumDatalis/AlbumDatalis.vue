<template>
  <backComo :backname="'专辑详情'" />
  <AlbumDatalis :albumt-id="albumtId" />
</template>

<script setup>
import { inject, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router' // 引入 useRoute
import { ThemeSymbol } from '../../theme-context'
import { getUserAvatarApi } from '../../api/authService.js'
// import MusicList from '../../components/MusicList.vue'
import AlbumDatalis from '../../components/albumContainer.vue'

import backComo from '../../components/backComo.vue'

const themeContext = inject(ThemeSymbol)

if (!themeContext) {
  throw new Error('Theme context not provided')
}

const { theme, toggleTheme } = themeContext

const route = useRoute() // 获取当前路由对象
const albumtId = route.params.id // 获取路由参数 id

onMounted(() => {
  // console.log(route.params, '11');
  // console.log('当前歌手 ID:', artistId)
  // 可以在这里调用 API 获取歌手详情，例如：
  // fetchArtistDetails(artistId)
})
</script>

<style scoped></style>