<template>
  <PlaylistDetails :playlist-id="playlistId" />
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'
import { ThemeSymbol } from '../../theme-context'
import Header from '../../components/header.vue'
import PlaylistDetails from '../../components/PlaylistDetails.vue'
import { useRoute } from 'vue-router' // 引入 useRoute
const themeContext = inject(ThemeSymbol)

if (!themeContext) {
  throw new Error('Theme context not provided')
}

const { theme, toggleTheme } = themeContext
const route = useRoute() // 获取当前路由对象
const playlistId = route.params.id // 获取路由参数中的 playlistId
</script>

<style scoped></style>