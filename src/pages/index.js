import React from 'react';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import MovieGrid from '../components/movie/MovieGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { tmdbService } from '../services/api';
import { cacheManager } from '../utils/storage';

const HomePage = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTV, setTrendingTV] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingContent = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Check cache first
        const moviesCacheKey = 'trending_movies_day';
        const tvCacheKey = 'trending_tv_day';
        
        let moviesData = cacheManager.get(moviesCacheKey);
        let tvData = cacheManager.get(tvCacheKey);
        
        // Fetch if not cached
        if (!moviesData) {
          const moviesResponse = await tmdbService.getTrending('movie', 'day');
          moviesData = moviesResponse.results.slice(0, 10); // Show top 10
          cacheManager.set(moviesCacheKey, moviesData, 60); // Cache for 1 hour
        }
        
        if (!tvData) {
          const tvResponse = await tmdbService.getTrending('tv', 'day');
          tvData = tvResponse.results.slice(0, 10); // Show top 10
          cacheManager.set(tvCacheKey, tvData, 60); // Cache for 1 hour
        }
        
        setTrendingMovies(moviesData);
        setTrendingTV(tvData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingContent();
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Loading trending content..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <>
      <Head>
        <title>Cinema-vault - Discover Movies & TV Shows</title>
        <meta name="description" content="Discover trending movies and TV shows. Explore what's popular today and manage your watchlist." />
        <meta name="keywords" content="movies, tv shows, trending, cinema, entertainment" />
      </Head>
      
      <div className="home-page">
        <div className="container">
          <section className="hero-section">
            <h1>Discover Your Next Favorite Movie or Show</h1>
            <p>Explore trending content, manage your watchlist, and never miss what's popular.</p>
            
            {/* Quick Navigation */}
            <div className="quick-nav">
              <Link href="/search" className="nav-card">
                <h3>🔍 Search</h3>
                <p>Find movies and TV shows</p>
              </Link>
              
              <Link href="/trending" className="nav-card">
                <h3>📈 Trending</h3>
                <p>What's popular now</p>
              </Link>
              
              <Link href="/watchlist" className="nav-card">
                <h3>📋 Watchlist</h3>
                <p>Your saved movies</p>
              </Link>
              
              <Link href="/watched" className="nav-card">
                <h3>✅ Watched</h3>
                <p>Movies you've seen</p>
              </Link>
            </div>
          </section>
          
          <MovieGrid
            movies={trendingMovies}
            title="🔥 Trending Movies Today"
          />
          
          <MovieGrid
            movies={trendingTV}
            title="📺 Trending TV Shows Today"
          />
        </div>
      </div>
    </>
  );
};

export default HomePage;