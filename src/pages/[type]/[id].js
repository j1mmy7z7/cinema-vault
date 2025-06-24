// pages/[type]/[id].js

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { tmdbService, enrichMovieData, getImageUrl } from '../../services/api';
import { watchlistManager, watchedManager } from '../../utils/storage';

const MovieDetailPage = () => {
  const router = useRouter();
  const { type, id } = router.query;

  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isWatched, setIsWatched] = useState(false);

  useEffect(() => {
    if (!router.isReady || !type || !id) return;

    const fetchMovieDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let movieData;
        if (type === 'movie') {
          movieData = await tmdbService.getMovieDetails(id);
        } else {
          movieData = await tmdbService.getTVDetails(id);
        }

        const enrichedData = await enrichMovieData(movieData);
        setMovie(enrichedData);
        setIsInWatchlist(watchlistManager.isInWatchlist(parseInt(id)));
        setIsWatched(watchedManager.isWatched(parseInt(id)));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [router.isReady, type, id]);

  const handleWatchlistToggle = () => {
    if (isInWatchlist) {
      watchlistManager.removeFromWatchlist(movie.id);
      setIsInWatchlist(false);
    } else {
      watchlistManager.addToWatchlist({ ...movie, media_type: type });
      setIsInWatchlist(true);
    }
  };

  const handleWatchedToggle = () => {
    if (isWatched) {
      watchedManager.removeFromWatched(movie.id);
      setIsWatched(false);
    } else {
      watchedManager.markAsWatched({ ...movie, media_type: type });
      setIsWatched(true);
      if (isInWatchlist) {
        watchlistManager.removeFromWatchlist(movie.id);
        setIsInWatchlist(false);
      }
    }
  };

  if (isLoading) return <LoadingSpinner message="Loading details..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!movie) return <ErrorMessage message="Movie not found" />;

  const title = movie.title || movie.name;
  const releaseDate = movie.release_date || movie.first_air_date;
  const runtime = movie.runtime || (movie.episode_run_time && movie.episode_run_time[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 pb-16">
      <div className="container mx-auto px-4 py-10">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row gap-8 bg-white/95 rounded-2xl shadow-2xl p-6 md:p-10 border-2 border-gray-200">
          {/* Poster */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <img
              src={getImageUrl(movie.poster_path, 'w500')}
              alt={title}
              className="rounded-xl shadow-lg w-60 md:w-72 object-cover bg-gray-800 border-4 border-gray-200"
              onError={(e) => {
                e.target.src = '/placeholder-movie.jpg';
              }}
            />
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-4 text-center md:text-left block">
                {title}
              </h1>
              {/* Date, Time, Type - vertical flow */}
              <div className="flex flex-col gap-3 items-center mb-6 md:items-start text-blue-900 tracking-widest whitespace-nowrap">
                {releaseDate && (
                  <span className="px-3 py-1 bg-transparent text-blue-900 text-sm font-semibold shadow-none block" style={{ wordSpacing: '0.3em', letterSpacing: '0.08em' }}>
                    {new Date(releaseDate).getFullYear()}
                  </span>
                )}
                {runtime && (
                  <span className="px-3 py-1 bg-transparent text-blue-900 text-sm font-semibold shadow-none block" style={{ wordSpacing: '0.3em', letterSpacing: '0.08em' }}>
                    {runtime} min
                  </span>
                )}
                <span className="px-3 py-1 bg-transparent text-blue-900 text-sm font-semibold shadow-none block" style={{ wordSpacing: '0.3em', letterSpacing: '0.08em' }}>
                  {type.toUpperCase()}
                </span>
              </div>

              {/* Genres - vertical flow */}
              <div className="flex flex-col gap-2 mb-4 items-center md:items-start">
                {movie.genres && movie.genres.map(genre => (
                  <span
                    key={genre.id}
                    className="px-2 py-1 bg-transparent text-blue-800 text-xs font-medium block"
                    style={{ wordSpacing: '0.2em', letterSpacing: '0.07em' }}
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              {/* Ratings */}
              <div className="flex flex-wrap gap-4 mb-6 justify-center md:justify-start">
                <div className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-lg text-sm text-blue-900 font-semibold shadow block">
                  <span>TMDB:</span>
                  <span>⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                </div>
                {movie.imdbRating && (
                  <div className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-lg text-sm text-blue-900 font-semibold shadow block">
                    <span>IMDB:</span>
                    <span>⭐ {movie.imdbRating}</span>
                  </div>
                )}
                {movie.rottenTomatoesRating && (
                  <div className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-lg text-sm text-blue-900 font-semibold shadow block">
                    <span>RT:</span>
                    <span>🍅 {movie.rottenTomatoesRating}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-4 mb-6 justify-center md:justify-start">
                <button
                  onClick={handleWatchlistToggle}
                  className={`px-5 py-2 rounded-lg font-semibold shadow transition-all duration-300 hover:scale-105 block ${
                    isInWatchlist
                      ? 'bg-emerald-600/90 text-white hover:bg-emerald-500/90'
                      : 'bg-blue-200 text-blue-900 hover:bg-blue-300'
                  }`}
                >
                  {isInWatchlist ? '💚 In Watchlist' : '🤍 Add to Watchlist'}
                </button>
                <button
                  onClick={handleWatchedToggle}
                  className={`px-5 py-2 rounded-lg font-semibold shadow transition-all duration-300 hover:scale-105 block ${
                    isWatched
                      ? 'bg-blue-600/90 text-white hover:bg-blue-500/90'
                      : 'bg-blue-200 text-blue-900 hover:bg-blue-300'
                  }`}
                >
                  {isWatched ? '✅ Watched' : '⭕ Mark as Watched'}
                </button>
              </div>

              {/* Overview */}
              <div className="mb-4 flex flex-col items-center">
                <h3 className="text-lg font-bold text-blue-900 mb-2 text-center block">Overview</h3>
                <p className="text-blue-900 text-center block max-w-2xl">{movie.plot || movie.overview || 'No overview available.'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12">
          {/* Cast */}
          {movie.credits && movie.credits.cast && (
            <section className="mb-10">
              <h3 className="text-xl font-bold text-blue-900 mb-4 text-center block">Cast</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                {movie.credits.cast.slice(0, 10).map(actor => (
                  <div key={actor.id} className="flex flex-col items-center">
                    <img
                      src={getImageUrl(actor.profile_path, 'w185')}
                      alt={actor.name}
                      className="w-24 h-24 object-cover rounded-full mb-2 bg-blue-200 border-2 border-blue-200"
                      onError={(e) => {
                        e.target.src = '/placeholder-person.jpg';
                      }}
                    />
                    <div className="text-center">
                      <p className="text-sm font-semibold text-blue-900">{actor.name}</p>
                      <p className="text-xs text-blue-700">{actor.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Crew */}
          {movie.credits && movie.credits.crew && (
            <section className="mb-10">
              <h3 className="text-xl font-bold text-blue-900 mb-4 text-center block tracking-widest">
                Key Crew
              </h3>
              <div className="flex flex-col gap-4 items-center">
                {movie.credits.crew
                  .filter(person => ['Director', 'Producer', 'Writer'].includes(person.job))
                  .slice(0, 10)
                  .map(person => (
                    <div
                      key={`${person.id}-${person.job}`}
                      className="shadow px-4 py-2 bg-blue-100 flex flex-col items-center rounded-2xl w-full max-w-xs"
                    >
                      <span className="block text-blue-900 font-semibold">{person.name}</span>
                      <span className="block text-xs text-blue-700">{person.job}</span>
                    </div>
                  ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;