// SideBar/SideBarContainer.vue
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  isExpanded: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'toggle'): void
  (e: 'new-chat'): void
}>()

const sidebarStyle = computed(() => {
  return {
    position: 'fixed' as const,
    left: '0',
    top: '0',
    height: '100vh',
    width: props.isExpanded ? '256px' : '64px',
    transition: 'width 0.3s ease-in-out',
    display: 'flex',
    flexDirection: 'column' as const,
    background: 'linear-gradient(to bottom, #fff5f5, #ffffff)',
    borderRight: '1px solid #fecaca',
    zIndex: 50,
  }
})

// 处理鼠标进入事件
const handleMouseEnter = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement
  if (target) {
    target.style.background = '#fee2e2'
  }
}

// 处理鼠标离开事件
const handleMouseLeave = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement
  if (target) {
    target.style.background = 'transparent'
  }
}

// 处理新对话按钮鼠标进入
const handleNewChatMouseEnter = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement
  if (target) {
    target.style.background = '#b91c1c'
  }
}

// 处理新对话按钮鼠标离开
const handleNewChatMouseLeave = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement
  if (target) {
    target.style.background = '#dc2626'
  }
}
</script>

<template>
  <div :style="sidebarStyle" class="sidebar-container">
    <!-- 侧边栏头部 - 固定在顶部 -->
    <div class="sidebar-header" :style="{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      padding: '12px',
      borderBottom: '1px solid #fecaca',
      backgroundColor: 'inherit',
      flexShrink: 0, // 防止头部被压缩
    }">
      <!-- 折叠/展开按钮 -->
      <button
        @click="emit('toggle')"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        :style="{
          padding: '8px',
          borderRadius: '8px',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#dc2626'
        }"
        :title="isExpanded ? '折叠侧边栏' : '展开侧边栏'"
      >
        <svg
          v-if="isExpanded"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <!-- 新对话按钮 - 只在展开时显示 -->
      <button
        v-if="isExpanded"
        @click="emit('new-chat')"
        @mouseenter="handleNewChatMouseEnter"
        @mouseleave="handleNewChatMouseLeave"
        :style="{
          padding: '8px 12px',
          borderRadius: '8px',
          border: 'none',
          background: '#dc2626',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          fontWeight: '500'
        }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        <span>新对话</span>
      </button>
    </div>

    <!-- 历史记录列表区域 - 可滚动 -->
    <div class="history-list-container">
      <div class="history-list-content">
        <slot></slot>
      </div>
    </div>

    <!-- 底部用户信息区域 - 固定在底部 -->
    <div class="sidebar-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<style scoped>
.sidebar-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden; /* 防止整个容器滚动 */
}

/* 头部样式 */
.sidebar-header {
  flex-shrink: 0; /* 防止头部被压缩 */
  background: inherit;
}

/* 历史记录列表容器 - 可滚动区域 */
.history-list-container {
  flex: 1 1 auto; /* 自动增长和收缩 */
  overflow-y: auto; /* 启用垂直滚动 */
  min-height: 0; /* 重要：允许容器收缩 */
  height: 100%; /* 占满剩余空间 */
  position: relative;
}

/* 历史记录内容 */
.history-list-content {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* 底部样式 */
.sidebar-footer {
  flex-shrink: 0; /* 防止底部被压缩 */
  background: inherit;
}

/* 自定义滚动条样式 - Webkit浏览器 (Chrome, Safari, Edge) */
.history-list-container::-webkit-scrollbar {
  width: 6px; /* 稍微宽一点，更容易点击 */
}

.history-list-container::-webkit-scrollbar-track {
  background: transparent;
  margin: 4px 0; /* 上下留点空间 */
}

.history-list-container::-webkit-scrollbar-thumb {
  background: #fecaca;
  border-radius: 6px;
  transition: background 0.2s;
}

.history-list-container::-webkit-scrollbar-thumb:hover {
  background: #dc2626; /* 悬停时变成红色 */
}

/* Firefox 滚动条样式 */
.history-list-container {
  scrollbar-width: thin;
  scrollbar-color: #fecaca transparent;
}

/* 确保滚动区域在折叠状态下也能正常工作 */
.sidebar-container:not([style*="width: 256px"]) .history-list-container {
  scrollbar-width: thin;
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .sidebar-container {
    background: linear-gradient(to bottom, #1f1a1a, #111827);
    border-right-color: #7f1d1d;
  }
  
  .sidebar-header {
    border-bottom-color: #7f1d1d;
  }
  
  .history-list-container::-webkit-scrollbar-thumb {
    background: #7f1d1d;
  }
  
  .history-list-container::-webkit-scrollbar-thumb:hover {
    background: #991b1b;
  }
  
  .history-list-container {
    scrollbar-color: #7f1d1d transparent;
  }
}

/* 确保内容区域正确显示 */
:deep(.history-item) {
  width: 100%;
  box-sizing: border-box;
}

/* 添加一个微妙的渐变效果，提示下方还有内容 */
.history-list-container::after {
  content: '';
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20px;
  background: linear-gradient(to top, rgba(255, 255, 255, 0.8), transparent);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
}

.history-list-container:hover::after {
  opacity: 1;
}

@media (prefers-color-scheme: dark) {
  .history-list-container::after {
    background: linear-gradient(to top, rgba(17, 24, 39, 0.8), transparent);
  }
}
</style>