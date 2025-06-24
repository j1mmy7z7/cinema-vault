// pages/search.js
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
      cacheManager.set(cacheKey, response, 15);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-10 flex flex-col items-center">
      <div className="container max-w-4xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-amber-400 mb-8 text-center tracking-tight">
          🎯 Search Movies & TV Shows
        </h1>

        <div className="mb-8 flex justify-center">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>
      </div>
      <div className="container max-w-6xl mx-auto px-4 w-full">
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
