<template>
  <div class="aspect-video bg-gray-900 flex items-center justify-center">
    <!-- Loading State -->
    <div v-if="loading" class="text-center text-white">
      <div class="text-lg mb-2">در حال بارگذاری ویدیو...</div>
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="text-center text-white">
      <div class="text-red-500 text-lg mb-2">خطا در بارگذاری ویدیو</div>
      <div class="text-sm text-gray-400 mb-4">{{ error }}</div>
      <button 
        @click="$emit('retry')" 
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
      >
        تلاش مجدد
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  loading: boolean;
  error?: string;
}

defineProps<Props>();

defineEmits<{
  retry: [];
}>();
</script> 