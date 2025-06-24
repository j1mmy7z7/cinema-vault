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
    <div className="trending-page">
      <div className="container">
        <h1>Trending Content</h1>
        
        <div className="trending-filters">
          <div className="filter-group">
            <label>Time Period:</label>
            <select 
              value={timeWindow} 
              onChange={(e) => handleTimeWindowChange(e.target.value)}
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Content Type:</label>
            <select 
              value={mediaType} 
              onChange={(e) => handleMediaTypeChange(e.target.value)}
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