<!-- src/components/ui/vanishing-input/VanishingInput.vue -->
<template>
  <div class="vanishing-input-container">
    <!-- 主输入表单 -->
    <form
      :class="
        cn(
          `relative mx-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200`,
          vanishingText && 'bg-gray-50',
        )
      "
      @submit.prevent="handleSubmit"
    >
      <!-- Canvas Element -->
      <canvas
        ref="canvasRef"
        :class="
          cn(
            `pointer-events-none absolute top-[20%] left-2 origin-top-left scale-50 pr-20 text-base invert sm:left-8 dark:invert-0`,
            animating ? 'opacity-100' : 'opacity-0',
          )
        "
      />

      <!-- 输入框容器 - 左右布局 -->
      <div class="input-wrapper">
        <!-- 左侧输入区域（包含 AdaptiveTextarea 和动画提示词） -->
        <div class="input-area-left">
          <AdaptiveTextarea
            ref="textareaRef"
            v-model="vanishingText"
            :placeholder="''"
            :disabled="animating || isGenerating"
            :min-rows="1"
            :max-rows="5"
            @submit="handleSubmit"
          />
          
          <!-- 动画提示词（覆盖在输入框上） -->
          <div class="placeholder-overlay">
            <Transition
              v-show="!vanishingText"
              mode="out-in"
              enter-active-class="transition duration-300 ease-out"
              leave-active-class="transition duration-300 ease-in"
              enter-from-class="opacity-0 translate-y-4"
              enter-to-class="opacity-100 translate-y-0"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-4"
            >
              <p
                :key="currentPlaceholder"
                class="placeholder-text"
              >
                {{ placeholders[currentPlaceholder] }}
              </p>
            </Transition>
          </div>
        </div>

        <!-- 右侧按钮区域（垂直居中） -->
        <div class="button-area-right">
          <!-- 停止按钮（生成时显示） -->
          <StopButton
            v-if="isGenerating"
            :is-generating="isGenerating"
            @stop="handleStopGeneration"
          />
          
          <!-- 文件上传按钮（非生成时显示） -->
          <button
            v-else
            type="button"
            @click="toggleFileUploader"
            class="action-btn"
            :class="{
              'upload-active': uploadedFiles.length > 0,
            }"
            :title="uploadedFiles.length > 0 ? `已选择 ${uploadedFiles.length} 个文件` : '上传文件'"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </button>

          <!-- Submit Button / 发送按钮（非生成时显示） -->
          <button
            v-if="!isGenerating"
            :disabled="!vanishingText && uploadedFiles.length === 0"
            type="submit"
            class="action-btn submit-btn"
            :class="{
              'submit-active': vanishingText || uploadedFiles.length > 0,
            }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M5 12l14 0" />
              <path d="M13 18l6 -6" />
              <path d="M13 6l6 6" />
            </svg>
          </button>
        </div>
      </div>
    </form>

    <!-- 文件上传器面板（展开/折叠） -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="showFileUploader"
        class="mt-2 w-full max-w-2xl mx-auto"
      >
        <FileUploader
          @files-selected="handleFilesSelected"
          @file-removed="handleFileRemoved"
          @files-cleared="handleFilesCleared"
          :max-file-size="100 * 1024 * 1024" 
        />
        
        <!-- 显示已上传文件数量 -->
        <div
          v-if="uploadedFiles.length > 0"
          class="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right"
        >
          已选择 {{ uploadedFiles.length }} 个文件
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { cn } from "@inspira-ui/plugins";
import { onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from "vue";
import FileUploader from './FileUploader/index.vue'
import AdaptiveTextarea from './AdaptiveTextarea.vue'
import StopButton from './StopButton.vue'
import type { UploadedFile } from "./FileUploader/types"; 

// Define interfaces for props and data structures
interface Props {
  placeholders?: string[];
  isGenerating?: boolean;  // 新增：是否正在生成
}

interface PixelData {
  x: number;
  y: number;
  color: string;
}

interface AnimatedPixel extends PixelData {
  r: number;
}

// props
const props = withDefaults(defineProps<Props>(), {
  placeholders: () => ["Placeholder 1", "Placeholder 2", "Placeholder 3"],
  isGenerating: false,
});

// emits
const emit = defineEmits<{
  (e: "update:modelValue", value: string): void
  (e: "submit", data: { text: string; files: UploadedFile[] }): void
  (e: "change", event: any): void
  (e: "stop-generation"): void  // 新增：停止生成事件
}>();

const vanishingText = defineModel<string>({
  default: "",
});
const canvasRef = useTemplateRef<HTMLCanvasElement>("canvasRef");
const textareaRef = useTemplateRef<InstanceType<typeof AdaptiveTextarea>>("textareaRef");

// 存储上传的文件
const uploadedFiles = ref<UploadedFile[]>([]);
const showFileUploader = ref<boolean>(false);

// normal refs
const currentPlaceholder = ref<number>(0);
const animating = ref<boolean>(false);
const intervalRef = ref<number | null>(null);
const newDataRef = ref<AnimatedPixel[]>([]);
const animationFrame = ref<number | null>(null);

// Focus on input when mounted
onMounted(() => {
  if (!textareaRef.value) return;
  textareaRef.value.focus();
});

function changePlaceholder(): void {
  intervalRef.value = window.setInterval(() => {
    currentPlaceholder.value = (currentPlaceholder.value + 1) % props.placeholders.length;
  }, 3000);
}

function handleVisibilityChange(): void {
  if (document.visibilityState !== "visible" && intervalRef.value) {
    clearInterval(intervalRef.value);
    intervalRef.value = null;
  } else if (document.visibilityState === "visible") {
    changePlaceholder();
  }
}

function draw(): void {
  if (!textareaRef.value || !canvasRef.value) return;

  const canvas = canvasRef.value;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // 获取 textarea 的计算样式
  const textareaElement = textareaRef.value.$el as HTMLElement;
  const computedStyles = getComputedStyle(textareaElement);

  canvas.width = 800;
  canvas.height = 800;
  ctx.clearRect(0, 0, 800, 800);

  const fontSize = Number.parseFloat(computedStyles.getPropertyValue("font-size"));
  ctx.font = `${fontSize * 2}px ${computedStyles.fontFamily}`;
  ctx.fillStyle = "#FFF";
  ctx.fillText(vanishingText.value, 16, 40);

  const imageData = ctx.getImageData(0, 0, 800, 800);
  const pixelData = imageData.data;
  const newData: PixelData[] = [];

  for (let t = 0; t < 800; t++) {
    const i = 4 * t * 800;
    for (let n = 0; n < 800; n++) {
      const e = i + 4 * n;
      if (pixelData[e] !== 0 && pixelData[e + 1] !== 0 && pixelData[e + 2] !== 0) {
        newData.push({
          x: n,
          y: t,
          color: `rgba(${pixelData[e]}, ${pixelData[e + 1]}, ${pixelData[e + 2]}, ${pixelData[e + 3]})`,
        });
      }
    }
  }
  newDataRef.value = newData.map(({ x, y, color }) => ({ x, y, r: 1, color }));
}

function animate(start: number = 0): void {
  animationFrame.value = requestAnimationFrame(() => {
    const newArr: AnimatedPixel[] = [];
    for (const current of newDataRef.value) {
      if (current.x < start) {
        newArr.push(current);
      } else {
        if (current.r <= 0) {
          current.r = 0;
          continue;
        }
        current.x += Math.random() > 0.5 ? 1 : -1;
        current.y += Math.random() > 0.5 ? 1 : -1;
        current.r -= 0.05 * Math.random();
        newArr.push(current);
      }
    }
    newDataRef.value = newArr;
    const ctx = canvasRef.value?.getContext("2d");
    if (ctx) {
      ctx.clearRect(start, 0, 800, 800);
      newDataRef.value.forEach(({ x, y, r, color }) => {
        if (x > start) {
          ctx.beginPath();
          ctx.rect(x, y, r, r);
          ctx.fillStyle = color;
          ctx.strokeStyle = color;
          ctx.stroke();
        }
      });
    }
    if (newDataRef.value.length > 0) {
      animate(start - 8);
    } else {
      vanishingText.value = "";
      animating.value = false;
      setTimeout(() => {
        // regain focus after animation
        textareaRef.value?.focus();
      }, 100);
    }
  });
}

function vanishAndSubmit(): void {
  console.log('vanishAndSubmit called, text:', vanishingText.value, 'files:', uploadedFiles.value.length)
  
  animating.value = true;
  draw();
  if (vanishingText.value || uploadedFiles.value.length > 0) {
    const maxX = Math.max(...newDataRef.value.map(({ x }) => x));
    animate(maxX);
    // 提交时同时携带文本和文件
    console.log('Emitting submit event')
    emit("submit", {
      text: vanishingText.value,
      files: uploadedFiles.value,
    });
  }
}

function handleSubmit(): void {
  vanishAndSubmit();
}

// 停止生成
function handleStopGeneration(): void {
  console.log('Stop generation requested')
  emit('stop-generation')
}

// 处理文件选择 - 直接替换文件列表
function handleFilesSelected(files: UploadedFile[]): void {
  uploadedFiles.value = files;
}

// 处理文件移除 - 根据索引移除文件
function handleFileRemoved(index: number): void {
  uploadedFiles.value = uploadedFiles.value.filter((_, i) => i !== index);
}

// 处理清空文件
function handleFilesCleared(): void {
  uploadedFiles.value = [];
}

// 切换文件上传器显示
function toggleFileUploader(): void {
  showFileUploader.value = !showFileUploader.value;
}

// Watch for value changes
watch(vanishingText, (newVal: string) => {
  if (!animating.value) {
    emit("change", { target: { value: newVal } });
  }
});

onMounted(() => {
  changePlaceholder();
  document.addEventListener("visibilitychange", handleVisibilityChange);
});

onBeforeUnmount(() => {
  if (intervalRef.value) {
    clearInterval(intervalRef.value);
  }
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value);
  }
  document.removeEventListener("visibilitychange", handleVisibilityChange);
});
</script>

