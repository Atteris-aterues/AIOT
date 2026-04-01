<!-- src/views/admin/components/RedisCleaner.vue -->
<template>
  <div class="redis-cleaner">
    <h3 class="section-title">Redis 缓存管理</h3>
    <div class="cleaner-content">
      <div class="info-card">
        <div class="info-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4l3 3" />
          </svg>
        </div>
        <div class="info-text">
          <p>清理 Redis 缓存可以释放内存空间，提升系统性能</p>
          <p class="warning">注意：清理操作不可逆，请谨慎执行</p>
        </div>
      </div>
      <button 
        class="clean-btn" 
        :disabled="cleaning"
        @click="handleClean"
      >
        <svg v-if="cleaning" class="spinner" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="4" />
        </svg>
        <template v-else>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          清理 Redis 缓存
        </template>
      </button>
    </div>
    <div v-if="cleanResult" class="result-message" :class="cleanSuccess ? 'success' : 'error'">
      {{ cleanResult }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits<{
  (e: 'clear'): Promise<void>
}>()

const cleaning = ref(false)
const cleanResult = ref('')
const cleanSuccess = ref(false)

const handleClean = async () => {
  cleaning.value = true
  cleanResult.value = ''
  
  try {
    await emit('clear')
    cleanSuccess.value = true
    cleanResult.value = '✓ Redis 缓存清理完成'
    ElMessage.success('Redis 缓存清理完成')
    setTimeout(() => {
      cleanResult.value = ''
    }, 3000)
  } catch (error) {
    cleanSuccess.value = false
    cleanResult.value = '✗ 清理失败，请重试'
    ElMessage.error('清理失败')
    setTimeout(() => {
      cleanResult.value = ''
    }, 3000)
  } finally {
    cleaning.value = false
  }
}
</script>

<style scoped>
.redis-cleaner {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #dc2626;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
}

.cleaner-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  background: #fef9f9;
  padding: 16px;
  border-radius: 16px;
}

.info-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #dc2626, #7e66ea);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.info-text p {
  margin: 0;
  font-size: 14px;
  color: #4b5563;
}

.info-text .warning {
  font-size: 12px;
  color: #f59e0b;
  margin-top: 4px;
}

.clean-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #dc2626, #7e66ea);
  color: white;
  border: none;
  border-radius: 40px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 160px;
  justify-content: center;
}

.clean-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(220, 38, 38, 0.3);
}

.clean-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.result-message {
  margin-top: 16px;
  padding: 12px;
  border-radius: 12px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  animation: fadeIn 0.3s ease;
}

.result-message.success {
  background: #d1fae5;
  color: #10b981;
}

.result-message.error {
  background: #fee2e2;
  color: #dc2626;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>