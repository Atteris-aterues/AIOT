<!-- src/views/admin/components/SensitiveWordList.vue -->
<template>
  <div class="sensitive-word-list">
    <div class="list-header">
      <h3 class="section-title">敏感词管理</h3>
      <button class="add-btn" @click="openAddDialog">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        添加敏感词
      </button>
    </div>

    <div class="word-table">
      <table>
        <thead>
          <tr>
            <th>序号</th>
            <th>敏感词</th>
            <th>添加时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in words" :key="item.id">
            <td>{{ index + 1 }}</td>
            <td>
              <span v-if="editingId !== item.id" class="word-text">{{ item.word }}</span>
              <input 
                v-else 
                v-model="editWord" 
                class="edit-input" 
                @keyup.enter="saveEdit(item.id)"
              />
            </td>
            <td>{{ formatTime(item.createdAt) }}</td>
            <td class="actions">
              <button v-if="editingId !== item.id" class="edit-btn" @click="startEdit(item)">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 3l4 4-7 7H10v-4l7-7z" />
                  <path d="M4 20h16" />
                </svg>
              </button>
              <button v-else class="save-btn" @click="saveEdit(item.id)">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>
              <button class="delete-btn" @click="handleDelete(item.id)">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </td>
          </tr>
          <tr v-if="words.length === 0">
            <td colspan="4" class="empty-state">暂无敏感词，点击上方按钮添加</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 添加敏感词弹窗 -->
    <div v-if="showAddDialog" class="dialog-overlay" @click.self="closeAddDialog">
      <div class="dialog-content">
        <h4>添加敏感词</h4>
        <input 
          v-model="newWord" 
          type="text" 
          placeholder="请输入敏感词" 
          class="dialog-input"
          @keyup.enter="confirmAdd"
        />
        <div class="dialog-actions">
          <button class="cancel-btn" @click="closeAddDialog">取消</button>
          <button class="confirm-btn" @click="confirmAdd">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { SensitiveWord } from '../types'

const props = defineProps<{
  words: SensitiveWord[]
}>()

const emit = defineEmits<{
  (e: 'add', word: string): void
  (e: 'update', id: string, word: string): void
  (e: 'delete', id: string): void
}>()

const showAddDialog = ref(false)
const newWord = ref('')
const editingId = ref<string | null>(null)
const editWord = ref('')

const formatTime = (time?: string) => {
  if (!time) return '-'
  return new Date(time).toLocaleString()
}

const openAddDialog = () => {
  newWord.value = ''
  showAddDialog.value = true
}

const closeAddDialog = () => {
  showAddDialog.value = false
  newWord.value = ''
}

const confirmAdd = () => {
  if (!newWord.value.trim()) {
    ElMessage.warning('请输入敏感词')
    return
  }
  emit('add', newWord.value.trim())
  closeAddDialog()
}

const startEdit = (item: SensitiveWord) => {
  editingId.value = item.id
  editWord.value = item.word
}

const saveEdit = (id: string) => {
  if (!editWord.value.trim()) {
    ElMessage.warning('敏感词不能为空')
    return
  }
  emit('update', id, editWord.value.trim())
  editingId.value = null
  editWord.value = ''
}

const handleDelete = (id: string) => {
  ElMessageBox.confirm(
    '确定要删除这个敏感词吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    emit('delete', id)
  }).catch(() => {})
}
</script>

<style scoped>
.sensitive-word-list {
  background: white;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #dc2626;
  margin: 0;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #dc2626, #7e66ea);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

.word-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

th {
  font-weight: 600;
  color: #374151;
  background: #fafafa;
}

td {
  color: #4b5563;
}

.word-text {
  font-weight: 500;
  color: #1f2937;
}

.edit-input {
  padding: 6px 10px;
  border: 1px solid #dc2626;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  width: 150px;
}

.actions {
  display: flex;
  gap: 8px;
}

.edit-btn, .save-btn, .delete-btn {
  padding: 6px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.edit-btn {
  background: #fef3c7;
  color: #d97706;
}
.edit-btn:hover {
  background: #fde68a;
}

.save-btn {
  background: #d1fae5;
  color: #10b981;
}
.save-btn:hover {
  background: #a7f3d0;
}

.delete-btn {
  background: #fee2e2;
  color: #dc2626;
}
.delete-btn:hover {
  background: #fecaca;
}

.empty-state {
  text-align: center;
  color: #9ca3af;
  padding: 40px;
}

/* 弹窗样式 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-content {
  background: white;
  border-radius: 16px;
  padding: 24px;
  width: 320px;
  animation: fadeIn 0.2s ease;
}

.dialog-content h4 {
  font-size: 18px;
  font-weight: 600;
  color: #dc2626;
  margin-bottom: 16px;
}

.dialog-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  margin-bottom: 20px;
}

.dialog-input:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.1);
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn {
  padding: 8px 16px;
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: #6b7280;
}

.confirm-btn {
  padding: 8px 16px;
  background: linear-gradient(135deg, #dc2626, #7e66ea);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: white;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>