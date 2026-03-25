<!-- FileUploader/UploadingOverlay.vue -->
<template>
  <div v-if="show" class="uploading-overlay">
    <div class="spinner"></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  show?: boolean
}>()
</script>

<style scoped>
.uploading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top-color: #ec4899;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>