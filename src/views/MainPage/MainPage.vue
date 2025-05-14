<template>
  <div class="card">
    <p>当前主题：{{ theme }}</p>
    <button @click="toggleTheme">切换主题</button>
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
.card {
  background-color: var(--card-bg);
  color: var(--text-color);
  padding: 1rem;
}
</style>
