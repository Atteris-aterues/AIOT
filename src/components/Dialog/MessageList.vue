<!-- src/components/Dialog/MessageList.vue -->
<template>
  <div ref="messageListRef" class="message-list">
    <div class="messages-container">
      <MessageItem
        v-for="message in messages"
        :key="message.id"
        :message="message"
        @edit-message="handleEditMessage"  
      />
      
      <!-- 滚动到底部按钮 -->
      <button
        v-if="showScrollButton"
        class="scroll-to-bottom"
        @click="() => scrollToBottom('smooth')" 
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import MessageItem from './MessageItem.vue'
import type { Message } from './types'

const props = defineProps<{
  messages: Message[]
}>()

// 定义 emit
const emit = defineEmits<{
  (e: 'edit-message', messageId: string, newContent: string): void
  (e: 'typing-complete', messageId: string): void
}>()

const messageListRef = ref<HTMLDivElement | null>(null)
const showScrollButton = ref(false)

// 滚动到底部
const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
  if (messageListRef.value) {
    messageListRef.value.scrollTo({
      top: messageListRef.value.scrollHeight,
      behavior
    })
    showScrollButton.value = false
  }
}

// 检查是否在底部
const checkIfAtBottom = () => {
  if (!messageListRef.value) return true
  const { scrollTop, scrollHeight, clientHeight } = messageListRef.value
  return scrollHeight - scrollTop - clientHeight < 100
}

// 处理编辑消息
const handleEditMessage = (messageId: string, newContent: string) => {
  emit('edit-message', messageId, newContent)
}

// 监听消息数量变化，自动滚动到底部
watch(() => props.messages.length, async () => {
  await nextTick()
  scrollToBottom('smooth')
}, { flush: 'post' })

// 监听消息内容变化（比如思考状态结束）
watch(() => props.messages[props.messages.length - 1]?.isThinking, async (newVal, oldVal) => {
  if (oldVal === true && newVal === false) {
    await nextTick()
    scrollToBottom('smooth')
  }
})

// 监听消息内容更新（编辑消息时）
watch(() => props.messages.map(m => m.content), async () => {
  await nextTick()
  if (checkIfAtBottom()) {
    scrollToBottom('auto')
  }
})

// 组件挂载后滚动到底部
onMounted(() => {
  setTimeout(() => {
    scrollToBottom('auto')
  }, 100)
})
</script>

<style scoped>
.message-list {
  padding: 20px;
  min-height: 100%;
  height: 100%;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.messages-container {
  max-width: 800px;
  margin: 0 auto;
}

/* 自定义滚动条 */
.message-list::-webkit-scrollbar {
  width: 6px;
}

.message-list::-webkit-scrollbar-track {
  background: #f0f0f0;
  border-radius: 3px;
}

.message-list::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.message-list::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}

.scroll-to-bottom {
  position: sticky;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: white;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  margin-top: 20px;
  z-index: 10;
}

.scroll-to-bottom:hover {
  background: #f5f5f5;
  transform: translateX(-50%) scale(1.05);
}
</style>