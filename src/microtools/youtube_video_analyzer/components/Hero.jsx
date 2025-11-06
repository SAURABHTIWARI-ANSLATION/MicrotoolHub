import React from 'react';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            <span className="gradient-text">YouTube Video</span>
            <br />
            Information Viewer
          </h1>
          <p className="hero-description">
            Discover detailed information about any YouTube video. 
            Get insights into video metadata, thumbnails, and more with our modern, 
            clean interface.
          </p>
          <div className="hero-features">
            <div className="feature-badge">
              <span className="feature-icon">🎥</span>
              Video Analysis
            </div>
            <div className="feature-badge">
              <span className="feature-icon">📊</span>
              Detailed Metadata
            </div>
            <div className="feature-badge">
              <span className="feature-icon">🚀</span>
              Lightning Fast
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="video-mockup">
            <div className="mockup-screen">
              <div className="mockup-header">
                <div className="mockup-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="mockup-content">
                <div className="mockup-thumbnail"></div>
                <div className="mockup-info">
                  <div className="mockup-title"></div>
                  <div className="mockup-details"></div>
                  <div className="mockup-stats"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
