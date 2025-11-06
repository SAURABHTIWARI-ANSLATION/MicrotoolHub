import React from 'react';
import { createRoot } from 'react-dom/client';
import { QuizTool as App } from './src/App';
import './src/index.css';

// Create a wrapper component that can be used by the main app
const QuizTool = () => {
  return <App />;
};

export default QuizTool;

// For standalone development
if (import.meta.env.DEV) {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
  }
}