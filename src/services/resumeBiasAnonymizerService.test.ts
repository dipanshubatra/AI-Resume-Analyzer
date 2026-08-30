import {
  anonymizeCandidateResume,
  auditResumeForBiasRisk,
  CandidateRawData,
} from './resumeBiasAnonymizerService';

describe('ResumeBiasAnonymizerService', () => {
  const sampleCandidate: CandidateRawData = {
    candidateId: 'cand-bias-101',
    fullName: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '555-0199',
    addressLocation: 'San Francisco, CA',
    graduationYear: 2005,
    genderPronouns: 'she/her',
    universityName: 'Stanford University',
    rawResumeText: `
      Jane Doe
      Email: jane.doe@example.com | Phone: 555-0199
      Address: San Francisco, CA
      Graduated from Stanford University in 2005.
      She spearheaded engineering team growth.
    `,
  };

  it('anonymizes candidate resume text PII fields accurately', () => {
    const result = anonymizeCandidateResume(sampleCandidate);

    expect(result.candidateId).toBe('cand-bias-101');
    expect(result.anonymizedResumeText).not.toContain('Jane Doe');
    expect(result.anonymizedResumeText).not.toContain('jane.doe@example.com');
    expect(result.anonymizedResumeText).toContain('[CANDIDATE_NAME]');
    expect(result.removedPiiFields).toContain('fullName');
    expect(result.removedPiiFields).toContain('universityName');
  });

  it('audits resume for bias risks and reports recommendations', () => {
    const report = auditResumeForBiasRisk(sampleCandidate);

    expect(report.candidateId).toBe('cand-bias-101');
    expect(report.biasRiskScore).toBeGreaterThanOrEqual(60);
    expect(report.auditStatus).toBe('HIGH_BIAS_EXPOSURE');
    expect(report.detectedBiasTypes).toContain('GENDER');
    expect(report.detectedBiasTypes).toContain('UNIVERISTY_PRESTIGE');
    expect(report.anonymizationRecommendations.length).toBeGreaterThan(0);
  });
});
