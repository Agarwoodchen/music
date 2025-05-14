import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus';


import MainPage from '../views/MainPage/MainPage.vue'
import Login from '../views/Login/Login.vue'
import Register from '../views/Register/Register.vue'
import Discover from '../views/Discover/Discover.vue';
import Playlist from '../views/Playlist/Playlist.vue';
import Rank from '../views/Rank/Rank.vue';
import Artists from '../views/Artists/Artists.vue';

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
  {
    path: '/Discover',
    name: 'Discover',
    component: Discover,
  },
  {
    path: '/Playlist',
    name: 'Playlist',
    component: Playlist,
  },
  {
    path: '/Rank',
    name: 'Rank',
    component: Rank,
  },
  {
    path: '/Artists',
    name: 'Artists',
    component: Artists,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})


// 添加前置路由守卫
router.beforeEach((to, from, next) => {
  // 如果目标路由是登录页，则不需要进行验证，直接跳转
  if (to.path === '/login') {
    return next();  // 允许进入登录页
  }

  // 如果没有 token，强制跳转到登录页
  if (!localStorage.getItem('token')) {
    ElMessage.error('请先登录');
    return next('/login');  // 跳转到登录页
  }

  // 允许访问其他页面
  next();
});


export default router

