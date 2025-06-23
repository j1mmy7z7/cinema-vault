const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const OMDB_BASE_URL = 'http://www.omdbapi.com';

// reusable function for fetching data and handling errors
const fetchJson = async(url) => {
    try {
        const response = await fetch(url)
        if (!response.ok) {
            if (response.status == 429) {
                throw new Error("Too many requests")
            } else if (response.status == 401) {
                throw new Error("Authaorized, please incluse api key")
            } else if (response.status == 500) {
                throw new Error("server error")
            }
            throw new Error("An issue occured")
        }
        return await response.json()
    } catch(error) {
        console.error("Fetch error:", error)
        throw error;
    }
}

export const tmdbService = {
  search: async (query, page = 1) => {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      query,
      page,
    });
    return fetchJson(`${TMDB_BASE_URL}/search/multi?${params}`);
  },

  // add function to get movie details
  getMovieDetails: async (movieId) => {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      append_to_response: 'credits,videos',
    });
    return fetchJson(`${TMDB_BASE_URL}/movie/${movieId}?${params}`);
  },

  // function for getting trending
  getTrending: async (mediaType = 'all', timeWindow = 'day') => {
    const params = new URLSearchParams({ api_key: TMDB_API_KEY });
    return fetchJson(`${TMDB_BASE_URL}/trending/${mediaType}/${timeWindow}?${params}`);
  },

  // function to get tv details
  getTVDetails: async (tvId) => {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      append_to_response: 'credits,videos',
    });
    return fetchJson(`${TMDB_BASE_URL}/tv/${tvId}?${params}`);
  },

  //function to get movie genres
   getGenres: async (type = 'movie') => {
    const params = new URLSearchParams({ api_key: TMDB_API_KEY });
    return fetchJson(`${TMDB_BASE_URL}/genre/${type}/list?${params}`);
  },

  // search movie by genre
   discoverByGenre: async (genreId, type = 'movie', page = 1) => {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      with_genres: genreId,
      page,
    });
    return fetchJson(`${TMDB_BASE_URL}/discover/${type}?${params}`);
  }
}

// OMDB functions
export const omdbService = {
  getByImdbId: async (imdbId) => {
    const params = new URLSearchParams({
      apikey: OMDB_API_KEY,
      i: imdbId,
      plot: 'full',
    });
    return fetchJson(`${OMDB_BASE_URL}/?${params}`);
  },

   search: async (title, year) => {
    const params = new URLSearchParams({ apikey: OMDB_API_KEY, t: title });
    if (year) params.append('y', year);
    return fetchJson(`${OMDB_BASE_URL}/?${params}`);
  }
}
