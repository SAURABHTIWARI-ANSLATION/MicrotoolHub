import React from 'react'
import UrlForm from './components/UrlForm.jsx'
import Controls from './components/Controls.jsx'
import ScreenshotViewer from './components/ScreenshotViewer.jsx'
import { buildScreenshotUrl, normalizeUrl } from './lib/screenshotClient.js'
import './styles/global.css'

export default function App() {
  const [url, setUrl] = React.useState('')
  const [format, setFormat] = React.useState('png')
  const [imageUrl, setImageUrl] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [toast, setToast] = React.useState('')

  const normalized = React.useMemo(() => normalizeUrl(url), [url])

  async function capture() {
    setError('')
    if (!normalized) {
      setError('Please enter a valid URL (e.g., https://example.com)')
      return
    }
    setLoading(true)
    try {
      const apiUrl = buildScreenshotUrl({ url: normalized, format })
      setImageUrl(apiUrl)
      // Save to localStorage when capturing screenshot
      localStorage.setItem('ss_last', JSON.stringify({ url, format }))
      setToast('Screenshot ready')
      setTimeout(()=>setToast(''), 2000)
    } catch (e) {
      setError(e?.message || 'Failed to capture screenshot.')
    } finally {
      setLoading(false)
    }
  }

  function handleDownload() {
    if (!imageUrl) return
    try {
      const u = new URL(normalized)
      const ts = new Date().toISOString().replace(/[:.]/g,'-')
      const filename = `${u.hostname}-${ts}.${format}`
      const a = document.createElement('a')
      a.href = imageUrl
      a.download = filename
      a.target = '_blank'
      a.rel = 'noopener noreferrer'
      document.body.appendChild(a)
      a.click()
      a.remove()
      setToast('Downloading…')
      setTimeout(()=>setToast(''), 1500)
    } catch {
      window.open(imageUrl, '_blank', 'noopener,noreferrer')
    }
  }

  // Handle saving and clearing URL from localStorage
  React.useEffect(() => {
    // Load saved state on component mount
    const saved = localStorage.getItem('ss_last')
    if (saved) {
      try {
        const s = JSON.parse(saved)
        // Only set the URL if it's not the unwanted default
        if (s.url && !s.url.includes('saurabh-tiwari.netlify.app')) {
          setUrl(s.url)
        }
        if (s.format) setFormat(s.format)
      } catch {}
    }

    // Cleanup function to clear URL when component unmounts
    return () => {
      // Only clear the URL, keep the format
      const saved = localStorage.getItem('ss_last')
      if (saved) {
        try {
          const s = JSON.parse(saved)
          localStorage.setItem('ss_last', JSON.stringify({ format: s.format }))
        } catch {
          localStorage.setItem('ss_last', JSON.stringify({ format: 'png' }))
        }
      }
    }
  }, [])

  return (
    <div className="app-container" role="main">
      <div className="canvas" aria-hidden="true" />
      <div className="container">
        <header className="header" role="banner">
          <div className="brand">
            <div className="logo" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                <circle cx="12" cy="13" r="3"/>
              </svg>
            </div>
            <div>
              <h1 className="title">SnapShot</h1>
              <div className="helper">URL → Image • 1024×768</div>
            </div>
          </div>
          <span className="badge" aria-label="Tool features">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4"/>
              <path d="M12 8h.01"/>
            </svg>
            No server • Clean UI
          </span>
        </header>

        <UrlForm url={url} setUrl={setUrl} onSubmit={capture} />

        <Controls
          format={format}
          setFormat={setFormat}
          loading={loading}
          onCapture={capture}
        />

        {error && (
          <div className="card error-card" role="alert" aria-live="polite">
            <p style={{color:'var(--danger)', margin:0, fontWeight: '500'}}>{error}</p>
            <p className="helper" style={{marginTop:8}}>
              Check the URL or try again later (API limits may apply).
            </p>
          </div>
        )}

        <ScreenshotViewer imageUrl={imageUrl} loading={loading} onDownload={handleDownload} />

        <footer className="footer" role="contentinfo">
          <a 
            className="link" 
            href="https://screenshotmachine.com" 
            target="_blank" 
            rel="noreferrer"
            aria-label="Visit ScreenshotMachine website"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Powered by ScreenshotMachine
          </a>
          <span className="helper">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
              <circle cx="12" cy="13" r="3"/>
            </svg>
            Looks native • Not templated
          </span>
        </footer>
      </div>

      <div 
        className={`toast ${toast ? 'show' : ''}`} 
        role={toast ? "status" : "none"}
        aria-live={toast ? "polite" : "off"}
      >
        {toast}
      </div>
    </div>
  )
}