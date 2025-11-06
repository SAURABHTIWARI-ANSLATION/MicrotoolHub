export interface GrammarError {
  id: string;
  type: 'spelling' | 'grammar' | 'style' | 'punctuation';
  message: string;
  suggestion: string;
  explanation: string;
  startIndex: number;
  endIndex: number;
  severity: 'low' | 'medium' | 'high';
}

export interface TextStats {
  words: number;
  sentences: number;
  paragraphs: number;
  characters: number;
  readingTime: number;
  readabilityScore: number;
}

export interface GrammarRule {
  pattern: RegExp;
  type: GrammarError['type'];
  message: string;
  suggestion: string;
  explanation: string;
  severity: GrammarError['severity'];
}