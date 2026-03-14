import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ToolCard from '../components/ToolCard';
import { tools, categories, sortTools } from '../data/tools';
import './HomePage.css';

const CATEGORY_ICONS = {
  "Writing AI": "✍️",
  "Image Generation": "🎨",
  "Video AI": "🎬",
  "Coding AI": "💻",
  "Voice & Audio": "🎙️",
  "Productivity": "⚡",
  "Marketing AI": "📣",
  "Research AI": "🔬",
  "Automation": "🔄",
  "Chat & Assistants": "🤖",
  "Design AI": "📐",
  "3D & Animation": "🧊",
  "Data & Analytics": "📊",
  "Education AI": "🎓",
};

const FEATURED_IDS = ["chatgpt", "midjourney", "cursor", "suno", "perplexity"];

export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const featuredTools = FEATURED_IDS.map(id => tools.find(t => t.id === id)).filter(Boolean);
  const currentFeatured = featuredTools[featuredIdx];

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('nv-recent') || '[]');
      setRecentlyViewed(saved.map(id => tools.find(t => t.id === id)).filter(Boolean).slice(0, 4));
    } catch { }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setFeaturedIdx(i => (i + 1) % featuredTools.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [featuredTools.length]);

  const filtered = useMemo(() => {
    let result = tools;
    if (activeCategory !== 'All') {
      result = result.filter(t => t.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.shortDescription.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.tagline?.toLowerCase().includes(q)
      );
    }
    return sortTools(result, sortBy);
  }, [search, activeCategory, sortBy]);

  useEffect(() => {
    if (search || activeCategory !== 'All') {
      const categoryText = activeCategory !== 'All' ? ` in ${activeCategory}` : '';
      const searchText = search ? ` for "${search}"` : '';
      document.title = `Search AI Tools${searchText}${categoryText} | AIToolDock`;

      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', `Browsing the best AI tools${searchText}${categoryText}. Find the top curated AI solutions on AIToolDock.`);
      }
    } else {
      document.title = 'AIToolDock | Discover the Future of AI Tools';
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 'AIToolDock ◈ The ultimate AI tools directory for 2026. Discover 100+ best AI tools for writing, coding, image generation, business, and productivity.');
      }
    }
  }, [search, activeCategory]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    tools.forEach(t => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }, []);

  const handleToolClick = useCallback((id) => {
    try {
      const saved = JSON.parse(localStorage.getItem('nv-recent') || '[]');
      const updated = [id, ...saved.filter(x => x !== id)].slice(0, 8);
      localStorage.setItem('nv-recent', JSON.stringify(updated));
    } catch { }
    navigate(`/tool/${id}`);
  }, [navigate]);

  const isSearching = search.trim() !== '' || activeCategory !== 'All';

  return (
    <div className="home">
      <Header />

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
          <div className="hero-grid" />
        </div>
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="eyebrow-dot" />
            The AI Discovery Platform
          </div>
          <h1 className="hero-title">
            Discover the best<br />
            <span className="hero-accent">AI tools</span> for your work
          </h1>
          <p className="hero-subtitle">
            The ultimate intelligence index. {tools.length}+ curated AI solutions,
            verified for performance and impact. Navigate the future of productivity with precision.
          </p>

          <div className="search-wrap">
            <div className="search-bar">
              <span className="search-icon">⌕</span>
              <input
                type="text"
                placeholder="Search tools, categories, or use cases..."
                value={search}
                onChange={e => { setSearch(e.target.value); setActiveCategory('All'); }}
                className="search-input"
              />
              {search && (
                <button className="search-clear" onClick={() => setSearch('')}>✕</button>
              )}
            </div>
            <div className="search-suggestions">
              {["Image AI", "Coding", "Writing", "Automation", "Voice"].map(s => (
                <button key={s} className="suggestion-pill"
                  onClick={() => { setSearch(s); setActiveCategory('All'); }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-num">{tools.length}</span>
              <span className="stat-label">AI Tools</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">{categories.length - 1}</span>
              <span className="stat-label">Categories</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">100%</span>
              <span className="stat-label">Free to Explore</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">{tools.filter(t => t.isNew).length}</span>
              <span className="stat-label">New This Month</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Spotlight — only show when not searching */}
      {!isSearching && (
        <section className="featured-section">
          <div className="container">
            <div className="section-label">
              <span className="section-label-dot" />
              Featured Tool
            </div>
            <div
              className="featured-card"
              style={{ '--featured-color': currentFeatured?.logoColor }}
              onClick={() => handleToolClick(currentFeatured.id)}
            >
              <div className="featured-bg-glow" />
              <div className="featured-content">
                <div className="featured-left">
                  <div className="featured-logo">{currentFeatured?.logo}</div>
                  <div className="featured-category">{currentFeatured?.category}</div>
                  <h2 className="featured-name">{currentFeatured?.name}</h2>
                  <p className="featured-tagline">{currentFeatured?.tagline}</p>
                  <div className="featured-meta">
                    <span className="feat-rating">★ {currentFeatured?.rating}</span>
                    <span className="feat-users">{currentFeatured?.users} users</span>
                  </div>
                  <button className="featured-cta">
                    Learn About This Tool →
                  </button>
                </div>
                <div className="featured-right">
                  <div className="featured-use-cases">
                    {currentFeatured?.useCases?.slice(0, 3).map((uc, i) => (
                      <div key={i} className="feat-use-case">
                        <div className="feat-uc-num">{String(i + 1).padStart(2, '0')}</div>
                        <div>
                          <div className="feat-uc-title">{uc.title}</div>
                          <div className="feat-uc-desc">{uc.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="featured-dots">
                {featuredTools.map((_, i) => (
                  <button
                    key={i}
                    className={`feat-dot ${i === featuredIdx ? 'feat-dot-active' : ''}`}
                    onClick={e => { e.stopPropagation(); setFeaturedIdx(i); }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recently Viewed */}
      {!isSearching && recentlyViewed.length > 0 && (
        <section className="recent-section">
          <div className="container">
            <div className="section-label">
              <span className="section-label-dot" style={{ background: '#a5b4fc' }} />
              Recently Viewed
            </div>
            <div className="recent-grid">
              {recentlyViewed.map(tool => (
                <div
                  key={tool.id}
                  className="recent-card"
                  style={{ '--card-color': tool.logoColor }}
                  onClick={() => handleToolClick(tool.id)}
                >
                  <span className="recent-emoji">{tool.logo}</span>
                  <div>
                    <div className="recent-name">{tool.name}</div>
                    <div className="recent-cat">{tool.category}</div>
                  </div>
                  <span className="recent-arrow">→</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Browse — only show when not searching */}
      {!isSearching && activeCategory === 'All' && (
        <section className="categories-browse">
          <div className="container">
            <div className="section-label">
              <span className="section-label-dot" style={{ background: '#fbbf24' }} />
              Browse by Category
            </div>
            <div className="cat-cards-grid">
              {categories.slice(1).map(cat => (
                <button
                  key={cat}
                  className="cat-card"
                  onClick={() => setActiveCategory(cat)}
                >
                  <span className="cat-card-icon">{CATEGORY_ICONS[cat] || '🔧'}</span>
                  <div className="cat-card-name">{cat}</div>
                  <div className="cat-card-count">{categoryCounts[cat] || 0} tools</div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filter & Sort Bar */}
      <div className="filters-bar">
        <div className="filters-inner">
          <div className="categories-scroll">
            {categories.map(cat => (
              <button
                key={cat}
                className={`cat-btn ${activeCategory === cat ? 'cat-btn-active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat !== 'All' && CATEGORY_ICONS[cat] && (
                  <span className="cat-btn-icon">{CATEGORY_ICONS[cat]}</span>
                )}
                {cat}
                {cat !== 'All' && (
                  <span className="cat-btn-count">{categoryCounts[cat] || 0}</span>
                )}
              </button>
            ))}
          </div>
          <div className="filter-controls">
            <select
              className="sort-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="rating">Highest Rated</option>
              <option value="name">A → Z</option>
            </select>
            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'view-btn-active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid view"
              >⊞</button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'view-btn-active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List view"
              >☰</button>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <section className="tools-section">
        <div className="container">
          <div className="section-header">
            <div className="section-header-left">
              <h2 className="section-title">
                {search ? `Results for "${search}"` : activeCategory === 'All' ? 'All AI Tools' : activeCategory}
              </h2>
              <span className="results-count">{filtered.length} tool{filtered.length !== 1 ? 's' : ''}</span>
            </div>
            {isSearching && (
              <button
                className="clear-filters-btn"
                onClick={() => { setSearch(''); setActiveCategory('All'); }}
              >
                ✕ Clear filters
              </button>
            )}
          </div>

          {filtered.length > 0 ? (
            <div className={`tools-grid ${viewMode === 'list' ? 'tools-list' : ''}`}>
              {filtered.map(tool => (
                viewMode === 'list'
                  ? <ListCard key={tool.id} tool={tool} onClick={() => handleToolClick(tool.id)} />
                  : <div key={tool.id} onClick={() => handleToolClick(tool.id)}>
                    <ToolCard tool={tool} />
                  </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔮</div>
              <h3>No tools found</h3>
              <p>Try a different search term or browse by category</p>
              <button
                className="empty-reset"
                onClick={() => { setSearch(''); setActiveCategory('All'); }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-left">
            <div className="footer-logo">◈ AIToolDock</div>
            <p className="footer-tagline">The ultimate AI discovery platform</p>
          </div>
          <div className="footer-right">
            <p className="footer-copy">© 2026 AIToolDock · {tools.length} tools across {categories.length - 1} categories</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ListCard({ tool, onClick }) {
  return (
    <div className="list-card" onClick={onClick} style={{ '--card-color': tool.logoColor }}>
      <div className="list-logo">
        <span>{tool.logo}</span>
      </div>
      <div className="list-body">
        <div className="list-meta">
          <span className="list-category">{tool.category}</span>
          {tool.popular && <span className="badge badge-popular">Popular</span>}
          {tool.isNew && <span className="badge badge-new">New</span>}
        </div>
        <h3 className="list-name">{tool.name}</h3>
        <p className="list-desc">{tool.shortDescription}</p>
      </div>
      <div className="list-stats">
        <div className="list-rating">
          <span className="star">★</span> {tool.rating}
        </div>
        <div className="list-users">{tool.users}</div>
      </div>
      <div className="list-arrow">→</div>
    </div>
  );
}
