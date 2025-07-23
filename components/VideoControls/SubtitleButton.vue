<template>
  <button 
    @click="$emit('toggle')"
    class="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded transition-colors relative"
  >
    <IconSub class="w-4 h-4" />
    <div 
      v-if="enabled"
      class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-red-500 rounded-full"
    ></div>
  </button>
</template>

<script setup lang="ts">
import IconSub from '~/components/Icons/IconSub.vue';

defineProps<{
  enabled: boolean;
}>();

defineEmits<{
  toggle: [];
}>();
</script> 