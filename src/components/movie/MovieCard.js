import { Link } from 'react-router-dom';
import { getImageUrl } from '../../services/api';
import { watchlistManager, watchedManager } from '../../utils/storage';

const MovieCard = ({ movie, showActions = true }) => {
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
        // Force re-render by updating parent component
        window.location.reload();
    };

    const handleWatchedToggle = (e) => {
        e.preventDefault();
        if (isWatched) {
            watchedManager.removeFromWatched(movie.id);
        } else {
            watchedManager.markAsWatched(movie);
        }
        window.location.reload(); // Simple solution for now
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).getFullYear();
    };

    const formatRating = (rating) => {
        return rating ? rating.toFixed(1) : 'N/A';
    };

    return (
        <div className="movie-card">
      <Link to={`/${mediaType}/${movie.id}`} className="movie-card-link">
        <div className="movie-poster">
          <img 
            src={getImageUrl(movie.poster_path)} 
            alt={title}
            onError={(e) => {
              e.target.src = '/placeholder-movie.jpg';
            }}
          />
          <div className="movie-overlay">
            <div className="movie-rating">
              ⭐ {formatRating(movie.vote_average)}
            </div>
          </div>
        </div>
        
        <div className="movie-info">
          <h3 className="movie-title">{title}</h3>
          <div className="movie-meta">
            <span className="movie-year">{formatDate(releaseDate)}</span>
            <span className="movie-type">{mediaType.toUpperCase()}</span>
          </div>
          
          {movie.overview && (
            <p className="movie-overview">
              {movie.overview.length > 100 
                ? `${movie.overview.substring(0, 100)}...` 
                : movie.overview
              }
            </p>
          )}
        </div>
      </Link>
      
      {showActions && (
        <div className="movie-actions">
          <button 
            onClick={handleWatchlistToggle}
            className={`action-button ${isInWatchlist ? 'active' : ''}`}
            title={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            {isInWatchlist ? '💚' : '🤍'} Watchlist
          </button>
          
          <button 
            onClick={handleWatchedToggle}
            className={`action-button ${isWatched ? 'active' : ''}`}
            title={isWatched ? 'Mark as Unwatched' : 'Mark as Watched'}
          >
            {isWatched ? '✅' : '⭕'} Watched
          </button>
        </div>
      )}
    </div>
  );
}

export default MovieCard;
