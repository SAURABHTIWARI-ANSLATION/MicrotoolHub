import React from 'react';
import { FileText, Clock, BarChart3, Target } from 'lucide-react';
import { TextStats } from '../types';
import './StatsPanel.css';

interface StatsPanelProps {
  stats: TextStats;
}

export function StatsPanel({ stats }: StatsPanelProps) {
  const getReadabilityLevel = (score: number) => {
    if (score >= 90) return { level: 'Very Easy', color: 'stats-panel-readability-level-very-easy' };
    if (score >= 80) return { level: 'Easy', color: 'stats-panel-readability-level-easy' };
    if (score >= 70) return { level: 'Fairly Easy', color: 'stats-panel-readability-level-fairly-easy' };
    if (score >= 60) return { level: 'Standard', color: 'stats-panel-readability-level-standard' };
    if (score >= 50) return { level: 'Fairly Difficult', color: 'stats-panel-readability-level-fairly-difficult' };
    if (score >= 30) return { level: 'Difficult', color: 'stats-panel-readability-level-difficult' };
    return { level: 'Very Difficult', color: 'stats-panel-readability-level-very-difficult' };
  };

  const readability = getReadabilityLevel(stats.readabilityScore);

  return (
    <div className="stats-panel-container">
      <h2 className="stats-panel-title">Text Statistics</h2>
      
      <div className="stats-panel-grid">
        {/* Basic Stats */}
        <div className="stats-panel-basic-grid">
          <div className="stats-panel-card">
            <div className="stats-panel-card-header">
              <FileText className="stats-panel-card-icon" />
              <span className="stats-panel-card-label">Words</span>
            </div>
            <div className="stats-panel-card-value">{stats.words.toLocaleString()}</div>
          </div>
          
          <div className="stats-panel-card">
            <div className="stats-panel-card-header">
              <Target className="stats-panel-card-icon" />
              <span className="stats-panel-card-label">Sentences</span>
            </div>
            <div className="stats-panel-card-value">{stats.sentences.toLocaleString()}</div>
          </div>
          
          <div className="stats-panel-card">
            <div className="stats-panel-card-header">
              <FileText className="stats-panel-card-icon" />
              <span className="stats-panel-card-label">Characters</span>
            </div>
            <div className="stats-panel-card-value">{stats.characters.toLocaleString()}</div>
          </div>
          
          <div className="stats-panel-card">
            <div className="stats-panel-card-header">
              <Clock className="stats-panel-card-icon" />
              <span className="stats-panel-card-label">Read Time</span>
            </div>
            <div className="stats-panel-card-value">{stats.readingTime}m</div>
          </div>
        </div>

        {/* Readability Score */}
        <div className="stats-panel-card">
          <div className="stats-panel-readability-header">
            <BarChart3 className="stats-panel-card-icon" />
            <span className="stats-panel-card-label">Readability Score</span>
          </div>
          
          <div className="stats-panel-readability-score">
            <span className="stats-panel-card-value">{stats.readabilityScore}</span>
            <span className={`stats-panel-readability-level ${readability.color}`}>
              {readability.level}
            </span>
          </div>
          
          <div className="stats-panel-progress-container">
            <div
              className="stats-panel-progress-bar"
              style={{ width: `${Math.min(100, stats.readabilityScore)}%` }}
            ></div>
          </div>
          
          <p className="stats-panel-progress-note">
            Based on Flesch Reading Ease score. Higher scores indicate easier readability.
          </p>
        </div>

        {/* Additional Metrics */}
        <div className="stats-panel-card">
          <h3 className="stats-panel-metrics-title">Additional Metrics</h3>
          <div className="stats-panel-metrics">
            <div className="stats-panel-metric-item">
              <span className="stats-panel-metric-label">Avg. words per sentence:</span>
              <span className="stats-panel-metric-value">{stats.sentences > 0 ? (stats.words / stats.sentences).toFixed(1) : '0'}</span>
            </div>
            <div className="stats-panel-metric-item">
              <span className="stats-panel-metric-label">Avg. characters per word:</span>
              <span className="stats-panel-metric-value">{stats.words > 0 ? (stats.characters / stats.words).toFixed(1) : '0'}</span>
            </div>
            <div className="stats-panel-metric-item">
              <span className="stats-panel-metric-label">Paragraphs:</span>
              <span className="stats-panel-metric-value">{stats.paragraphs}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}