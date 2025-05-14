<template>
  <div :class="theme">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, provide, computed, watchEffect } from 'vue'
import { ThemeSymbol, Theme } from '../theme-context'

const theme = ref<Theme>('light')

// 切换主题函数
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

// 设置指定主题
const setTheme = (t: Theme) => {
  theme.value = t
}

// 自动根据本地存储或系统偏好设置主题
if (localStorage.getItem('theme')) {
  theme.value = localStorage.getItem('theme') as Theme
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  theme.value = 'dark'
}

watchEffect(() => {
  // 将主题保存到 localStorage
  localStorage.setItem('theme', theme.value)
  // 根据主题切换类名
  document.documentElement.className = theme.value
})

provide(ThemeSymbol, {
  theme,
  toggleTheme,
  setTheme,
})

const themeClass = computed(() => theme.value)
</script>
