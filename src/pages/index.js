import React, { useState, useEffect } from 'react';
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

  const [moviePage, setMoviePage] = useState(1);
  const [tvPage, setTvPage] = useState(1);

  useEffect(() => {
    const fetchTrendingContent = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const moviesKey = `trending_movies_day_${moviePage}`;
        const tvKey = `trending_tv_day_${tvPage}`;

        let moviesData = cacheManager.get(moviesKey);
        let tvData = cacheManager.get(tvKey);

        if (!moviesData) {
          const resp = await tmdbService.getTrending('movie', 'day', moviePage);
          moviesData = resp.results;
          cacheManager.set(moviesKey, moviesData);
        }
        if (!tvData) {
          const resp = await tmdbService.getTrending('tv', 'day', tvPage);
          tvData = resp.results;
          cacheManager.set(tvKey, tvData);
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

  if (isLoading) return <LoadingSpinner message="Loading trending content..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <>
      <Head>
        <title>Cinema-vault</title>
        <meta name="description" content="Discover trending movies and TV shows" />
      </Head>

      <div className="relative min-h-screen pb-12 overflow-hidden bg-gray-900 text-white">
        {/* Top Navigation Bar */}
        <nav className="relative z-20 bg-blue-600/90 backdrop-blur-sm border-b border-blue-500/50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <Link href="/" className="no-underline">
                <h1 className="text-2xl font-bold text-white font-serif">
                  Cinema-vault
                </h1>
              </Link>
              
              {/* Navigation Links */}
              <div className="flex items-center" style={{ gap: '7px' }}>
                {['Home', 'Search', 'Trending', 'Watchlist', 'Watched'].map((name, idx) => (
                  <Link key={idx} href={name === 'Home' ? '/' : `/${name.toLowerCase()}`} className="no-underline">
                    <span className="px-4 py-2 text-white hover:text-blue-200 hover:bg-blue-700/50 rounded-lg transition-all duration-200 text-sm font-medium">
                      {name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* SVG Background Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-5" preserveAspectRatio="none">
          <defs>
            <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#ffbf00" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>

        {/* Layered Gradients */}
        <div className="absolute inset-0 -z-10">
          <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 absolute" />
          <div className="w-full h-full bg-gradient-to-tr from-amber-400/10 via-transparent to-amber-600/20 absolute" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-10 text-white">
          {/* Hero Section */}
          <section className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-amber-400 drop-shadow-lg mb-4 font-serif tracking-tight">
              Discover Your Next Favorite Movie or Show
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Explore trending content, manage your watchlist, and never miss what's popular.
            </p>
          </section>

          {/* Trending Movies */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-amber-300 mb-6 text-center drop-shadow font-serif">
              🔥 Trending Movies Today
            </h2>
            <MovieGrid movies={trendingMovies} showActions />
            <div className="flex justify-center items-center gap-6 mt-6">
              <button
                disabled={moviePage === 1}
                onClick={() => setMoviePage(moviePage - 1)}
                className="px-6 py-2 rounded-full bg-gray-700 text-amber-200 hover:bg-amber-400 hover:text-gray-900 transition disabled:opacity-50"
              >
                Previous
              </button>
              <span className="font-semibold text-amber-300 text-sm">Page {moviePage}</span>
              <button
                onClick={() => setMoviePage(moviePage + 1)}
                className="px-6 py-2 rounded-full bg-gray-700 text-amber-200 hover:bg-amber-400 hover:text-gray-900 transition"
              >
                Next
              </button>
            </div>
          </div>

          {/* Trending TV */}
          <div>
            <h2 className="text-3xl font-bold text-amber-300 mb-6 text-center drop-shadow font-serif">
              📺 Trending TV Shows Today
            </h2>
            <MovieGrid movies={trendingTV} showActions />
            <div className="flex justify-center items-center gap-6 mt-6">
              <button
                disabled={tvPage === 1}
                onClick={() => setTvPage(tvPage - 1)}
                className="px-6 py-2 rounded-full bg-gray-700 text-amber-200 hover:bg-amber-400 hover:text-gray-900 transition disabled:opacity-50"
              >
                Previous
              </button>
              <span className="font-semibold text-amber-300 text-sm">Page {tvPage}</span>
              <button
                onClick={() => setTvPage(tvPage + 1)}
                className="px-6 py-2 rounded-full bg-gray-700 text-amber-200 hover:bg-amber-400 hover:text-gray-900 transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;