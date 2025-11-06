import React from 'react'

export default function Controls({ format, setFormat, loading, onCapture }) {
  return (
    <div className="card">
      <div style={{display:'grid', gridTemplateColumns:'1fr auto', gap:'12px', alignItems:'end'}}>
        <div>
          <label htmlFor="image-format" className="helper">
            Image format
          </label>
          <select 
            id="image-format"
            value={format} 
            onChange={(e) => setFormat(e.target.value)}
            aria-label="Select image format for screenshot"
            className="select"
          >
            <option value="png">PNG (Best quality)</option>
            <option value="jpg">JPG (Smaller file)</option>
          </select>
        </div>
        <button 
          className="button" 
          disabled={loading} 
          onClick={onCapture}
          aria-label={loading ? "Capturing screenshot" : "Capture screenshot"}
        >
          {loading ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              Capturing…
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                <circle cx="12" cy="13" r="3"/>
              </svg>
              Capture Screenshot
            </>
          )}
        </button>
      </div>
    </div>
  )
}