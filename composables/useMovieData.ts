import { ref } from 'vue';

interface Episode {
  number: number;
  title: string;
  poster?: string;
}

interface MovieData {
  id: number;
  title_fa: string;
  title_en: string;
  year: number;
  poster: string;
  imdb?: number;
  rotten?: number;
  metacritic?: number;
  user_rating?: number;
  episodes: Episode[];
}

interface StreamData {
  video_url: string;
  subtitle?: string;
}

export function useMovieData(id: number | string) {
  const movieData = ref<MovieData | null>(null);
  const streamData = ref<StreamData | null>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);

  const fetchData = async () => {
    loading.value = true;
    try {
      const [movieRes, streamRes] = await Promise.all([
        fetch(`https://ylnk.site/test/?action=info&id=${id}`),
        fetch(`https://ylnk.site/test/?action=stream&id=${id}`)
      ]);
      if (!movieRes.ok || !streamRes.ok) throw new Error('خطا در دریافت اطلاعات');
      movieData.value = await movieRes.json();
      streamData.value = await streamRes.json();
    } catch (e: any) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };

  fetchData();

  return { movieData, streamData, loading, error };
} 