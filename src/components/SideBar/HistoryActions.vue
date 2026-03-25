// SideBar/HistoryActions.vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  historyId: string;
  isSelected: boolean;
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'action', action: 'rename' | 'pin' | 'delete', id: string, event: MouseEvent): void
}>()

const showActions = ref(false)
const actionsRef = ref<HTMLElement | null>(null)

// 点击外部关闭动作菜单
const handleClickOutside = (event: MouseEvent) => {
  if (actionsRef.value && !actionsRef.value.contains(event.target as Node)) {
    showActions.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 切换动作菜单显示
const toggleActions = (event: MouseEvent) => {
  event.stopPropagation()
  showActions.value = !showActions.value
}
</script>

<template>
  <div class="absolute right-2 top-2" ref="actionsRef">
    <!-- 更多操作按钮 -->
    <button
      @click="toggleActions"
      class="p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200 dark:hover:bg-red-800"
      :class="{ 'opacity-100': showActions }"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="text-gray-600 dark:text-gray-300"
      >
        <circle cx="12" cy="12" r="1" />
        <circle cx="12" cy="5" r="1" />
        <circle cx="12" cy="19" r="1" />
      </svg>
    </button>

    <!-- 动作菜单 -->
    <div
      v-if="showActions"
      class="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-red-100 dark:border-red-900 py-1 min-w-[120px] z-50"
      @click.stop
    >
      <!-- 重命名 -->
      <button
        @click="emit('action', 'rename', historyId, $event)"
        class="w-full px-3 py-2 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2 text-gray-700 dark:text-gray-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
        </svg>
        重命名
      </button>

      <!-- 置顶 -->
      <button
        @click="emit('action', 'pin', historyId, $event)"
        class="w-full px-3 py-2 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2 text-gray-700 dark:text-gray-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M12 2v8" />
          <path d="m4.93 10.93 1.41 1.41C7.69 13.7 8 15.13 8 16v5h8v-5c0-.87.31-2.3 1.66-3.66l1.41-1.41" />
          <path d="M2 2h20" />
          <path d="M5 5h14" />
        </svg>
        置顶
      </button>

      <!-- 删除 -->
      <button
        @click="emit('action', 'delete', historyId, $event)"
        class="w-full px-3 py-2 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2 text-red-600 dark:text-red-400 border-t border-red-100 dark:border-red-900 mt-1 pt-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 4V3c0-1 1-2 2-2h4c1 0 2 1 2 2v1" />
        </svg>
        删除
      </button>
    </div>
  </div>
</template>