import React from 'react';
import { AlertCircle, CheckCircle, Info, Zap } from 'lucide-react';
import { GrammarError } from '../types';
import './ErrorPanel.css';

interface ErrorPanelProps {
  errors: GrammarError[];
  selectedError: GrammarError | null;
  onErrorSelect: (error: GrammarError) => void;
  onErrorFix: (error: GrammarError) => void;
}

const errorIcons = {
  spelling: AlertCircle,
  grammar: CheckCircle,
  style: Zap,
  punctuation: Info
};

const errorColors = {
  spelling: 'error-panel-item-spelling',
  grammar: 'error-panel-item-grammar',
  style: 'error-panel-item-style',
  punctuation: 'error-panel-item-punctuation'
};

const errorSummaryColors = {
  spelling: 'error-panel-summary-spelling',
  grammar: 'error-panel-summary-grammar',
  style: 'error-panel-summary-style',
  punctuation: 'error-panel-summary-punctuation'
};

const severityColors = {
  high: 'error-panel-item-severity-high',
  medium: 'error-panel-item-severity-medium',
  low: 'error-panel-item-severity-low'
};

export function ErrorPanel({ errors, selectedError, onErrorSelect, onErrorFix }: ErrorPanelProps) {
  const errorCounts = errors.reduce((counts, error) => {
    counts[error.type] = (counts[error.type] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  return (
    <div className="error-panel-container">
      <div className="mb-6">
        <h2 className="error-panel-title">Issues Found</h2>
        
        {errors.length === 0 ? (
          <div className="error-panel-empty">
            <CheckCircle className="error-panel-empty-icon" />
            <p className="error-panel-empty-title">Great work!</p>
            <p>No grammar issues found in your text.</p>
          </div>
        ) : (
          <>
            {/* Error Summary */}
            <div className="error-panel-summary">
              {Object.entries(errorCounts).map(([type, count]) => {
                const Icon = errorIcons[type as keyof typeof errorIcons];
                return (
                  <div
                    key={type}
                    className={`error-panel-summary-item ${errorSummaryColors[type as keyof typeof errorSummaryColors]}`}
                  >
                    <div className="error-panel-summary-header">
                      <Icon className="error-panel-summary-icon" />
                      <span className="font-medium capitalize">{type}</span>
                    </div>
                    <div className="error-panel-summary-count">{count}</div>
                  </div>
                );
              })}
            </div>

            {/* Error List */}
            <div className="error-panel-list">
              {errors.map((error) => {
                const Icon = errorIcons[error.type];
                const isSelected = selectedError?.id === error.id;
                
                return (
                  <div
                    key={error.id}
                    className={`error-panel-item ${isSelected ? 'error-panel-item-selected' : ''}`}
                    onClick={() => onErrorSelect(error)}
                  >
                    <div className="error-panel-item-content">
                      <div className="error-panel-item-text">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="error-panel-item-message">{error.message}</span>
                          <span className={`error-panel-item-severity ${severityColors[error.severity]}`}>
                            {error.severity}
                          </span>
                        </div>
                        <p className="error-panel-item-explanation">{error.explanation}</p>
                        {error.suggestion && (
                          <div className="error-panel-item-suggestion">
                            <span className="error-panel-item-suggestion-label">Suggestion: </span>
                            <span className="error-panel-item-suggestion-text">{error.suggestion}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="error-panel-item-actions">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onErrorFix(error);
                          }}
                          className="error-panel-item-fix-btn"
                        >
                          Apply Suggestion
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}