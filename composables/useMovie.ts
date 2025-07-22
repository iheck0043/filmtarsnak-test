import { ref } from 'vue';

interface Rate {
  imdb: number;
  rotten_tomatoes: number;
  metacritic: number;
  user_rate_count: number;
  user_rate_average: number;
}

interface Episode {
  id: number;
  poster: string;
  title: string;
}

interface Movie {
  id: number;
  title_fa: string;
  title_en: string;
  year: number;
  poster: string;
  rate: Rate;
  episodes: Episode[];
}

export const useMovie = () => {
  const movie = ref<Movie | null>(null);
  const error = ref<string | null>(null);

  const fetchMovie = async (id: number | string) => {
    try {
      const { data, error: fetchError } = await useFetch<Movie>(`https://ylnk.site/test/?action=info&id=${id}`);
      if (fetchError.value) {
        throw new Error(fetchError.value.message);
      }
      movie.value = data.value;
    } catch (e: any) {
      error.value = e.message;
      console.error('Failed to fetch movie data:', e);
    }
  };

  return {
    movie,
    error,
    fetchMovie,
  };
}; 