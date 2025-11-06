import React, { useState, useEffect, useMemo } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { GrammarError, TextStats } from '../types';
import { analyzeText, calculateTextStats } from '../utils/textAnalyzer.ts';
import { TextEditor } from './TextEditor.tsx';
import { ErrorPanel } from './ErrorPanel.tsx';
import { StatsPanel } from './StatsPanel.tsx';
import './GrammarChecker.css';

const sampleText = `This is a sample text with various errors for you to test the grammar checker. Your doing great at using this tool! Its been very helpful for finding mistakes. There going to be really useful for improving your writting. 

You could of used other tools, but this one is definately the best. Its got alot of features and can seperate different types of errors. The tool will recieve your text and check it for various issues.

This text has been written with several common mistakes that people make when writting. The tool should catch these errors and provide helpful suggestions for improvement.`;

export function GrammarChecker() {
  const [text, setText] = useState(sampleText);
  const [selectedError, setSelectedError] = useState<GrammarError | null>(null);
  const [activeTab, setActiveTab] = useState<'errors' | 'stats'>('errors');

  const errors = useMemo(() => analyzeText(text), [text]);
  const stats = useMemo(() => calculateTextStats(text), [text]);

  const handleErrorClick = (error: GrammarError) => {
    setSelectedError(error);
    setActiveTab('errors');
  };

  const handleErrorFix = (error: GrammarError) => {
    const beforeError = text.slice(0, error.startIndex);
    const afterError = text.slice(error.endIndex);
    const newText = beforeError + error.suggestion + afterError;
    setText(newText);
    setSelectedError(null);
  };

  const handleClearText = () => {
    setText('');
    setSelectedError(null);
  };

  const handleExportText = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'checked-text.txt';
    document.body.appendChild(a);
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grammar-checker-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="grammar-header">
          <div className="grammar-header-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h1 className="grammar-title">
            Grammar Checker Pro
          </h1>
          <p className="grammar-subtitle">
            Elevate your writing with advanced grammar, spelling, and style suggestions.
          </p>
        </div>

        {/* Main Layout */}
        <div className="grammar-main-layout">
          {/* Text Editor - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2">
            <div className="grammar-editor-container">
              <TextEditor
                text={text}
                setText={setText}
                errors={errors}
                onErrorClick={handleErrorClick}
                selectedError={selectedError}
              />
              
              {/* Action Buttons */}
              <div className="grammar-action-buttons">
                <button
                  onClick={handleClearText}
                  className="grammar-btn grammar-btn-clear"
                >
                  <RefreshCw className="w-4 h-4" />
                  Clear Text
                </button>
                <button
                  onClick={handleExportText}
                  disabled={text.length === 0}
                  className="grammar-btn grammar-btn-export"
                >
                  <Download className="w-4 h-4" />
                  Export Text
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="grammar-sidebar">
            {/* Tab Navigation */}
            <div className="grammar-tab-container">
              <div className="grammar-tab-nav">
                <button
                  onClick={() => setActiveTab('errors')}
                  className={`grammar-tab-btn ${activeTab === 'errors' ? 'active' : ''}`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>Issues</span>
                    {errors.length > 0 && (
                      <span className="grammar-error-count">
                        {errors.length}
                      </span>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`grammar-tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
                >
                  Statistics
                </button>
              </div>

              <div className="grammar-tab-content">
                {activeTab === 'errors' ? (
                  <ErrorPanel
                    errors={errors}
                    selectedError={selectedError}
                    onErrorSelect={handleErrorClick}
                    onErrorFix={handleErrorFix}
                  />
                ) : (
                  <StatsPanel stats={stats} />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="grammar-footer">
          <div className="grammar-tip">
            <svg className="grammar-tip-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="grammar-tip-text">
              Tip: Click on highlighted errors to get detailed suggestions
            </span>
          </div>
          <p className="grammar-copyright">
            © {new Date().getFullYear()} Grammar Checker Pro. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}