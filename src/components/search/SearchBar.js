import { useState } from 'react';

const SearchBar = ({ onSearch, isLoading }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault()
        if (query.trim()) {
            onSearch(query);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="search-bar">
            <div className="search-input-container">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for movies and TV shows..."
                    className="search-input"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="search-button"
                    disabled={isLoading || !query.trim()}
                >
                    {isLoading ? 'Searching...' : 'Search'}
                </button>
            </div>
        </form>
    );
}

export default SearchBar