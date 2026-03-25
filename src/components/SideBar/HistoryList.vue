// SideBar/HistoryList.vue
<script setup lang="ts">
import { inject } from 'vue'
import HistoryActions from './HistoryActions.vue'

interface HistoryItem {
  id: string;
  title: string;
  timestamp: Date;
}

interface Props {
  historyItems: HistoryItem[];
  selectedId: string;
  renamingId: string | null;
  newTitle: string;
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'select', id: string): void
  (e: 'rename', id: string): void
  (e: 'pin', id: string): void
  (e: 'delete', id: string): void
  (e: 'save-rename'): void
  (e: 'cancel-rename'): void
  (e: 'update:new-title', value: string): void
}>()

// 从父组件注入状态和方法
const sidebarState = inject('sidebar-state') as {
  isExpanded: { value: boolean }
  selectedId: { value: string }
}
const formatTime = inject('format-time-fn') as (date: Date) => string

// 处理动作按钮点击
const handleAction = (action: string, id: string, event: MouseEvent) => {
  event.stopPropagation()
  switch (action) {
    case 'rename':
      emit('rename', id)
      break
    case 'pin':
      emit('pin', id)
      break
    case 'delete':
      emit('delete', id)
      break
  }
}

// 处理重命名输入按键
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    emit('save-rename')
  } else if (event.key === 'Escape') {
    emit('cancel-rename')
  }
}

// 处理输入框失去焦点
const handleBlur = () => {
  emit('save-rename')
}
</script>

<template>
  <div
    v-for="item in historyItems"
    :key="item.id"
    @click="renamingId !== item.id && emit('select', item.id)"
    class="p-3 rounded-lg cursor-pointer transition-colors group relative"
    :class="[
      selectedId === item.id && renamingId !== item.id
        ? 'bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500'
        : 'hover:bg-red-100 dark:hover:bg-red-900/50',
      !sidebarState.isExpanded.value && 'flex justify-center',
      renamingId === item.id && 'bg-red-50 dark:bg-red-900/20'
    ]"
    :title="sidebarState.isExpanded.value ? item.title : item.title"
  >
    <!-- 展开状态显示详细信息 -->
    <template v-if="sidebarState.isExpanded.value">
      <!-- 重命名模式 -->
      <template v-if="renamingId === item.id">
        <input
          type="text"
          :value="newTitle"
          @input="(e) => emit('update:new-title', (e.target as HTMLInputElement).value)"
          @keydown="handleKeydown"
          @blur="handleBlur"
          @click.stop
          class="w-full px-2 py-1 text-sm border border-red-300 rounded focus:outline-none focus:border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          placeholder="输入新标题"
          autofocus
        />
      </template>
      
      <!-- 普通模式 -->
      <template v-else>
        <div class="font-medium text-sm text-gray-900 dark:text-gray-100 truncate pr-8">{{ item.title }}</div>
        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ formatTime(item.timestamp) }}</div>
        
        <!-- 动作按钮 - 悬停时显示，放在右侧 -->
        <HistoryActions
          :history-id="item.id"
          :is-selected="selectedId === item.id"
          @action="(action, id, event) => handleAction(action, id, event)"
        />
      </template>
    </template>
    <!-- 收起状态仅显示一个圆点 -->
    <template v-else>
      <div class="w-2 h-2 rounded-full bg-red-400 dark:bg-red-600"></div>
    </template>
  </div>
</template>