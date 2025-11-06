import React, { useState } from 'react';
import { isValidYouTubeUrl } from '../utils';

const VideoInput = ({ onSubmit, loading = false }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    // Validate YouTube URL using our utility function
    if (!isValidYouTubeUrl(url)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setError('');
    
    try {
      if (typeof onSubmit === 'function') {
        await onSubmit(url);
      } else {
        console.error('onSubmit is not a function');
        throw new Error('Form submission handler is not available');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message || 'Failed to fetch video information. Please try again.');
      throw err; // Re-throw the error to be caught by the parent component
    }
  };

  return (
    <div className="video-input-container">
      <form onSubmit={handleSubmit} className="video-input-form">
        <div className="input-group">
          <div className="input-wrapper">
            <span className="input-icon">🔗</span>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube URL here... (e.g., https://youtube.com/watch?v=...)"
              className="url-input"
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className={`submit-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="button-spinner"></span>
                Analyzing...
              </>
            ) : (
              <>
                <span className="button-icon">🔍</span>
                Analyze Video
              </>
            )}
          </button>
        </div>
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default VideoInput;