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
        <form @submit.prevent="handleLogin">
          <!-- 账号输入框 -->
          <div class="mb-4">
            <label class="mb-2 block text-sm font-medium text-gray-700">账号</label>
            <input
              v-model="form.account"
              type="text"
              placeholder="手机号 / 邮箱"
              class="w-full rounded-lg border border-gray-300 p-3 transition-all focus:border-[#8B0000] focus:outline-none focus:ring-2 focus:ring-[#8B0000]/20"
              required
            />
          </div>

          <!-- 密码输入框 -->
          <div class="mb-6">
            <label class="mb-2 block text-sm font-medium text-gray-700">密码</label>
            <input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              class="w-full rounded-lg border border-gray-300 p-3 transition-all focus:border-[#8B0000] focus:outline-none focus:ring-2 focus:ring-[#8B0000]/20"
              required
            />
          </div>

          <!-- 记住密码和忘记密码 -->
          <div class="mb-6 flex items-center justify-between">
            <label class="flex items-center">
              <input type="checkbox" class="rounded border-gray-300 text-[#8B0000] focus:ring-[#8B0000]" />
              <span class="ml-2 text-sm text-gray-600">记住密码</span>
            </label>
            <a href="#" class="text-sm text-[#8B0000] transition-colors hover:text-[#FF69B4]">忘记密码？</a>
          </div>

          <!-- 登录按钮 - 五色渐变 -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full rounded-lg bg-gradient-to-r from-[#8B0000] via-[#FF0000] via-[#FF69B4] via-[#9370DB] to-[#8A2BE2] py-3 font-medium text-white transition-all hover:brightness-75 disabled:cursor-not-allowed disabled:opacity-70"
            :class="{ 'hover:brightness-75': !loading }"
          >
            <span v-if="loading">登录中...</span>
            <span v-else>登录</span>
          </button>

          <!-- 注册提示 - 修改这里，添加点击事件 -->
          <p class="mt-4 text-center text-sm text-gray-600">
            还没有账号？
            <a 
              href="#" 
              @click.prevent="goToRegister"
              class="font-medium text-[#8B0000] transition-colors hover:text-[#FF69B4]"
            >
              立即注册
            </a>
          </p>
        </form>

        <!-- 其他登录方式 -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="bg-white px-2 text-gray-500">其他登录方式</span>
            </div>
          </div>

          <div class="mt-6 flex justify-center gap-4">
            <!-- 使用之前提供的色号作为辅助色 -->
            <button class="rounded-full bg-[#818cf8] p-3 text-white transition-all hover:scale-110 hover:bg-[#8B0000]">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 16.991 22 12z"/>
              </svg>
            </button>
            <button class="rounded-full bg-[#22d3ee] p-3 text-white transition-all hover:scale-110 hover:bg-[#8B0000]">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
              </svg>
            </button>
            <button class="rounded-full bg-[#c084fc] p-3 text-white transition-all hover:scale-110 hover:bg-[#8B0000]">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

// Props
defineProps<{
  visible: boolean
}>()

// Emits
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'login', data: { account: string; password: string }): void
}>()

// 获取路由实例
const router = useRouter()

// 表单数据
const form = reactive({
  account: '',
  password: ''
})

// 加载状态
const loading = ref(false)

// 关闭登录框
const handleClose = () => {
  emit('close')
}

// 登录处理
const handleLogin = async () => {
  loading.value = true
  try {
    // 模拟登录请求
    await new Promise(resolve => setTimeout(resolve, 1500))
    emit('login', { ...form })
    // 登录成功后可以自动关闭
    handleClose()
    // 可以在这里添加成功提示
  } catch (error) {
    console.error('登录失败', error)
  } finally {
    loading.value = false
  }
}

// 跳转到注册页面
const goToRegister = () => {
  handleClose() // 先关闭登录框
  router.push('/register') // 跳转到注册页面
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