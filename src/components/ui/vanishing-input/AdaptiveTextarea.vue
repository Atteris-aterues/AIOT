<!-- src/components/ui/vanishing-input/AdaptiveTextarea.vue -->
<template>
  <div class="adaptive-textarea-wrapper">
    <textarea
      ref="textareaRef"
      v-model="localValue"
      placeholder=""
      :disabled="disabled"
      :rows="minRows"
      class="adaptive-textarea"
      :class="{ 'has-scroll': isScrollable }"
      @input="handleInput"
      @keydown.enter="handleEnter"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
  disabled?: boolean
  minRows?: number
  maxRows?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'submit'): void
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const localValue = ref(props.modelValue)
const isScrollable = ref(false)

// 默认最小行数
const minRows = props.minRows || 1
// 最大行数
const maxRows = props.maxRows || 5

// 计算行高
const lineHeight = 24

// 监听外部值变化
watch(() => props.modelValue, (newVal) => {
  if (newVal !== localValue.value) {
    localValue.value = newVal
    adjustHeight()
  }
})

// 调整高度
const adjustHeight = async () => {
  await nextTick()
  if (!textareaRef.value) return
  
  const textarea = textareaRef.value
  
  // 重置高度以获取正确的 scrollHeight
  textarea.style.height = 'auto'
  
  const scrollHeight = textarea.scrollHeight
  const maxHeight = maxRows * lineHeight
  
  if (scrollHeight > maxHeight) {
    // 超过最大高度，固定高度并启用滚动
    textarea.style.height = `${maxHeight}px`
    isScrollable.value = true
  } else {
    // 自适应高度
    textarea.style.height = `${scrollHeight}px`
    isScrollable.value = false
  }
}

// 处理输入
const handleInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement
  localValue.value = target.value
  emit('update:modelValue', target.value)
  adjustHeight()
}

// 处理回车键
const handleEnter = (e: KeyboardEvent) => {
  // 如果按的是 Enter 键且没有按 Shift 键，则提交
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    emit('submit')
  }
}

// 初始调整高度
watch(() => localValue.value, () => {
  adjustHeight()
}, { immediate: true })

// 暴露方法
defineExpose({
  focus: () => textareaRef.value?.focus(),
  blur: () => textareaRef.value?.blur()
})
</script>

<style scoped>
.adaptive-textarea-wrapper {
  width: 100%;
  position: relative;
}

.adaptive-textarea {
  width: 100%;
  padding: 8px 0;
  border: none;
  background: transparent;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #1f2937;
  font-family: inherit;
  resize: none;
  outline: none;
  transition: all 0.2s;
  overflow-y: auto;
}

.adaptive-textarea.has-scroll {
  overflow-y: auto;
}

/* 自定义滚动条 - 在右侧 */
.adaptive-textarea::-webkit-scrollbar {
  width: 6px;
}

.adaptive-textarea::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 3px;
}

.adaptive-textarea::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.adaptive-textarea::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>