<template>
  <div class=" rounded-lg p-4 mb-6">
    <div class="flex flex-col xl:flex-row xl:items-center lg:justify-between gap-4">
      <!-- right: movie info and controls -->
      <div class="flex flex-col justify-between lg:flex-row lg:items-center gap-4 flex-1">
        <!-- main info -->
        <div class="flex items-center gap-4">
          <!-- quality and type -->
          <div class="flex-col hidden lg:flex rounded-md items-center p-1 bg-[#AB070F]">
            <div class="bg-white text-[#AB070F] rounded px-2 py-1 font-bold text-xs">
              {{ selectedQuality?.split(' - ')[0] ?? '1080p' }}
            </div>
            <div class="text-white rounded font-bold text-xs mt-1">WebDL</div>
          </div>
          
          <!-- movie title -->
          <div>
            <h1 class="text-xl lg:text-2xl font-bold text-white">
              سریال {{ movie?.title_en }}
            </h1>
            <p class="text-sm lg:text-base text-gray-300">{{ movie?.title_fa }}</p>
          </div>
        </div>

        <!-- player controls -->
        <div class="flex items-center gap-4">
          <span class="flex items-center gap-1 text-sm text-gray-300 font-bold">
            <IconPlayCircle class="w-5 h-5" />
            فصل ۱ قسمت {{ currentEpisode }}
          </span>
          
          <div class="relative">
            <select
              class="bg-[#23272e] text-white rounded-lg  py-2 text-sm appearance-none cursor-pointer pr-4 pl-7"
              v-model="localQuality"
            >
              <option v-for="q in qualities" :key="q" :value="q">کیفیت {{ q }}</option>
            </select>
            <div class="absolute inset-y-0 left-2 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- left: score and buttons -->
      <div class="flex flex-wrap items-center gap-2 lg:gap-2">
        <!-- score -->
        <div class="flex items-center gap-3">
          <!-- IMDB -->
          <div v-if="movie?.imdb" class="flex items-center gap-1">
           
            <div class="text-center flex justify-center items-center gap-2">
             
              <StarRating :rating="movie.imdb" class="" />
              <div class="text-yellow-400 font-bold text-sm"><span class="text-white text-lg">{{ movie.imdb }}</span><span class="text-white">/10</span></div>
            </div>
            <NuxtImg src="/imdb.png" alt="IMDb" class="h-6 w-6" />
          </div>

      

          <!-- Rotten Tomatoes -->
          <div v-if="movie?.rotten" class="flex items-center gap-1">
           
            <div class="text-center">
              <div class="text-white font-bold text-sm">{{ movie.rotten }}%</div>
             
            </div>
            <IconRT  class="h-6 w-6"/>
          </div>

          <!-- Metacritic -->
          <div v-if="movie?.metacritic" class="flex items-center gap-1">
           
            <div class="text-center">
              <div class="text-white font-bold text-sm">{{ movie.metacritic }}</div>
             
            </div>
             <IconMetacritic  class="h-6 w-6" />
           
          </div>
        </div>

        <!-- action buttons -->
        <div class="flex items-center gap-2">
          <button 
            @click="toggleBookmark" 
            class="action-btn"
            :class="isBookmarked ? 'text-red-500' : 'text-white'"
            :title="isBookmarked ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'"
          >
            <IconBookmark />
          </button>
          
          <button 
            @click="shareMovie"
            class="action-btn text-white"
            title="اشتراک‌گذاری"
          >
            <IconShare />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useMovieStore } from '~/stores/useMovieStore'
import StarRating from '~/components/StarRating.vue'
import IconBookmark from '~/components/Icons/IconBookmark.vue'
import IconShare from '~/components/Icons/IconShare.vue'
import IconPlayCircle from '~/components/Icons/IconPlayCircle.vue'
import IconRT from '~/components/Icons/IconRT.vue'
import IconMetacritic from '~/components/Icons/IconMetacritic.vue'

interface MovieData {
  id: number
  title_fa?: string
  title_en?: string
  year?: number
  imdb?: number
  rotten?: number
  metacritic?: number
  user_rating?: number
  poster?: string
  episodes?: any[]
}

const props = defineProps<{
  movie: MovieData | null
  currentEpisode?: number
  qualities?: string[]
  selectedQuality?: string
  onQualityChange?: (quality: string) => void
}>()

const movieStore = useMovieStore()

// Local state for quality selector
const localQuality = ref(props.selectedQuality || '1080p')

// Watch for changes and emit to parent
watch(localQuality, (newQuality) => {
  if (props.onQualityChange) {
    props.onQualityChange(newQuality)
  }
})

const isBookmarked = computed(() => {
  return props.movie ? movieStore.isBookmarked(props.movie.id) : false
})

const toggleBookmark = () => {
  if (props.movie) {
    movieStore.toggleBookmark(props.movie.id)
  }
}

const shareMovie = async () => {
  if (!props.movie) return
  
  const shareData = {
    title: props.movie.title_fa || props.movie.title_en || 'فیلم',
    text: `${props.movie.title_fa || props.movie.title_en} را در فیلم‌ترسناک ببینید`,
    url: window.location.href
  }

  if (navigator.share) {
    try {
      await navigator.share(shareData)
    } catch (err) {
      console.log('اشتراک‌گذاری لغو شد')
    }
  } else {
    // fallback: کپی لینک
    await navigator.clipboard.writeText(window.location.href)
    console.log('لینک کپی شد')
  }
}
</script>

<style scoped>
.action-btn {
  @apply bg-[#242629] w-12 h-12 flex items-center justify-center transition-colors hover:bg-[#353a40] rounded-md;
}
</style> 