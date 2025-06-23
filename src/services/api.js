const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const OMDB_API_KEY = process.env.REACT_APP_OMDB_API_KEY;

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const OMDB_BASE_URL = 'http://www.omdbapi.com';

// reusable function for fetching data and handling errors
const fetchJson = async(url) => {
    try {
        const response = await fetch(url)
        if (!response.ok) {
            if (response.status == 429) {
                throw new Error("Too many requests")
            }
            throw new Error("An issue occured")
        }
        return await response.json()
    } catch(error) {
        console.error("Fetch error:", error)
        throw error;
    }
}

export const tmdbService = {
  search: async (query, page = 1) => {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      query,
      page,
    });
    return fetchJson(`${TMDB_BASE_URL}/search/multi?${params}`);
  },
}