import { useState, useEffect } from 'react';
import MovieGrid from '../components/movie/MovieGrid';
import { watchlistManager } from '../utils/storage';

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const loadWatchlist = () => {
      const userWatchlist = watchlistManager.getWatchlist();
      setWatchlist(userWatchlist);
    };

    loadWatchlist();
    window.addEventListener('storage', loadWatchlist);
    return () => {
      window.removeEventListener('storage', loadWatchlist);
    };
  }, []);

  const handleRemoveFromWatchlist = (movieId) => {
    watchlistManager.removeFromWatchlist(movieId);
    setWatchlist(watchlistManager.getWatchlist());
  };

  if (watchlist.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="container max-w-xl mx-auto bg-gray-800/80 rounded-xl shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-amber-400 mb-4">My Watchlist</h1>
          <div className="empty-state text-gray-300">
            <p className="mb-2">Your watchlist is empty.</p>
            <p>Start adding movies and TV shows you want to watch!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-10">
      <div className="container max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-amber-400 mb-6 text-center">My Watchlist <span className="text-base text-amber-200">({watchlist.length})</span></h1>
        <MovieGrid movies={watchlist} />
      </div>
    </div>
  );
};

export default WatchlistPage;