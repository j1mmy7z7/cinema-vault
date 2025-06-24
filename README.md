# Cinema-vault
An entertainment discovery platform where users can search for movies and TV shows, view detailed information, manage personal watchlists, and discover trending content—all powered by TMDB and OMDB APIs.
🚀 Features

    🔍 Real-Time Search: Instantly search for movies and TV shows with live autocomplete.

    🎞️ Detailed View Pages: See titles, plot summaries, cast, release dates, posters, and ratings from TMDB, IMDB, and Rotten Tomatoes.

    📋 Personal Watchlist: Add or remove titles and mark them as watched.

    📈 Trending Dashboard: View popular and trending movies and shows.

    ⭐ Multi-Source Ratings: Integrate ratings from IMDB, Rotten Tomatoes, and TMDB.


🔧 Tech Stack

    Frontend: React / Next.js

    Styling: Tailwind CSS

    Data: TMDB API, OMDB API

    State Management: React Hooks

    Persistence: localStorage

⚙️ Technical Highlights

    ✅ Loading states and graceful error messages.

    ✅ Pagination support for long content lists.

    ✅ API response caching for performance.

    ✅ Environment-based API key protection.

🔐 Environment Setup

Create a .env.local file in the root with the following:

NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
NEXT_PUBLIC_OMDB_API_KEY=your_omdb_api_key

📁 LocalStorage Structure

User preferences and watchlists are stored persistently in the browser:

localStorage.setItem('watchlist', JSON.stringify([...]));
localStorage.setItem('watched', JSON.stringify([...]));

💡 Future Enhancements
    filter based on genres

    more sleek ui desing

    movie recommendations

    Social sharing and reviews

    Integration with trailers 


🧪 Running Locally
git clone the repo
cd entertainment-platform
npm install
npm run dev

Visit http://localhost:3000 to view the app.
📜 License

MIT — open-source and free to use.