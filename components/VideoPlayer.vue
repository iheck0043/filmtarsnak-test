<template>
  <div class="relative bg-black rounded-lg mb-4 overflow-hidden">
    <!-- Loading/Error State -->
    <VideoLoadingState 
      v-if="loading || error"
      :loading="loading"
      :error="error || undefined"
      @retry="retryLoad"
    />
    
    <!-- Video Player -->
    <div v-else class="relative group">
      <VideoElement
        ref="videoElementRef"
        :poster="infoData?.poster || undefined"
        :subtitle-url="subtitleUrl"
        :is-local-subtitle="isLocalSubtitle || false"
        :is-playing="isPlaying"
        @loaded="onVideoLoaded"
        @error="onVideoError"
        @time-update="onTimeUpdate"
        @play="onPlay"
        @pause="onPause"
        @volume-change="onVolumeChange"
        @click="handleVideoClick"
        @toggle-play="togglePlay"
        @video-ref="setVideoRef"
      />
      
      <!-- Custom Video Controls -->
      <VideoControls
        :is-playing="isPlaying"
        :volume="volume"
        :is-muted="isMuted"
        :current-time="currentTime"
        :duration="duration"
        :progress-percent="progressPercent"
        :buffered-percent="bufferedPercent"
        :subtitle-url="subtitleUrl"
        :subtitle-enabled="subtitleEnabled"
        :is-fullscreen="isFullscreen"
        @toggle-play="togglePlay"
        @skip-forward="skipForward"
        @toggle-mute="toggleMute"
        @set-volume="setVolume"
        @toggle-subtitle="toggleSubtitle"
        @toggle-settings="toggleSettings"
        @toggle-pip="togglePiP"
        @toggle-fullscreen="toggleFullscreen"
                 @seek-to="(event, progressBar) => seekTo(event, progressBar)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue';
import { useVideoStream } from '~/composables/useVideoStream';
import { useVideoPlayer } from '~/composables/useVideoPlayer';
import VideoLoadingState from '~/components/VideoLoadingState.vue';
import VideoElement from '~/components/VideoElement.vue';
import VideoControls from '~/components/VideoControls.vue';

interface Props {
  videoId?: string;
  videoUrl?: string;
  subtitleUrl?: string;
  episode?: number;
}

const props = withDefaults(defineProps<Props>(), {
  videoId: undefined
});

// Get videoId from route if not provided as prop
const route = useRoute();
const videoId = computed(() => props.videoId || route.params.id);

// Video stream composable
const { loading, error, streamData, infoData, fetchVideoStream, fetchVideoInfo, clearError } = useVideoStream();

// Video player composable
const {
  videoRef,
  setVideoRef,
  isPlaying,
  isMuted,
  isFullscreen,
  currentTime,
  duration,
  volume,
  subtitleEnabled,
  progressPercent,
  bufferedPercent,
  initializeHLS,
  togglePlay,
  skipForward,
  toggleMute,
  setVolume,
  seekTo,
  toggleFullscreen,
  togglePiP,
  toggleSubtitle,
  toggleSettings,
  onTimeUpdate,
  onPlay,
  onPause,
  onVolumeChange,
  onVideoLoaded,
  handleVideoClick,
  loadExternalSubtitle,
  cleanup
} = useVideoPlayer();

// Video element ref
const videoElementRef = ref();

// Computed properties
const videoUrl = computed(() => {
  return props.videoUrl || streamData.value?.video_url;
});

const subtitleUrl = computed(() => {
  return props.subtitleUrl || streamData.value?.subtitle;
});

const isLocalSubtitle = computed(() => {
  return subtitleUrl.value?.startsWith('/') || subtitleUrl.value?.startsWith('http://localhost');
});

// Methods
const retryLoad = async () => {
  clearError();
  if (videoId.value) {
    const episodeParam = props.episode ? `&episode=${props.episode}` : '';
    await fetchVideoStream(`${String(videoId.value)}${episodeParam}`);
    await fetchVideoInfo(`${String(videoId.value)}${episodeParam}`);
  }
};

const reloadVideo = async () => {
  console.log('Reloading video...');
  
  // Clear error state
  clearError();
  
  // Fetch new video data
  if (videoId.value && !props.videoUrl) {
    const episodeParam = props.episode ? `&episode=${props.episode}` : '';
    await fetchVideoStream(`${String(videoId.value)}${episodeParam}`);
    await fetchVideoInfo(`${String(videoId.value)}${episodeParam}`);
  } else if (props.videoUrl) {
    // Wait for DOM update
    await nextTick();
    setTimeout(() => {
      if (props.videoUrl) {
        initializeHLS(props.videoUrl);
      }
    }, 100);
  }
};

const onVideoError = (event: Event) => {
  console.error('Video error:', event);
};

// Watch for videoId changes to reload video
watch(videoId, async (newVideoId, oldVideoId) => {
  if (newVideoId && newVideoId !== oldVideoId) {
    console.log('Video ID changed, reloading video:', newVideoId);
    await reloadVideo();
  }
}, { immediate: false });

// Watch for video URL changes
watch(videoUrl, (newUrl) => {
  if (newUrl) {
    console.log('Video URL changed:', newUrl);
    console.log('Video ref available:', !!videoRef.value);
    nextTick(() => {
      initializeHLS(newUrl);
    });
  }
});

// Watch for stream data changes
watch(streamData, (newData) => {
  if (newData) {
    console.log('Stream data received:', newData);
    if (newData.subtitle && !isLocalSubtitle.value) {
      loadExternalSubtitle(newData.subtitle);
    }
  }
});

// Lifecycle
onMounted(async () => {
  console.log('VideoPlayer mounted with props:', {
    videoId: videoId.value,
    videoUrl: props.videoUrl,
    subtitleUrl: props.subtitleUrl
  });
  
  if (videoId.value && !props.videoUrl) {
    console.log('Fetching video stream for ID:', videoId.value);
    const episodeParam = props.episode ? `&episode=${props.episode}` : '';
    await fetchVideoStream(`${String(videoId.value)}${episodeParam}`);
    await fetchVideoInfo(`${String(videoId.value)}${episodeParam}`);
  } else if (props.videoUrl) {
    console.log('Using provided video URL:', props.videoUrl);
    await nextTick();
    setTimeout(() => {
      if (props.videoUrl) {
        initializeHLS(props.videoUrl);
      }
    }, 100);
  }
  
  // Load external subtitle if needed
  if (subtitleUrl.value && !isLocalSubtitle.value) {
    loadExternalSubtitle(subtitleUrl.value);
  }
});

onUnmounted(() => {
  cleanup();
});
</script>

<style scoped>
/* Hide native controls */
video::-webkit-media-controls {
  display: none !important;
}

video::-webkit-media-controls-panel {
  display: none !important;
}
</style> 