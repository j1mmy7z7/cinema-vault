import MovieCard from './MovieCard';

const MovieGrid = ({ movies, title, showActions = true }) => {
  if (!movies || movies.length === 0) {
    return (
      <div className="movie-grid-empty">
        <p>No movies to display</p>
      </div>
    );
  }

  return (
    <div className="movie-grid-container">
      {title && <h2 className="grid-title">{title}</h2>}
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard 
            key={movie.id} 
            movie={movie} 
            showActions={showActions}
          />
        ))}
      </div>
    </div>
  );
};

export default MovieGrid;