/**
 * AI Diversity Audit Log & Enterprise Compliance Synthesizer Service
 * Aggregates resume anonymization audits, blind skill scores, and text inclusivity metrics
 * into an enterprise-wide diversity compliance report for blind hiring audits.
 */

import { BiasAuditReport } from './resumeBiasAnonymizerService';
import { BlindEvaluationResult } from './blindHiringEvaluatorUtils';
import { LanguageInclusivityAnalysis } from './textInclusivityUtils';

export interface EnterpriseDiversityAuditReport {
  auditId: string;
  companyName: string;
  candidateId: string;
  overallBlindHiringScore: number; // 0 - 100
  complianceTier: 'ENTERPRISE_BLIND_HIRING_CERTIFIED' | 'PASSING_COMPLIANT' | 'NEEDS_REMEDIATION';
  biasAuditSummary?: BiasAuditReport;
  blindSkillSummary?: BlindEvaluationResult;
  inclusivitySummary?: LanguageInclusivityAnalysis;
  complianceViolations: string[];
  actionItems: string[];
  auditedAt: string;
}

/**
 * Synthesizes individual blind hiring metrics into an enterprise compliance report.
 */
export function synthesizeEnterpriseDiversityAudit(
  auditId: string,
  companyName: string,
  candidateId: string,
  biasAudit?: BiasAuditReport,
  blindSkill?: BlindEvaluationResult,
  inclusivity?: LanguageInclusivityAnalysis
): EnterpriseDiversityAuditReport {
  const biasScore = biasAudit ? 100 - biasAudit.biasRiskScore : 80;
  const skillScore = blindSkill ? blindSkill.blindSkillScore : 70;
  const inclScore = inclusivity ? inclusivity.inclusivityScore : 85;

  const totalScore = Math.round(biasScore * 0.4 + skillScore * 0.35 + inclScore * 0.25);

  const violations: string[] = [];
  const actions: string[] = [];

  if (biasAudit && biasAudit.biasRiskScore >= 50) {
    violations.push(`High PII bias risk detected (Score: ${biasAudit.biasRiskScore}).`);
    actions.push(...biasAudit.anonymizationRecommendations);
  }

  if (inclusivity && inclusivity.inclusivityScore < 70) {
    violations.push('Gender-coded language skew detected in resume bullet points.');
    actions.push(...inclusivity.suggestions);
  }

  let tier: EnterpriseDiversityAuditReport['complianceTier'] = 'PASSING_COMPLIANT';
  if (totalScore >= 88) tier = 'ENTERPRISE_BLIND_HIRING_CERTIFIED';
  else if (totalScore < 65) tier = 'NEEDS_REMEDIATION';

  return {
    auditId,
    companyName,
    candidateId,
    overallBlindHiringScore: totalScore,
    complianceTier: tier,
    biasAuditSummary: biasAudit,
    blindSkillSummary: blindSkill,
    inclusivitySummary: inclusivity,
    complianceViolations: violations,
    actionItems: Array.from(new Set(actions)),
    auditedAt: new Date().toISOString(),
  };
}
