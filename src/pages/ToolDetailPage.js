import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { tools } from '../data/tools';
import './ToolDetailPage.css';

export default function ToolDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const tool = tools.find(t => t.id === id);

  // Related tools — same category
  const related = tools.filter(t => t.id !== id && t.category === tool?.category).slice(0, 3);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Track recently viewed
    try {
      const saved = JSON.parse(localStorage.getItem('nv-recent') || '[]');
      const updated = [id, ...saved.filter(x => x !== id)].slice(0, 8);
      localStorage.setItem('nv-recent', JSON.stringify(updated));
    } catch { }

    const handleScroll = () => setScrolled(window.scrollY > 140);
    window.addEventListener('scroll', handleScroll);

    // Scroll Spy Logic
    const observerOptions = {
      root: null,
      rootMargin: '-15% 0px -75% 0px', // Adjust trigger thresholds
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = ['overview', 'how-it-works', 'use-cases', 'features', 'pros-cons', 'tips'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Dynamic SEO
    if (tool) {
      document.title = `${tool.name} | ${tool.tagline} | AIToolDock`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', `${tool.name}: ${tool.shortDescription} Discover more about this AI tool on AIToolDock.`);
      }
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
      // Reset SEO on unmount
      document.title = 'AIToolDock | Discover the Future of AI Tools';
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 'AIToolDock ◈ The ultimate AI tools directory for 2026. Discover 100+ best AI tools for writing, coding, image generation, business, and productivity.');
      }
    };
  }, [id, tool]);

  const scrollToSection = useCallback((sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  if (!tool) {
    return (
      <div className="not-found">
        <Header />
        <div className="not-found-content">
          <div className="nf-icon">🔮</div>
          <h2>Tool not found</h2>
          <p>This tool doesn't exist in our directory yet.</p>
          <button onClick={() => navigate('/')}>← Back to all tools</button>
        </div>
      </div>
    );
  }

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'use-cases', label: 'Use Cases' },
    { id: 'features', label: 'Features' },
    { id: 'pros-cons', label: 'Pros & Cons' },
    { id: 'tips', label: 'Tips' },
  ];

  return (
    <div className="detail-page">
      <Header />

      {/* Sticky CTA Bar */}
      <div className={`sticky-cta ${scrolled ? 'sticky-cta-visible' : ''}`}>
        <div className="sticky-inner">
          <div className="sticky-info">
            <span className="sticky-emoji">{tool.logo}</span>
            <span className="sticky-name">{tool.name}</span>
            <span className="sticky-sep">·</span>
            <span className="sticky-cat">{tool.category}</span>
          </div>
          <div className="sticky-tabs">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`sticky-tab ${activeTab === tab.id ? 'sticky-tab-active' : ''}`}
                onClick={() => { setActiveTab(tab.id); scrollToSection(tab.id); }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <a href={tool.url} target="_blank" rel="noreferrer" className="btn-open btn-sm">
            Open Tool ↗
          </a>
        </div>
      </div>

      {/* Hero */}
      <div className="detail-hero" style={{ '--tc': tool.logoColor }}>
        <div className="hero-grid-bg" />
        <div className="hero-color-wash" />
        <div className="detail-hero-inner">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← All Tools
          </button>

          <div className="tool-header">
            <div className="tool-logo-wrap">
              <div className="tool-logo-lg">{tool.logo}</div>
              <div className="tool-logo-ring" />
            </div>

            <div className="tool-header-text">
              <div className="tool-meta-row">
                <span className="detail-cat-tag">{tool.category}</span>
                {tool.popular && <span className="badge badge-popular">⚡ Popular</span>}
                {tool.isNew && <span className="badge badge-new">✦ New</span>}
              </div>
              <h1 className="detail-name">{tool.name}</h1>
              <p className="detail-tagline">{tool.tagline}</p>
              <div className="detail-quick-stats">
                <div className="qs-item">
                  <span className="qs-icon">★</span>
                  <span className="qs-val">{tool.rating}</span>
                  <span className="qs-label">Rating</span>
                </div>
                <div className="qs-divider" />
                <div className="qs-item">
                  <span className="qs-icon">👥</span>
                  <span className="qs-val">{tool.users}</span>
                  <span className="qs-label">Users</span>
                </div>
                <div className="qs-divider" />
                <div className="qs-item">
                  <span className="qs-icon">🏷️</span>
                  <span className="qs-val">{tool.category}</span>
                  <span className="qs-label">Category</span>
                </div>
              </div>

              <div className="hero-actions">
                <a href={tool.url} target="_blank" rel="noreferrer" className="btn-open btn-lg">
                  <span>Open {tool.name}</span>
                  <span className="btn-icon">↗</span>
                </a>
                <div className="btn-url">{tool.url.replace('https://', '')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Nav (mobile) */}
      <div className="mobile-tabs">
        <div className="mobile-tabs-scroll">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`mobile-tab ${activeTab === tab.id ? 'mobile-tab-active' : ''}`}
              onClick={() => { setActiveTab(tab.id); scrollToSection(tab.id); }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="detail-content">
        <div className="detail-layout">
          <main className="detail-main">

            {/* Overview */}
            <DetailSection id="overview" icon="💡" title="What This Tool Does">
              <p className="body-text">{tool.longDescription}</p>
              <div className="audience-inline">
                <span className="ai-label">Best for:</span>
                {tool.audience.map((a, i) => (
                  <span key={i} className="ai-tag">{a}</span>
                ))}
              </div>
            </DetailSection>

            {/* How It Works */}
            <DetailSection id="how-it-works" icon="⚙️" title="How This AI Tool Works">
              <p className="body-text">{tool.howItWorks}</p>
            </DetailSection>

            {/* Use Cases */}
            <DetailSection id="use-cases" icon="🎯" title="Real-World Use Cases">
              <div className="use-cases-grid">
                {tool.useCases.map((uc, i) => (
                  <div key={i} className="use-case-card" style={{ '--tc': tool.logoColor }}>
                    <div className="uc-num">{String(i + 1).padStart(2, '0')}</div>
                    <div className="uc-body">
                      <h4 className="uc-title">{uc.title}</h4>
                      <p className="uc-desc">{uc.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </DetailSection>

            {/* Features */}
            <DetailSection id="features" icon="✦" title="Key Features">
              <div className="features-grid">
                {tool.features.map((f, i) => (
                  <div key={i} className="feature-pill" style={{ '--tc': tool.logoColor }}>
                    <span className="feature-check">✓</span>
                    {f}
                  </div>
                ))}
              </div>
            </DetailSection>

            {/* Pros & Cons */}
            <div id="pros-cons" className="two-col-wrap">
              <div className="pros-card">
                <div className="pc-header">
                  <span className="pc-icon pc-icon-pro">↑</span>
                  <h3>Advantages</h3>
                </div>
                <ul className="pc-list">
                  {tool.advantages.map((a, i) => (
                    <li key={i}>
                      <span className="pc-bullet pc-bullet-pro">✓</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="cons-card">
                <div className="pc-header">
                  <span className="pc-icon pc-icon-con">↓</span>
                  <h3>Limitations</h3>
                </div>
                <ul className="pc-list">
                  {tool.limitations.map((l, i) => (
                    <li key={i}>
                      <span className="pc-bullet pc-bullet-con">!</span>
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tips */}
            <DetailSection id="tips" icon="💎" title="Tips for Getting Started">
              <div className="tips-grid">
                {tool.tips.map((tip, i) => (
                  <div key={i} className="tip-card" style={{ '--tc': tool.logoColor }}>
                    <div className="tip-num">{i + 1}</div>
                    <p>{tip}</p>
                  </div>
                ))}
              </div>
            </DetailSection>

            {/* Related Tools */}
            {related.length > 0 && (
              <DetailSection id="related" icon="🔗" title={`More ${tool.category} Tools`}>
                <div className="related-grid">
                  {related.map(rt => (
                    <div
                      key={rt.id}
                      className="related-card"
                      style={{ '--tc': rt.logoColor }}
                      onClick={() => navigate(`/tool/${rt.id}`)}
                    >
                      <div className="related-logo">{rt.logo}</div>
                      <div>
                        <div className="related-name">{rt.name}</div>
                        <div className="related-desc">{rt.shortDescription.slice(0, 60)}…</div>
                      </div>
                      <div className="related-rating">★ {rt.rating}</div>
                    </div>
                  ))}
                </div>
              </DetailSection>
            )}

          </main>

          {/* Sidebar */}
          <aside className="detail-sidebar">
            {/* Open Tool Card */}
            <div className="sidebar-cta" style={{ '--tc': tool.logoColor }}>
              <div className="sc-logo">{tool.logo}</div>
              <h3 className="sc-name">{tool.name}</h3>
              <p className="sc-desc">Ready to try it out? Open the real tool in a new tab.</p>
              <a href={tool.url} target="_blank" rel="noreferrer" className="btn-open btn-full">
                Open {tool.name} ↗
              </a>
              <div className="sc-url">🔗 {tool.url.replace('https://', '')}</div>
            </div>

            {/* Quick Stats */}
            <div className="sidebar-card">
              <h3 className="sb-title">Quick Info</h3>
              <div className="qi-list">
                <QIRow icon="🏷️" label="Category" value={tool.category} />
                <QIRow icon="★" label="Rating" value={`${tool.rating} / 5.0`} highlight />
                <QIRow icon="👥" label="User Base" value={tool.users} />
                <QIRow icon="🟢" label="Status" value="Active & Updated" green />
                {tool.isNew && <QIRow icon="✨" label="Added" value="Recently" />}
              </div>
            </div>

            {/* Who It's For */}
            <div className="sidebar-card">
              <h3 className="sb-title">Who Should Use This?</h3>
              <div className="audience-grid">
                {tool.audience.map((a, i) => (
                  <span key={i} className="aud-tag">{a}</span>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="sidebar-card">
              <h3 className="sb-title">Ease of Use</h3>
              <div className="ease-meter">
                <div className="ease-bar">
                  <div
                    className="ease-fill"
                    style={{
                      width: tool.category === 'Coding AI' ? '55%' : tool.category === 'Automation' ? '60%' : '80%',
                      background: `linear-gradient(90deg, var(--accent), ${tool.logoColor})`
                    }}
                  />
                </div>
                <span className="ease-label">
                  {tool.category === 'Coding AI' ? 'Moderate' : tool.category === 'Automation' ? 'Moderate' : 'Beginner Friendly'}
                </span>
              </div>
              <p className="ease-note">Based on typical onboarding complexity</p>
            </div>
          </aside>
        </div>
      </div>

      <footer className="detail-footer">
        <div className="detail-footer-inner">
          <span className="df-logo">◈ AIToolDock</span>
          <button className="df-back" onClick={() => navigate('/')}>← Back to all tools</button>
          <a href={tool.url} target="_blank" rel="noreferrer" className="df-open">
            Open {tool.name} ↗
          </a>
        </div>
      </footer>
    </div>
  );
}

function DetailSection({ id, icon, title, children }) {
  return (
    <div id={id} className="detail-section">
      <div className="ds-header">
        <span className="ds-icon">{icon}</span>
        <h2 className="ds-title">{title}</h2>
      </div>
      <div className="ds-body">{children}</div>
    </div>
  );
}

function QIRow({ icon, label, value, highlight, green }) {
  return (
    <div className="qi-row">
      <span className="qi-icon">{icon}</span>
      <span className="qi-label">{label}</span>
      <span className={`qi-val ${highlight ? 'qi-gold' : ''} ${green ? 'qi-green' : ''}`}>
        {value}
      </span>
    </div>
  );
}
