<!-- FileUploader/index.vue -->
<template>
  <div
    ref="dropZoneRef"
    class="file-uploader"
    :class="{
      'is-dragover': isDragover,
      'has-files': uploadedFiles.length > 0,
    }"
    @dragenter.prevent="handleDragEnter"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <!-- 上传按钮区域 -->
    <UploadButtons
      v-if="uploadedFiles.length === 0"
      :disabled="isUploading"
      @select="handleFileSelect"
    />

    <!-- 文件预览区域 -->
    <FilePreview
      v-else
      :files="uploadedFiles"
      @remove="removeFile"
      @clear="clearAllFiles"
    />

    <!-- 上传遮罩 -->
    <UploadingOverlay :show="isUploading" />
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import UploadButtons from './UploadButtons.vue'
import FilePreview from './FilePreview.vue'
import UploadingOverlay from './UploadingOverlay.vue'
import type { UploadedFile } from './types'

const props = defineProps<{
  maxFileSize?: number
  multiple?: boolean  // 添加 multiple 属性，默认 true
}>()

const emit = defineEmits<{
  (e: 'files-selected', files: UploadedFile[]): void
  (e: 'file-removed', index: number): void
  (e: 'files-cleared'): void
}>()

const dropZoneRef = ref<HTMLDivElement | null>(null)
const uploadedFiles = ref<UploadedFile[]>([])
const isDragover = ref(false)
const isUploading = ref(false)

// 生成预览 URL
const generatePreview = (file: File): string | undefined => {
  if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
    return URL.createObjectURL(file)
  }
  return undefined
}

// 检查文件大小
const checkFileSize = (file: File): boolean => {
  const maxSize = props.maxFileSize || 100 * 1024 * 1024
  return file.size <= maxSize
}

// 处理文件选择 - 修改为追加模式
const handleFileSelect = (type: string, fileList: FileList) => {
  processFiles(Array.from(fileList), type, true) // true 表示追加模式
}

// 处理拖拽 - 修改为追加模式
const handleDrop = (e: DragEvent) => {
  isDragover.value = false
  const files = e.dataTransfer?.files
  if (files?.length) {
    processFiles(Array.from(files), undefined, true) // true 表示追加模式
  }
}

// 核心处理函数 - 添加 append 参数
const processFiles = (files: File[], specificType?: string, append: boolean = false) => {
  const validFiles = files.filter(file => {
    if (!checkFileSize(file)) {
      alert(`文件 ${file.name} 超过大小限制 (100MB)`)
      return false
    }

    if (specificType === 'pdf' && file.type !== 'application/pdf') {
      alert('请上传 PDF 文件')
      return false
    }
    if (specificType === 'video' && !file.type.startsWith('video/')) {
      alert('请上传视频文件')
      return false
    }
    if (specificType === 'image' && !file.type.startsWith('image/')) {
      alert('请上传图片文件')
      return false
    }

    return true
  })

  if (validFiles.length === 0) return

  isUploading.value = true
  setTimeout(() => {
    const newFiles = validFiles.map(file => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: generatePreview(file),
    }))

    // 如果是追加模式，保留原有文件并添加新文件
    if (append) {
      uploadedFiles.value = [...uploadedFiles.value, ...newFiles]
    } else {
      uploadedFiles.value = newFiles
    }
    
    isUploading.value = false
    emit('files-selected', uploadedFiles.value)
  }, 600)
}

// 处理拖拽事件
const handleDragEnter = () => {
  isDragover.value = true
}

const handleDragOver = () => {
  isDragover.value = true
}

const handleDragLeave = (e: DragEvent) => {
  if (dropZoneRef.value && !dropZoneRef.value.contains(e.relatedTarget as Node)) {
    isDragover.value = false
  }
}

// 移除文件
const removeFile = (index: number) => {
  const removed = uploadedFiles.value.splice(index, 1)[0]
  if (removed.preview) URL.revokeObjectURL(removed.preview)
  emit('file-removed', index)
  if (uploadedFiles.value.length === 0) {
    emit('files-cleared')
  }
}

// 清空文件
const clearAllFiles = () => {
  uploadedFiles.value.forEach(f => {
    if (f.preview) URL.revokeObjectURL(f.preview)
  })
  uploadedFiles.value = []
  emit('files-cleared')
}

// 清理预览 URL
onUnmounted(() => {
  uploadedFiles.value.forEach(f => {
    if (f.preview) URL.revokeObjectURL(f.preview)
  })
})
</script>

<style scoped>
.file-uploader {
  position: relative;
  width: 100%;
  min-height: 120px;
  border-radius: 16px;
  background: rgba(235, 217, 255, 0.761);
  border: 2px solid rgba(139, 92, 246, 0.3);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
  overflow: hidden;
}

.file-uploader.is-dragover {
  border-color: #ec4899;
  background: rgba(236, 72, 153, 0.1);
  transform: scale(1.02);
}

.file-uploader.has-files {
  border-style: solid;
  border-color: #b91010;
  background: rgba(185, 16, 16, 0.05);
}

@media (prefers-color-scheme: dark) {
  .file-uploader {
    background: rgba(0, 0, 0, 0.2);
  }
}
</style>