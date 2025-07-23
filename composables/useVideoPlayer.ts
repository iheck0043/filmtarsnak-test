import { ref, computed, watch, nextTick } from 'vue';
import Hls from 'hls.js';

export function useVideoPlayer() {
  // Video refs
  let hls: Hls | null = null;
  const videoRef = ref<HTMLVideoElement>();

  // Function to set video ref from external component
  const setVideoRef = (ref: HTMLVideoElement | undefined) => {
    videoRef.value = ref;
  };

  // Player state
  const isPlaying = ref(false);
  const isMuted = ref(false);
  const isFullscreen = ref(false);
  const currentTime = ref(0);
  const duration = ref(0);
  const volume = ref(1);
  const subtitleEnabled = ref(true);

  // Computed properties
  const progressPercent = computed(() => {
    return duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0;
  });

  const bufferedPercent = computed(() => {
    if (!videoRef.value || !videoRef.value.buffered.length) return 0;
    const bufferedEnd = videoRef.value.buffered.end(videoRef.value.buffered.length - 1);
    return (bufferedEnd / duration.value) * 100;
  });

  // HLS initialization
  const initializeHLS = (videoUrl: string) => {
    if (!videoRef.value || !videoUrl) {
      console.log('Video ref or URL not ready:', { videoRef: !!videoRef.value, videoUrl });
      return;
    }
    
    const video = videoRef.value;
    console.log('Initializing HLS for URL:', videoUrl);
    
    // Destroy existing HLS instance if any
    if (hls) {
      console.log('Destroying existing HLS instance');
      hls.destroy();
      hls = null;
    }
    
    // Check if it's an HLS stream
    if (videoUrl.includes('.m3u8')) {
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
        
        hls.loadSource(videoUrl);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('HLS manifest loaded successfully');
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
        video.src = videoUrl;
      } else {
        console.error('HLS is not supported in this browser');
      }
    } else {
      // Regular video file
      console.log('Using regular video playback');
      video.src = videoUrl;
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

  const setVolume = (newVolume: number) => {
    if (!videoRef.value) return;
    videoRef.value.volume = newVolume;
    volume.value = newVolume;
  };

  const seekTo = (event: MouseEvent, progressBar: HTMLElement) => {
    if (!videoRef.value || !progressBar) return;
    const rect = progressBar.getBoundingClientRect();
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

  const toggleSubtitle = () => {
    if (!videoRef.value) return;
    
    const tracks = videoRef.value.textTracks;
    if (tracks.length > 0) {
      subtitleEnabled.value = !subtitleEnabled.value;
      tracks[0].mode = subtitleEnabled.value ? 'showing' : 'hidden';
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

  const onVideoLoaded = () => {
    console.log('Video metadata loaded');
    
    if (videoRef.value) {
      duration.value = videoRef.value.duration;
      volume.value = videoRef.value.volume;
      isMuted.value = videoRef.value.muted;
    }
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

  // Load external subtitle
  const loadExternalSubtitle = async (subtitleUrl: string) => {
    if (!videoRef.value) return;
    
    try {
      console.log('Loading external subtitle:', subtitleUrl);
      const response = await fetch(subtitleUrl);
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

  // Cleanup
  const cleanup = () => {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  };

  return {
    // Refs
    videoRef,
    setVideoRef,
    isPlaying,
    isMuted,
    isFullscreen,
    currentTime,
    duration,
    volume,
    subtitleEnabled,
    
    // Computed
    progressPercent,
    bufferedPercent,
    
    // Methods
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
    formatTime,
    
    // Event handlers
    onTimeUpdate,
    onPlay,
    onPause,
    onVolumeChange,
    onVideoLoaded,
    handleVideoClick,
    loadExternalSubtitle,
    
    // Cleanup
    cleanup
  };
} 