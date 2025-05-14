<template>
  <div class="auth-page" :class="theme">
    <div class="auth-container">
      <div class="auth-card">
        <h1 class="auth-title">登录 MusicHub</h1>

        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label for="login-email">电子邮箱</label>
            <input id="login-email" type="email" v-model="loginForm.email" placeholder="请输入您的邮箱" required>
            <span class="error-message" v-if="loginErrors.email">{{ loginErrors.email }}</span>
          </div>

          <div class="form-group">
            <label for="login-password">密码</label>
            <div class="password-input">
              <input id="login-password" :type="showLoginPassword ? 'text' : 'password'" v-model="loginForm.password"
                placeholder="请输入您的密码" required>
              <button type="button" class="toggle-password" @click="showLoginPassword = !showLoginPassword">
                <i :class="showLoginPassword ? 'icon-eye-off' : 'icon-eye'"></i>
              </button>
            </div>
            <span class="error-message" v-if="loginErrors.password">{{ loginErrors.password }}</span>
          </div>

          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" v-model="loginForm.remember">
              <span>记住我</span>
            </label>
            <router-link to="/forgot-password" class="forgot-password">忘记密码?</router-link>
          </div>

          <button type="submit" class="auth-button" :disabled="loginLoading">
            <span v-if="!loginLoading">登录</span>
            <span v-else class="loading">登录中...</span>
          </button>
        </form>

        <div class="auth-divider">
          <span>或</span>
        </div>

        <div class="social-login">
          <button class="social-button google">
            <i class="icon-google"></i> 使用 Google 登录
          </button>
          <button class="social-button wechat">
            <i class="icon-wechat"></i> 使用微信登录
          </button>
        </div>

        <div class="auth-footer">
          还没有账号? <router-link to="/register" class="auth-link">立即注册</router-link>
        </div>
      </div>

      <!-- <div class="auth-theme-toggle">
        <button @click="toggleTheme" class="theme-button">
          <i :class="theme === 'dark' ? 'icon-sun' : 'icon-moon'"></i>
          {{ theme === 'dark' ? '亮色模式' : '暗色模式' }}
        </button>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { inject } from 'vue'
import { ThemeSymbol } from '../../theme-context'
import { loginApi } from '../../api/authService'
import { ElMessage } from 'element-plus'
import config from '../../api/config.js';
const router = useRouter()

const themeContext = inject(ThemeSymbol)
if (!themeContext) {
  throw new Error('Theme context not provided')
}
const { theme, toggleTheme } = themeContext

const loginForm = ref({
  email: '26689@163.com',
  password: '123456',
  remember: false
})

const loginErrors = ref({
  email: '',
  password: ''
})

const showLoginPassword = ref(false)
const loginLoading = ref(false)

const validateLoginForm = () => {
  let isValid = true
  loginErrors.value = { email: '', password: '' }

  if (!loginForm.value.email) {
    loginErrors.value.email = '请输入邮箱地址'
    isValid = false
  } else if (!/^\S+@\S+\.\S+$/.test(loginForm.value.email)) {
    loginErrors.value.email = '请输入有效的邮箱地址'
    isValid = false
  }

  if (!loginForm.value.password) {
    loginErrors.value.password = '请输入密码'
    isValid = false
  } else if (loginForm.value.password.length < 6) {
    loginErrors.value.password = '密码长度不能少于6个字符'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateLoginForm()) return;

  loginLoading.value = true;

  const email = loginForm.value.email;
  const password = loginForm.value.password;

  try {
    const result = await loginApi(email, password);

    // 人为延迟 1 秒用于加载体验
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (result.success) {
      // 保存 token 和用户信息到 localStorage
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));

      // 保存 API_BASE_URL 到 localStorage（如果你有需要在别处读取）
      localStorage.setItem('API_BASE_URL', config.API_BASE_URL);

      ElMessage.success(result.message || '登录成功');
      router.push('/');
    } else {
      ElMessage.error(result.message || '登录失败');
    }

  } catch (err) {
    ElMessage.error('登录出错，请稍后再试');
    console.error(err);
  } finally {
    loginLoading.value = false;
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
  /* padding: 2rem; */
}

.auth-container {
  position: relative;
  width: 100%;
  max-width: 420px;
}

.auth-card {
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 10px 25px var(--shadow-color);
}

.auth-title {
  margin: 0 0 2rem 0;
  font-size: 1.8rem;
  text-align: center;
  color: var(--text-color);
}

.auth-form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-color);
}

.form-group input {
  width: 80%;
  padding: 10%;
  padding: 5% 10% 5% 10%;
  border: 1px solid var(--input-border);
  border-radius: 8px;
  background-color: var(--input-bg);
  color: var(--input-text);
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--button-bg);
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-color);
  opacity: 0.6;
  cursor: pointer;
  padding: 0.2rem;
}

.toggle-password:hover {
  opacity: 1;
}

.error-message {
  display: block;
  margin-top: 0.3rem;
  font-size: 0.8rem;
  color: var(--error-color);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.5rem 0;
}

.remember-me {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: var(--text-color);
  cursor: pointer;
}

.remember-me input {
  margin-right: 0.5rem;
}

.forgot-password {
  font-size: 0.9rem;
  color: var(--link-color);
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.auth-button {
  width: 100%;
  padding: 1rem;
  background-color: var(--button-bg);
  color: var(--button-text-color);
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.auth-button:hover {
  background-color: var(--button-bg);
  opacity: 0.9;
}

.auth-button:disabled {
  background-color: var(--border-color);
  cursor: not-allowed;
}

.loading {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.loading::after {
  content: "";
  display: inline-block;
  width: 1rem;
  height: 1rem;
  margin-left: 0.5rem;
  border: 2px solid var(--button-text-color);
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.auth-divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: var(--text-color);
  opacity: 0.7;
  font-size: 0.9rem;
}

.auth-divider::before,
.auth-divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background-color: var(--border-color);
  margin: 0 0.5rem;
}

.social-login {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
}

.social-button {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: transparent;
  color: var(--text-color);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.social-button:hover {
  background-color: var(--hover-bg);
}

.social-button.google {
  color: #DB4437;
}

.social-button.wechat {
  color: #07C160;
}

.auth-footer {
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-color);
}

.auth-link {
  color: var(--link-color);
  text-decoration: none;
  font-weight: 500;
}

.auth-link:hover {
  text-decoration: underline;
}

.auth-theme-toggle {
  position: absolute;
  top: -3.5rem;
  right: 0;
}

.theme-button {
  background-color: var(--card-bg);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.theme-button:hover {
  background-color: var(--hover-bg);
}

/* 图标样式 */
[class^="icon-"]::before,
[class*=" icon-"]::before {
  font-family: 'Material Icons';
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  display: inline-block;
}

.icon-eye::before {
  content: "👁️";
}

.icon-eye-off::before {
  content: "👁️‍🗨️";
}

.icon-sun::before {
  content: "☀️";
}

.icon-moon::before {
  content: "🌙";
}

.icon-google::before {
  content: "G";
  font-weight: bold;
}

.icon-wechat::before {
  content: "微";
}
</style>