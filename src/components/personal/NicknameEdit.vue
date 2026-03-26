<!-- src/components/personal/NicknameEdit.vue -->
<template>
  <div class="info-section">
    <label class="section-label">昵称</label>
    <div class="nickname-wrapper">
      <input 
        v-model="localNickname" 
        type="text" 
        class="nickname-input"
        placeholder="请输入昵称"
      />
      <button class="save-btn" @click="handleSave">保存</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  nickname: string
}>()

const emit = defineEmits<{
  (e: 'update:nickname', value: string): void
}>()

const localNickname = ref(props.nickname)

watch(() => props.nickname, (newVal) => {
  localNickname.value = newVal
})

const handleSave = () => {
  if (!localNickname.value.trim()) {
    ElMessage.warning('昵称不能为空')
    return
  }
  emit('update:nickname', localNickname.value)
  ElMessage.success('昵称修改成功')
}
</script>

<style scoped>
.info-section {
  margin-bottom: 28px;
}

.section-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
}

.nickname-wrapper {
  display: flex;
  gap: 12px;
}

.nickname-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.2s;
  outline: none;
}

.nickname-input:focus {
  border-color: #7e66ea;
  box-shadow: 0 0 0 2px rgba(126, 102, 234, 0.1);
}

.save-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #dc2626 0%, #7e66ea 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.save-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}
</style>