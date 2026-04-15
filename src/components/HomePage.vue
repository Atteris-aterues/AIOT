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
      :user-avatar="'https://placehold.co/40x40'"
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
import { 
  createSession, 
  getSessionDetail, 
  sendMessage, 
  stopChat, 
  editAndRegenerate,
  uploadMaterial,
  getMaterialStatus 
} from '@/api/chat'
import { ElMessage } from 'element-plus'

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
const currentSessionId = ref<string | null>(null);
const sceneType = ref(1); // 默认为1

// 停止当前生成
const handleStopGeneration = async () => {
  if (currentSessionId.value) {
    try {
      await stopChat({ sessionId: currentSessionId.value });
      ElMessage.success('已停止生成');
    } catch (error) {
      console.error('停止生成失败:', error);
    }
  }
  isGenerating.value = false;
  isProcessing.value = false;
};

// 格式化后端消息为前端消息
const formatMessage = (item: any): Message => {
  return {
    id: item.messageId?.toString() || `${Date.now()}-${Math.random()}`,
    type: item.role === 'user' ? 'user' : 'assistant',
    content: item.content || item.reply || '',
    timestamp: Date.now(),
    displayContent: item.content || item.reply || ''
  };
};

// 处理文件上传并获取 fileIds
const uploadFiles = async (files: UploadedFile[], sessionId: string): Promise<number[]> => {
  if (!files || files.length === 0) return [];
  
  // 检查文件大小 (限制为 10MB)
  const MAX_SIZE = 10 * 1024 * 1024;
  const largeFiles = files.filter(f => f.file && f.file.size > MAX_SIZE);
  if (largeFiles.length > 0) {
    const fileNames = largeFiles.map(f => f.name).join(', ');
    ElMessage.warning(`文件 [${fileNames}] 超过 10MB 限制，请上传较小的文件`);
    return [];
  }

  const uploadPromises = files.map(async file => {
    if (file.file) {
      try {
        const res = await uploadMaterial(file.file, sessionId);
        return res;
      } catch (error: any) {
        if (error.response?.status === 413) {
          ElMessage.error(`文件 ${file.name} 太大，服务器拒绝处理`);
        } else {
          ElMessage.error(`文件 ${file.name} 上传失败`);
        }
        return null;
      }
    }
    return null;
  });

  const results = await Promise.all(uploadPromises);
  const fileIds = results
    .filter((res): res is any => res !== null && res.code === 200)
    .map(res => res.data.fileId);

  if (fileIds.length > 0) {
    await pollFilesStatus(fileIds);
  }
  
  return fileIds;
};

