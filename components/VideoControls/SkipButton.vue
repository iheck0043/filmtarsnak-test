<template>
  <button 
    @click="$emit('skip')"
    class="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded transition-colors"
  >
    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
    </svg>
  </button>
</template>

<script setup lang="ts">
defineEmits<{
  skip: [];
}>();
</script> 