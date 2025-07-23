export interface VideoStreamData {
  video_url: string;
  subtitle: string; // This is now a full URL to the VTT file
}

export interface VideoInfoData {
  poster?: string;
  title?: string;
  description?: string;
  // Add other fields as needed
}

export const useVideoStream = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const streamData = ref<VideoStreamData | null>(null);
  const infoData = ref<VideoInfoData | null>(null);
  const { get } = useApi();

  const fetchVideoStream = async (id: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      const data = await get(`?action=stream&id=${id}`);
      
      // Validate response structure
      if (!data.video_url) {
        throw new Error('API response missing video_url');
      }
      
      streamData.value = data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'خطا در دریافت اطلاعات ویدیو';
      console.error('Error fetching video stream:', err);
    } finally {
      loading.value = false;
    }
  };

  const fetchVideoInfo = async (id: string) => {
    try {
      const data = await get(`?action=info&id=${id}`);
      infoData.value = data;
    } catch (err) {
      console.error('Error fetching video info:', err);
    }
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    loading: readonly(loading),
    error: readonly(error),
    streamData: readonly(streamData),
    infoData: readonly(infoData),
    fetchVideoStream,
    fetchVideoInfo,
    clearError
  };
}; 