import { defineStore } from 'pinia'
import { ref, computed } from 'vue'


export const usePlayerStore = defineStore('player', () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''

  return {
    apiBaseUrl,
  }
})
