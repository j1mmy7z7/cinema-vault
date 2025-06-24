import { useState, useEffect } from 'react';
import MovieGrid from '../components/movie/MovieGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { tmdbService } from '../services/api';

const TrendingPage = () => {
  const [trendingContent, setTrendingContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeWindow, setTimeWindow] = useState('day');
  const [mediaType, setMediaType] = useState('all');

  useEffect(() => {
    const fetchTrending = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await tmdbService.getTrending(mediaType, timeWindow);
        setTrendingContent(response.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrending();
  }, [mediaType, timeWindow]);

  const handleTimeWindowChange = (newTimeWindow) => {
    setTimeWindow(newTimeWindow);
  };

  const handleMediaTypeChange = (newMediaType) => {
    setMediaType(newMediaType);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading trending content..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-10">
      <div className="container max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-amber-400 mb-6 text-center">Trending Content</h1>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <label className="text-gray-200 font-medium">Time Period:</label>
            <select 
              value={timeWindow} 
              onChange={(e) => handleTimeWindowChange(e.target.value)}
              className="rounded-lg px-3 py-2 bg-gray-800 text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-gray-200 font-medium">Content Type:</label>
            <select 
              value={mediaType} 
              onChange={(e) => handleMediaTypeChange(e.target.value)}
              className="rounded-lg px-3 py-2 bg-gray-800 text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="all">All</option>
              <option value="movie">Movies</option>
              <option value="tv">TV Shows</option>
            </select>
          </div>
        </div>

        <MovieGrid 
          movies={trendingContent} 
          title={`Trending ${mediaType === 'all' ? 'Content' : mediaType === 'movie' ? 'Movies' : 'TV Shows'} - ${timeWindow === 'day' ? 'Today' : 'This Week'}`}
        />
      </div>
    </div>
  );
};

export default TrendingPage;