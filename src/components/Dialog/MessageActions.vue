<!-- src/components/Dialog/MessageActions.vue -->
<template>
  <div class="message-actions">
    <!-- 复制按钮 -->
    <button class="action-btn" @click="handleCopy" :title="copied ? '复制成功' : '复制'">
      <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </button>
    
    <!-- 编辑按钮（仅用户消息显示） -->
    <button v-if="isUser" class="action-btn" @click="$emit('edit')" title="编辑">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M17 3l4 4-7 7H10v-4l7-7z"></path>
        <path d="M4 20h16"></path>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  isUser: boolean
  content: string
}>()

const emit = defineEmits<{
  (e: 'edit'): void
}>()

const copied = ref(false)

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(props.content)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    alert('复制失败')
  }
}
</script>

<style scoped>
.message-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
  opacity: 0;
  transition: opacity 0.2s;
}

.message-item:hover .message-actions {
  opacity: 1;
}

.action-btn {
  background: transparent;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  color: #666;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: #f0f0f0;
  color: #333;
  border-color: #ccc;
}

/* 复制成功时的样式 */
.action-btn svg {
  transition: all 0.2s;
}
</style>