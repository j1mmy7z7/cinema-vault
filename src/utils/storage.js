/**
 * STORAGE_KEYS defines the keys used in localStorage for different data types.
 * Keeping keys centralized helps avoid typos and makes refactoring easier.
 */
const STORAGE_KEYS = {
  WATCHLIST: 'vault_watchlist',
  WATCHED: 'vault_watched',
  PREFERENCES: 'vault_preferences',
  CACHE: 'vault_cache'
};

/**
 * Generic storage utility for interacting with localStorage.
 * Handles JSON serialization/deserialization and error catching.
 */
export const storage = {
  /**
   * Retrieve and parse a value from localStorage.
   * @param {string} key - The localStorage key.
   * @returns {any|null} - Parsed value or null if not found or error occurs.
   */
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  /**
   * Stringify and store a value in localStorage.
   * @param {string} key - The localStorage key.
   * @param {any} value - The value to store.
   * @returns {boolean} - True if successful, false otherwise.
   */
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },

  /**
   * Remove a value from localStorage.
   * @param {string} key - The localStorage key.
   * @returns {boolean} - True if successful, false otherwise.
   */
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }
}

/**
 * Manages the user's watchlist (movies/shows to watch).
 * Uses localStorage for persistence.
 */
export const watchlistManager = {
  /**
   * Retrieve the current watchlist.
   * @returns {Array} - Array of watchlist items.
   */
  getWatchlist: () => {
    return storage.get(STORAGE_KEYS.WATCHLIST) || [];
  },

  /**
   * Add a movie/show to the watchlist if not already present.
   * Only stores essential fields for display and identification.
   * @param {Object} movie - The movie/show object.
   * @returns {boolean} - True if added, false if already present.
   */
  addToWatchlist: (movie) => {
    const watchlist = watchlistManager.getWatchlist();
    const isAlreadyAdded = watchlist.some(item => item.id === movie.id);

    if (!isAlreadyAdded) {
      const newWatchlist = [
        ...watchlist,
        {
          id: movie.id,
          title: movie.title || movie.name,
          poster_path: movie.poster_path,
          media_type: movie.media_type || 'movie',
          release_date: movie.release_date || movie.first_air_date,
          vote_average: movie.vote_average,
          added_date: new Date().toISOString()
        }
      ];
      storage.set(STORAGE_KEYS.WATCHLIST, newWatchlist);
      return true;
    }
    return false;
  },

  /**
   * Remove a movie/show from the watchlist by its ID.
   * @param {number|string} movieId - The ID of the movie/show to remove.
   * @returns {boolean} - Always true (removal is idempotent).
   */
  removeFromWatchlist: (movieId) => {
    const watchlist = watchlistManager.getWatchlist();
    const newWatchlist = watchlist.filter(item => item.id !== movieId);
    storage.set(STORAGE_KEYS.WATCHLIST, newWatchlist);
    return true;
  },

  /**
   * Check if a movie/show is in the watchlist.
   * @param {number|string} movieId - The ID to check.
   * @returns {boolean} - True if present, false otherwise.
   */
  isInWatchlist: (movieId) => {
    const watchlist = watchlistManager.getWatchlist();
    return watchlist.some(item => item.id === movieId);
  }
}

/**
 * Manages the user's watched list (movies/shows already watched).
 * Also allows marking as watched with an optional user rating.
 */
