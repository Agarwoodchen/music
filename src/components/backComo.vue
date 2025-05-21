<template>
  <header class="page-header">
    <button class="back-button" @click="goBack">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20"
        height="20" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      返回
    </button>

    <h1 class="page-title">{{ title }}</h1>
  </header>
</template>

<script setup>
import { inject, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router' // 引入 useRoute
import { ThemeSymbol } from '../theme-context'



const themeContext = inject(ThemeSymbol)

if (!themeContext) {
  throw new Error('Theme context not provided')
}

const { theme, toggleTheme } = themeContext

const router = useRouter()


// ✅ 接收 props
const props = defineProps({
  backname: {
    type: String,
    required: false,
    default: '返回'
  }
})
const title = props.backname
console.log(title, 'title');
const goBack = () => {

  router.go(-1) // 返回上一页
}
</script>

<style scoped>
/* 添加顶部导航栏样式 */
.page-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: var(--header-bg);
  border-bottom: 1px solid var(--border-color);
}

.back-button {
  background: none;
  border: none;
  color: var(--link-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
}

.back-button:hover {
  background-color: var(--hover-bg);
}

.page-title {
  margin: 0 auto;
  font-size: 1.2rem;
}
</style>