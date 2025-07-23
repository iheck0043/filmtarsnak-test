<template>
  <div class="relative bg-black rounded-lg mb-4 overflow-hidden">
    <!-- Loading State -->
    <div v-if="loading" class="aspect-video bg-gray-900 flex items-center justify-center">
      <div class="text-white text-lg">در حال بارگذاری ویدیو...</div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="aspect-video bg-gray-900 flex items-center justify-center">
      <div class="text-center text-white">
        <div class="text-red-500 text-lg mb-2">خطا در بارگذاری ویدیو</div>
        <div class="text-sm text-gray-400 mb-4">{{ error }}</div>
        <button 
          @click="retryLoad" 
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          تلاش مجدد
        </button>
      </div>
    </div>
    
          <!-- Video Player -->
      <div v-else class="relative group">
        <video
          ref="videoRef"
          class="w-full aspect-video bg-black cursor-pointer"
          preload="auto"
          :poster="infoData?.poster"
          @loadedmetadata="onVideoLoaded"
          @error="onVideoError"
          @timeupdate="onTimeUpdate"
          @play="onPlay"
          @pause="onPause"
          @volumechange="onVolumeChange"
          @click="handleVideoClick"
          style="min-height: 400px;"
        >
        <track 
          v-if="subtitleUrl && isLocalSubtitle" 
          kind="subtitles" 
          :src="subtitleUrl" 
          srclang="fa" 
          label="فارسی" 
          default
        />
                  مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
        </video>
        
        <!-- Center Play Button -->
        <div 
          v-if="!isPlaying"
          class="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div class="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center pointer-events-auto cursor-pointer" @click="togglePlay">
            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      
              <!-- Custom Video Controls -->
        <div dir="ltr" class="custom-controls absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <!-- Progress Bar -->
        <div class="mb-3">
          <div 
            class="h-1 bg-gray-600 rounded-full cursor-pointer relative"
            @click="seekTo"
            ref="progressBar"
          >
            <div 
              class="h-full bg-red-500 rounded-full relative"
              :style="{ width: progressPercent + '%' }"
            >
              <div 
                class="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              ></div>
            </div>
            <div 
              class="absolute top-0 h-full bg-gray-300 rounded-full"
              :style="{ width: bufferedPercent + '%' }"
            ></div>
          </div>
        </div>
        
        <!-- Controls -->
        <div class="flex items-center justify-between text-white">
          <!-- Left Controls -->
          <div class="flex items-center space-x-4 space-x-reverse">
            <!-- Play/Pause Button -->
            <button 
              @click="togglePlay"
              class="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded transition-colors"
            >
              <svg v-if="!isPlaying" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            </button>
            
            <!-- Skip Button -->
            <button 
              @click="skipForward"
              class="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded transition-colors"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
              </svg>
            </button>
            
            <!-- Volume Control -->
            <div class="flex items-center space-x-2 space-x-reverse">
              <button 
                @click="toggleMute"
                class="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded transition-colors"
              >
                <svg v-if="!isMuted" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                </svg>
              </button>
              <input 
                type="range" 
                min="0" 
                max="100" 
                :value="volume * 100"
                @input="setVolume"
                class="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            
            <!-- Time Display -->
            <div class="text-sm font-mono">
              {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
            </div>
          </div>
          
          <!-- Right Controls -->
          <div class="flex items-center space-x-4 space-x-reverse">
            <!-- Subtitle Toggle Button -->
            <button 
              v-if="subtitleUrl"
              @click="toggleSubtitle"
              class="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded transition-colors relative"
            >
              <IconSub class="w-4 h-4" />
              <div 
                v-if="subtitleEnabled"
                class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-red-500 rounded-full"
              ></div>
            </button>
            
            <!-- Settings Button with HD Badge -->
            <button 
              @click="toggleSettings"
              class="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded transition-colors relative"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
              </svg>
              <!-- HD Badge -->
              <div class="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded text-[10px] leading-none">
                HD
              </div>
            </button>
            
            <!-- Picture in Picture -->
            <button 
              @click="togglePiP"
              class="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded transition-colors"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/>
              </svg>
            </button>
            
            <!-- Fullscreen -->
            <button 
              @click="toggleFullscreen"
              class="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded transition-colors"
            >
              <svg v-if="!isFullscreen" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
              </svg>
              <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import Hls from 'hls.js';
import { useVideoStream } from '~/composables/useVideoStream';
import IconSub from '~/components/Icons/IconSub.vue';

interface Props {
  videoId?: string;
  videoUrl?: string;
  subtitleUrl?: string;
}

const props = withDefaults(defineProps<Props>(), {
  videoId: '2501'
});

const { loading, error, streamData, infoData, fetchVideoStream, fetchVideoInfo, clearError } = useVideoStream();

// Video refs
const videoRef = ref<HTMLVideoElement>();
let hls: Hls | null = null;

// Player state
const subtitleEnabled = ref(true);
const isPlaying = ref(false);
const isMuted = ref(false);
const isFullscreen = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(1);
const progressBar = ref<HTMLElement>();

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

const progressPercent = computed(() => {
  return duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0;
});

const bufferedPercent = computed(() => {
  if (!videoRef.value || !videoRef.value.buffered.length) return 0;
  const bufferedEnd = videoRef.value.buffered.end(videoRef.value.buffered.length - 1);
  return (bufferedEnd / duration.value) * 100;
});

// Methods
const initializeHLS = () => {
  if (!videoRef.value || !videoUrl.value) {
    console.log('Video ref or URL not ready:', { videoRef: !!videoRef.value, videoUrl: videoUrl.value });
    return;
  }
  
  const video = videoRef.value;
  console.log('Initializing HLS for URL:', videoUrl.value);
  console.log('Video element:', video);
  
  // Destroy existing HLS instance if any
  if (hls) {
    console.log('Destroying existing HLS instance');
    hls.destroy();
    hls = null;
  }
  
  // Check if it's an HLS stream
  if (videoUrl.value.includes('.m3u8')) {
    if (Hls.isSupported()) {
      console.log('HLS.js is supported, initializing...');
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        xhrSetup: (xhr, url) => {
          xhr.withCredentials = false;
          console.log('HLS XHR request to:', url);
        }
      });
      
      hls.loadSource(videoUrl.value);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS manifest loaded successfully');
        console.log('Video ready to play');
        // Try to play automatically
        video.play().catch(e => console.log('Auto-play failed:', e));
      });
      

      
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log('Network error, trying to recover...');
              hls?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('Media error, trying to recover...');
              hls?.recoverMediaError();
              break;
            default:
              console.log('Fatal error, destroying HLS instance');
              hls?.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      console.log('Using native HLS support');
      video.src = videoUrl.value;
    } else {
      console.error('HLS is not supported in this browser');
    }
  } else {
    // Regular video file
    console.log('Using regular video playback');
    video.src = videoUrl.value;
  }
};

