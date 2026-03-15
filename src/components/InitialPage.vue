<template>
  <div class="relative">
    <WavyBackground class="mx-auto max-w-4xl pb-40">
      <p class="inter-var text-center text-2xl font-bold text-black md:text-4xl lg:text-7xl">
        AIOT智能教学系统
      </p>
      <p class="inter-var mt-4 text-center text-base font-normal text-black md:text-lg">
        在对话中，渐进赋能每一课
      </p>
      
      <!-- 圆角按钮 -->
      <div class="mt-12 flex justify-center">
        <button 
          @click="showLogin = true"
          class="rounded-full bg-black px-8 py-3 text-white transition-all hover:bg-gray-800 hover:shadow-lg"
        >
          开始体验
        </button>
      </div>
    </WavyBackground>

    <!-- 登录盒子组件 -->
    <LoginBox 
      :visible="showLogin"
      @close="showLogin = false"
      @login="handleLogin"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WavyBackground from './ui/wavy-background/WavyBackground.vue'
import LoginBox from './login/LoginBox.vue'

// 控制登录框显示
const showLogin = ref(false)

// 处理登录
const handleLogin = (data: { account: string; password: string }) => {
  console.log('登录数据:', data)
  // 这里处理实际的登录逻辑
  // 可以调用API、存储token等
}
</script>