import { useState, useEffect } from 'react';
import MovieGrid from '../components/movie/MovieGrid';
import { watchedManager } from '../utils/storage';

const WatchedPage = () => {
  const [watched, setWatched] = useState([]);

  useEffect(() => {
    const loadWatched = () => {
      const userWatched = watchedManager.getWatched();
      setWatched(userWatched);
    };

    loadWatched();
    
    window.addEventListener('storage', loadWatched);
    
    return () => {
      window.removeEventListener('storage', loadWatched);
    };
  }, []);

  if (watched.length === 0) {
    return (
      <div className="watched-page">
        <div className="container">
          <h1>Watched Movies & Shows</h1>
          <div className="empty-state">
            <p>You haven't marked anything as watched yet.</p>
            <p>Mark movies and shows as watched to track your viewing history!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="watched-page">
      <div className="container">
        <h1>Watched Movies & Shows ({watched.length})</h1>
        <MovieGrid movies={watched} />
      </div>
    </div>
  );
};

export default WatchedPage;