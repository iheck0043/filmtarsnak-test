<template>
  <div class="bg-[#111111] text-white min-h-screen flex items-center justify-center">
    <p>Redirecting to player...</p>
  </div>
</template>

<script setup lang="ts">
import { navigateTo } from '#app';

onMounted(() => {
  // Redirect to a default movie or show movie selection
  navigateTo('/player/2501');
});
</script> 