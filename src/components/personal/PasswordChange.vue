<!-- src/components/personal/PasswordChange.vue -->
<template>
  <div class="info-section">
    <label class="section-label">修改密码</label>
    <div class="password-form">
      <input 
        v-model="form.oldPassword" 
        type="password" 
        class="password-input"
        placeholder="当前密码"
      />
      <input 
        v-model="form.newPassword" 
        type="password" 
        class="password-input"
        placeholder="新密码"
      />
      <input 
        v-model="form.confirmPassword" 
        type="password" 
        class="password-input"
        placeholder="确认新密码"
      />
      <div class="btn-wrapper">
        <button class="save-btn" @click="handleChange">修改密码</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { PasswordForm } from './types'

const emit = defineEmits<{
  (e: 'change-password', form: PasswordForm): void
}>()

const form = reactive<PasswordForm>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const handleChange = () => {
  if (!form.oldPassword) {
    ElMessage.warning('请输入当前密码')
    return
  }
  if (!form.newPassword) {
    ElMessage.warning('请输入新密码')
    return
  }
  if (form.newPassword.length < 6) {
    ElMessage.warning('新密码长度不能少于6位')
    return
  }
  if (form.newPassword !== form.confirmPassword) {
    ElMessage.warning('两次输入的新密码不一致')
    return
  }
  
  emit('change-password', { ...form })
  ElMessage.success('密码修改成功')
  
  form.oldPassword = ''
  form.newPassword = ''
  form.confirmPassword = ''
}
</script>

<style scoped>
.info-section {
  margin-bottom: 28px;
}

.section-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.password-input {
  padding: 12px 16px;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.2s;
  outline: none;
}

.password-input:focus {
  border-color: #7e66ea;
  box-shadow: 0 0 0 2px rgba(126, 102, 234, 0.1);
}

.btn-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 4px;
}

.save-btn {
  padding: 8px 24px;
  background: linear-gradient(135deg, #dc2626 0%, #7e66ea 100%);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  width: auto;
  min-width: 100px;
}

.save-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}
</style>