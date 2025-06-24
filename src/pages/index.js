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

  // Add pagination state for movies and TV
  const [moviePage, setMoviePage] = useState(1);
  const [tvPage, setTvPage] = useState(1);

  useEffect(() => {
    const fetchTrendingContent = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Use page in cache key for uniqueness
        const moviesCacheKey = `trending_movies_day_${moviePage}`;
        const tvCacheKey = `trending_tv_day_${tvPage}`;

        let moviesData = cacheManager.get(moviesCacheKey);
        let tvData = cacheManager.get(tvCacheKey);

        if (!moviesData) {
          const moviesResponse = await tmdbService.getTrending('movie', 'day', moviePage);
          moviesData = moviesResponse.results;
          cacheManager.set(moviesCacheKey, moviesData);
        }

        if (!tvData) {
          const tvResponse = await tmdbService.getTrending('tv', 'day', tvPage);
          tvData = tvResponse.results;
          cacheManager.set(tvCacheKey, tvData);
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
  }, [moviePage, tvPage]);

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
          {/* Pagination controls for movies */}
          <div className="pagination">
            <button disabled={moviePage === 1} onClick={() => setMoviePage(moviePage - 1)}>Previous</button>
            <span>Page {moviePage}</span>
            <button onClick={() => setMoviePage(moviePage + 1)}>Next</button>
          </div>
          
          <MovieGrid
            movies={trendingTV}
            title="📺 Trending TV Shows Today"
          />
          {/* Pagination controls for TV */}
          <div className="pagination">
            <button disabled={tvPage === 1} onClick={() => setTvPage(tvPage - 1)}>Previous</button>
            <span>Page {tvPage}</span>
            <button onClick={() => setTvPage(tvPage + 1)}>Next</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;