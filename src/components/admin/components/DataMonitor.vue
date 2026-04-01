<!-- src/views/admin/components/DataMonitor.vue -->
<template>
  <div class="data-monitor">
    
    <div class="marquee-container">
      <!-- 第一行跑马灯 -->
      <Marquee
        pause-on-hover
        class="[--duration:30s]"
      >
        <div
          v-for="(stat, index) in firstRow"
          :key="index"
          class="stat-card"
        >
          <div class="stat-icon" :class="stat.iconClass">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path :d="stat.iconPath" />
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </Marquee>

      <!-- 第二行跑马灯（反向） -->
      <Marquee
        reverse
        pause-on-hover
        class="[--duration:30s]"
      >
        <div
          v-for="(stat, index) in secondRow"
          :key="index"
          class="stat-card"
        >
          <div class="stat-icon" :class="stat.iconClass">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path :d="stat.iconPath" />
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </Marquee>
    </div>

    <!-- 左右渐变遮罩 -->
    <div class="gradient-left" />
    <div class="gradient-right" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Marquee from '@/components/ui/marquee/Marquee.vue'
import type { DashboardData } from '../types'

const props = defineProps<{
  data: DashboardData
}>()

// 统计数据数组
const stats = computed(() => [
  {
    label: '聊天消息',
    value: props.data.chatMessages,
    iconPath: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
    iconClass: 'chat-icon'
  },
  {
    label: '文件素材',
    value: props.data.materials,
    iconPath: 'M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z M13 2v7h7',
    iconClass: 'material-icon'
  },
  {
    label: '敏感词',
    value: props.data.sensitiveWords,
    iconPath: 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5',
    iconClass: 'sensitive-icon'
  },
  {
    label: '生成任务',
    value: props.data.generationTasks,
    iconPath: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6',
    iconClass: 'task-icon'
  },
  {
    label: 'Redis键数',
    value: props.data.redisApproxKeyCount,
    iconPath: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 8v4l3 3',
    iconClass: 'redis-icon'
  },
  {
    label: '聊天会话',
    value: props.data.chatSessions,
    iconPath: 'M2 3h20v14H2z M8 21h8',
    iconClass: 'session-icon'
  }
])

// 分成两行
const firstRow = computed(() => stats.value.slice(0, 3))
const secondRow = computed(() => stats.value.slice(3, 6))
</script>

<style scoped>
.data-monitor {
  position: relative;
  width: 100%;
  background: white;
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.marquee-container {
  position: relative;
  width: 100%;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background: #fef9f9;
  border-radius: 20px;
  margin: 0 12px;
  min-width: 220px;
  transition: all 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(220, 38, 38, 0.15);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.chat-icon {
  background: linear-gradient(135deg, #dc2626, #7e66ea);
}
.material-icon {
  background: linear-gradient(135deg, #f59e0b, #dc2626);
}
.sensitive-icon {
  background: linear-gradient(135deg, #8b5cf6, #7e66ea);
}
.task-icon {
  background: linear-gradient(135deg, #10b981, #34d399);
}
.redis-icon {
  background: linear-gradient(135deg, #ef4444, #f97316);
}
.session-icon {
  background: linear-gradient(135deg, #3b82f6, #7e66ea);
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
  margin-top: 4px;
}

/* 左右渐变遮罩 */
.gradient-left {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100px;
  background: linear-gradient(to right, white, transparent);
  pointer-events: none;
  z-index: 10;
}

.gradient-right {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100px;
  background: linear-gradient(to left, white, transparent);
  pointer-events: none;
  z-index: 10;
}
</style>