import React, { useState } from 'react';
import VideoInput from './components/VideoInput';
import VideoInfoCard from './components/VideoInfoCard';
import Hero from './components/Hero';
import Features from './components/Features';
import './index.css';

function YouTubeVideoAnalyzer() {
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');

  const extractVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleVideoSubmit = async (url) => {
    setLoading(true);
    setError('');
    setVideoData(null);
    setOriginalUrl(url);
    
    try {
      const videoId = extractVideoId(url);
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }

      // Simulate video data extraction (in a real app, you'd use YouTube API)
      const mockVideoData = {
        id: videoId,
        title: 'Sample Video Title - This is a demo',
        author: 'Demo Channel',
        duration: '5:42',
        views: '1,234,567',
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        description: 'This is a demo application showcasing a modern YouTube video information viewer. The server has been removed and this is now a frontend-only application.',
        uploadDate: new Date().toLocaleDateString(),
        url: url
      };

      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setVideoData(mockVideoData);
    } catch (error) {
      console.error('Error processing video:', error);
      setError(error.message || 'Failed to process video information');
    } finally {
      setLoading(false);
    }
  };

  const handleWatchOnYouTube = () => {
    if (originalUrl) {
      window.open(originalUrl, '_blank');
    }
  };

  const handleShareVideo = async () => {
    if (navigator.share && videoData) {
      try {
        await navigator.share({
          title: videoData.title,
          text: `Check out this video: ${videoData.title}`,
          url: originalUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(originalUrl);
      alert('Video URL copied to clipboard!');
    }
  };

  const handleBack = () => {
    setVideoData(null);
    setError('');
    setOriginalUrl('');
  };

  return (
    <div className="app">
      {!videoData ? (
        <>
          <Hero />
          <main className="app-main">
            <div className="search-section">
              <h2>Discover YouTube Videos</h2>
              <p>Enter a YouTube URL to view detailed video information</p>
              <VideoInput onSubmit={handleVideoSubmit} loading={loading} />
              {error && (
                <div className="error-message">
                  <i className="error-icon">⚠️</i>
                  {error}
                </div>
              )}
              {loading && (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Analyzing video...</p>
                </div>
              )}
            </div>
            <Features />
          </main>
        </>
      ) : (
        <main className="app-main video-view">
          <div className="video-container">
            <div className="video-header">
              <button className="back-button" onClick={handleBack}>
                <i className="back-icon">←</i> Back to Search
              </button>
            </div>
            
            <VideoInfoCard 
              video={videoData} 
              onWatchOnYouTube={handleWatchOnYouTube}
              onShare={handleShareVideo}
            />
          </div>
        </main>
      )}
      
      <footer className="app-footer">
        <div className="footer-content">
          <p>🎬 YouTube Video Info Viewer</p>
          <p>Built with React • For educational purposes only</p>
        </div>
      </footer>
    </div>
  );
}

export default YouTubeVideoAnalyzer;