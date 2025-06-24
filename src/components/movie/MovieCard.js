'use client';
import Link from 'next/link';
import { useState } from 'react';
import { getImageUrl } from '../../services/api';
import { watchlistManager, watchedManager } from '../../utils/storage';

const MovieCard = ({ movie, showActions = true }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const title = movie.title || movie.name;
  const releaseDate = movie.release_date || movie.first_air_date;
  const mediaType = movie.media_type || 'movie';
  const isInWatchlist = watchlistManager.isInWatchlist(movie.id);
  const isWatched = watchedManager.isWatched(movie.id);

  const handleWatchlistToggle = (e) => {
    e.preventDefault();
    if (isInWatchlist) {
      watchlistManager.removeFromWatchlist(movie.id);
    } else {
      watchlistManager.addToWatchlist(movie);
    }
    window.location.reload();
  };

  const handleWatchedToggle = (e) => {
    e.preventDefault();
    if (isWatched) {
      watchedManager.removeFromWatched(movie.id);
    } else {
      watchedManager.markAsWatched(movie);
    }
    window.location.reload();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).getFullYear();
  };

  const formatRating = (rating) => {
    return rating ? rating.toFixed(1) : 'N/A';
  };

  const getRatingColor = (rating) => {
    if (rating >= 8) return 'text-emerald-400 bg-emerald-900/80';
    if (rating >= 6) return 'text-amber-400 bg-amber-900/80';
    return 'text-red-400 bg-red-900/80';
  };

  return (
    <div 
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/95 to-gray-800/95 shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20 flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${Math.random() * 0.5}s` }}
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 bg-gradient-to-br from-amber-400 via-purple-500 to-pink-500 blur-2xl -z-10 scale-110"></div>
      
      <Link href={`/${mediaType}/${movie.id}`} className="flex flex-col h-full">
        {/* Image */}
        <div className="relative overflow-hidden rounded-t-2xl">
          {!imageLoaded && (
            <div className="aspect-[2/3] w-full bg-gradient-to-br from-gray-800 to-gray-700 animate-pulse flex items-center justify-center">
              <div className="text-gray-400 text-3xl">🎬</div>
            </div>
          )}
          
          <img
            src={getImageUrl(movie.poster_path)}
            alt={title}
            className={`aspect-[2/3] w-full object-cover transition-all duration-700 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src = '/placeholder-movie.jpg';
              setImageLoaded(true);
            }}
          />

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-bold backdrop-blur-sm shadow-lg transition-all duration-300 ${getRatingColor(movie.vote_average)} transform ${isHovered ? 'scale-110' : 'scale-100'}`}>
            ★ {formatRating(movie.vote_average)}
          </div>

          <div className="absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-medium bg-black/70 text-white backdrop-blur-sm shadow">
            {mediaType === 'movie' ? '🎬' : '📺'} {mediaType.toUpperCase()}
          </div>

          <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
            <p className="text-xs text-gray-200 bg-black/40 rounded px-2 py-1 line-clamp-3 shadow">
              {movie.overview && movie.overview.length > 80 
                ? `${movie.overview.substring(0, 80)}...` 
                : movie.overview || 'No description available'}
            </p>
          </div>
        </div>

        {/* Title and Release */}
        <div className="p-3 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold mb-1 text-white line-clamp-2 group-hover:text-amber-200 transition-colors duration-300 text-center">
              {title}
            </h3>
            <div className="text-xs text-gray-400 mb-2 text-center">
              <span>{formatDate(releaseDate)}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Action Buttons */}
      {showActions && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-between p-2 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-full group-hover:translate-y-0">
          <button
            onClick={handleWatchlistToggle}
            className={`px-3 py-1 rounded-md text-xs font-semibold shadow transition-all duration-300 hover:scale-110 ${
              isInWatchlist 
                ? 'bg-emerald-600/90 text-white hover:bg-emerald-500/90' 
                : 'bg-gray-700/80 text-gray-200 hover:bg-amber-400/90 hover:text-gray-900'
            }`}
            title={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            {isInWatchlist ? '💚' : '🤍'}
          </button>
          
          <button
            onClick={handleWatchedToggle}
            className={`px-3 py-1 rounded-md text-xs font-semibold shadow transition-all duration-300 hover:scale-110 ${
              isWatched 
                ? 'bg-blue-600/90 text-white hover:bg-blue-500/90' 
                : 'bg-gray-700/80 text-gray-200 hover:bg-amber-400/90 hover:text-gray-900'
            }`}
            title={isWatched ? 'Mark as Unwatched' : 'Mark as Watched'}
          >
            {isWatched ? '✅' : '⭕'}
          </button>
        </div>
      )}

      {/* Status Indicators */}
      <div className="absolute top-0 left-0 right-0 flex justify-between p-2 pointer-events-none">
        {isInWatchlist && (
          <div className="bg-emerald-500/20 backdrop-blur-sm rounded-full p-1">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          </div>
        )}
        {isWatched && (
          <div className="bg-blue-500/20 backdrop-blur-sm rounded-full p-1 ml-auto">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in-up {
          animation: slide-in-up 0.6s ease-out forwards;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default MovieCard;
