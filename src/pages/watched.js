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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="container max-w-xl mx-auto bg-gray-800/80 rounded-xl shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-amber-400 mb-4">Watched Movies & Shows</h1>
          <div className="empty-state text-gray-300">
            <p className="mb-2">You haven't marked anything as watched yet.</p>
            <p>Mark movies and shows as watched to track your viewing history!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-10">
      <div className="container max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-amber-400 mb-6 text-center">
          Watched Movies & Shows <span className="text-base text-amber-200">({watched.length})</span>
        </h1>
        <MovieGrid movies={watched} />
      </div>
    </div>
  );
};

export default WatchedPage;