// pages/[type]/[id].js

'use client'; // if you're using App Router; remove this if in pages directory

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
    <div className="movie-detail-page">
      <div className="movie-hero">
        <div className="container">
          <div className="movie-hero-content">
            <div className="movie-poster-large">
              <img
                src={getImageUrl(movie.poster_path, 'w500')}
                alt={title}
                onError={(e) => {
                  e.target.src = '/placeholder-movie.jpg';
                }}
              />
            </div>

            <div className="movie-details">
              <h1 className="movie-title">{title}</h1>

              <div className="movie-meta">
                {releaseDate && (
                  <span className="release-date">
                    {new Date(releaseDate).getFullYear()}
                  </span>
                )}
                {runtime && (
                  <span className="runtime">{runtime} min</span>
                )}
                <span className="media-type">{type.toUpperCase()}</span>
              </div>

              <div className="movie-genres">
                {movie.genres && movie.genres.map(genre => (
                  <span key={genre.id} className="genre-tag">
                    {genre.name}
                  </span>
                ))}
              </div>

              <div className="movie-ratings">
                <div className="rating">
                  <span className="rating-label">TMDB:</span>
                  <span className="rating-value">
                    ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                  </span>
                </div>

                {movie.imdbRating && (
                  <div className="rating">
                    <span className="rating-label">IMDB:</span>
                    <span className="rating-value">⭐ {movie.imdbRating}</span>
                  </div>
                )}

                {movie.rottenTomatoesRating && (
                  <div className="rating">
                    <span className="rating-label">RT:</span>
                    <span className="rating-value">🍅 {movie.rottenTomatoesRating}</span>
                  </div>
                )}
              </div>

              <div className="movie-actions">
                <button
                  onClick={handleWatchlistToggle}
                  className={`action-button ${isInWatchlist ? 'active' : ''}`}
                >
                  {isInWatchlist ? '💚 In Watchlist' : '🤍 Add to Watchlist'}
                </button>

                <button
                  onClick={handleWatchedToggle}
                  className={`action-button ${isWatched ? 'active' : ''}`}
                >
                  {isWatched ? '✅ Watched' : '⭕ Mark as Watched'}
                </button>
              </div>

              <div className="movie-overview">
                <h3>Overview</h3>
                <p>{movie.plot || movie.overview || 'No overview available.'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="movie-additional-info">
        <div className="container">
          {movie.credits && movie.credits.cast && (
            <section className="cast-section">
              <h3>Cast</h3>
              <div className="cast-grid">
                {movie.credits.cast.slice(0, 10).map(actor => (
                  <div key={actor.id} className="cast-member">
                    <img
                      src={getImageUrl(actor.profile_path, 'w185')}
                      alt={actor.name}
                      onError={(e) => {
                        e.target.src = '/placeholder-person.jpg';
                      }}
                    />
                    <div className="cast-info">
                      <p className="actor-name">{actor.name}</p>
                      <p className="character-name">{actor.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {movie.credits && movie.credits.crew && (
            <section className="crew-section">
              <h3>Key Crew</h3>
              <div className="crew-list">
                {movie.credits.crew
                  .filter(person => ['Director', 'Producer', 'Writer'].includes(person.job))
                  .slice(0, 10)
                  .map(person => (
                    <div key={`${person.id}-${person.job}`} className="crew-member">
                      <span className="crew-name">{person.name}</span>
                      <span className="crew-job">{person.job}</span>
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