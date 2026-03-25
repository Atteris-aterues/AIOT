<!-- FileUploader/UploadButtons.vue -->
<template>
  <div class="upload-actions">
    <button
      v-for="btn in buttons"
      :key="btn.type"
      type="button"
      class="upload-btn"
      :class="btn.type"
      :disabled="disabled"
      @click="triggerFileSelect(btn.index)"
    >
      <el-icon class="icon" :size="22">
        <component :is="btn.icon" />
      </el-icon>
      <span>{{ btn.label }}</span>
      <input
        :ref="el => setInputRef(btn.index, el)"
        type="file"
        :accept="btn.accept"
        class="hidden-input"
        @change="e => handleFileSelect(e, btn.type)"
      />
    </button>
    <p class="hint">或拖拽文件到此处</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Document, VideoPlay, PictureFilled } from '@element-plus/icons-vue'

const props = defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'select', type: string, files: FileList): void
}>()

const inputRefs = ref<HTMLInputElement[]>([])

const buttons = [
  {
    index: 0,
    type: 'pdf',
    label: 'PDF',
    icon: Document,
    accept: '.pdf,application/pdf'
  },
  {
    index: 1,
    type: 'video',
    label: '视频',
    icon: VideoPlay,
    accept: 'video/*'
  },
  {
    index: 2,
    type: 'image',
    label: '图片',
    icon: PictureFilled,
    accept: 'image/*'
  }
]

const setInputRef = (index: number, el: any) => {
  if (el) {
    inputRefs.value[index] = el as HTMLInputElement
  }
}

const triggerFileSelect = (index: number) => {
  inputRefs.value[index]?.click()
}

const handleFileSelect = (event: Event, type: string) => {
  const input = event.target as HTMLInputElement
  if (input.files?.length) {
    emit('select', type, input.files)
    input.value = ''
  }
}
</script>

<style scoped>
.upload-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 20px 16px;
  flex-wrap: wrap;
}

.upload-btn {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  min-width: 70px;
  background: rgba(30, 30, 40, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(4px);
}

.upload-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  background: rgba(50, 50, 60, 0.9);
  border-color: rgba(255, 255, 255, 0.2);
}

/* 不同按钮的悬停阴影 */
.upload-btn.pdf:hover {
  box-shadow: 0 4px 12px -2px rgba(139, 92, 246, 0.3);
}
.upload-btn.video:hover {
  box-shadow: 0 4px 12px -2px rgba(139, 92, 246, 0.3);
}
.upload-btn.image:hover {
  box-shadow: 0 4px 12px -2px rgba(139, 92, 246, 0.3);
}

.upload-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icon {
  width: 22px;
  height: 22px;
}

.upload-btn span {
  font-size: 0.8rem;
}

.hidden-input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}

.hint {
  width: 100%;
  text-align: center;
  color: rgba(0, 0, 0, 0.5);
  font-size: 0.75rem;
  margin-top: 6px;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .upload-btn {
    background: rgba(20, 20, 30, 0.9);
  }
}
</style>