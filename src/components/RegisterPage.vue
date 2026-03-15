<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- 返回按钮 -->
    <div class="container mx-auto px-4 pt-8">
      <button 
        @click="goBack"
        class="flex items-center text-gray-600 transition-colors hover:text-[#8B0000]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        返回
      </button>
    </div>

    <!-- 主内容 -->
    <div class="container mx-auto flex min-h-[calc(100vh-120px)] items-center justify-center px-4 py-8">
      <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        
        <!-- 步骤提示 -->
        <div class="mb-8">
          <div class="flex items-center justify-between relative">
            <!-- 连接线背景 -->
            <div class="absolute left-0 right-0 top-5 h-[2px] bg-gray-300 -z-10"></div>
            
            <!-- 连接线进度 -->
            <div 
              class="absolute left-0 top-5 h-[2px] bg-[#8B0000] transition-all duration-300 -z-10"
              :style="{ width: progressWidth }"
            ></div>
            
            <!-- 步骤1 -->
            <div class="flex flex-col items-center bg-white px-2">
              <div 
                class="flex h-10 w-10 items-center justify-center rounded-full text-white transition-all"
                :class="currentStep >= 1 ? 'bg-[#8B0000]' : 'bg-gray-300'"
              >
                <span v-if="currentStep > 1" class="text-lg">✓</span>
                <span v-else class="text-lg">1</span>
              </div>
              <span class="mt-2 text-sm" :class="currentStep >= 1 ? 'text-[#8B0000]' : 'text-gray-400'">验证账号</span>
            </div>
            
            <!-- 步骤2 -->
            <div class="flex flex-col items-center bg-white px-2">
              <div 
                class="flex h-10 w-10 items-center justify-center rounded-full text-white transition-all"
                :class="currentStep >= 2 ? 'bg-[#8B0000]' : 'bg-gray-300'"
              >
                <span v-if="currentStep > 2" class="text-lg">✓</span>
                <span v-else class="text-lg">2</span>
              </div>
              <span class="mt-2 text-sm" :class="currentStep >= 2 ? 'text-[#8B0000]' : 'text-gray-400'">设置密码</span>
            </div>
            
            <!-- 步骤3 -->
            <div class="flex flex-col items-center bg-white px-2">
              <div 
                class="flex h-10 w-10 items-center justify-center rounded-full text-white transition-all"
                :class="currentStep >= 3 ? 'bg-[#8B0000]' : 'bg-gray-300'"
              >
                <span class="text-lg">3</span>
              </div>
              <span class="mt-2 text-sm" :class="currentStep >= 3 ? 'text-[#8B0000]' : 'text-gray-400'">注册成功</span>
            </div>
          </div>
        </div>

        <!-- 步骤1：验证账号 -->
        <div v-if="currentStep === 1" class="space-y-6">
          <h2 class="text-2xl font-bold text-gray-800">验证手机号或邮箱</h2>
          
          <!-- 账号输入框 -->
          <div>
            <input
              v-model="form.account"
              type="text"
              placeholder="手机号 / 邮箱"
              class="w-full rounded-lg border border-gray-300 p-3 transition-all focus:border-[#8B0000] focus:outline-none focus:ring-2 focus:ring-[#8B0000]/20"
            />
          </div>
          
          <!-- 提示文字 -->
          <p class="text-sm text-gray-500">建议使用常用手机号，便于接收通知</p>
          
          <!-- 验证码 -->
          <div class="flex gap-2">
            <input
              v-model="form.verificationCode"
              type="text"
              placeholder="请输入验证码"
              class="flex-1 rounded-lg border border-gray-300 p-3 transition-all focus:border-[#8B0000] focus:outline-none focus:ring-2 focus:ring-[#8B0000]/20"
            />
            <button
              @click="sendVerificationCode"
              :disabled="codeSending || codeCountdown > 0 || !form.account"
              class="whitespace-nowrap rounded-lg bg-gradient-to-r from-[#8B0000] to-[#FF69B4] px-4 py-3 text-white transition-all hover:brightness-75 disabled:opacity-50"
            >
              <span v-if="codeSending">发送中...</span>
              <span v-else-if="codeCountdown > 0">{{ codeCountdown }}秒后重发</span>
              <span v-else>获取验证码</span>
            </button>
          </div>

          <!-- 继续按钮 -->
          <button
            @click="nextStep"
            :disabled="!canProceedToStep2"
            class="w-full rounded-lg bg-gradient-to-r from-[#8B0000] via-[#FF0000] via-[#FF69B4] via-[#9370DB] to-[#8A2BE2] py-3 font-medium text-white transition-all hover:brightness-75 disabled:cursor-not-allowed disabled:opacity-50"
          >
            继续
          </button>
        </div>

        <!-- 步骤2：设置密码 -->
        <div v-else-if="currentStep === 2" class="space-y-6">
          <h2 class="text-2xl font-bold text-gray-800">设置密码</h2>
          
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">密码</label>
            <input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              class="w-full rounded-lg border border-gray-300 p-3 transition-all focus:border-[#8B0000] focus:outline-none focus:ring-2 focus:ring-[#8B0000]/20"
              @input="checkPasswordStrength"
            />
            
            <!-- 密码强度提示 -->
            <div class="mt-2">
              <div class="flex items-center gap-2">
                <!-- 强度指示条 -->
                <div class="flex gap-1 flex-1">
                  <div 
                    class="h-1 flex-1 rounded-full transition-all duration-300"
                    :class="[
                      passwordScore >= 1 ? strengthBarColor(1) : 'bg-gray-200',
                      passwordScore >= 2 ? strengthBarColor(2) : 'bg-gray-200',
                      passwordScore >= 3 ? strengthBarColor(3) : 'bg-gray-200'
                    ]"
                  ></div>
                </div>
                <!-- 强度文字 -->
                <span class="text-xs font-medium" :class="passwordStrengthColor">
                  {{ passwordStrength }}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">确认密码</label>
            <input
              v-model="form.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              class="w-full rounded-lg border border-gray-300 p-3 transition-all focus:border-[#8B0000] focus:outline-none focus:ring-2 focus:ring-[#8B0000]/20"
              :class="{ 'border-red-500': passwordMismatch }"
            />
            <p v-if="passwordMismatch" class="mt-1 text-xs text-red-500">两次输入的密码不一致</p>
          </div>

          <!-- 上一步/下一步按钮 -->
          <div class="flex gap-4">
            <button
              @click="prevStep"
              class="flex-1 rounded-lg border-2 border-[#8B0000] py-3 font-medium text-[#8B0000] transition-all hover:bg-[#8B0000] hover:text-white"
            >
              上一步
            </button>
            <button
              @click="nextStep"
              :disabled="!canProceedToStep3"
              class="flex-1 rounded-lg bg-gradient-to-r from-[#8B0000] via-[#FF0000] via-[#FF69B4] via-[#9370DB] to-[#8A2BE2] py-3 font-medium text-white transition-all hover:brightness-75 disabled:cursor-not-allowed disabled:opacity-50"
            >
              完成注册
            </button>
          </div>
        </div>

        <!-- 步骤3：注册成功 -->
        <div v-else-if="currentStep === 3" class="space-y-6 py-4 text-center">
          <!-- 成功图标 -->
          <div class="flex justify-center">
            <div class="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-[#8B0000] to-[#FF69B4]">
              <svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <h2 class="text-2xl font-bold text-gray-800">注册成功！</h2>
          <p class="text-gray-600">您的账号 {{ form.account }} 已成功创建</p>
          
          <!-- 返回登录 -->
          <div class="pt-6">
            <button
              @click="goToLogin"
              class="w-full rounded-lg bg-gradient-to-r from-[#8B0000] via-[#FF0000] via-[#FF69B4] via-[#9370DB] to-[#8A2BE2] py-3 font-medium text-white transition-all hover:brightness-75"
            >
              返回登录
            </button>
          </div>
          
          <!-- 提示 -->
          <p class="text-sm text-gray-500">
            我们已向您的邮箱/手机发送了确认信息，请注意查收
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 当前步骤
const currentStep = ref(1)

// 验证码发送状态
const codeSending = ref(false)
const codeCountdown = ref(0)

// 表单数据
const form = reactive({
  account: '',
  verificationCode: '',
  password: '',
  confirmPassword: ''
})

// 密码强度检查
const passwordCheck = computed(() => {
  const pwd = form.password
  
  return {
    lengthValid: pwd.length >= 8,
    hasLetter: /[a-zA-Z]/.test(pwd),
    hasNumber: /[0-9]/.test(pwd),
    hasUpperLower: /[a-z]/.test(pwd) && /[A-Z]/.test(pwd),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)
  }
})

