import React from 'react'

export default function ScreenshotViewer({ imageUrl, loading, onDownload }) {
  if (loading) return (
    <div className="card">
      <h3 className="helper" style={{ margin: '0 0 12px 0' }}>Generating screenshot...</h3>
      <div className="skeleton" />
    </div>
  )
  if (!imageUrl) return null
  return (
    <div className="card preview">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, flexWrap:'wrap', marginBottom: '12px'}}>
        <h3 style={{margin:'0'}}>Preview</h3>
        <div className="footer" style={{ margin: 0, padding: 0, border: 'none' }}>
          <a 
            className="link" 
            href={imageUrl} 
            target="_blank" 
            rel="noreferrer"
            aria-label="Open raw image in new tab"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Open raw image
          </a>
          <button 
            className="button" 
            onClick={onDownload}
            aria-label="Download screenshot"
            style={{ padding: '10px 16px' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download
          </button>
        </div>
      </div>
      <img 
        src={imageUrl} 
        alt="Website screenshot preview" 
        style={{ width: '100%', height: 'auto' }}
        onLoad={(e) => {
          // Add a subtle fade-in effect when image loads
          e.target.style.opacity = 0;
          e.target.style.transition = 'opacity 0.3s ease';
          setTimeout(() => {
            e.target.style.opacity = 1;
          }, 50);
        }}
      />
    </div>
  )
}