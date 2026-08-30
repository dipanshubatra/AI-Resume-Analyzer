import { analyzeTextInclusivity } from './textInclusivityUtils';

describe('TextInclusivityUtils', () => {
  it('detects masculine-coded terms and calculates inclusivity score', () => {
    const text = 'Seeking a rockstar engineer who is aggressive and eager to outperform competitors.';

    const result = analyzeTextInclusivity('desc-01', text);

    expect(result.analyzedTextId).toBe('desc-01');
    expect(result.genderToneBalance).toBe('MASCULINE_LEANING');
    expect(result.masculineTermsDetected).toContain('rockstar');
    expect(result.masculineTermsDetected).toContain('aggressive');
    expect(result.inclusivityScore).toBeLessThan(80);
    expect(result.suggestions.length).toBeGreaterThan(0);
  });

  it('evaluates balanced inclusive text correctly', () => {
    const text = 'Engineered full-stack TypeScript web applications in a collaborative environment.';

    const result = analyzeTextInclusivity('desc-02', text);

    expect(result.genderToneBalance).toBe('BALANCED_INCLUSIVE');
    expect(result.inclusivityScore).toBeGreaterThanOrEqual(85);
  });
});
