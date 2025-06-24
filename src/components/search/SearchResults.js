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
      <div className="no-results">
        <p>No results found. Try a different search term.</p>
      </div>
    );
  }

  return (
    <div className="search-results">
      <div className="results-grid">
        {results.map((item) => (
          <MovieCard 
            key={`${item.id}-${item.media_type}`} 
            movie={item} 
          />
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
    const pages = [];
    const maxVisible = 5;
    
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    // Adjust start if we're near the end
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="pagination">
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-button"
      >
        Previous
      </button>
      
      {getPageNumbers().map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`pagination-button ${page === currentPage ? 'active' : ''}`}
        >
          {page}
        </button>
      ))}
      
      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        Next
      </button>
    </div>
  );
};


export default SearchResults;