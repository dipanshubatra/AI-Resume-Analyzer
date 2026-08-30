import { synthesizeEnterpriseDiversityAudit } from './enterpriseDiversityAuditService';

describe('EnterpriseDiversityAuditService', () => {
  it('synthesizes diversity metrics into an enterprise compliance report', () => {
    const biasAudit = {
      candidateId: 'cand-div-101',
      detectedBiasTypes: ['GENDER' as const],
      biasRiskScore: 25,
      auditStatus: 'POTENTIAL_BIAS_RISK' as const,
      anonymizationRecommendations: ['Remove gender pronouns.'],
    };

    const blindSkill = {
      candidateId: 'cand-div-101',
      blindSkillScore: 90,
      skillMatchTier: 'EXCEPTIONAL_MATCH' as const,
      diversityComplianceStatus: 'FULLY_BLIND_HIRING_COMPLIANT' as const,
      evaluationSummary: 'Evaluated strictly on skills.',
    };

    const inclusivity = {
      analyzedTextId: 'desc-01',
      inclusivityScore: 90,
      masculineTermsDetected: [],
      feminineTermsDetected: [],
      genderToneBalance: 'BALANCED_INCLUSIVE' as const,
      suggestions: [],
    };

    const report = synthesizeEnterpriseDiversityAudit(
      'audit-789',
      'Acme Corp',
      'cand-div-101',
      biasAudit,
      blindSkill,
      inclusivity
    );

    expect(report.auditId).toBe('audit-789');
    expect(report.overallBlindHiringScore).toBeGreaterThanOrEqual(85);
    expect(report.complianceTier).toBe('ENTERPRISE_BLIND_HIRING_CERTIFIED');
  });
});
