import { useState, useCallback } from 'react';
import SearchBar from '../components/search/SearchBar';
import SearchResults from '../components/search/SearchResults';
import { tmdbService } from '../services/api';
import { cacheManager } from '../utils/storage';

const SearchPage = () => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentQuery, setCurrentQuery] = useState('');

  const handleSearch = useCallback(async (query, page = 1) => {
    setIsLoading(true);
    setError(null);
    setCurrentQuery(query);
    setCurrentPage(page);

    // Check cache first
    const cacheKey = `search_${query}_${page}`;
    const cachedResults = cacheManager.get(cacheKey);
    
    if (cachedResults) {
      setResults(cachedResults.results);
      setTotalPages(cachedResults.total_pages);
      setIsLoading(false);
      return;
    }

    try {
      const response = await tmdbService.search(query, page);
      setResults(response.results);
      setTotalPages(response.total_pages);
      
      // Cache the results
      cacheManager.set(cacheKey, response, 15); // Cache for 15 minutes
      
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handlePageChange = (page) => {
    if (currentQuery) {
      handleSearch(currentQuery, page);
    }
  };

  return (
    <div className="search-page">
      <div className="container">
        <h1>Search Movies & TV Shows</h1>
        
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        
        <SearchResults
          results={results}
          isLoading={isLoading}
          error={error}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default SearchPage;
