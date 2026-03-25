<!-- src/components/HomePage.vue -->
<template>
  <div class="flex h-screen">
    <!-- 侧边栏 -->
    <SideBar
      ref="sidebarRef"
      @select-history="handleSelectHistory"
      @new-chat="handleNewChat"
      @update-user="handleUpdateUser"
      :user-name="'张三'"
      :user-avatar="'https://via.placeholder.com/40'"
    />
    
    <!-- 主内容区 -->
    <div 
      class="flex-1 transition-all duration-300 relative" 
      :class="sidebarRef?.isSidebarExpanded ? 'ml-64' : 'ml-16'"
    >
      <!-- 初始状态：中间输入框（绝对定位居中） -->
      <div 
        v-if="messages.length === 0"
        class="absolute inset-0 flex flex-col items-center justify-center px-4"
      >
        <h2 class="mb-10 text-center text-xl font-bold text-black sm:mb-20 sm:text-5xl">
          有什么需要帮助的吗?
        </h2>
        <div class="w-full max-w-xl">
          <VanishingInput
            v-model="inputText"
            :placeholders="placeholders"
            :is-generating="isGenerating"
            @submit="handleFirstSubmit"
            @stop-generation="handleStopGeneration"
          />
        </div>
      </div>
      
      <!-- 对话状态：消息列表 + 底部固定输入框 -->
      <div v-else class="flex flex-col h-full">
        <!-- 消息列表区域（可滚动） -->
        <div class="flex-1 overflow-hidden">
          <MessageList 
            :messages="messages" 
            @edit-message="handleEditMessage"
          />
        </div>
        
        <!-- 底部固定输入框 -->
        <div class="input-area p-5 border-t border-gray-200 bg-white sticky bottom-0">
          <VanishingInput
            v-model="inputText"
            :placeholders="placeholders"
            :is-generating="isGenerating"
            @submit="handleChatSubmit"
            @stop-generation="handleStopGeneration"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VanishingInput from "./ui/vanishing-input/VanishingInput.vue";
import MessageList from "./Dialog/MessageList.vue";
import SideBar from "@/components/SideBar/index.vue";
import type { UploadedFile } from "./ui/vanishing-input/FileUploader/types";
import type { Message } from "./Dialog/types";

const placeholders = [
  "协助制作教学大纲",
  "文档润色",
  "帮助设计PPT",
  "分析知识点重点",
  "设计课堂活动",
];

const inputText = ref("");
const messages = ref<Message[]>([]);
const sidebarRef = ref<InstanceType<typeof SideBar> | null>(null);
const isProcessing = ref(false);
const isGenerating = ref(false);
let currentTypingController: AbortController | null = null;
let currentTimeout: number | null = null;

// 停止当前生成
const stopCurrentGeneration = () => {
  if (currentTypingController) {
    currentTypingController.abort();
    currentTypingController = null;
  }
  if (currentTimeout) {
    clearTimeout(currentTimeout);
    currentTimeout = null;
  }
  isGenerating.value = false;
};

// 生成唯一ID
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// 模拟AI回复 - 支持停止
const simulateAIResponse = async (userMessage: string, files?: UploadedFile[]) => {
  // 创建新的 AbortController
  currentTypingController = new AbortController();
  const signal = currentTypingController.signal;
  
  let responseText = '';
  if (files && files.length > 0) {
    responseText = `我已经收到了您的问题：「${userMessage}」以及 ${files.length} 个文件。\n\n根据您提供的信息，我为您分析如下：\n\n1. 这是一个示例回复，实际应用中会接入真实的AI模型\n2. 您上传的文件可以帮助我更好地理解您的需求\n3. 如果您需要更详细的帮助，请告诉我具体的问题`;
  } else {
    responseText = `关于「${userMessage}」这个问题，我的建议是：\n\n1. 首先，这是一个示例回复，实际应用中会接入真实的AI模型\n2. 您可以根据具体需求进一步细化问题\n3. 如果需要更详细的帮助，请告诉我更多信息`;
  }
  
  const assistantMessage: Message = {
    id: generateId(),
    type: 'assistant',
    content: responseText,
    timestamp: Date.now(),
    displayContent: ''
  };
  
  messages.value.push(assistantMessage);
  
  // 开始打字效果
  isGenerating.value = true;
  
  // 逐字输出
  for (let i = 0; i <= responseText.length; i++) {
    // 检查是否被中止
    if (signal.aborted) {
      // 停止生成，保留已生成的内容
      assistantMessage.displayContent = responseText.substring(0, i);
      assistantMessage.content = responseText.substring(0, i);
      break;
    }
    
    assistantMessage.displayContent = responseText.substring(0, i);
    
    // 使用 Promise 包装 setTimeout，支持中止
    await new Promise((resolve, reject) => {
      currentTimeout = window.setTimeout(resolve, 30);
      signal.addEventListener('abort', () => {
        if (currentTimeout) {
          clearTimeout(currentTimeout);
          currentTimeout = null;
        }
        reject(new Error('aborted'));
      });
    }).catch(err => {
      if (err.message === 'aborted') {
        // 被中止，退出循环
        return;
      }
    });
  }
  
  isGenerating.value = false;
  currentTypingController = null;
};

