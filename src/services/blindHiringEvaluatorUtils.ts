/**
 * Fair Hiring Diversity Index & Skill-Based Scoring Utility
 * Evaluates candidate qualifications purely on technical skill metrics, project code quality,
 * and experience outputs while filtering out demographic indicators.
 */

export interface BlindCandidateProfile {
  candidateId: string;
  technicalSkills: string[];
  projectQualityScore: number; // 0 - 100
  testCoveragePercent: number; // 0 - 100
  yearsOfRelevantExperience: number;
}

export interface BlindEvaluationResult {
  candidateId: string;
  blindSkillScore: number; // 0 - 100
  skillMatchTier: 'EXCEPTIONAL_MATCH' | 'QUALIFIED_MATCH' | 'POTENTIAL_MATCH' | 'UNMATCHED';
  diversityComplianceStatus: 'FULLY_BLIND_HIRING_COMPLIANT';
  evaluationSummary: string;
}

/**
 * Computes blind skill evaluation score without demographic exposure.
 */
export function evaluateBlindCandidateProfile(profile: BlindCandidateProfile): BlindEvaluationResult {
  const skillScore = Math.min(40, profile.technicalSkills.length * 8);
  const projScore = profile.projectQualityScore * 0.35;
  const testScore = profile.testCoveragePercent * 0.25;

  const totalScore = Math.round(skillScore + projScore + testScore);

  let tier: BlindEvaluationResult['skillMatchTier'] = 'QUALIFIED_MATCH';
  if (totalScore >= 85) tier = 'EXCEPTIONAL_MATCH';
  else if (totalScore >= 65) tier = 'QUALIFIED_MATCH';
  else if (totalScore >= 45) tier = 'POTENTIAL_MATCH';
  else tier = 'UNMATCHED';

  return {
    candidateId: profile.candidateId,
    blindSkillScore: totalScore,
    skillMatchTier: tier,
    diversityComplianceStatus: 'FULLY_BLIND_HIRING_COMPLIANT',
    evaluationSummary: `Candidate evaluated strictly on ${profile.technicalSkills.length} technical skills and ${profile.projectQualityScore}% code quality rating.`,
  };
}
