import { GrammarError, TextStats } from '../types';
import { grammarRules, calculateReadabilityScore } from './grammarRules.ts';

export function analyzeText(text: string): GrammarError[] {
  const errors: GrammarError[] = [];
  
  grammarRules.forEach((rule, ruleIndex) => {
    let match;
    const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
    
    while ((match = regex.exec(text)) !== null) {
      errors.push({
        id: `${ruleIndex}-${match.index}`,
        type: rule.type,
        message: rule.message,
        suggestion: rule.suggestion,
        explanation: rule.explanation,
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        severity: rule.severity
      });
    }
  });
  
  return errors.sort((a, b) => a.startIndex - b.startIndex);
}

export function calculateTextStats(text: string): TextStats {
  const words = text.split(/\s+/).filter(w => w.trim().length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  
  return {
    words: words.length,
    sentences: sentences.length,
    paragraphs: Math.max(1, paragraphs.length),
    characters: text.length,
    readingTime: Math.ceil(words.length / 200), // Average reading speed: 200 words per minute
    readabilityScore: calculateReadabilityScore(text)
  };
}