// stores/api.ts
import { defineStore } from 'pinia'

export const useApiStore = defineStore('api', () => {
  // 默认使用环境变量中的测试 API 地址
  const apiBaseUrl = import.meta.env.VITE_API_TEST_URL || ''

  return {
    apiBaseUrl,
  }
})
