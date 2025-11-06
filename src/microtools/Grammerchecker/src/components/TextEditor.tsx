import React, { useState, useCallback, useRef } from 'react';
import { GrammarError } from '../types';
import './TextEditor.css';

interface TextEditorProps {
  text: string;
  setText: (text: string) => void;
  errors: GrammarError[];
  onErrorClick: (error: GrammarError) => void;
  selectedError: GrammarError | null;
}

const errorColors = {
  spelling: 'text-editor-error-spelling',
  grammar: 'text-editor-error-grammar',
  style: 'text-editor-error-style',
  punctuation: 'text-editor-error-punctuation'
};

export function TextEditor({ text, setText, errors, onErrorClick, selectedError }: TextEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  }, [setText]);

  const renderHighlightedText = () => {
    if (isEditing || text.length === 0) return null;

    let result: React.ReactNode[] = [];
    let lastIndex = 0;

    // Sort errors by start index to process them in order
    const sortedErrors = [...errors].sort((a, b) => a.startIndex - b.startIndex);

    sortedErrors.forEach((error) => {
      // Add text before the error
      if (error.startIndex > lastIndex) {
        result.push(
          <span key={`text-${lastIndex}`}>
            {text.slice(lastIndex, error.startIndex)}
          </span>
        );
      }

      // Add the highlighted error
      const errorText = text.slice(error.startIndex, error.endIndex);
      result.push(
        <span
          key={error.id}
          className={`
            text-editor-error-highlight
            ${errorColors[error.type]} 
            ${selectedError?.id === error.id ? 'text-editor-selected-error' : ''}
          `}
          onClick={() => onErrorClick(error)}
          title={error.message}
        >
          {errorText}
        </span>
      );

      lastIndex = error.endIndex;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      result.push(
        <span key={`text-${lastIndex}`}>
          {text.slice(lastIndex)}
        </span>
      );
    }

    return result;
  };

  return (
    <div className="text-editor-container">
      <div className="text-editor-header">
        <h2 className="text-editor-title">Text Editor</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`text-editor-toggle-btn ${isEditing ? 'text-editor-toggle-btn-view' : 'text-editor-toggle-btn-edit'}`}
        >
          {isEditing ? 'View Highlights' : 'Edit Text'}
        </button>
      </div>

      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          className="text-editor-textarea"
          placeholder="Enter your text here to check for grammar, spelling, and style issues..."
        />
      ) : (
        <div className="text-editor-display">
          {text.length === 0 ? (
            <span className="text-editor-placeholder">
              Enter your text and switch to "View Highlights" mode to see grammar checking in action...
            </span>
          ) : (
            renderHighlightedText()
          )}
        </div>
      )}

      {!isEditing && errors.length > 0 && (
        <div className="text-editor-legend">
          <div className="text-editor-legend-item">
            <div className="text-editor-legend-color text-editor-legend-spelling"></div>
            <span>Spelling</span>
          </div>
          <div className="text-editor-legend-item">
            <div className="text-editor-legend-color text-editor-legend-grammar"></div>
            <span>Grammar</span>
          </div>
          <div className="text-editor-legend-item">
            <div className="text-editor-legend-color text-editor-legend-style"></div>
            <span>Style</span>
          </div>
          <div className="text-editor-legend-item">
            <div className="text-editor-legend-color text-editor-legend-punctuation"></div>
            <span>Punctuation</span>
          </div>
        </div>
      )}
    </div>
  );
}