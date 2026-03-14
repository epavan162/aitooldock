import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ToolCard.css';

export default function ToolCard({ tool, featured = false }) {
  const navigate = useNavigate();

  return (
    <div
      className={`tool-card ${featured ? 'tool-card-featured' : ''}`}
      onClick={() => navigate(`/tool/${tool.id}`)}
      style={{ '--card-color': tool.logoColor }}
    >
      <div className="card-glow" />
      <div className="card-inner">
        <div className="card-top">
          <div className="card-logo">
            <span className="card-emoji">{tool.logo}</span>
          </div>
          <div className="card-badges">
            {tool.popular && <span className="badge badge-popular">Popular</span>}
            {tool.isNew && <span className="badge badge-new">New</span>}
          </div>
        </div>

        <div className="card-body">
          <div className="card-category">{tool.category}</div>
          <h3 className="card-name">{tool.name}</h3>
          <p className="card-desc">{tool.shortDescription}</p>
        </div>

        <div className="card-footer">
          <div className="card-rating">
            <span className="star">★</span>
            <span className="rating-val">{tool.rating}</span>
          </div>
          <div className="card-users">{tool.users} users</div>
          <div className="card-cta">
            View Details <span className="card-arrow">→</span>
          </div>
        </div>
      </div>
    </div>
  );
}
