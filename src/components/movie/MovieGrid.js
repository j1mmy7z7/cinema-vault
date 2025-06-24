import MovieCard from './MovieCard';

const MovieGrid = ({ movies, title, showActions = true }) => {
  if (!movies || movies.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-xl bg-gradient-to-br from-gray-900/50 to-gray-800/70 p-8 text-center shadow-inner">
        <div className="relative">
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-amber-600/20 to-purple-600/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
          <p className="relative font-serif text-xl text-amber-100/80">
            The cosmic reel is empty...<br />
            <span className="text-sm text-gray-400">No celestial projections to display</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12 space-y-8 px-4 sm:px-6 md:px-8">
      {title && (
        <h2 className="font-serif text-3xl font-medium text-amber-100/90">
          <span className="relative inline-block">
            {title}
            <span className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-amber-600/80 to-transparent"></span>
          </span>
        </h2>
      )}
      
      {/* Alternative: Improved flex layout with better spacing */}
      <div className="flex flex-wrap justify-center sm:justify-start gap-8 md:gap-10 lg:gap-12">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="w-[320px] sm:w-[360px] md:w-[400px] flex-shrink-0"
          >
            <MovieCard movie={movie} showActions={showActions} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieGrid;