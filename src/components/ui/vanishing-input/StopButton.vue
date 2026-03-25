<!-- src/components/ui/vanishing-input/StopButton.vue -->
<template>
  <button
    type="button"
    class="stop-btn"
    :class="{ 'is-active': isGenerating }"
    @click="handleStop"
    :title="isGenerating ? '停止生成' : '生成中'"
  >
    <svg
      v-if="isGenerating"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <rect x="6" y="6" width="12" height="12" rx="1" />
    </svg>
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  isGenerating: boolean
}>()

const emit = defineEmits<{
  (e: 'stop'): void
}>()

const handleStop = () => {
  emit('stop')
}
</script>

<style scoped>
.stop-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
  color: #9ca3af;
  flex-shrink: 0;
}

.stop-btn:hover {
  background: #f3f4f6;
  color: #6b7280;
}

.stop-btn.is-active {
  color: #f43f5e;
}

.stop-btn.is-active:hover {
  background: #fef2f2;
  color: #e11d48;
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
  .stop-btn:hover {
    background: #374151;
    color: #9ca3af;
  }
  
  .stop-btn.is-active:hover {
    background: #3b1e2a;
  }
}
</style>