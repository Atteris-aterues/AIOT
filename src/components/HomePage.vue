<script setup lang="ts">
import VanishingInput from "./ui/vanishing-input/VanishingInput.vue";
import { ref } from "vue";

const placeholders = [
  "协助制作教学大纲",
  "文档润色",
  "帮助设计PPT",
  "分析知识点重点",
  "设计课堂活动",
];
const text = ref("");
</script>

<template>
  <div class="flex h-160 flex-col items-center justify-center px-4">
    <h2 class="mb-10 text-center text-xl font-bold text-black sm:mb-20 sm:text-5xl dark:text-white">
      有什么需要帮助的吗?
    </h2>
    <VanishingInput
      v-model="text"
      :placeholders="placeholders"
    />
  </div>
</template>