/**
 * AI Gendered Language & Inclusive Job Description Alignment Utility
 * Analyzes resume bullet points and job description text for gendered wording (e.g. overly aggressive/masculine vs passive terms)
 * and generates inclusivity optimization suggestions.
 */

export const MASCULINE_CODED_TERMS = [
  'ninja',
  'rockstar',
  'dominant',
  'aggressive',
  'headstrong',
  'outperform',
  'unrivaled',
  'fearless',
];

export const FEMININE_CODED_TERMS = [
  'supportive',
  'nurturing',
  'collaborative',
  'interpersonal',
  'empathetic',
  'compassionate',
  'dependable',
];

export interface LanguageInclusivityAnalysis {
  analyzedTextId: string;
  inclusivityScore: number; // 0 - 100
  masculineTermsDetected: string[];
  feminineTermsDetected: string[];
  genderToneBalance: 'BALANCED_INCLUSIVE' | 'MASCULINE_LEANING' | 'FEMININE_LEANING';
  suggestions: string[];
}

/**
 * Analyzes text for gendered language balance and inclusivity.
 */
export function analyzeTextInclusivity(textId: string, text: string): LanguageInclusivityAnalysis {
  if (!text || text.trim().length === 0) {
    return {
      analyzedTextId: textId,
      inclusivityScore: 100,
      masculineTermsDetected: [],
      feminineTermsDetected: [],
      genderToneBalance: 'BALANCED_INCLUSIVE',
      suggestions: [],
    };
  }

  const textLower = text.toLowerCase();
  const mascMatches = MASCULINE_CODED_TERMS.filter((term) => textLower.includes(term));
  const femMatches = FEMININE_CODED_TERMS.filter((term) => textLower.includes(term));

  const delta = Math.abs(mascMatches.length - femMatches.length);
  const penalty = delta * 15;
  const score = Math.max(0, 100 - penalty);

  let balance: LanguageInclusivityAnalysis['genderToneBalance'] = 'BALANCED_INCLUSIVE';
  if (mascMatches.length > femMatches.length + 1) balance = 'MASCULINE_LEANING';
  else if (femMatches.length > mascMatches.length + 1) balance = 'FEMININE_LEANING';

  const suggestions: string[] = [];
  if (mascMatches.length > 0) {
    suggestions.push(`Replace aggressive terms like (${mascMatches.join(', ')}) with inclusive technical verbs.`);
  }

  return {
    analyzedTextId: textId,
    inclusivityScore: score,
    masculineTermsDetected: mascMatches,
    feminineTermsDetected: femMatches,
    genderToneBalance: balance,
    suggestions,
  };
}
