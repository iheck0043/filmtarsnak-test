<template>
  <div class="mt-6 space-y-4">
    <!-- button and player tabs in one line -->
    <div class="flex flex-wrap items-center justify-between gap-4">
   

      <!-- player tabs -->
      <div dir="ltr" class="flex flex-wrap gap-2">
        <button 
          v-for="player in players" 
          class="text-xs"
          :key="player.id"
          :class="[
            'px-2 py-4 rounded text-sm font-medium transition-colors',
            player.active 
              ? 'bg-[#AB070F] text-white' 
              : 'bg-[#2A2D31] text-white hover:bg-[#3A3D41]'
          ]"
          @click="selectPlayer(player.id)"
        >
          {{ player.name }}
        </button>
      </div>
         <!-- report issue section -->
         <div class="flex items-center gap-3 text-xs">
        <span class="text-gray-300 text-sx">حین تماشا با مشکلی رو به رو شدید؟</span>
        <button class="bg-[#242629] hover:bg-slate-900 underline text-white px-4 py-2 rounded text-xs font-medium transition-colors">
          اعلام مشکل
        </button>
      </div>
    </div>

    <!-- warning message -->
    <div class="bg-[#2E2217] h-11 rounded-lg  flex items-center justify-between ">
     <div class="flex items-center gap-3">
      <div class="bg-[#493018] text-xl  h-10 w-10 flex items-center justify-center"><IconDanger></IconDanger></div>
      <div class="flex-1">
        <p class="text-gray-300 text-sm leading-relaxed">
          پیش از شروع تماشای آنلاین وی پی ان خود را خاموش کنید
        </p>
      </div>
    </div>
      <button class="bg-[#1B1C1F] border border-[#FB7800] text-[#FB7800] px-4 py-2 rounded text-sm font-medium transition-colors">
        خرید اشتراک
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import IconDanger from '~/components/Icons/IconDanger.vue';

interface Player {
  id: number;
  name: string;
  active: boolean;
}

const players = ref<Player[]>([
  { id: 1, name: 'پلیر تلویزیون‌های قدیمی', active: false },
  { id: 2, name: 'پلیر تلویزیون‌های قدیمی', active: false },
  { id: 3, name: 'پلیر تلویزیون‌های سامسونگ', active: true },
]);

const selectPlayer = (playerId: number) => {
  players.value.forEach(player => {
    player.active = player.id === playerId;
  });
};
</script> 