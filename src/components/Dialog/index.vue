<!-- src/components/Dialog/index.vue -->
<template>
  <div class="dialog-container">
    <!-- 消息列表 -->
    <MessageList :messages="messages" />
    
    <!-- 输入区域 -->
    <div class="input-area">
      <VanishingInput
        v-model="inputText"
        :placeholders="placeholders"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import MessageList from './MessageList.vue'
import VanishingInput from '@/components/ui/vanishing-input/VanishingInput.vue'
import type { Message, DialogProps } from './types'
import type { UploadedFile } from '@/components/ui/vanishing-input/FileUploader/types'

const props = withDefaults(defineProps<DialogProps>(), {
  initialMessages: () => [],
  placeholder: '输入你的问题...'
})

const emit = defineEmits<{
  (e: 'message-sent', message: Message): void
  (e: 'message-received', message: Message): void
}>()

const messages = ref<Message[]>([...props.initialMessages])
const inputText = ref('')
const isProcessing = ref(false)

const placeholders = [
  "协助制作教学大纲",
  "文档润色",
  "帮助设计PPT",
  "分析知识点重点",
  "设计课堂活动",
]

// 生成唯一ID
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// 模拟AI回复
const simulateAIResponse = async (userMessage: string, files?: UploadedFile[]) => {
  // 添加思考中的消息
  const thinkingMessage: Message = {
    id: generateId(),
    type: 'assistant',
    content: '',
    timestamp: Date.now(),
    isThinking: true
  }
  messages.value.push(thinkingMessage)
  emit('message-received', thinkingMessage)
  
  // 模拟思考时间
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // 移除思考中的消息
  const thinkingIndex = messages.value.findIndex(m => m.id === thinkingMessage.id)
  if (thinkingIndex !== -1) {
    messages.value.splice(thinkingIndex, 1)
  }
  
  // 生成回复内容（假数据）
  let responseText = ''
  if (files && files.length > 0) {
    responseText = `我已经收到了您的问题：「${userMessage}」以及 ${files.length} 个文件。\n\n根据您提供的信息，我为您分析如下：\n\n1. 这是一个示例回复，实际应用中会接入真实的AI模型\n2. 您上传的文件可以帮助我更好地理解您的需求\n3. 如果您需要更详细的帮助，请告诉我具体的问题`
  } else {
    responseText = `关于「${userMessage}」这个问题，我的建议是：\n\n1. 首先，这是一个示例回复，实际应用中会接入真实的AI模型\n2. 您可以根据具体需求进一步细化问题\n3. 如果需要更详细的帮助，请告诉我更多信息`
  }
  
  const assistantMessage: Message = {
    id: generateId(),
    type: 'assistant',
    content: responseText,
    timestamp: Date.now()
  }
  
  messages.value.push(assistantMessage)
  emit('message-received', assistantMessage)
}

// 处理用户提交
const handleSubmit = async (data: { text: string, files: UploadedFile[] }) => {
  console.log('Dialog handleSubmit called with:', data)
  
  if ((!data.text || !data.text.trim()) && (!data.files || data.files.length === 0)) {
    console.log('No content to submit')
    return
  }
  if (isProcessing.value) {
    console.log('Already processing')
    return
  }
  
  isProcessing.value = true
  
  // 添加用户消息
  const userMessage: Message = {
    id: generateId(),
    type: 'user',
    content: data.text || '',
    files: data.files,
    timestamp: Date.now()
  }
  
  messages.value.push(userMessage)
  console.log('User message added, messages count:', messages.value.length)
  emit('message-sent', userMessage)
  
  // 清空输入框
  inputText.value = ''
  
  // 等待下一帧滚动到底部
  await nextTick()
  
  // 模拟AI回复
  await simulateAIResponse(data.text || '', data.files)
  
  isProcessing.value = false
  console.log('Dialog handleSubmit completed')
}

// 清空消息
const clearMessages = () => {
  messages.value = []
}

// 暴露方法给父组件
defineExpose({
  messages,
  clearMessages,
  handleSubmit
})
</script>

<style scoped>
.dialog-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  overflow: hidden;
}

.input-area {
  padding: 20px;
  border-top: 1px solid #e5e5e5;
  background: white;
}
</style>