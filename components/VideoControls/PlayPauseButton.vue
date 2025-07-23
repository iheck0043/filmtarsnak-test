<template>
  <button 
    @click="$emit('toggle')"
    class="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded transition-colors"
  >
    <svg v-if="!isPlaying" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z"/>
    </svg>
    <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
    </svg>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  isPlaying: boolean;
}>();

defineEmits<{
  toggle: [];
}>();
</script> 