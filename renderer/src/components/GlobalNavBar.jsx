import { useState } from 'react';
import '../styles/GlobalNavBar.css';

/**
 * Global Navigation Bar Component
 * Features:
 * - Back button
 * - Close/Home button
 * - Global search
 * - Breadcrumbs
 * - Theme toggle
 */
export default function GlobalNavBar({
  onBack,
  onHome,
  onSearch,
  currentView,
  viewHistory = [],
  searchPlaceholder = "Search anywhere...",
  showSearch = true,
  showBack = true,
  showHome = true
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleBackClick = () => {
    if (onBack && viewHistory.length > 1) {
      onBack();
    }
  };

  const handleHomeClick = () => {
    if (onHome) {
      onHome();
    }
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <div className="global-navbar">
      <div className="navbar-left">
        {/* Back Button */}
        {showBack && (
          <button
            className={`nav-btn nav-back ${viewHistory.length <= 1 ? 'disabled' : ''}`}
            onClick={handleBackClick}
            disabled={viewHistory.length <= 1}
            title="Go back"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Back</span>
          </button>
        )}

        {/* Home Button */}
        {showHome && (
          <button
            className="nav-btn nav-home"
            onClick={handleHomeClick}
            title="Go to dashboard"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span>Home</span>
          </button>
        )}

        {/* Breadcrumbs */}
        <div className="breadcrumbs">
          <span className="breadcrumb-item current">
            {currentView || 'Dashboard'}
          </span>
        </div>
      </div>

      <div className="navbar-center">
        {/* Global Search */}
        {showSearch && (
          <div className={`global-search ${searchFocused ? 'focused' : ''}`}>
            <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            {searchQuery && (
              <button
                className="search-clear"
                onClick={handleSearchClear}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        )}
      </div>

      <div className="navbar-right">
        {/* Additional actions can go here */}
        <div className="navbar-actions">
          {/* User menu, notifications, etc. */}
        </div>
      </div>
    </div>
  );
}
