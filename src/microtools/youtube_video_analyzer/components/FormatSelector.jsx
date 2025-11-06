import React, { useState } from 'react';

const FormatSelector = ({ formats, onDownload }) => {
  const [selectedFormat, setSelectedFormat] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  // Filter formats for MP4 (video) and MP3 (audio only)
  const videoFormats = formats.filter(format => 
    format.type === 'mp4' && format.quality !== 'audio only'
  );
  
  const audioFormats = formats.filter(format => 
    format.quality === 'audio only' || format.type === 'mp3' || format.itag === '140'
  );

  const handleDownload = async () => {
    if (!selectedFormat) {
      setError('Please select a format');
      return;
    }
    
    setError('');
    setDownloading(true);
    
    try {
      await onDownload(selectedFormat);
    } catch (err) {
      setError('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  // If no formats are available, show a message
  if (formats.length === 0) {
    return (
      <div className="format-selector">
        <h3>Select Format</h3>
        <div className="no-formats-message">
          <p>Unable to retrieve format information for this video.</p>
          <p>You can still try downloading with default settings:</p>
          <button 
            onClick={() => {
              setSelectedFormat('18');
              onDownload('18');
            }}
            className="download-button"
            disabled={downloading}
          >
            {downloading ? 'Downloading...' : 'Download (360p MP4)'}
          </button>
          <button 
            onClick={() => {
              setSelectedFormat('140');
              onDownload('140');
            }}
            className="download-button"
            disabled={downloading}
            style={{ marginTop: '10px', backgroundColor: '#ff6600' }}
          >
            {downloading ? 'Downloading...' : 'Download (Audio Only)'}
          </button>
          <div className="info-message">
            <p><strong>Note:</strong> YouTube frequently changes their platform which can affect downloads. If downloads don't work, try:</p>
            <ul>
              <li>Using a different video</li>
              <li>Trying again later</li>
              <li>Using a different format</li>
            </ul>
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>
    );
  }

  return (
    <div className="format-selector">
      <h3>Select Format</h3>
      
      <div className="format-options">
        {videoFormats.length > 0 && (
          <div className="format-group">
            <h4>Video (MP4)</h4>
            {videoFormats.map(format => (
              <div key={format.itag} className="format-option">
                <label>
                  <input
                    type="radio"
                    name="format"
                    value={format.itag}
                    checked={selectedFormat === String(format.itag)}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                  />
                  <span className="format-label">
                    {format.quality} ({format.type.toUpperCase()})
                  </span>
                </label>
              </div>
            ))}
          </div>
        )}
        
        {audioFormats.length > 0 && (
          <div className="format-group">
            <h4>Audio (MP3)</h4>
            {audioFormats.map(format => (
              <div key={format.itag} className="format-option">
                <label>
                  <input
                    type="radio"
                    name="format"
                    value={format.itag}
                    checked={selectedFormat === String(format.itag)}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                  />
                  <span className="format-label">
                    Audio only ({format.bitrate} kbps)
                  </span>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="info-message">
        <p><strong>Note:</strong> If download fails, it's likely due to YouTube restrictions. Try a different video or format.</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <button 
        onClick={handleDownload}
        className="download-button"
        disabled={downloading || !selectedFormat}
      >
        {downloading ? 'Downloading...' : 'Download'}
      </button>
    </div>
  );
};

export default FormatSelector;