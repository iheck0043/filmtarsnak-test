<template>
  <div class="text-sm font-mono">
    {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentTime: number;
  duration: number;
}>();

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
</script> 