import { defineStore } from 'pinia'

interface Episode {
  number: number;
  title: string;
  poster: string;
}

interface MovieData {
  id: number;
  title_fa: string;
  title_en: string;
  year: number;
  imdb?: number;
  rotten?: number;
  metacritic?: number;
  user_rating?: number;
  poster: string;
  episodes?: Episode[];
}

interface MovieState {
  currentMovie: MovieData | null;
  loading: boolean;
  error: string | null;
  bookmarkedMovies: number[];
}

export const useMovieStore = defineStore('movie', {
  state: (): MovieState => ({
    currentMovie: null,
    loading: false,
    error: null,
    bookmarkedMovies: []
  }),

  getters: {
    isBookmarked: (state) => (movieId: number) => {
      return state.bookmarkedMovies.includes(movieId)
    },
    
    hasAllRatings: (state) => {
      const movie = state.currentMovie
      return movie && (movie.imdb || movie.rotten || movie.metacritic || movie.user_rating)
    }
  },

  actions: {
    async fetchMovie(id: number | string) {
      this.loading = true
      this.error = null
      
      try {
        const { get } = useApi()
        const movieData = await get(`?action=info&id=${id}`)
        this.currentMovie = movieData
      } catch (error: any) {
        this.error = error.message || 'خطا در دریافت اطلاعات فیلم'
        console.error('Failed to fetch movie:', error)
      } finally {
        this.loading = false
      }
    },

    toggleBookmark(movieId: number) {
      const index = this.bookmarkedMovies.indexOf(movieId)
      if (index > -1) {
        this.bookmarkedMovies.splice(index, 1)
      } else {
        this.bookmarkedMovies.push(movieId)
      }
      
      // Save to localStorage
      if (process.client) {
        localStorage.setItem('bookmarked-movies', JSON.stringify(this.bookmarkedMovies))
      }
    },

    loadBookmarksFromStorage() {
      if (process.client) {
        const stored = localStorage.getItem('bookmarked-movies')
        if (stored) {
          this.bookmarkedMovies = JSON.parse(stored)
        }
      }
    },

    clearError() {
      this.error = null
    }
  }
}) 