//'use client';
// function App() {
//   useEffect(() => {
//     const test = async () => {
//       const data = await tmdbService.search("fight club");
//       console.log("TMDB Data:", data);
//     };

//     const test2 = async () => {
//       const data = await tmdbService.getMovieDetails("550,")
//       console.log("movie data: " , data)
//     }

//     test();
//     test2();
//   }, []);

//   return <div>App Loaded</div>;
// }


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import TrendingPage from './pages/TrendingPage';
import WatchlistPage from './pages/WatchlistPage';
import WatchedPage from './pages/WatchedPage';
import MovieDetailPage from './pages/MovieDetailPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/trending" element={<TrendingPage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/watched" element={<WatchedPage />} />
            <Route path="/movie/:id" element={<MovieDetailPage />} />
            <Route path="/tv/:id" element={<MovieDetailPage />} />
            {/* Catch all route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

// Simple 404 page
const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="container">
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
      </div>
    </div>
  );
};

// Simple footer
const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; 2024 CinephileHub. Data provided by TMDB and OMDB.</p>
      </div>
    </footer>
  );
};


export default App;








  // export default function App() {
//   return (
//     <>
//     <h1> content goes here ... </h1>
//     </>
//   );
// }
