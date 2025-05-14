<template>
  <div class="auth-page" :class="theme">
    <div class="auth-container">
      <div class="auth-card">
        <h1 class="auth-title">注册 MusicHub</h1>

        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="form-group">
            <label for="register-username">用户名</label>
            <input id="register-username" type="text" v-model="registerForm.username" placeholder="请输入您的用户名" required>
            <span class="error-message" v-if="registerErrors.username">{{ registerErrors.username }}</span>
          </div>

          <div class="form-group">
            <label for="register-email">电子邮箱</label>
            <input id="register-email" type="email" v-model="registerForm.email" placeholder="请输入您的邮箱" required>
            <span class="error-message" v-if="registerErrors.email">{{ registerErrors.email }}</span>
          </div>

          <div class="form-group">
            <label for="register-password">密码</label>
            <div class="password-input">
              <input id="register-password" :type="showRegisterPassword ? 'text' : 'password'"
                v-model="registerForm.password" placeholder="请输入至少6位密码" required>
              <button type="button" class="toggle-password" @click="showRegisterPassword = !showRegisterPassword">
                <i :class="showRegisterPassword ? 'icon-eye-off' : 'icon-eye'"></i>
              </button>
            </div>
            <span class="error-message" v-if="registerErrors.password">{{ registerErrors.password }}</span>
          </div>

          <div class="form-group">
            <label for="register-confirm-password">确认密码</label>
            <div class="password-input">
              <input id="register-confirm-password" :type="showConfirmPassword ? 'text' : 'password'"
                v-model="registerForm.confirmPassword" placeholder="请再次输入密码" required>
              <button type="button" class="toggle-password" @click="showConfirmPassword = !showConfirmPassword">
                <i :class="showConfirmPassword ? 'icon-eye-off' : 'icon-eye'"></i>
              </button>
            </div>
            <span class="error-message" v-if="registerErrors.confirmPassword">{{ registerErrors.confirmPassword
            }}</span>
          </div>

          <div class="form-checkbox">
            <label class="agree-terms">
              <input type="checkbox" v-model="registerForm.agreeTerms" required>
              <span>我已阅读并同意 <router-link to="/terms" class="terms-link">服务条款</router-link> 和 <router-link to="/privacy"
                  class="terms-link">隐私政策</router-link></span>
            </label>
            <span class="error-message" v-if="registerErrors.agreeTerms">{{ registerErrors.agreeTerms }}</span>
          </div>

          <button type="submit" class="auth-button" :disabled="registerLoading">
            <span v-if="!registerLoading">注册</span>
            <span v-else class="loading">注册中...</span>
          </button>
        </form>

        <div class="auth-divider">
          <span>或</span>
        </div>

        <div class="social-login">
          <button class="social-button google">
            <i class="icon-google"></i> 使用 Google 注册
          </button>
          <button class="social-button wechat">
            <i class="icon-wechat"></i> 使用微信注册
          </button>
        </div>

        <div class="auth-footer">
          已有账号? <router-link to="/login" class="auth-link">立即登录</router-link>
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

const router = useRouter()

const themeContext = inject(ThemeSymbol)
if (!themeContext) {
  throw new Error('Theme context not provided')
}
const { theme, toggleTheme } = themeContext

const registerForm = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

const registerErrors = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: ''
})

const showRegisterPassword = ref(false)
const showConfirmPassword = ref(false)
const registerLoading = ref(false)

const validateRegisterForm = () => {
  let isValid = true
  registerErrors.value = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: ''
  }

  // 验证用户名
  if (!registerForm.value.username) {
    registerErrors.value.username = '请输入用户名'
    isValid = false
  } else if (registerForm.value.username.length < 3) {
    registerErrors.value.username = '用户名长度不能少于3个字符'
    isValid = false
  }

  // 验证邮箱
  if (!registerForm.value.email) {
    registerErrors.value.email = '请输入邮箱地址'
    isValid = false
  } else if (!/^\S+@\S+\.\S+$/.test(registerForm.value.email)) {
    registerErrors.value.email = '请输入有效的邮箱地址'
    isValid = false
  }

  // 验证密码
  if (!registerForm.value.password) {
    registerErrors.value.password = '请输入密码'
    isValid = false
  } else if (registerForm.value.password.length < 6) {
    registerErrors.value.password = '密码长度不能少于6个字符'
    isValid = false
  }

  // 验证确认密码
  if (!registerForm.value.confirmPassword) {
    registerErrors.value.confirmPassword = '请再次输入密码'
    isValid = false
  } else if (registerForm.value.password !== registerForm.value.confirmPassword) {
    registerErrors.value.confirmPassword = '两次输入的密码不一致'
    isValid = false
  }

  // 验证服务条款
  if (!registerForm.value.agreeTerms) {
    registerErrors.value.agreeTerms = '请同意服务条款和隐私政策'
    isValid = false
  }

  return isValid
}

const handleRegister = () => {
  if (!validateRegisterForm()) return

  registerLoading.value = true

  // 模拟注册API调用
  setTimeout(() => {
    registerLoading.value = false
    router.push('/login')
  }, 1500)
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
  padding: 3% 10% 3% 10%;
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

.form-checkbox {
  margin: 1.5rem 0;
}

.agree-terms {
  display: flex;
  align-items: flex-start;
  font-size: 0.9rem;
  color: var(--text-color);
  cursor: pointer;
  line-height: 1.4;
}

.agree-terms input {
  margin-right: 0.5rem;
  margin-top: 0.2rem;
}

.terms-link {
  color: var(--link-color);
  text-decoration: none;
}

.terms-link:hover {
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