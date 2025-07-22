<template>
  <div dir="ltr" class="flex items-center">
    <template v-for="i in 5" :key="i">
      <IconStarRating
        :class="i <= filledStars ?  'fill-path text-yellow-400' : 'text-gray-500'"
        class="w-6 h-6 fill-current"
  
      >
      </IconStarRating>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import IconStarRating from '~/components/Icons/IconStarRating.vue';
const props = defineProps<{ rating: number }>(); // rating: 1 تا 10
// each two rating is one star
const filledStars = computed(() => Math.round(props.rating / 2));
</script> 

<style>
.fill-path path{
  fill: #F3B209!important;
}
</style>