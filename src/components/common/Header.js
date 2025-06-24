import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation()

    const isActive = (path) => {
        return location.pathname === path ? 'nav-link active' : 'nva-link';
    }

    return (
        <header className="header">
      <div className="container">
        <Link to="/" className="logo">
            cinema-vault
        </Link>
        
        <nav className="nav">
          <Link to="/" className={isActive('/')}>
            Home
          </Link>
          <Link to="/search" className={isActive('/search')}>
            Search
          </Link>
          <Link to="/trending" className={isActive('/trending')}>
            Trending
          </Link>
          <Link to="/watchlist" className={isActive('/watchlist')}>
            Watchlist
          </Link>
          <Link to="/watched" className={isActive('/watched')}>
            Watched
          </Link>
        </nav>
      </div>
    </header>
  );   
}

export default Header;