const toggleSubtitle = () => {
  if (!videoRef.value) return;
  
  const tracks = videoRef.value.textTracks;
  if (tracks.length > 0) {
    subtitleEnabled.value = !subtitleEnabled.value;
    tracks[0].mode = subtitleEnabled.value ? 'showing' : 'hidden';
  }
};

const retryLoad = async () => {
  clearError();
  if (props.videoId) {
    await fetchVideoStream(props.videoId);
    await fetchVideoInfo(props.videoId);
  }
};

// Video control methods
const togglePlay = () => {
  if (!videoRef.value) return;
  if (isPlaying.value) {
    videoRef.value.pause();
  } else {
    videoRef.value.play();
  }
};

const skipForward = () => {
  if (!videoRef.value) return;
  videoRef.value.currentTime += 10;
};

const toggleMute = () => {
  if (!videoRef.value) return;
  videoRef.value.muted = !videoRef.value.muted;
  isMuted.value = videoRef.value.muted;
};

const setVolume = (event: Event) => {
  if (!videoRef.value) return;
  const target = event.target as HTMLInputElement;
  const newVolume = parseFloat(target.value) / 100;
  videoRef.value.volume = newVolume;
  volume.value = newVolume;
};

const seekTo = (event: MouseEvent) => {
  if (!videoRef.value || !progressBar.value) return;
  const rect = progressBar.value.getBoundingClientRect();
  const percent = (event.clientX - rect.left) / rect.width;
  videoRef.value.currentTime = percent * duration.value;
};

const toggleFullscreen = () => {
  if (!videoRef.value) return;
  if (!document.fullscreenElement) {
    videoRef.value.requestFullscreen();
    isFullscreen.value = true;
  } else {
    document.exitFullscreen();
    isFullscreen.value = false;
  }
};

const togglePiP = async () => {
  if (!videoRef.value) return;
  try {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else {
      await videoRef.value.requestPictureInPicture();
    }
  } catch (error) {
    console.error('Picture in Picture not supported');
  }
};

