<!-- src/components/personal/LogoutButton.vue -->
<template>
  <div class="logout-section">
    <button class="logout-btn" @click="handleLogout">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      退出登录
    </button>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { logout } from '@/api/user'

const router = useRouter()
const emit = defineEmits<{
  (e: 'logout'): void
}>()

const handleLogout = () => {
  ElMessageBox.confirm(
    '确定要退出登录吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      await logout()
    } catch (error) {
      console.error('退出登录请求失败:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      ElMessage.success('已退出登录')
      router.push('/')
      emit('logout')
    }
  }).catch(() => {})
}
</script>

<style scoped>
.logout-section {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
  text-align: center;
}

.logout-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 32px;
  background: white;
  border: 1px solid #dc2626;
  border-radius: 12px;
  color: #dc2626;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: #dc2626;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}
</style>