export const watchedManager = {
  /**
   * Retrieve the watched list.
   * @returns {Array} - Array of watched items.
   */
  getWatched: () => {
    return storage.get(STORAGE_KEYS.WATCHED) || [];
  },

  /**
   * Mark a movie/show as watched if not already present.
   * Also removes it from the watchlist if present.
   * @param {Object} movie - The movie/show object.
   * @param {number|null} rating - Optional user rating.
   * @returns {boolean} - True if marked as watched, false if already present.
   */
  markAsWatched: (movie, rating = null) => {
    const watched = watchedManager.getWatched();
    const isAlreadyWatched = watched.some(item => item.id === movie.id);

    if (!isAlreadyWatched) {
      const newWatched = [
        ...watched,
        {
          id: movie.id,
          title: movie.title || movie.name,
          poster_path: movie.poster_path,
          media_type: movie.media_type || 'movie',
          watched_date: new Date().toISOString(),
          user_rating: rating,
          genres: movie.genres || movie.genre_ids
        }
      ];
      storage.set(STORAGE_KEYS.WATCHED, newWatched);

      // Remove from watchlist if it exists there
      watchlistManager.removeFromWatchlist(movie.id);
      return true;
    }
    return false;
  },

  /**
   * Remove a movie/show from the watched list by its ID.
   * @param {number|string} movieId - The ID to remove.
   * @returns {boolean} - Always true (removal is idempotent).
   */
  removeFromWatched: (movieId) => {
    const watched = watchedManager.getWatched();
    const newWatched = watched.filter(item => item.id !== movieId);
    storage.set(STORAGE_KEYS.WATCHED, newWatched);
    return true;
  },

  /**
   * Check if a movie/show is in the watched list.
   * @param {number|string} movieId - The ID to check.
   * @returns {boolean} - True if present, false otherwise.
   */
  isWatched: (movieId) => {
    const watched = watchedManager.getWatched();
    return watched.some(item => item.id === movieId);
  }
};

/**
 * Simple caching system using localStorage.
 * Stores data with an expiry timestamp (TTL).
 * Note: Cache is stored as a single object under CACHE key.
 */
export const cacheManager = {
  /**
   * Retrieve cached data by key if not expired.
   * @param {string} key - The cache key.
   * @returns {any|null} - Cached data or null if not found/expired.
   */
  get: (key) => {
    const cache = storage.get(STORAGE_KEYS.CACHE) || {};
    const item = cache[key];

    // Check if item exists and is not expired
    if (item && item.expiry && Date.now() < item.expiry) {
      return item.data;
    }
    return null;
  },

  /**
   * Store data in cache with a time-to-live (TTL).
   * @param {string} key - The cache key.
   * @param {any} data - The data to cache.
   * @param {number} ttlMinutes - Time to live in minutes (default: 30).
   */
  set: (key, data, ttlMinutes = 30) => {
    const cache = storage.get(STORAGE_KEYS.CACHE) || {};
    cache[key] = {
      data,
      expiry: Date.now() + (ttlMinutes * 60 * 1000)
    };
    storage.set(STORAGE_KEYS.CACHE, cache);
  },

  /**
   * Clear the entire cache.
   */
  clear: () => {
    storage.set(STORAGE_KEYS.CACHE, {});
  }
};

/**
 * Manages user preferences such as favorite genres, language, and theme.
 * Preferences are stored as a single object in localStorage.
 */
export const preferencesManager = {
  /**
   * Retrieve user preferences, or default values if not set.
   * @returns {Object} - Preferences object.
   */
  getPreferences: () => {
    return storage.get(STORAGE_KEYS.PREFERENCES) || {
      favoriteGenres: [],
      preferredLanguage: 'en',
      theme: 'light'
    };
  },

  /**
   * Update user preferences by merging new values with existing ones.
   * @param {Object} newPreferences - Partial preferences to update.
   * @returns {Object} - Updated preferences object.
   */
  updatePreferences: (newPreferences) => {
    const currentPrefs = preferencesManager.getPreferences();
    const updatedPrefs = { ...currentPrefs, ...newPreferences };
    storage.set(STORAGE_KEYS.PREFERENCES, updatedPrefs);
    return updatedPrefs;
  },

  /**
   * Add a genre to the user's list of favorite genres.
   * Prevents duplicates.
   * @param {number|string} genreId - The genre ID to add.
   */
  addFavoriteGenre: (genreId) => {
    const prefs = preferencesManager.getPreferences();
    if (!prefs.favoriteGenres.includes(genreId)) {
      prefs.favoriteGenres.push(genreId);
      storage.set(STORAGE_KEYS.PREFERENCES, prefs);
    }
  }
};
