import { useState, useEffect } from 'react';
import { tmdbService } from '../../services/api';

const GenreFilter = ({ selectedGenres, onGenreChange, mediaType = 'movie' }) => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await tmdbService.getGenres(mediaType);
        setGenres(response.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, [mediaType]);

  const handleGenreToggle = (genreId) => {
    const newSelectedGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId];
    
    onGenreChange(newSelectedGenres);
  };

  if (loading) {
    return <div>Loading genres...</div>;
  }

  return (
    <div className="genre-filter">
      <h3>Filter by Genre</h3>
      <div className="genre-buttons">
        {genres.map(genre => (
          <button
            key={genre.id}
            onClick={() => handleGenreToggle(genre.id)}
            className={`genre-button ${
              selectedGenres.includes(genre.id) ? 'active' : ''
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenreFilter