import MovieCard from '../movie/MovieCard';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const SearchResults = ({
  results,
  isLoading,
  error,
  currentPage,
  totalPages,
  onPageChange
}) => {
  if (isLoading) {
    return <LoadingSpinner message="Searching..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!results || results.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-12">
        <p>No results found. Try a different search term.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {results.map((item) => (
          <div
            key={`${item.id}-${item.media_type || item.title || item.name}`}
            className="scale-125 origin-top mx-auto"
            style={{ maxWidth: '180px', minWidth: '120px' }}
          >
            <MovieCard
              movie={item}
              showActions={false}
            />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        Previous
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-md font-medium ${
            page === currentPage
              ? 'bg-amber-500 text-white'
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default SearchResults;
