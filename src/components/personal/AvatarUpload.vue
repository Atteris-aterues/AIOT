<!-- src/components/personal/AvatarUpload.vue -->
<template>
  <div class="avatar-section">
    <div class="avatar-container">
      <img 
        :src="avatarUrl || defaultAvatar" 
        alt="头像" 
        class="avatar-image"
      />
      <div class="avatar-overlay" @click="triggerUpload">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      </div>
    </div>
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      class="hidden-input"
      @change="handleFileChange"
    />
    <p class="avatar-hint">支持 JPG、PNG 格式，大小不超过 5MB</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  avatarUrl?: string
}>()

const emit = defineEmits<{
  (e: 'update:avatar', url: string): void
}>()

const defaultAvatar = 'https://placehold.co/120x120/7e66ea/ffffff?text=User'
const fileInputRef = ref<HTMLInputElement | null>(null)

const triggerUpload = () => {
  fileInputRef.value?.click()
}

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  
  if (!file) return
  
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请上传图片文件')
    return
  }
  
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过 5MB')
    return
  }
  
  const reader = new FileReader()
  reader.onload = (e) => {
    const newAvatar = e.target?.result as string
    emit('update:avatar', newAvatar)
    ElMessage.success('头像上传成功')
  }
  reader.readAsDataURL(file)
  
  input.value = ''
}
</script>

<style scoped>
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.avatar-container {
  position: relative;
  width: 120px;
  height: 120px;
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s;
  color: white;
  font-size: 12px;
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.avatar-hint {
  margin-top: 12px;
  font-size: 12px;
  color: #999;
}

.hidden-input {
  display: none;
}
</style>