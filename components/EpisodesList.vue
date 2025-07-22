<template>
  <div class="w-full">
    <h3 class="text-xl font-bold mb-4 text-white">قسمت ها</h3>
    <div v-if="episodes" class="space-y-2">
      <div
        v-for="episode in episodes"
        :key="episode.number"
        class="flex items-center gap-3 mt-1 rounded-lg hover:bg-gray-800 cursor-pointer group"
      >
        <div class="relative">
          <img
            :src="episode.poster"
            :alt="episode.title"
            class="w-20 h-[7.25rem] rounded-md object-cover border-2 border-transparent group-hover:border-[#AB070F] transition-all duration-200"
          />
          <div
            class="absolute inset-0 flex items-center justify-center pointer-events-none
                   opacity-0 group-hover:opacity-100 transition-all duration-300
                   translate-y-2 group-hover:translate-y-0"
          >
            <div class="bg-black/40 backdrop-blur rounded-full w-9 h-9 flex items-center justify-center">
              <IconPlayCircle class="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
        <div class="flex-grow">
          <p class="font-bold text-lg">{{ episode.title }}</p>
          <div class="flex text-sm justify-between items-center">
            <div>فصل 1</div>
            <div class="px-4">قسمت {{ episode.number }}</div>
          </div>
          <div class=" flex items-center gap-1 mt-3">
            <div class="flex justify-center items-center bg-[#FB7800] h-6 w-6 rounded-md"><IconFire></IconFire></div>
            <div class="flex justify-center items-center bg-[#245DEF] h-6 w-20 rounded-md p-1 gap-[2px] ">
              <IconSub class="h-4 w-4"></IconSub>
              <span class="text-xs font-semibold mb-1 ">زیرنویس</span>
              
            </div>
            <div class="flex justify-center items-center bg-[#43B100] h-6 w-12 rounded-md p-1 gap-2px">
              <IconMicrophon class="h-4 w-4"></IconMicrophon>
              <span class="text-xs font-semibold mb-1">دوبله</span>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconShare from "~/components/Icons/IconShare.vue";
import IconBookmark from "~/components/Icons/IconBookmark.vue";
import StarRating from "~/components/StarRating.vue";
import IconFire from "~/components/Icons/IconFire.vue";
import IconSub from "~/components/Icons/IconSub.vue";
import IconMicrophon from "~/components/Icons/IconMicrophon.vue";
import IconPlayCircle from "~/components/Icons/IconPlayCircle.vue";

import { NuxtImg } from '#components';

interface Episode {
  number: number;
  title: string;
  poster: string;
}

defineProps<{
  episodes: Episode[] | null;
}>();
</script>

<style>
.action-subheader-btn {
  @apply bg-[#242629] w-12 h-12 flex items-center justify-center text-white transition-colors hover:bg-[#353a40] rounded-md;
}
</style>
