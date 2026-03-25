<!-- src/components/Dialog/MessageItem.vue -->
<template>
  <div class="message-item" :class="message.type">
    <div class="message-content">
      <div class="message-header">
        <span class="message-role">{{ message.type === 'user' ? '我' : 'AI助手' }}</span>
        <span class="message-time">{{ formatTime(message.timestamp) }}</span>
        <span v-if="message.edited" class="edited-badge">已编辑</span>
        <span v-if="isTyping" class="typing-badge">正在输入...</span>
      </div>
      
      <!-- 正常显示消息内容 -->
      <div v-if="!isEditing" class="message-text">{{ displayText }}</div>
      
      <!-- 编辑模式 -->
      <div v-else class="edit-mode">
        <textarea
          ref="editTextareaRef"
          v-model="editText"
          :rows="3"
          placeholder="编辑你的消息..."
          class="edit-textarea"
        />
        <div class="edit-actions">
          <button class="cancel-btn" @click="cancelEdit">取消</button>
          <button class="send-btn" @click="handleSend">发送</button>
        </div>
      </div>
      
      <!-- 文件预览 -->
      <div v-if="message.files && message.files.length > 0" class="message-files">
        <div v-for="(file, idx) in message.files" :key="idx" class="file-tag">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
            <polyline points="13 2 13 9 20 9" />
          </svg>
          <span>{{ file.name }}</span>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <MessageActions
        v-if="!message.isThinking && !isEditing && !isTyping"
        :is-user="message.type === 'user'"
        :content="message.content"
        @edit="startEdit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import MessageActions from './MessageActions.vue'  
import type { Message } from './types'

const props = defineProps<{
  message: Message
}>()

const emit = defineEmits<{
  (e: 'edit-message', messageId: string, newContent: string): void
  (e: 'typing-complete', messageId: string): void
}>()

const isEditing = ref(false)
const editText = ref('')
const editTextareaRef = ref<HTMLTextAreaElement | null>(null)
const displayContent = ref('')
const isTyping = ref(false)
let typingInterval: number | null = null

// 显示的文本
const displayText = computed(() => {
  return displayContent.value || props.message.content
})

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - timestamp
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

// 滚动到底部
const scrollToBottom = () => {
  const messageItem = document.querySelector('.message-list')
  const container = messageItem?.parentElement?.parentElement
  if (container) {
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'auto'
    })
  }
}

// 开始打字效果
const startTyping = () => {
  // 只有 AI 消息才启动打字效果
  if (props.message.type !== 'assistant') return
  if (!props.message.content) return
  if (displayContent.value === props.message.content) return
  
  // 停止已有定时器
  if (typingInterval) {
    clearInterval(typingInterval)
    typingInterval = null
  }
  
  isTyping.value = true
  let index = displayContent.value.length
  
  typingInterval = window.setInterval(() => {
    if (index < props.message.content.length) {
      index++
      displayContent.value = props.message.content.substring(0, index)
      scrollToBottom()
    } else {
      // 打字完成
      if (typingInterval) {
        clearInterval(typingInterval)
        typingInterval = null
      }
      isTyping.value = false
      emit('typing-complete', props.message.id)
    }
  }, 10)
}

// 停止打字效果
const stopTyping = () => {
  if (typingInterval) {
    clearInterval(typingInterval)
    typingInterval = null
  }
  isTyping.value = false
  displayContent.value = props.message.content
}

// 监听消息内容变化（新消息或编辑后）
watch(() => props.message.content, (newContent, oldContent) => {
  // 当内容变化时
  if (newContent && newContent !== oldContent) {
    if (props.message.type === 'assistant') {
      // AI 消息：重新开始打字
      displayContent.value = ''
      startTyping()
    } else {
      // 用户消息：直接显示完整内容
      displayContent.value = newContent
      isTyping.value = false
    }
  }
}, { immediate: true })

// 开始编辑
const startEdit = () => {
  stopTyping()
  editText.value = props.message.content
  isEditing.value = true
  setTimeout(() => {
    editTextareaRef.value?.focus()
  }, 100)
}

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false
  editText.value = ''
  // 恢复显示
  if (props.message.type === 'assistant') {
    startTyping()
  } else {
    displayContent.value = props.message.content
  }
}

// 发送编辑后的消息
const handleSend = () => {
  const newContent = editText.value.trim()
  if (newContent) {
    stopTyping()
    emit('edit-message', props.message.id, newContent)
  }
  isEditing.value = false
  editText.value = ''
}

onMounted(() => {
  if (props.message.type === 'assistant' && props.message.content) {
    startTyping()
  } else if (props.message.type === 'user' && props.message.content) {
    displayContent.value = props.message.content
  }
})

onUnmounted(() => {
  stopTyping()
})
</script>

<style scoped>
/* ... 保持原有样式不变 ... */
.message-item {
  padding: 16px;
  animation: slideIn 0.3s ease;
  position: relative;
}

.message-item.user {
  background: #f9f9f9;
  border-radius: 16px;
  margin: 8px 16px;
}

.message-item.assistant {
  background: transparent;
  border-radius: 16px;
  margin: 8px 16px;
}

.message-content {
  flex: 1;
  min-width: 0;
  position: relative;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.message-role {
  font-weight: 600;
  font-size: 0.9rem;
  color: #333;
}

.message-time {
  font-size: 0.7rem;
  color: #999;
}

.edited-badge {
  font-size: 0.65rem;
  color: #999;
  margin-left: 4px;
}

.typing-badge {
  font-size: 0.65rem;
  color: #7e66ea;
  margin-left: 4px;
  animation: pulse 1.5s ease infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.message-text {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #333;
  word-wrap: break-word;
}

/* 编辑模式样式 */
.edit-mode {
  margin-top: 8px;
}

.edit-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #333;
  font-family: inherit;
  resize: none;
  outline: none;
  transition: all 0.2s;
  background: white;
}

.edit-textarea:focus {
  outline: none;
  border-color: #7e66ea;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.cancel-btn,
.send-btn {
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.cancel-btn {
  background: #f0f0f0;
  color: #666;
}

.cancel-btn:hover {
  background: #e0e0e0;
}

.send-btn {
  background: #7e66ea;
  color: white;
}

.send-btn:hover {
  background: #7f32cd;
}

.message-files {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.file-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #f0f0f0;
  border-radius: 6px;
  font-size: 0.75rem;
  color: #666;
}

.thinking {
  display: inline-flex;
  gap: 2px;
  margin-top: 8px;
}

.dot {
  font-size: 20px;
  animation: blink 1.4s infinite;
  opacity: 0;
  color: #999;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes blink {
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>