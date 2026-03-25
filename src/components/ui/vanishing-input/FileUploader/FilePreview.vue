<!-- FileUploader/FilePreview.vue -->
<template>
  <div class="file-preview">
    <!-- 文件列表容器，添加滚动 -->
    <div class="file-list" :class="{ 'has-multiple': files.length > 3 }">
      <div v-for="(file, index) in files" :key="index" class="file-item">
        <!-- 图片预览 -->
        <template v-if="file.type.startsWith('image/')">
          <img :src="file.preview" :alt="file.name" class="preview-image" />
        </template>

        <!-- 视频预览 -->
        <template v-else-if="file.type.startsWith('video/')">
          <video :src="file.preview" class="preview-video" muted controls />
        </template>

        <!-- PDF 或其他文件图标 -->
        <template v-else>
          <div class="file-icon pdf-bg">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke-width="1.5" />
              <path d="M14 2v6h6" stroke-width="1.5" />
            </svg>
          </div>
        </template>

        <div class="file-info">
          <span class="file-name">{{ truncateName(file.name) }}</span>
          <span class="file-size">{{ formatSize(file.size) }}</span>
        </div>

        <button type="button" class="remove-btn" @click="$emit('remove', index)" title="移除文件">
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor">
            <path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 文件数量提示（当文件较多时） -->
    <div v-if="files.length > 3" class="file-count-hint">
      共 {{ files.length }} 个文件，可滚动查看
    </div>

    <button type="button" class="add-more-btn" @click="$emit('clear')">
      + 重新上传
    </button>
  </div>
</template>

<script setup lang="ts">
import type { UploadedFile } from './types'

defineProps<{
  files: UploadedFile[]
}>()

defineEmits<{
  (e: 'remove', index: number): void
  (e: 'clear'): void
}>()

const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

const truncateName = (name: string, maxLength = 20): string => {
  if (name.length <= maxLength) return name
  const ext = name.split('.').pop() || ''
  const base = name.slice(0, maxLength - ext.length - 3)
  return `${base}...${ext}`
}
</script>

<style scoped>
.file-preview {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 文件列表容器 - 添加滚动支持 */
.file-list {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 4px;
}

/* 自定义滚动条样式 */
.file-list::-webkit-scrollbar {
  width: 6px;
}

.file-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.file-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.file-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 当有多个文件时，调整内边距 */
.file-list.has-multiple {
  padding-right: 8px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 12px;
  margin-bottom: 8px;
  border: 1.5px solid rgba(0, 0, 0, 0.05);
  animation: slideIn 0.3s ease;
}

.file-item:last-child {
  margin-bottom: 0;
}

/* 文件数量提示 */
.file-count-hint {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  padding: 4px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 16px;
}

.preview-image {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.preview-video {
  width: 56px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
}

.file-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.pdf-bg {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
}

.file-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
}

.file-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: #000000;  /* 改为黑色 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  font-size: 0.7rem;
  color: rgba(0, 0, 0, 0.6);  /* 改为深灰色 */
}

.remove-btn {
  background: none;
  border: none;
  color: rgba(0, 0, 0, 0.4);
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.remove-btn:hover {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.add-more-btn {
  width: auto;
  min-width: 100px;
  margin-top: 4px;
  padding: 6px 16px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  color: #333;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  align-self: center;
}

.add-more-btn:hover {
  background: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>