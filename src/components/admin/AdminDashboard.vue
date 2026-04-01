<!-- src/views/admin/AdminDashboard.vue -->
<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h1>管理后台</h1>
      <p>数据监控与系统管理</p>
    </div>

    <!-- 数据监控 -->
    <DataMonitor :data="dashboardData" />

    <!-- 敏感词管理 -->
    <SensitiveWordList
      :words="sensitiveWords"
      @add="handleAddWord"
      @update="handleUpdateWord"
      @delete="handleDeleteWord"
    />

    <!-- Redis 缓存清理 -->
    <RedisCleaner @clear="handleClearRedis" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import DataMonitor from './components/DataMonitor.vue'
import SensitiveWordList from './components/SensitiveWordList.vue'
import RedisCleaner from './components/RedisCleaner.vue'
import type { DashboardData, SensitiveWord } from './types'

// Mock 初始数据
const mockDashboardData: DashboardData = {
  chatMessages: 128,
  materials: 45,
  sensitiveWords: 8,
  generationTasks: 23,
  redisApproxKeyCount: 156,
  chatSessions: 67
}

const mockSensitiveWords: SensitiveWord[] = [
  { id: '1', word: '敏感词1', createdAt: new Date().toISOString() },
  { id: '2', word: '敏感词2', createdAt: new Date().toISOString() },
  { id: '3', word: '敏感词3', createdAt: new Date().toISOString() }
]

// 数据状态
const dashboardData = ref<DashboardData>({ ...mockDashboardData })
const sensitiveWords = ref<SensitiveWord[]>([...mockSensitiveWords])
let nextId = 4

// 添加敏感词
const handleAddWord = (word: string) => {
  const newWord: SensitiveWord = {
    id: String(nextId++),
    word: word,
    createdAt: new Date().toISOString()
  }
  sensitiveWords.value.push(newWord)
  // 更新敏感词数量
  dashboardData.value.sensitiveWords = sensitiveWords.value.length
  ElMessage.success('添加成功')
}

// 更新敏感词
const handleUpdateWord = (id: string, word: string) => {
  const index = sensitiveWords.value.findIndex(item => item.id === id)
  if (index !== -1) {
    sensitiveWords.value[index]!.word = word
    sensitiveWords.value[index]!.updatedAt = new Date().toISOString()
    ElMessage.success('修改成功')
  }
}

// 删除敏感词
const handleDeleteWord = (id: string) => {
  const index = sensitiveWords.value.findIndex(item => item.id === id)
  if (index !== -1) {
    sensitiveWords.value.splice(index, 1)
    // 更新敏感词数量
    dashboardData.value.sensitiveWords = sensitiveWords.value.length
    ElMessage.success('删除成功')
  }
}

// 清理 Redis 缓存
const handleClearRedis = async () => {
  // 模拟异步清理
  return new Promise((resolve) => {
    setTimeout(() => {
      // 清理后重置 Redis 键数量
      dashboardData.value.redisApproxKeyCount = 0
      resolve(true)
    }, 1500)
  })
}

onMounted(() => {
  // 初始化敏感词数量
  dashboardData.value.sensitiveWords = sensitiveWords.value.length
})
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #fff5f5 0%, #fff 100%);
  padding: 40px 24px;
}

.dashboard-header {
  max-width: 1200px;
  margin: 0 0 32px 0;
  padding: 0;
} 

.dashboard-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #dc2626;
  margin-bottom: 8px;
}

.dashboard-header p {
  font-size: 14px;
  color: #6b7280;
}
</style>