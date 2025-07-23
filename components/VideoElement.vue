<template>
  <div class="relative group">
    <video
      ref="videoRef"
      class="w-full aspect-video bg-black cursor-pointer"
      preload="auto"
      :poster="poster"
      @loadedmetadata="$emit('loaded')"
      @error="$emit('error', $event)"
      @timeupdate="$emit('timeUpdate')"
      @play="$emit('play')"
      @pause="$emit('pause')"
      @volumechange="$emit('volumeChange')"
      @click="$emit('click', $event)"
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
      <div 
        class="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center pointer-events-auto cursor-pointer hover:bg-black/70 transition-colors" 
        @click="$emit('togglePlay')"
      >
        <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  poster?: string | undefined;
  subtitleUrl?: string | null;
  isLocalSubtitle: boolean;
  isPlaying: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  loaded: [];
  error: [event: Event];
  timeUpdate: [];
  play: [];
  pause: [];
  volumeChange: [];
  click: [event: MouseEvent];
  togglePlay: [];
  videoRef: [ref: HTMLVideoElement | undefined];
}>();

const videoRef = ref<HTMLVideoElement>();

// Watch for videoRef changes and emit to parent
watch(videoRef, (newRef) => {
  emit('videoRef', newRef);
}, { immediate: true });

// Expose video ref for parent component
defineExpose({
  videoRef
});
</script> 