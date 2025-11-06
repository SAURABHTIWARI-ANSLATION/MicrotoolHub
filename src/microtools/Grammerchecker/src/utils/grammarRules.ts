import { GrammarRule } from '../types';

export const grammarRules: GrammarRule[] = [
  // Spelling errors (common mistakes)
  {
    pattern: /\b(recieve|recieved|recieving)\b/gi,
    type: 'spelling',
    message: 'Spelling error',
    suggestion: 'receive/received/receiving',
    explanation: 'Remember: "i" before "e" except after "c"',
    severity: 'high'
  },
  {
    pattern: /\b(seperate|seperated|seperating)\b/gi,
    type: 'spelling',
    message: 'Spelling error',
    suggestion: 'separate/separated/separating',
    explanation: 'The correct spelling uses "a" in the middle',
    severity: 'high'
  },
  {
    pattern: /\b(definately)\b/gi,
    type: 'spelling',
    message: 'Spelling error',
    suggestion: 'definitely',
    explanation: 'Common misspelling - remember "finite" is in "definitely"',
    severity: 'high'
  },
  {
    pattern: /\b(occured|occurence)\b/gi,
    type: 'spelling',
    message: 'Spelling error',
    suggestion: 'occurred/occurrence',
    explanation: 'Double "r" is needed in these forms',
    severity: 'high'
  },
  
  // Grammar errors
  {
    pattern: /\b(your)\s+(doing|going|coming|running|walking)\b/gi,
    type: 'grammar',
    message: 'Incorrect usage of "your"',
    suggestion: 'you\'re (you are)',
    explanation: 'Use "you\'re" (contraction of "you are") instead of "your" (possessive)',
    severity: 'medium'
  },
  {
    pattern: /\b(its)\s+(been|going|important|necessary)\b/gi,
    type: 'grammar',
    message: 'Incorrect usage of "its"',
    suggestion: 'it\'s (it is)',
    explanation: 'Use "it\'s" (contraction of "it is") instead of "its" (possessive)',
    severity: 'medium'
  },
  {
    pattern: /\b(there)\s+(doing|going|coming|happy|sad)\b/gi,
    type: 'grammar',
    message: 'Incorrect usage of "there"',
    suggestion: 'they\'re (they are)',
    explanation: 'Use "they\'re" (contraction of "they are") instead of "there" (location)',
    severity: 'medium'
  },
  {
    pattern: /\b(could|should|would)\s+of\b/gi,
    type: 'grammar',
    message: 'Incorrect phrase',
    suggestion: 'could/should/would have',
    explanation: 'Use "have" instead of "of" in these constructions',
    severity: 'high'
  },
  
  // Style improvements
  {
    pattern: /\b(very|really|extremely|incredibly)\s+(good|bad|big|small|nice|great)\b/gi,
    type: 'style',
    message: 'Weak modifier usage',
    suggestion: 'Consider stronger adjectives',
    explanation: 'Instead of "very good", try "excellent". Instead of "very bad", try "terrible"',
    severity: 'low'
  },
  {
    pattern: /\b(a lot of|lots of)\b/gi,
    type: 'style',
    message: 'Informal expression',
    suggestion: 'many/much',
    explanation: 'Use "many" (countable) or "much" (uncountable) for more formal writing',
    severity: 'low'
  },
  {
    pattern: /\b(thing|stuff|things|stuffs)\b/gi,
    type: 'style',
    message: 'Vague noun',
    suggestion: 'Be more specific',
    explanation: 'Use more precise nouns instead of vague terms like "thing" or "stuff"',
    severity: 'low'
  },
  
  // Punctuation errors
  {
    pattern: /[.!?]\s*[a-z]/g,
    type: 'punctuation',
    message: 'Missing capitalization',
    suggestion: 'Capitalize after sentence endings',
    explanation: 'The first letter after a period, exclamation mark, or question mark should be capitalized',
    severity: 'medium'
  },
  {
    pattern: /\s{2,}/g,
    type: 'punctuation',
    message: 'Extra spaces',
    suggestion: 'Use single space',
    explanation: 'Use only one space between words and after punctuation',
    severity: 'low'
  }
];

export function calculateReadabilityScore(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.trim().length > 0);
  const syllables = words.reduce((count, word) => {
    return count + countSyllables(word);
  }, 0);

  if (sentences.length === 0 || words.length === 0) return 0;

  // Flesch Reading Ease Score
  const score = 206.835 - (1.015 * (words.length / sentences.length)) - (84.6 * (syllables / words.length));
  return Math.max(0, Math.min(100, Math.round(score)));
}

function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}