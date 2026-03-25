// SideBar/UserFooter.vue（使用 Tailwind CSS）
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'

interface Props {
  userName: string;
  userAvatar: string;
  isExpanded: boolean;
}

const props = defineProps<Props>()
const router = useRouter()
const showTooltip = ref(false)

// 处理鼠标进入事件
const handleMouseEnter = () => {
  showTooltip.value = true
}

// 处理鼠标离开事件
const handleMouseLeave = () => {
  showTooltip.value = false
}

// 跳转到个人信息页面
const goToPersonalPage = () => {
  router.push('/personal')
}
</script>

<template>
  <div class="relative w-full">
    <div
      @click="goToPersonalPage"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      class="p-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-3 cursor-pointer transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
      :class="[isExpanded ? 'justify-start' : 'justify-center']"
    >
      <!-- 头像 -->
      <img
        :src="userAvatar"
        alt="avatar"
        class="w-8 h-8 rounded-full object-cover flex-shrink-0 border-2 border-gray-700 dark:border-gray-400"
      />
      <!-- 用户名 (展开时显示) -->
      <span v-if="isExpanded" class="text-sm font-medium text-gray-900 dark:text-gray-50 truncate">
        {{ userName }}
      </span>
    </div>
    
    <!-- 提示框 -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showTooltip"
        class="absolute z-50 px-3 py-1.5 text-xs text-white bg-gray-800 dark:bg-gray-700 rounded-md shadow-lg whitespace-nowrap pointer-events-none"
        :class="[
          'left-full top-1/2 -translate-y-1/2 ml-3',
          'after:content-[\'\'] after:absolute after:right-full after:top-1/2 after:-translate-y-1/2 after:border-4 after:border-transparent after:border-r-gray-800 dark:after:border-r-gray-700'
        ]"
      >
        点击修改个人信息
      </div>
    </Transition>
  </div>
</template>