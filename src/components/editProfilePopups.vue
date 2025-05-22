<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="edit-profile-modal card">
      <div class="modal-header">
        <h2>编辑个人信息</h2>
        <button class="close-btn" @click="closeModal">&times;</button>
      </div>

      <div class="modal-content">
        <div class="avatar-section">
          <div class="avatar-preview">
            <img :src="form.avatar_url || 'https://via.placeholder.com/150'" alt="用户头像" class="avatar">
            <button class="change-avatar-btn" @click="triggerAvatarUpload">更换头像</button>
            <input type="file" ref="avatarInput" accept="image/*" style="display: none" @change="handleAvatarChange">
          </div>
        </div>

        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="username">用户名</label>
            <input type="text" id="username" v-model="form.username" disabled class="disabled-input">
          </div>

          <div class="form-group">
            <label for="nickname">昵称</label>
            <input type="text" id="nickname" v-model="form.nickname" placeholder="请输入昵称">
          </div>

          <div class="form-group">
            <label for="full_name">真实姓名</label>
            <input type="text" id="full_name" v-model="form.full_name" placeholder="请输入真实姓名">
          </div>

          <div class="form-group">
            <label for="email">电子邮箱</label>
            <input type="email" id="email" v-model="form.email" placeholder="请输入电子邮箱">
          </div>

          <div class="form-group">
            <label>性别</label>
            <div class="radio-group">
              <label>
                <input type="radio" v-model="form.gender" value="male"> 男
              </label>
              <label>
                <input type="radio" v-model="form.gender" value="female"> 女
              </label>
              <label>
                <input type="radio" v-model="form.gender" value="other"> 其他
              </label>
            </div>
          </div>

          <div class="form-group">
            <label for="birthdate">出生日期</label>
            <input type="date" id="birthdate" v-model="form.birthdate">
          </div>

          <div class="form-group">
            <label for="phone_number">手机号码</label>
            <input type="tel" id="phone_number" v-model="form.phone_number" placeholder="请输入手机号码">
          </div>

          <div class="form-group">
            <label for="address">地址</label>
            <input type="text" id="address" v-model="form.address" placeholder="请输入地址">
          </div>

          <div class="form-group">
            <label for="bio">个人简介</label>
            <textarea id="bio" v-model="form.bio" placeholder="介绍一下你自己..." rows="3"></textarea>
          </div>

          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="closeModal">取消</button>
            <button type="submit" class="submit-btn">保存更改</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { inject } from 'vue'
import { ThemeSymbol } from '../theme-context'
import { uploadUserAvatarApi } from '../api/test.ts' // 根据你实际路径调整
import { useApiStore } from '../stores/userApiUrl.ts'
const apiStore = useApiStore()
const apiBaseUrl = apiStore.apiBaseUrl
const themeContext = inject(ThemeSymbol)
if (!themeContext) {
  throw new Error('Theme context not provided')
}
const { theme } = themeContext

const props = defineProps({
  userData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'save'])

const avatarInput = ref(null)

const form = ref({
  username: '',
  nickname: '',
  full_name: '',
  email: '',
  gender: null,
  birthdate: '',
  phone_number: '',
  address: '',
  bio: '',
  avatar_url: ''
})

onMounted(() => {
  // 初始化表单数据
  form.value = {
    username: props.userData.username,
    nickname: props.userData.nickname || '',
    full_name: props.userData.full_name || '',
    email: props.userData.email || '',
    gender: props.userData.gender || null,
    birthdate: props.userData.birthdate || '',
    phone_number: props.userData.phone_number || '',
    address: props.userData.address || '',
    bio: props.userData.bio || '',
    avatar_url: props.userData.avatar_url || '',
    user_id: props.userData.user_id
  }
})

function closeModal() {
  emit('close')
}

function submitForm() {
  emit('save', form.value)
}

function triggerAvatarUpload() {
  avatarInput.value.click()
}



function handleAvatarChange(event) {
  const file = event.target.files[0]
  if (!file) return

  // 本地预览
  const reader = new FileReader()
  reader.onload = (e) => {
    form.value.avatar_url = e.target.result // 本地预览地址（base64）
  }
  reader.readAsDataURL(file)

  // 上传文件到服务器
  uploadUserAvatarApi(file, form.value.user_id).then(response => {
    if (response.success) {
      form.value.avatar_url = apiBaseUrl + response.data.avatarUrl // 用服务器返回的 URL 替换本地预览
      console.log('上传成功:', response.data.avatarUrl)
    } else {
      console.error('上传失败:', response.message)
    }
  })
}

</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.edit-profile-modal {
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.5rem;
  position: relative;
  box-shadow: 0 10px 25px var(--shadow-color);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-color);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-color);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.close-btn:hover {
  background-color: var(--hover-bg);
}

.avatar-section {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.avatar-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--border-color);
}

.change-avatar-btn {
  background-color: transparent;
  color: var(--link-color);
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
}

.change-avatar-btn:hover {
  text-decoration: underline;
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

.form-group input,
.form-group textarea {
  width: 96%;
  padding: 0.7rem 2%;
  border: 1px solid var(--input-border);
  border-radius: 4px;
  background-color: var(--input-bg);
  color: var(--input-text);
  font-size: 1rem;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.disabled-input {
  background-color: var(--card-bg) !important;
  cursor: not-allowed;
  opacity: 0.7;
}

.radio-group {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: normal;
  cursor: pointer;
}

.radio-group input[type="radio"] {
  width: auto;
  margin: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-btn {
  background-color: var(--card-bg);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.cancel-btn:hover {
  background-color: var(--hover-bg);
}

.submit-btn {
  background-color: var(--button-bg);
  color: var(--button-text-color);
}

.submit-btn:hover {
  background-color: var(--button-bg);
  filter: brightness(0.9);
}

/* 暗色模式调整 */
html.dark .change-avatar-btn {
  color: var(--link-color);
}

html.dark .disabled-input {
  background-color: var(--input-bg) !important;
}

/* 响应式调整 */
@media (max-width: 480px) {
  .edit-profile-modal {
    width: 95%;
    padding: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions button {
    width: 100%;
  }
}
</style>