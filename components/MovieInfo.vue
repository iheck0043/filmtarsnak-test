<template>
  <div class="flex items-center justify-between mb-4 h-10">
    <!-- Right: movie info -->
    <div class="flex items-center">
      <div class=" flex-col hidden lg:flex rounded-md items-center p-1 bg-[#AB070F] mb-2">
        <div class="bg-white text-[#AB070F] rounded px-2 py-1 font-bold text-xs">1080p</div>
        <div class=" text-white rounded font-bold text-xs mt-2 mb-1">WebDL</div>
      </div>
      <div class="mr-2">
        <h1 class="text-2xl font-bold">سریال {{ movie?.title_en }}</h1>
        <p class="text-muted-foreground mb-2">{{ movie?.title_fa }}</p>
      </div>
    </div>
    <!-- Left: episode and quality -->
    <div class="lg:flex hidden  gap-3">
      <span class="flex items-center  gap-1 text-sm text-gray-300 font-bold">
        <IconPlayCircle class="w-5 h-5 ml-1" />
        فصل ۱ قسمت {{ currentEpisode }}
      
      </span>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
        <select
          class="bg-[#23272e] text-white rounded-lg px-3 py-2 pr-4 pl-7 text-sm appearance-none cursor-pointer"
          v-model="localQuality"
        >
          <option v-for="q in qualities" :key="q" :value="q">کیفیت {{ q }}</option>
        </select>
      
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import IconPlayCircle from '~/components/Icons/IconPlayCircle.vue';
interface MovieData {
  id: number;
  title_fa: string;
  title_en: string;
  year: number;
  poster: string;
  imdb?: number;
  rotten?: number;
  metacritic?: number;
  user_rating?: number;
}
const props = defineProps<{
  movie: MovieData | null,
  currentEpisode: number,
  qualities: string[],
  selectedQuality: string,
  onQualityChange?: (q: string) => void
}>();

const localQuality = ref(props.selectedQuality);

watch(localQuality, (val) => {
  props.onQualityChange && props.onQualityChange(val);
});
watch(() => props.selectedQuality, (val) => {
  localQuality.value = val;
});
</script> 