<template>
  <button 
    @click="$emit('click')"
    class="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded transition-colors"
  >
    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/>
    </svg>
  </button>
</template>

<script setup lang="ts">
defineEmits<{
  click: [];
}>();
</script> 