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
    
    // Listen for storage changes (if user adds/removes items)
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
      <div className="watchlist-page">
        <div className="container">
          <h1>My Watchlist</h1>
          <div className="empty-state">
            <p>Your watchlist is empty.</p>
            <p>Start adding movies and TV shows you want to watch!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="watchlist-page">
      <div className="container">
        <h1>My Watchlist ({watchlist.length})</h1>
        <MovieGrid movies={watchlist} />
      </div>
    </div>
  );
};

export default WatchlistPage;