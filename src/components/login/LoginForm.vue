<!-- src/components/login/LoginForm.vue -->
<template>
  <form @submit.prevent="handleSubmit">
    <!-- 账号输入框 -->
    <div class="mb-4">
      <label class="mb-2 block text-sm font-medium text-gray-700">账号</label>
      <input
        v-model="localForm.account"
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
        v-model="localForm.password"
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

    <!-- 登录按钮 -->
    <button
      type="submit"
      :disabled="loading"
      class="w-full rounded-lg bg-gradient-to-r from-[#8B0000] via-[#FF0000] via-[#FF69B4] via-[#9370DB] to-[#8A2BE2] py-3 font-medium text-white transition-all hover:brightness-75 disabled:cursor-not-allowed disabled:opacity-70"
    >
      <span v-if="loading">登录中...</span>
      <span v-else>登录</span>
    </button>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

interface LoginForm {
  account: string
  password: string
}

defineProps<{
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', form: LoginForm): void
}>()

const localForm = reactive<LoginForm>({
  account: '',
  password: ''
})

const handleSubmit = () => {
  emit('submit', { ...localForm })
}
</script>