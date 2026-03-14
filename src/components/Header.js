import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { tools } from '../data/tools';
import './Header.css';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="header glass-surface">
      <div className="header-inner">
        <Link to="/" className="logo">
          <div className="logo-icon">◈</div>
          <span className="logo-text">AIToolDock</span>
        </Link>

        <div className="nav-container">
          <nav className="nav">
            {!isHome && (
              <Link to="/" className="nav-back">
                ← All Tools
              </Link>
            )}
            {isHome && (
              <Link to="/about" className="nav-link">
                About Creator
              </Link>
            )}
            <div className="nav-badge">{tools.length} Tools</div>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
