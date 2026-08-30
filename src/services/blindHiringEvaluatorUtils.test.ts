import { evaluateBlindCandidateProfile } from './blindHiringEvaluatorUtils';

describe('BlindHiringEvaluatorUtils', () => {
  it('evaluates candidate strictly based on skills and code quality metrics', () => {
    const profile = {
      candidateId: 'cand-blind-101',
      technicalSkills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker'],
      projectQualityScore: 90,
      testCoveragePercent: 88,
      yearsOfRelevantExperience: 5,
    };

    const result = evaluateBlindCandidateProfile(profile);

    expect(result.candidateId).toBe('cand-blind-101');
    expect(result.blindSkillScore).toBeGreaterThanOrEqual(85);
    expect(result.skillMatchTier).toBe('EXCEPTIONAL_MATCH');
    expect(result.diversityComplianceStatus).toBe('FULLY_BLIND_HIRING_COMPLIANT');
  });
});