<style scoped>
.vanishing-input-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

/* 输入框容器 - 左右布局 */
.input-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px 8px 16px;
  min-height: 52px;
  width: 100%;
  position: relative;
}

/* 左侧输入区域 - 自适应宽度，相对定位用于提示词覆盖 */
.input-area-left {
  flex: 1;
  min-width: 0;
  position: relative;
}

/* 提示词覆盖层 */
.placeholder-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  pointer-events: none;
  padding: 0;
}

.placeholder-text {
  color: #9ca3af;
  font-size: 0.95rem;
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  margin: 0;
  padding: 0;
}

/* 右侧按钮区域 - 固定宽度，垂直居中 */
.button-area-right {
  display: flex;
  gap: 4px;
  align-items: center;
  flex-shrink: 0;
  height: 100%;
}

/* 按钮基础样式 */
.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
  color: #9ca3af;
  flex-shrink: 0;
}

.action-btn:hover {
  background: #f3f4f6;
  color: #6b7280;
}

/* 上传按钮激活状态 */
.action-btn.upload-active {
  color: #f43f5e;
}

.action-btn.upload-active:hover {
  background: #fef2f2;
  color: #e11d48;
}

/* 提交按钮激活状态 */
.submit-btn.submit-active {
  background: #f43f5e;
  color: white;
}

.submit-btn.submit-active:hover {
  background: #e11d48;
  transform: scale(1.05);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.submit-btn:disabled:hover {
  transform: none;
  background: transparent;
}

/* 确保表单自适应高度 */
form {
  min-height: 52px;
  transition: min-height 0.2s ease;
}
</style>