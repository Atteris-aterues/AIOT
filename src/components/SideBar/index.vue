// SideBar/index.vue
<script setup lang="ts">
import SideBarContainer from './SideBarContainer.vue'
import HistoryList from './HistoryList.vue'
import UserFooter from './UserFooter.vue'
import { ref, provide, onMounted } from 'vue'
import { getSessionList, renameSession, pinSession, deleteSession } from '@/api/chat'
import { ElMessage } from 'element-plus'

// 定义历史记录项的类型
interface HistoryItem {
  id: string;
  title: string;
  timestamp: Date;
  pinned?: boolean;
}

// 定义组件 Props
interface Props {
  userName?: string;
  userAvatar?: string;
}

const props = withDefaults(defineProps<Props>(), {
  userName: '张三',
  userAvatar: 'https://placehold.co/40x40',
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
const historyItems = ref<HistoryItem[]>([])
const loading = ref(false)

// 获取会话列表
const fetchSessionList = async () => {
  loading.value = true
  try {
    const res = await getSessionList({
      keyword: '',
      page: 1,
      size: 50
    })
    if (res.code === 200) {
      historyItems.value = res.data.items.map(item => ({
        id: item.sessionId,
        title: item.title,
        timestamp: new Date(item.updateTime || item.createTime),
        pinned: item.pinned
      }))
    }
  } catch (error) {
    console.error('获取会话列表失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSessionList()
})

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
const saveRename = async () => {
  if (renamingId.value && newTitle.value.trim()) {
    try {
      const res = await renameSession({
        sessionId: renamingId.value,
        title: newTitle.value.trim()
      })
      if (res.code === 200) {
        const index = historyItems.value.findIndex((item) => item.id === renamingId.value)
        if (index !== -1 && historyItems.value[index]) {
          historyItems.value[index]!.title = res.data.title
        }
        ElMessage.success('重命名成功')
      }
    } catch (error) {
      console.error('重命名失败:', error)
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
const handlePin = async (id: string) => {
  const item = historyItems.value.find(item => item.id === id)
  if (!item) return

  try {
    const res = await pinSession({
      sessionId: id,
      pin: !item.pinned
    })
    if (res.code === 200) {
      item.pinned = res.data.pinned
      // 重新排序：置顶的放前面
      historyItems.value.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1
        if (!a.pinned && b.pinned) return 1
        return b.timestamp.getTime() - a.timestamp.getTime()
      })
      ElMessage.success(item.pinned ? '已置顶' : '已取消置顶')
    }
  } catch (error) {
    console.error('置顶操作失败:', error)
  }
}

// 处理删除
const handleDelete = async (id: string) => {
  if (confirm('确定要删除这条历史记录吗？')) {
    try {
      const res = await deleteSession({ sessionId: id })
      if (res.code === 200) {
        const index = historyItems.value.findIndex(item => item.id === id)
        if (index !== -1) {
          historyItems.value.splice(index, 1)
          if (selectedId.value === id) {
            selectedId.value = ''
            emit('new-chat') // 如果删除了当前选中的，跳转到新对话
          }
        }
        ElMessage.success('删除成功')
      }
    } catch (error) {
      console.error('删除会话失败:', error)
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
  isSidebarExpanded,
  fetchSessionList
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