// 密码得分 (0-3分)
const passwordScore = computed(() => {
  const check = passwordCheck.value
  let score = 0
  
  // 基础要求：长度至少8位且有字母和数字
  if (check.lengthValid && check.hasLetter && check.hasNumber) {
    score = 1 // 中等强度基础
  } else {
    return 0 // 弱强度
  }
  
  // 有大小写混合加1分
  if (check.hasUpperLower) {
    score++
  }
  
  // 有特殊字符加1分
  if (check.hasSpecial) {
    score++
  }
  
  return score
})

// 密码强度文字
const passwordStrength = computed(() => {
  if (!form.password) return ''
  
  const score = passwordScore.value
  
  if (score === 0) return '弱'
  if (score === 1) return '中'
  if (score >= 2) return '强'
  return ''
})

// 密码强度颜色
const passwordStrengthColor = computed(() => {
  const strength = passwordStrength.value
  
  if (strength === '弱') return 'text-red-500'
  if (strength === '中') return 'text-yellow-500'
  if (strength === '强') return 'text-green-500'
  return 'text-gray-500'
})

// 强度条颜色
const strengthBarColor = (level: number) => {
  const score = passwordScore.value
  
  if (score === 0 && level === 1) return 'bg-red-500'
  if (score === 1 && level <= 1) return 'bg-yellow-500'
  if (score === 2 && level <= 2) return 'bg-green-500'
  if (score === 3 && level <= 3) return 'bg-green-500'
  return 'bg-gray-200'
}

