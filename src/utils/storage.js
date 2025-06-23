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
}