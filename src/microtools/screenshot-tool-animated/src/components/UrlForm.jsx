import React from 'react'

export default function UrlForm({ url, setUrl, onSubmit }) {
  return (
    <form 
      className="card" 
      onSubmit={(e) => {
        e.preventDefault(); 
        onSubmit?.()
      }}
      aria-label="Website screenshot capture form"
    >
      <label htmlFor="site-url" className="helper">
        Website URL
      </label>
      <input
        id="site-url"
        className="input"
        type="url"
        placeholder="Enter website URL (e.g., https://example.com)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        autoComplete="off"
        spellCheck="false"
        aria-label="Website URL to capture screenshot"
        aria-describedby="url-help"
        required
      />
      <div id="url-help" className="helper" style={{ marginTop: '4px' }}>
        Enter a valid website URL including https://
      </div>
      <div className="controls">
        <div className="helper">
          Press <kbd className="kbd">Enter</kbd> to capture
        </div>
        <button 
          className="button" 
          type="submit"
          aria-label="Capture screenshot of website"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
            <circle cx="12" cy="13" r="3"/>
          </svg>
          Capture Screenshot
        </button>
      </div>
    </form>
  )
}