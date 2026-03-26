// SideBar/index.vue
<script setup lang="ts">
import SideBarContainer from './SideBarContainer.vue'
import HistoryList from './HistoryList.vue'
import UserFooter from './UserFooter.vue'
import { ref, provide } from 'vue'

// 定义历史记录项的类型
interface HistoryItem {
  id: string;
  title: string;
  timestamp: Date;
}

// 定义组件 Props
interface Props {
  initialHistory?: HistoryItem[];
  userName?: string;
  userAvatar?: string;
}

const props = withDefaults(defineProps<Props>(), {
  // 将所有函数定义移到 withDefaults 内部
  initialHistory: () => {
    // 基础历史记录
    const defaultItems = [
      {
        id: '1',
        title: '教学大纲设计',
        timestamp: new Date(2024, 0, 15, 10, 30),
      },
      {
        id: '2',
        title: '文档润色',
        timestamp: new Date(2024, 0, 14, 15, 45),
      },
      {
        id: '3',
        title: 'PPT设计思路',
        timestamp: new Date(2024, 0, 13, 9, 20),
      },
      {
        id: '4',
        title: '知识点重点分析',
        timestamp: new Date(2024, 0, 12, 14, 10),
      },
      {
        id: '5',
        title: '课堂活动设计',
        timestamp: new Date(2024, 0, 11, 11, 0),
      },
      {
        id: '6',
        title: '历史记录示例 6',
        timestamp: new Date(2024, 0, 10, 16, 30),
      },
      {
        id: '7',
        title: '历史记录示例 7',
        timestamp: new Date(2024, 0, 9, 13, 15),
      },
    ]

    // 生成更多历史记录
    const generateMoreItems = () => {
      const items: HistoryItem[] = []
      const titles = [
        '教学大纲设计', '文档润色', 'PPT设计思路', '知识点重点分析', '课堂活动设计',
        '课程规划讨论', '学生作业批改', '考试题目生成', '学习资料整理', '教学反思记录',
        '家长会准备', '教研活动记录', '课题研究进展', '教学资源收集', '公开课准备',
        '学期总结报告', '教学计划制定', '学生成绩分析', '教学方法探讨', '教育技术应用'
      ]
      
      for (let i = 1; i <= 50; i++) {
        const randomTitle = titles[Math.floor(Math.random() * titles.length)]
        const randomDays = Math.floor(Math.random() * 30)
        const randomHours = Math.floor(Math.random() * 24)
        const randomMinutes = Math.floor(Math.random() * 60)
        
        const date = new Date()
        date.setDate(date.getDate() - randomDays)
        date.setHours(randomHours, randomMinutes)
        
        items.push({
          id: `history-${i}`,
          title: `${randomTitle} ${i}`,
          timestamp: date
        })
      }
      
      return items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    }

    return [...defaultItems, ...generateMoreItems()]
  },
  userName: '张三',
  userAvatar: 'https://via.placeholder.com/40',
})

// 定义事件
const emit = defineEmits<{
  (e: 'select-history', id: string): void;
  (e: 'new-chat'): void;
  (e: 'update-user'): void;
}>()

// 状态管理
const isSidebarExpanded = ref<boolean>(true)
const selectedId = ref<string>('')
const historyItems = ref<HistoryItem[]>([...props.initialHistory])

// 重命名相关状态
const renamingId = ref<string | null>(null)
const newTitle = ref<string>('')

// 提供给子组件使用的状态和方法
provide('sidebar-state', {
  isExpanded: isSidebarExpanded,
  selectedId,
})

// 处理历史记录点击
const handleHistoryClick = (id: string) => {
  selectedId.value = id
  emit('select-history', id)
}

// 处理新对话点击
const handleNewChat = () => {
  selectedId.value = ''
  emit('new-chat')
}

// 处理个人信息修改
const handleUserInfoClick = () => {
  emit('update-user')
}

// 切换侧边栏
const toggleSidebar = () => {
  isSidebarExpanded.value = !isSidebarExpanded.value
}

// 处理重命名
const handleRename = (id: string) => {
  const item = historyItems.value.find(item => item.id === id)
  if (item) {
    renamingId.value = id
    newTitle.value = item.title
  }
}

// 保存重命名
const saveRename = () => {
  if (renamingId.value && newTitle.value.trim()) {
    const index = historyItems.value.findIndex(item => item.id === renamingId.value)
    if (index !== -1) {
      const updatedItem: HistoryItem = {
        id: renamingId.value,
        title: newTitle.value.trim(),
        timestamp: historyItems.value[index].timestamp
      }
      historyItems.value[index] = updatedItem
    }
  }
  cancelRename()
}

// 取消重命名
const cancelRename = () => {
  renamingId.value = null
  newTitle.value = ''
}

// 处理置顶
const handlePin = (id: string) => {
  const index = historyItems.value.findIndex(item => item.id === id)
  if (index > 0) {
    const item = historyItems.value[index]
    if (item) {
      historyItems.value.splice(index, 1)
      historyItems.value.unshift(item)
    }
  }
}

// 处理删除
const handleDelete = (id: string) => {
  if (confirm('确定要删除这条历史记录吗？')) {
    const index = historyItems.value.findIndex(item => item.id === id)
    if (index !== -1) {
      historyItems.value.splice(index, 1)
      if (selectedId.value === id) {
        selectedId.value = ''
      }
    }
  }
}

// 格式化时间函数
const formatTime = (date: Date): string => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  } else if (diffDays === 1) {
    return '昨天'
  } else if (diffDays < 7) {
    return `${diffDays}天前`
  } else {
    return `${date.getMonth() + 1}/${date.getDate()}`
  }
}

provide('format-time-fn', formatTime)

defineExpose({
  isSidebarExpanded
})
</script>

<template>
  <SideBarContainer 
    :is-expanded="isSidebarExpanded"
    @toggle="toggleSidebar"
    @new-chat="handleNewChat"
  >
    <!-- 默认插槽 - 放置 HistoryList -->
    <HistoryList 
      :history-items="historyItems"
      :selected-id="selectedId"
      :renaming-id="renamingId"
      :new-title="newTitle"
      @select="handleHistoryClick"
      @rename="handleRename"
      @pin="handlePin"
      @delete="handleDelete"
      @save-rename="saveRename"
      @cancel-rename="cancelRename"
      @update:new-title="(value) => newTitle = value"
    />
    
    <!-- 具名插槽 - 放置 UserFooter -->
    <template #footer>
      <UserFooter 
        :user-name="userName"
        :user-avatar="userAvatar"
        :is-expanded="isSidebarExpanded"
        @update-user="handleUserInfoClick"
      />
    </template>
  </SideBarContainer>
</template>