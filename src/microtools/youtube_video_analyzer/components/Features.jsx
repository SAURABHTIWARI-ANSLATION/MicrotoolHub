import React from 'react';

const Features = () => {
  const features = [
    {
      icon: '🔍',
      title: 'Video Analysis',
      description: 'Extract comprehensive information from any YouTube video URL including metadata, thumbnails, and statistics.'
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Get instant results with our optimized processing engine. No waiting, no delays - just pure speed.'
    },
    {
      icon: '📱',
      title: 'Responsive Design',
      description: 'Works perfectly on all devices - desktop, tablet, and mobile. Beautiful interface that adapts to your screen.'
    },
    {
      icon: '🎨',
      title: 'Modern UI',
      description: 'Clean, intuitive interface with smooth animations and modern design principles for the best user experience.'
    },
    {
      icon: '🔒',
      title: 'Privacy First',
      description: 'No data collection, no tracking. Everything runs in your browser. Your privacy is our priority.'
    },
    {
      icon: '🌐',
      title: 'No Server Required',
      description: 'Fully client-side application. No backend servers, no API keys needed. Just pure frontend magic.'
    }
  ];

  return (
    <section className="features">
      <div className="features-container">
        <div className="features-header">
          <h2>Why Choose Our Video Viewer?</h2>
          <p>Powerful features designed for the modern web</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon-container">
                <span className="feature-icon">{feature.icon}</span>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
