import React, { useState } from 'react';
import VideoPlayer from './VideoPlayer';

const VideoInfoCard = ({ video, onWatchOnYouTube, onShare }) => {
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  
  const handleWatchHere = () => {
    setShowVideoPlayer(true);
    document.body.style.overflow = 'hidden';
  };
  
  const handleClosePlayer = () => {
    setShowVideoPlayer(false);
    document.body.style.overflow = 'unset';
  };
  if (!video) return null;

  return (
    <div className="video-info-card">
      <div className="video-content">
        <div className="thumbnail-container">
          <img 
            src={video.thumbnail} 
            alt={video.title} 
            className="video-thumbnail"
            onError={(e) => {
              e.target.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
            }}
          />
          <div className="thumbnail-overlay">
            <button className="play-button" onClick={onWatchOnYouTube}>
              <span className="play-icon">▶</span>
            </button>
          </div>
        </div>
        
        <div className="video-details">
          <div className="video-info">
            <h1 className="video-title">{video.title}</h1>
            
            <div className="video-meta">
              <div className="meta-item">
                <span className="meta-icon">👤</span>
                <span className="meta-label">Channel:</span>
                <span className="meta-value">{video.author}</span>
              </div>
              
              <div className="meta-item">
                <span className="meta-icon">⏱️</span>
                <span className="meta-label">Duration:</span>
                <span className="meta-value">{video.duration}</span>
              </div>
              
              <div className="meta-item">
                <span className="meta-icon">👁️</span>
                <span className="meta-label">Views:</span>
                <span className="meta-value">{video.views}</span>
              </div>
              
              <div className="meta-item">
                <span className="meta-icon">📅</span>
                <span className="meta-label">Upload Date:</span>
                <span className="meta-value">{video.uploadDate}</span>
              </div>
            </div>
            
            <div className="video-description">
              <h3>Description</h3>
              <p>{video.description}</p>
            </div>
          </div>
          
          <div className="video-actions">
            <button className="action-button primary" onClick={handleWatchHere}>
              <span>Watch Here</span>
              <span>▶</span>
            </button>
            <button className="action-button secondary" onClick={onWatchOnYouTube}>
              <span>Watch on YouTube</span>
              <span>↗</span>
            </button>
            <button className="action-button secondary" onClick={onShare}>
              <span>Share Video</span>
              <span>🔗</span>
            </button>
          </div>
        </div>
      </div>
      
      {showVideoPlayer && (
        <VideoPlayer 
          videoId={video.id} 
          onClose={handleClosePlayer} 
        />
      )}
    </div>
  );
};
export default VideoInfoCard;