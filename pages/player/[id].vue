<template>
  <div dir="rtl" class="bg-[#1B1C1F] text-white min-h-screen font-sans">
    <div class="container mx-auto max-w-[1400px]">
      <!-- Loading State -->
      <SkeletonLoading v-if="movieStore.loading" />
      
      <!-- Error State -->
      <div v-else-if="movieStore.error" class="text-red-500 text-center py-20">
        <p>خطا در دریافت اطلاعات: {{ movieStore.error }}</p>
        <button 
          @click="retryLoad" 
          class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          تلاش مجدد
        </button>
      </div>
      
      <!-- Main Content -->
      <div v-else-if="movieStore.currentMovie" class="space-y-6">
        <!-- moive info and score section-->
        <MovieInfoSection 
          :movie="movieStore.currentMovie"
          :currentEpisode="currentEpisode"
          :qualities="qualities"
          :selectedQuality="selectedQuality"
          :onQualityChange="handleQualityChange"
        />
        
        <!-- player and episodes section -->
        <div class="grid grid-cols-1 lg:grid-cols-12 lg:gap-8">
          <!-- player and settings -->
          <div class="lg:col-span-8">
            <VideoPlayer />
            <ViewingIssues />
          </div>
          
          <!-- episodes list -->
          <div class="lg:col-span-4">
            <EpisodesList 
              :episodes="movieStore.currentMovie.episodes || []"
              @episode-selected="handleEpisodeSelected"
              @user-rated="handleRatingSubmitted"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useMovieStore } from '~/stores/useMovieStore';
import VideoPlayer from '~/components/VideoPlayer.vue';
import MovieInfoSection from '~/components/MovieInfoSection.vue';
import EpisodesList from '~/components/EpisodesList.vue';
import ViewingIssues from '~/components/ViewingIssues.vue';
import SkeletonLoading from '~/components/SkeletonLoading.vue';

const route = useRoute();
const movieStore = useMovieStore();

// State for MovieInfo props
const currentEpisode = ref(1);
const qualities = ref(['1080p - webdl', '720p - webdl', '480p - webdl']);
const selectedQuality = ref('1080p');



const handleQualityChange = (quality: string) => {
  selectedQuality.value = quality;
  console.log('Quality changed to:', quality);
};

const handleEpisodeSelected = (episodeNumber: number) => {
  currentEpisode.value = episodeNumber;
  console.log('Episode selected:', episodeNumber);
};

const handleRatingSubmitted = (rating: number, comment: string) => {
  console.log('User submitted rating:', { rating, comment, episode: selectedEpisode.value });
  // You can add additional logic here if needed
};

const retryLoad = async () => {
  movieStore.clearError();
  const movieId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
  if (movieId) {
    await movieStore.fetchMovie(movieId);
  }
};

onMounted(async () => {
  movieStore.loadBookmarksFromStorage();
  const movieId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
  if (movieId) {
    await movieStore.fetchMovie(movieId);
  }
});
</script> 