// 处理编辑消息
const handleEditMessage = async (messageId: string, newContent: string) => {
  const messageIndex = messages.value.findIndex(m => m.id === messageId);
  if (messageIndex !== -1 && messages.value[messageIndex]) {
    const originalMessage = messages.value[messageIndex];
    
    // 更新消息内容
    originalMessage.content = newContent
    originalMessage.edited = true
    originalMessage.content = newContent;
    
    // 停止当前正在进行的生成
    stopCurrentGeneration();
    
    // 移除该消息之后的所有消息（因为编辑后需要重新生成回复）
    messages.value = messages.value.slice(0, messageIndex + 1);
    
    // 触发AI重新回复
    isProcessing.value = true
    isGenerating.value = true
    
    // 模拟AI回复
    await simulateAIResponse(newContent, originalMessage.files);
    
    isProcessing.value = false
    isGenerating.value = false
  }
};

// 处理首次提交（从中间输入框）
const handleFirstSubmit = async (data: { text: string, files: UploadedFile[] }) => {
  if ((!data.text || !data.text.trim()) && (!data.files || data.files.length === 0)) {
    return;
  }
  if (isProcessing.value) {
    return;
  }
  
  // 停止正在进行的生成
  stopCurrentGeneration();
  
  isProcessing.value = true;
  
  // 添加用户消息
  const userMessage: Message = {
    id: generateId(),
    type: 'user',
    content: data.text || '',
    files: data.files,
    timestamp: Date.now()
  };
  
  messages.value.push(userMessage);
  
  // 清空输入框
  inputText.value = '';
  
  // 模拟AI回复
  await simulateAIResponse(data.text || '', data.files);
  
  isProcessing.value = false;
};

// 处理对话中的提交（从底部输入框）
const handleChatSubmit = async (data: { text: string, files: UploadedFile[] }) => {
  if ((!data.text || !data.text.trim()) && (!data.files || data.files.length === 0)) {
    return;
  }
  if (isProcessing.value) {
    return;
  }
  
  // 停止正在进行的生成
  stopCurrentGeneration();
  
  isProcessing.value = true;
  
  // 添加用户消息
  const userMessage: Message = {
    id: generateId(),
    type: 'user',
    content: data.text || '',
    files: data.files,
    timestamp: Date.now()
  };
  
  messages.value.push(userMessage);
  
  // 清空输入框
  inputText.value = '';
  
  // 模拟AI回复
  await simulateAIResponse(data.text || '', data.files);
  
  isProcessing.value = false;
};

// 处理停止生成
const handleStopGeneration = () => {
  console.log('Stop generation triggered');
  stopCurrentGeneration();
};

// 处理侧边栏事件
const handleSelectHistory = (id: string) => {
  console.log("选中历史记录:", id);
};

const handleNewChat = () => {
  console.log("开启新对话");
  // 停止正在进行的生成
  stopCurrentGeneration();
  inputText.value = "";
  messages.value = [];
};

const handleUpdateUser = () => {
  console.log("修改个人信息");
};
</script>

<style scoped>
/* 确保侧边栏和主区域占满全屏 */
.h-screen {
  height: 100vh;
}

/* 初始状态：内容居中 */
.absolute {
  position: absolute;
}

.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

/* 对话状态布局 */
.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.h-full {
  height: 100%;
}

/* 消息列表区域自动滚动 */
.flex-1 {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

/* 底部输入框固定在底部 */
.sticky {
  position: sticky;
}

.bottom-0 {
  bottom: 0;
}

.input-area {
  background: white;
  border-top: 1px solid #e5e5e5;
  flex-shrink: 0;
}

/* 确保输入框容器有合适的宽度 */
.w-full {
  width: 100%;
}

.max-w-xl {
  max-width: 36rem;
}
</style>