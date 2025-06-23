const STORAGE_KEYS = {
  WATCHLIST: 'vault_watchlist',
  WATCHED: 'vault_watched',
  PREFERENCES: 'vault_preferences',
  CACHE: 'vault_cache'
};

// Generic storage functions
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

   set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },

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

export const watchlistManager = {
  getWatchlist: () => {
    return storage.get(STORAGE_KEYS.WATCHLIST) || [];
  },

  addToWatchlist: (movie) => {
    const watchlist = watchlistManager.getWatchlist();
    const isAlreadyAdded = watchlist.some(item => item.id === movie.id);
    
    if (!isAlreadyAdded) {
      const newWatchlist = [...watchlist, {
        id: movie.id,
        title: movie.title || movie.name,
        poster_path: movie.poster_path,
        media_type: movie.media_type || 'movie',
        release_date: movie.release_date || movie.first_air_date,
        vote_average: movie.vote_average,
        added_date: new Date().toISOString()
      }];
      storage.set(STORAGE_KEYS.WATCHLIST, newWatchlist);
      return true;
    }
    return false;
  },

   removeFromWatchlist: (movieId) => {
    const watchlist = watchlistManager.getWatchlist();
    const newWatchlist = watchlist.filter(item => item.id !== movieId);
    storage.set(STORAGE_KEYS.WATCHLIST, newWatchlist);
    return true;
  },

  isInWatchlist: (movieId) => {
    const watchlist = watchlistManager.getWatchlist();
    return watchlist.some(item => item.id === movieId);
  }
}

export const watchedManager = {
  getWatched: () => {
    return storage.get(STORAGE_KEYS.WATCHED) || [];
  },

  markAsWatched: (movie, rating = null) => {
    const watched = watchedManager.getWatched();
    const isAlreadyWatched = watched.some(item => item.id === movie.id);
    
    if (!isAlreadyWatched) {
      const newWatched = [...watched, {
        id: movie.id,
        title: movie.title || movie.name,
        poster_path: movie.poster_path,
        media_type: movie.media_type || 'movie',
        watched_date: new Date().toISOString(),
        user_rating: rating,
        genres: movie.genres || movie.genre_ids
      }];
      storage.set(STORAGE_KEYS.WATCHED, newWatched);
      
      // Remove from watchlist if it exists there
      watchlistManager.removeFromWatchlist(movie.id);
      return true;
    }
    return false;
  },

  removeFromWatched: (movieId) => {
    const watched = watchedManager.getWatched();
    const newWatched = watched.filter(item => item.id !== movieId);
    storage.set(STORAGE_KEYS.WATCHED, newWatched);
    return true;
  },

  isWatched: (movieId) => {
    const watched = watchedManager.getWatched();
    return watched.some(item => item.id === movieId);
  }
};


// Simple caching system
export const cacheManager = {
  get: (key) => {
    const cache = storage.get(STORAGE_KEYS.CACHE) || {};
    const item = cache[key];
    
    if (item && item.expiry && Date.now() < item.expiry) {
      return item.data;
    }
    return null;
  },

  set: (key, data, ttlMinutes = 30) => {
    const cache = storage.get(STORAGE_KEYS.CACHE) || {};
    cache[key] = {
      data,
      expiry: Date.now() + (ttlMinutes * 60 * 1000)
    };
    storage.set(STORAGE_KEYS.CACHE, cache);
  },

  clear: () => {
    storage.set(STORAGE_KEYS.CACHE, {});
  }
};