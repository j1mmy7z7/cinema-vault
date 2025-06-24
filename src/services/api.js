// Load API keys from environment variables for security and flexibility
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;

// Base URLs for The Movie Database (TMDB) and Open Movie Database (OMDB) APIs
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const OMDB_BASE_URL = 'http://www.omdbapi.com';

/**
 * Generic helper for fetching JSON data from a URL.
 * Handles common HTTP errors and logs them for debugging.
 * Throws an error for the caller to handle if the request fails.
 */
const fetchJson = async(url) => {
    try {
        const response = await fetch(url)
        if (!response.ok) {
            // Handle specific HTTP status codes with custom messages
            if (response.status == 429) {
                throw new Error("Too many requests")
            } else if (response.status == 401) {
                throw new Error("Authorized, please include API key")
            } else if (response.status == 500) {
                throw new Error("Server error")
            }
            throw new Error("An issue occurred")
        }
        return await response.json()
    } catch(error) {
        console.error("Fetch error:", error)
        throw error;
    }
}

/**
 * Service object for interacting with TMDB API.
 * Each method builds a URL with query parameters using URLSearchParams for clarity and safety.
 */
export const tmdbService = {
  /**
   * Search for movies, TV shows, or people by a query string.
   * @param {string} query - The search term.
   * @param {number} page - The page number for pagination (default: 1).
   * Uses TMDB's /search/multi endpoint.
   */
  search: async (query, page = 1) => {
    // URLSearchParams ensures proper encoding of parameters
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      query,
      page,
    });
    return fetchJson(`${TMDB_BASE_URL}/search/multi?${params}`);
  },

  /**
   * Get detailed information about a specific movie by its TMDB ID.
   * Appends credits and videos to the response for richer data.
   */
  getMovieDetails: async (movieId) => {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      append_to_response: 'credits,videos', // fetches cast/crew and trailers in one call
    });
    return fetchJson(`${TMDB_BASE_URL}/movie/${movieId}?${params}`);
  },

  /**
   * Get trending movies, TV shows, or people.
   * @param {string} mediaType - 'all', 'movie', or 'tv'.
   * @param {string} timeWindow - 'day' or 'week'.
   * @param {number} page - Page number for pagination (default: 1).
   * @returns {Promise<Object>} - Trending results.
   */
  getTrending: async (mediaType = 'all', timeWindow = 'day', page = 1) => {
    const params = new URLSearchParams({ api_key: TMDB_API_KEY, page });
    return fetchJson(`${TMDB_BASE_URL}/trending/${mediaType}/${timeWindow}?${params}`);
  },

  /**
   * Get detailed information about a specific TV show by its TMDB ID.
   * Appends credits and videos to the response.
   */
  getTVDetails: async (tvId) => {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      append_to_response: 'credits,videos',
    });
    return fetchJson(`${TMDB_BASE_URL}/tv/${tvId}?${params}`);
  },

  /**
   * Get a list of genres for movies or TV shows.
   * @param {string} type - 'movie' or 'tv' (default: 'movie').
   */
  getGenres: async (type = 'movie') => {
    const params = new URLSearchParams({ api_key: TMDB_API_KEY });
    return fetchJson(`${TMDB_BASE_URL}/genre/${type}/list?${params}`);
  },

  /**
   * Discover movies or TV shows by genre.
   * @param {string} genreId - The TMDB genre ID.
   * @param {string} type - 'movie' or 'tv' (default: 'movie').
   * @param {number} page - Page number for pagination (default: 1).
   * Uses TMDB's /discover endpoint with 'with_genres' filter.
   */
  discoverByGenre: async (genreId, type = 'movie', page = 1) => {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      with_genres: genreId, // filter results by genre
      page,
    });
    return fetchJson(`${TMDB_BASE_URL}/discover/${type}?${params}`);
  }
}

// OMDB service for fetching additional movie data by IMDb ID or title
export const omdbService = {
  /**
   * Get OMDB data by IMDb ID.
   * @param {string} imdbId - The IMDb ID (e.g., tt0111161).
   * Requests full plot for richer details.
   */
  getByImdbId: async (imdbId) => {
    const params = new URLSearchParams({
      apikey: OMDB_API_KEY,
      i: imdbId,
      plot: 'full',
    });
    return fetchJson(`${OMDB_BASE_URL}/?${params}`);
  },

  /**
   * Search OMDB by movie title and optional year.
   * @param {string} title - Movie title.
   * @param {string} year - Optional year to narrow results.
   */
  search: async (title, year) => {
    const params = new URLSearchParams({ apikey: OMDB_API_KEY, t: title });
    if (year) params.append('y', year);
    return fetchJson(`${OMDB_BASE_URL}/?${params}`);
  }
}

/**
 * Utility to get the full image URL from TMDB.
 * @param {string} path - The image path from TMDB.
 * @param {string} size - The image size (default: 'w500').
 * Returns a placeholder if no path is provided.
 */
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return '/placeholder-movie.jpg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

/**
 * Enriches TMDB movie data with extra ratings and plot from OMDB, if IMDb ID is available.
 * Merges OMDB ratings (including Rotten Tomatoes) and plot into the TMDB movie object.
 * Falls back to TMDB overview if OMDB plot is missing.
 */
export const enrichMovieData = async (tmdbMovie) => {
  try {
    if (tmdbMovie.imdb_id) {
      const omdbData = await omdbService.getByImdbId(tmdbMovie.imdb_id);
      return {
        ...tmdbMovie,
        omdbRatings: omdbData.Ratings || [],
        imdbRating: omdbData.imdbRating,
        rottenTomatoesRating: omdbData.Ratings?.find(r => r.Source === 'Rotten Tomatoes')?.Value,
        plot: omdbData.Plot || tmdbMovie.overview,
      };
    }
  } catch (error) {
    console.warn('Could not fetch OMDB data:', error);
  }
  return tmdbMovie;
};