const toggleSettings = () => {
  // TODO: Implement settings menu
  console.log('Settings clicked');
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Event handlers
const onTimeUpdate = () => {
  if (!videoRef.value) return;
  currentTime.value = videoRef.value.currentTime;
};

const onPlay = () => {
  isPlaying.value = true;
};

const onPause = () => {
  isPlaying.value = false;
};

const onVolumeChange = () => {
  if (!videoRef.value) return;
  volume.value = videoRef.value.volume;
  isMuted.value = videoRef.value.muted;
};

const handleVideoClick = (event: MouseEvent) => {
  // Prevent click if clicking on controls
  const target = event.target as HTMLElement;
  if (target.closest('.custom-controls')) {
    return;
  }
  
  // Toggle play/pause
  togglePlay();
};

const loadExternalSubtitle = async () => {
  if (!videoRef.value || !subtitleUrl.value || isLocalSubtitle.value) return;
  
  try {
    console.log('Loading external subtitle:', subtitleUrl.value);
    const response = await fetch(subtitleUrl.value);
    if (response.ok) {
      const subtitleText = await response.text();
      console.log('External subtitle loaded, length:', subtitleText.length);
      
      // Create blob URL for subtitle
      const blob = new Blob([subtitleText], { type: 'text/vtt' });
      const blobUrl = URL.createObjectURL(blob);
      
      // Add track element
      const track = document.createElement('track');
      track.kind = 'subtitles';
      track.src = blobUrl;
      track.srclang = 'fa';
      track.label = 'فارسی';
      track.default = true;
      
      videoRef.value.appendChild(track);
      console.log('External subtitle track added');
    } else {
      console.error('Failed to load external subtitle:', response.status);
    }
  } catch (error) {
    console.error('Error loading external subtitle:', error);
  }
};

// Event handlers
const onVideoLoaded = () => {
  console.log('Video metadata loaded');
  
  if (videoRef.value) {
    duration.value = videoRef.value.duration;
    volume.value = videoRef.value.volume;
    isMuted.value = videoRef.value.muted;
  }
  
  // Enable subtitle by default
  if (videoRef.value && subtitleUrl.value) {
    const tracks = videoRef.value.textTracks;
    if (tracks.length > 0) {
      tracks[0].mode = 'showing';
      subtitleEnabled.value = true;
    }
  }
};

const onVideoError = (event: Event) => {
  console.error('Video error:', event);
};



// Watchers
watch(videoUrl, (newUrl) => {
  if (newUrl) {
    console.log('Video URL changed:', newUrl);
    // Use nextTick to ensure DOM is ready
    nextTick(() => {
      initializeHLS();
    });
  }
});

watch(streamData, (newData) => {
  if (newData) {
    console.log('Stream data received:', newData);
    if (newData.video_url) {
      console.log('Video URL from API:', newData.video_url);
    }
    if (newData.subtitle && !isLocalSubtitle.value) {
      loadExternalSubtitle();
    }
  }
});

// Lifecycle
onMounted(async () => {
  console.log('VideoPlayer mounted with props:', {
    videoId: props.videoId,
    videoUrl: props.videoUrl,
    subtitleUrl: props.subtitleUrl
  });
  
  if (props.videoId && !props.videoUrl) {
    console.log('Fetching video stream for ID:', props.videoId);
    await fetchVideoStream(props.videoId);
    // Also fetch video info for poster
    await fetchVideoInfo(props.videoId);
  } else if (props.videoUrl) {
    console.log('Using provided video URL:', props.videoUrl);
    // Wait for DOM to be ready
    await nextTick();
    // Wait a bit more to ensure video element is fully rendered
    setTimeout(() => {
      initializeHLS();
    }, 100);
  }
  
  // Load external subtitle if needed
  if (subtitleUrl.value && !isLocalSubtitle.value) {
    loadExternalSubtitle();
  }
});

onUnmounted(() => {
  if (hls) {
    hls.destroy();
  }
});
</script>

<style scoped>
/* Basic styling for video player */
video {
  width: 100%;
  height: auto;
  display: block;
  background: #000;
  border-radius: 8px;
}

.aspect-video {
  aspect-ratio: 16 / 9;
}

/* Custom slider styling */
.slider {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

.slider::-webkit-slider-track {
  background: #ffffff;
  height: 4px;
  border-radius: 2px;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background: #ffffff;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  cursor: pointer;
}

.slider::-moz-range-track {
  background: #ffffff;
  height: 4px;
  border-radius: 2px;
}

.slider::-moz-range-thumb {
  background: #ffffff;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

/* Hide native controls */
video::-webkit-media-controls {
  display: none !important;
}

video::-webkit-media-controls-panel {
  display: none !important;
}
</style> 