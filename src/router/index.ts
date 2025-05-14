import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '../views/MainPage/MainPage.vue'
import Login from '../views/Login/Login.vue'
import Register from '../views/Register/Register.vue'


const routes = [
  {
    path: '/',
    name: 'MainPage',
    component: MainPage,
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/Register',
    name: 'Register',
    component: Register,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router

