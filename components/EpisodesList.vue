<template>
  <div class="w-full ">
    <!-- Rating Section - Mobile: Show above episodes, Desktop: Show inside episodes -->
    <div 
      v-if="isLastEpisodeSelected"
      ref="mobileRatingSectionRef"
      class="lg:hidden mb-6"
    >
      <RatingSection
        :max-stars="5"
        :movie-id="props.movieId || String(route.params.id)"
        :initial-rating="1"
        @rated="handleRatingSubmitted"
      />
    </div>

    <!-- <h3 class="text-xl font-bold mb-4 text-white">قسمت ها</h3> -->
    <div v-if="episodes" class="space-y-2 pl-2 max-h-[600px] overflow-y-scroll pr-2 episodes-scroll">
      <div
        v-for="episode in episodes"
        :key="episode.number"
        class="flex items-center gap-3 mt-1 rounded-lg hover:bg-gray-800 cursor-pointer group transition-all duration-300"
        :class="{
          'opacity-40': selectedEpisode !== episode.number,
          'bg-gray-800 border border-[#AB070F]': selectedEpisode === episode.number
        }"
        @click="handleEpisodeClick(episode.number)"
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

      <!-- Rating Section - Desktop: Show inside episodes scroll -->
      <div
        v-if="isLastEpisodeSelected"
        ref="ratingSectionRef"
        class="hidden lg:block mt-4 pt-4 border-t border-gray-700"
      >
        <RatingSection
          :max-stars="5"
          :movie-id="props.movieId || String(route.params.id)"
          :initial-rating="1"
          @rated="handleRatingSubmitted"
        />
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
import RatingSection from "~/components/RatingSection.vue";

import { NuxtImg } from '#components';

interface Episode {
  number: number;
  title: string;
  poster: string;
}

const props = defineProps<{
  episodes: Episode[] | null;
  movieId?: string | number;
}>();

const emit = defineEmits<{
  episodeSelected: [episodeNumber: number];
  userRated: [rating: number, comment: string];
}>();

// Composables for route management
const route = useRoute();
const router = useRouter();

// Get episode from URL or default to episode 1
const getInitialEpisode = (): number => {
  const episodeFromUrl = route.query.episode;
  if (episodeFromUrl && !isNaN(Number(episodeFromUrl))) {
    return Number(episodeFromUrl);
  }
  return 1; // Default to episode 1
};

// Reactive selected episode state
const selectedEpisode = ref<number>(getInitialEpisode());

// References to rating sections for auto scroll
const ratingSectionRef = ref<HTMLElement | null>(null);
const mobileRatingSectionRef = ref<HTMLElement | null>(null);

// Check if last episode is selected
const isLastEpisodeSelected = computed(() => {
  if (!props.episodes || props.episodes.length === 0) return false;
  const maxEpisode = Math.max(...props.episodes.map(ep => ep.number));
  return selectedEpisode.value === maxEpisode;
});

// Function to select an episode and update URL
const selectEpisode = async (episodeNumber: number) => {
  selectedEpisode.value = episodeNumber;
  
  // Update URL with episode parameter
  await router.push({
    path: route.path,
    query: {
      ...route.query,
      episode: episodeNumber.toString()
    }
  });
  
  // Emit to parent component
  emit('episodeSelected', episodeNumber);
};

// Handle episode click - select episode and auto-scroll to rating if last episode
const handleEpisodeClick = async (episodeNumber: number) => {
  await selectEpisode(episodeNumber);
  
  // Check if this is the last episode and scroll to rating section
  if (props.episodes && episodeNumber === Math.max(...props.episodes.map(ep => ep.number))) {
    // Wait for DOM update then scroll
    await nextTick();
    
    // Check screen size and scroll to appropriate rating section
    if (window.innerWidth >= 1024) {
      // Desktop - scroll to rating section inside episodes container
      if (ratingSectionRef.value) {
        ratingSectionRef.value.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    } else {
      // Mobile - scroll to rating section above episodes
      if (mobileRatingSectionRef.value) {
        mobileRatingSectionRef.value.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }
  }
};

// Handle rating submission
const handleRatingSubmitted = (rating: number, comment: string) => {
  console.log('User submitted rating:', { rating, comment });
  
  // Emit to parent component
  emit('userRated', rating, comment);
};

// Watch for route changes to sync selected episode
watch(() => route.query.episode, (newEpisode) => {
  if (newEpisode && !isNaN(Number(newEpisode))) {
    selectedEpisode.value = Number(newEpisode);
  }
}, { immediate: true });

// Initialize episode selection on mount
onMounted(() => {
  if (!route.query.episode && props.episodes && props.episodes.length > 0) {
    // Set default episode 1 in URL if not present
    selectEpisode(1);
  }
});
</script>

<style>
.action-subheader-btn {
  @apply bg-[#242629] w-12 h-12 flex items-center justify-center text-white transition-colors hover:bg-[#353a40] rounded-md;
}

/* Custom scrollbar for episodes list */
.episodes-scroll::-webkit-scrollbar {
  width: 6px;
}

.episodes-scroll::-webkit-scrollbar-track {
  background: #1f2937;
  border-radius: 2px;
}

.episodes-scroll::-webkit-scrollbar-thumb {
  background: #363c46;
  border-radius: 2px;
}

.episodes-scroll::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
