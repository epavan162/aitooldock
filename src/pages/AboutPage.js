import React from 'react';
import Header from '../components/Header';
import './AboutPage.css';

export default function AboutPage() {
    return (
        <div className="about-page">
            <Header />

            <main className="container about-container">
                <section className="about-hero">
                    <h1 className="about-title">About the <span className="text-gradient">Creator</span></h1>
                    <p className="about-lead">
                        Bridging the gap between complex AI technology and everyday productivity.
                    </p>
                </section>

                <div className="about-grid">
                    {/* Bio Section */}
                    <section className="about-card bio-card">
                        <div className="card-header">
                            <span className="card-icon">👨‍💻</span>
                            <h2>Pavan Kalyan</h2>
                        </div>
                        <div className="card-content">
                            <p>
                                A developer passionate about AI tools and technology.
                                I built <strong>AIToolDock</strong> to help users easily discover and learn about the best AI tools available today.
                            </p>
                            <p>
                                The goal is to provide a central, curated directory where anyone can find the right tool to amplify their work
                                without getting lost in technical jargon.
                            </p>
                        </div>
                    </section>

                    {/* Contact Section */}
                    <section className="about-card contact-card">
                        <div className="card-header">
                            <span className="card-icon">👋</span>
                            <h2>Reach Out</h2>
                        </div>
                        <div className="contact-links">
                            <a href="https://wa.me/919490131185" target="_blank" rel="noreferrer" className="contact-btn whatsapp">
                                <span className="btn-icon">💬</span> Message on WhatsApp
                            </a>
                            <a href="https://linkedin.com/in/pavan-kalyan-edagottu" target="_blank" rel="noreferrer" className="contact-btn linkedin">
                                <span className="btn-icon">🔗</span> Connect on LinkedIn
                            </a>
                            <a href="https://github.com/epavan162" target="_blank" rel="noreferrer" className="contact-btn github">
                                <span className="btn-icon">📦</span> GitHub
                            </a>
                            <a href="https://edagottu-pavan-kalyan-portfolio.netlify.app" target="_blank" rel="noreferrer" className="contact-btn portfolio">
                                <span className="btn-icon">🌐</span> Portfolio
                            </a>
                            <a href="mailto:epavan162@gmail.com" className="contact-btn email">
                                <span className="btn-icon">✉️</span> Send Email
                            </a>
                        </div>
                    </section>

                    {/* Submit Tool Section */}
                    <section className="about-card submit-card">
                        <div className="card-header">
                            <span className="card-icon">🚀</span>
                            <h2>Submit an AI Tool</h2>
                        </div>
                        <div className="card-content">
                            <p>
                                Think we missed something great? I'm always looking for innovative AI tools to add to our curated list.
                            </p>
                            <div className="submit-box">
                                <p className="submit-note">If you know a great AI tool that should be listed here, contact me via email.</p>
                                <a href="mailto:epavan162@gmail.com" className="submit-email">epavan162@gmail.com</a>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <footer className="footer">
                <div className="container footer-inner">
                    <div className="footer-left">
                        <div className="footer-logo">◈ AIToolDock</div>
                    </div>
                    <div className="footer-right">
                        <p className="footer-copy">© 2026 AIToolDock · Created with passion for the AI community</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
