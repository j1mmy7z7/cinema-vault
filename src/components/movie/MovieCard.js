import React from 'react';
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

    return (<>move card goes here </>)
}