// 检查密码强度
const checkPasswordStrength = () => {
  // 计算属性会自动更新
}

// 计算进度条宽度
const progressWidth = computed(() => {
  if (currentStep.value === 1) return '0%'
  if (currentStep.value === 2) return '50%'
  if (currentStep.value === 3) return '100%'
  return '0%'
})

// 密码是否匹配
const passwordMismatch = computed(() => {
  if (form.password && form.confirmPassword) {
    return form.password !== form.confirmPassword
  }
  return false
})

// 是否可以进入第二步
const canProceedToStep2 = computed(() => {
  return form.account && form.verificationCode
})

// 是否可以进入第三步
const canProceedToStep3 = computed(() => {
  return form.password && 
         form.confirmPassword && 
         !passwordMismatch.value &&
         passwordScore.value >= 1 // 至少达到中等强度
})

// 发送验证码
const sendVerificationCode = () => {
  if (!form.account) {
    alert('请输入手机号或邮箱')
    return
  }
  
  codeSending.value = true
  
  // 模拟发送验证码
  setTimeout(() => {
    codeSending.value = false
    codeCountdown.value = 60
    
    const timer = setInterval(() => {
      codeCountdown.value--
      if (codeCountdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
    
    alert('验证码已发送：123456（演示模式）')
  }, 1000)
}

// 下一步
const nextStep = () => {
  if (currentStep.value === 1 && canProceedToStep2.value) {
    currentStep.value = 2
  } else if (currentStep.value === 2 && canProceedToStep3.value) {
    // 模拟注册请求
    setTimeout(() => {
      currentStep.value = 3
    }, 1000)
  }
}

// 上一步
const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 返回登录
const goToLogin = () => {
  router.push('/')
}
</script>