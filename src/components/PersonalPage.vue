<!-- src/components/PersonalPage.vue -->
<template>
  <div class="personal-page">
    <div class="page-container">
      <h2 class="page-title">个人信息</h2>
      
      <AvatarUpload 
        :avatar-url="avatarUrl" 
        @update:avatar="avatarUrl = $event"
      />
      
      <NicknameEdit 
        :nickname="nickname" 
        @update:nickname="nickname = $event"
      />
      
      <PasswordChange @change-password="handlePasswordChange" />
      
      <LogoutButton @logout="handleLogout" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AvatarUpload from './personal/AvatarUpload.vue'
import NicknameEdit from './personal/NicknameEdit.vue'
import PasswordChange from './personal/PasswordChange.vue'
import LogoutButton from './personal/LogoutButton.vue'
import type { PasswordForm } from './personal/types'

const router = useRouter()
const avatarUrl = ref('https://placehold.co/120x120/7e66ea/ffffff?text=User')
const nickname = ref('')

onMounted(() => {
  // 从 localStorage 获取登录时的用户信息
  const userStr = localStorage.getItem('user')
  if (userStr) {
    try {
      const user = JSON.parse(userStr)
      // 优先使用 nickname，如果没有则使用 username
      nickname.value = user.nickname || user.username || '用户'
      if (user.avatar) {
        avatarUrl.value = user.avatar
      }
    } catch (e) {
      console.error('解析用户信息失败:', e)
    }
  }
})

const handlePasswordChange = (form: PasswordForm) => {
  // 这里调用修改密码接口
  console.log('修改密码:', form)
}

const handleLogout = () => {
  // 清除本地存储的登录信息
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  // 跳转到登录页
  router.push('/')
}
</script>

<style scoped>
.personal-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #fff5f5 0%, #fff 100%);
  padding: 40px 20px;
}

.page-container {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #dc2626;
  margin-bottom: 32px;
  text-align: center;
  position: relative;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #dc2626, #7e66ea);
  border-radius: 2px;
}
</style>