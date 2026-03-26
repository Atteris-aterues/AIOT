<!-- src/components/login/LoginModal.vue -->
<template>
  <Transition name="fade">
    <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- 背景遮罩 -->
      <div class="absolute inset-0 bg-black/50" @click="handleClose"></div>
      
      <!-- 登录卡片 -->
      <div class="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <!-- 关闭按钮 -->
        <button 
          @click="handleClose"
          class="absolute right-4 top-4 text-gray-400 transition-colors hover:text-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- 标题 -->
        <h2 class="mb-6 text-center text-3xl font-bold text-gray-800">欢迎回来</h2>
        
        <!-- 登录表单 -->
        <LoginForm 
          :loading="loading"
          :show-mock-hint="true"
          @submit="handleLogin"
        />

        <!-- 注册提示 -->
        <p class="mt-6 text-center text-sm text-gray-600">
          还没有账号？
          <a 
            href="#" 
            @click.prevent="goToRegister"
            class="font-medium text-[#8B0000] transition-colors hover:text-[#FF69B4]"
          >
            立即注册
          </a>
        </p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LoginForm from './LoginForm.vue'

// Props
defineProps<{
  visible: boolean
}>()

// Emits
const emit = defineEmits<{
  (e: 'close'): void
}>()

const router = useRouter()
const loading = ref(false)

// 假数据 - 测试账户
const MOCK_USERS = [
  {
    account: 'test@example.com',
    password: '123456',
    username: '测试用户'
  }
]

// 关闭登录框
const handleClose = () => {
  emit('close')
}

// 登录处理
const handleLogin = async (form: { account: string; password: string }) => {
  loading.value = true
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // 验证账号密码
  const user = MOCK_USERS.find(
    u => u.account === form.account && u.password === form.password
  )

  if (user) {
    // 登录成功
    console.log('登录成功:', user)
    
    // 可以在这里保存登录状态，比如使用 localStorage
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('username', user.username)
    
    // 关闭登录框
    handleClose()
    
    // 跳转到首页
    router.push('/home')
  } else {
    // 登录失败
    alert('账号或密码错误！\n\n测试账号：\n账号：test@example.com / 13800138000 / demo\n密码：123456 / demo123')
  }
  
  loading.value = false
}

// 跳转到注册页面
const goToRegister = () => {
  handleClose()
  router.push('/register')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>