// 轮询文件解析状态
const pollFilesStatus = async (fileIds: number[]) => {
  const checkStatus = async (fileId: number): Promise<void> => {
    let attempts = 0;
    const maxAttempts = 30; // 最大轮询 60 秒 (2s * 30)
    
    while (attempts < maxAttempts) {
      try {
        const res = await getMaterialStatus({ fileId });
        if (res.code === 200 && res.data.status === 'completed') {
          return;
        }
        if (res.code === 200 && res.data.status === 'error') {
          throw new Error('文件解析失败');
        }
      } catch (error) {
        console.error(`检查文件 ${fileId} 状态失败:`, error);
      }
      
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    throw new Error('文件解析超时，请稍后重试');
  };

  try {
    ElMessage.info('正在解析文件，请稍候...');
    await Promise.all(fileIds.map(id => checkStatus(id)));
    ElMessage.success('文件解析完成');
  } catch (error: any) {
    ElMessage.error(error.message || '文件解析过程中出现问题');
    throw error;
  }
};

// 处理首次提交（从中间输入框）
const handleFirstSubmit = async (data: { text: string, files: UploadedFile[] }) => {
  if ((!data.text || !data.text.trim()) && (!data.files || data.files.length === 0)) {
    return;
  }
  if (isProcessing.value) return;

  isProcessing.value = true;
  
  try {
    // 1. 创建会话
    const sessionRes = await createSession({
      sceneType: sceneType.value,
      firstPrompt: data.text || '新对话'
    });

    if (sessionRes.code === 200) {
      currentSessionId.value = sessionRes.data.sessionId;
      
      // 2. 添加用户消息到本地
      const userMsg: Message = {
        id: `temp-user-${Date.now()}`,
        type: 'user',
        content: data.text,
        files: data.files,
        timestamp: Date.now()
      };
      messages.value.push(userMsg);
      inputText.value = '';

      // 3. 上传文件（如果有）
      const fileIds = await uploadFiles(data.files, currentSessionId.value);

      // 4. 发送消息
      isGenerating.value = true;
      const sendRes = await sendMessage({
        sessionId: currentSessionId.value,
        content: data.text,
        fileIds: fileIds,
        sceneType: sceneType.value,
        isResend: false
      });

      if (sendRes.code === 200) {
        // 更新临时用户消息的 ID（如果后端返回了）
        if (sendRes.data.userMessageId) {
          userMsg.id = sendRes.data.userMessageId.toString();
        }
        messages.value.push(formatMessage(sendRes.data));
        // 刷新侧边栏列表
        sidebarRef.value?.fetchSessionList?.();
      }
    }
  } catch (error) {
    console.error('首次提交失败:', error);
    ElMessage.error('开启对话失败，请重试');
  } finally {
    isProcessing.value = false;
    isGenerating.value = false;
  }
};

// 处理对话中的提交（从底部输入框）
const handleChatSubmit = async (data: { text: string, files: UploadedFile[] }) => {
  if (!currentSessionId.value) return;
  if ((!data.text || !data.text.trim()) && (!data.files || data.files.length === 0)) {
    return;
  }
  if (isProcessing.value) return;

  isProcessing.value = true;
  
  try {
    // 1. 添加用户消息到本地
    const userMsg: Message = {
      id: `temp-user-${Date.now()}`,
      type: 'user',
      content: data.text,
      files: data.files,
      timestamp: Date.now()
    };
    messages.value.push(userMsg);
    inputText.value = '';

    // 2. 上传文件（如果有）
    const fileIds = await uploadFiles(data.files, currentSessionId.value);

    // 3. 发送消息
    isGenerating.value = true;
    const sendRes = await sendMessage({
      sessionId: currentSessionId.value,
      content: data.text,
      fileIds: fileIds,
      sceneType: sceneType.value,
      isResend: false
    });

    if (sendRes.code === 200) {
      // 更新临时用户消息的 ID（如果后端返回了）
      if (sendRes.data.userMessageId) {
        userMsg.id = sendRes.data.userMessageId.toString();
      }
      messages.value.push(formatMessage(sendRes.data));
    }
  } catch (error) {
    console.error('发送消息失败:', error);
    ElMessage.error('发送失败，请重试');
  } finally {
    isProcessing.value = false;
    isGenerating.value = false;
  }
};

// 处理编辑消息
const handleEditMessage = async (messageId: string, newContent: string) => {
  if (!currentSessionId.value) return;
  
  const messageIndex = messages.value.findIndex(m => m.id === messageId);
  if (messageIndex === -1) return;

  // 检查是否为有效 ID (后端返回的数字 ID)
  const numericId = parseInt(messageId);
  if (isNaN(numericId)) {
    ElMessage.warning('消息暂未就绪，请稍后重试');
    return;
  }

  isProcessing.value = true;
  isGenerating.value = true;
  
  try {
    const res = await editAndRegenerate({
      sessionId: currentSessionId.value,
      messageId: numericId,
      newContent
    });

    if (res.code === 200) {
      // 移除该消息之后的所有消息
      messages.value = messages.value.slice(0, messageIndex);
      // 添加编辑后的用户消息
      messages.value.push({
        id: messageId,
        type: 'user',
        content: newContent,
        timestamp: Date.now(),
        edited: true
      });
      // 添加 AI 回复
      messages.value.push(formatMessage(res.data));
    }
  } catch (error) {
    console.error('编辑消息失败:', error);
    ElMessage.error('操作失败');
  } finally {
    isProcessing.value = false;
    isGenerating.value = false;
  }
};

// 处理侧边栏事件：选择历史记录
const handleSelectHistory = async (id: string) => {
  currentSessionId.value = id;
  isProcessing.value = true;
  
  try {
    const res = await getSessionDetail({ sessionId: id });
    if (res.code === 200) {
      messages.value = res.data.history.map(item => formatMessage(item));
      sceneType.value = res.data.sessionInfo.sceneType;
    }
  } catch (error) {
    console.error('加载会话详情失败:', error);
    ElMessage.error('加载失败');
  } finally {
    isProcessing.value = false;
  }
};

const handleNewChat = () => {
  currentSessionId.value = null;
  messages.value = [];
  inputText.value = "";
  isGenerating.value = false;
  isProcessing.value = false;
};

const handleUpdateUser = () => {
  // 跳转到个人中心
  window.location.href = '/personal';
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