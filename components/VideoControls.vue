<template>
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
        <PlayPauseButton :is-playing="isPlaying" @toggle="$emit('togglePlay')" />
        <SkipButton @skip="$emit('skipForward')" />
        <VolumeControl 
          :volume="volume" 
          :is-muted="isMuted" 
          @toggle-mute="$emit('toggleMute')"
          @volume-change="$emit('setVolume', $event)"
        />
        <TimeDisplay :current-time="currentTime" :duration="duration" />
      </div>
      
      <!-- Right Controls -->
      <div class="flex items-center space-x-4 space-x-reverse">
        <SubtitleButton 
          v-if="subtitleUrl"
          :enabled="subtitleEnabled"
          @toggle="$emit('toggleSubtitle')"
        />
        <SettingsButton @click="$emit('toggleSettings')" />
        <PiPButton @click="$emit('togglePiP')" />
        <FullscreenButton :is-fullscreen="isFullscreen" @toggle="$emit('toggleFullscreen')" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PlayPauseButton from './VideoControls/PlayPauseButton.vue';
import SkipButton from './VideoControls/SkipButton.vue';
import VolumeControl from './VideoControls/VolumeControl.vue';
import TimeDisplay from './VideoControls/TimeDisplay.vue';
import SubtitleButton from './VideoControls/SubtitleButton.vue';
import SettingsButton from './VideoControls/SettingsButton.vue';
import PiPButton from './VideoControls/PiPButton.vue';
import FullscreenButton from './VideoControls/FullscreenButton.vue';

interface Props {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  progressPercent: number;
  bufferedPercent: number;
  subtitleUrl?: string;
  subtitleEnabled: boolean;
  isFullscreen: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  togglePlay: [];
  skipForward: [];
  toggleMute: [];
  setVolume: [volume: number];
  toggleSubtitle: [];
  toggleSettings: [];
  togglePiP: [];
  toggleFullscreen: [];
  seekTo: [event: MouseEvent, progressBar: HTMLElement];
}>();

const progressBar = ref<HTMLElement>();

const seekTo = (event: MouseEvent) => {
  if (progressBar.value) {
    emit('seekTo', event, progressBar.value);
  }
};
</script> 