/**
 * AI Resume Bias Detection & Candidate Anonymization Engine
 * Detects potentially biased personally identifiable information (PII), such as candidate names, gender indicators,
 * age/graduation dates, address locations, and university prestige bias to promote fair hiring practices.
 */

export interface CandidateRawData {
  candidateId: string;
  fullName: string;
  email: string;
  phone: string;
  addressLocation: string;
  graduationYear?: number;
  genderPronouns?: string;
  universityName: string;
  rawResumeText: string;
}

export interface AnonymizedCandidateResume {
  candidateId: string;
  anonymizedResumeText: string;
  removedPiiFields: string[];
  anonymizationTimestamp: string;
}

export interface BiasAuditReport {
  candidateId: string;
  detectedBiasTypes: Array<'GENDER' | 'AGE' | 'GEOGRAPHIC' | 'UNIVERISTY_PRESTIGE' | 'NAME'>;
  biasRiskScore: number; // 0 - 100
  auditStatus: 'COMPLIANT_BLIND_HIRING' | 'POTENTIAL_BIAS_RISK' | 'HIGH_BIAS_EXPOSURE';
  anonymizationRecommendations: string[];
}

export const PRESTIGE_UNIVERSITIES = ['Harvard', 'Stanford', 'MIT', 'Oxford', 'Cambridge', 'Yale', 'Princeton', 'Columbia'];
export const GENDER_PRONOUN_TERMS = ['he/him', 'she/her', 'they/them', 'mr.', 'ms.', 'mrs.'];

/**
 * Anonymizes candidate PII data from resume text for blind hiring audits.
 */
export function anonymizeCandidateResume(data: CandidateRawData): AnonymizedCandidateResume {
  if (!data.rawResumeText || data.rawResumeText.trim().length === 0) {
    return {
      candidateId: data.candidateId,
      anonymizedResumeText: '',
      removedPiiFields: [],
      anonymizationTimestamp: new Date().toISOString(),
    };
  }

  let text = data.rawResumeText;
  const removed: string[] = [];

  // Anonymize Name
  if (data.fullName && text.includes(data.fullName)) {
    text = text.replace(new RegExp(data.fullName, 'g'), '[CANDIDATE_NAME]');
    removed.push('fullName');
  }

  // Anonymize Email
  if (data.email && text.includes(data.email)) {
    text = text.replace(new RegExp(data.email, 'g'), '[CANDIDATE_EMAIL]');
    removed.push('email');
  }

  // Anonymize Phone
  if (data.phone && text.includes(data.phone)) {
    text = text.replace(new RegExp(data.phone, 'g'), '[CANDIDATE_PHONE]');
    removed.push('phone');
  }

  // Anonymize Location
  if (data.addressLocation && text.includes(data.addressLocation)) {
    text = text.replace(new RegExp(data.addressLocation, 'g'), '[LOCATION_REDACTED]');
    removed.push('addressLocation');
  }

  // Anonymize University
  if (data.universityName && text.includes(data.universityName)) {
    text = text.replace(new RegExp(data.universityName, 'g'), '[ACCELERATED_TECH_INSTITUTION]');
    removed.push('universityName');
  }

  return {
    candidateId: data.candidateId,
    anonymizedResumeText: text,
    removedPiiFields: removed,
    anonymizationTimestamp: new Date().toISOString(),
  };
}

/**
 * Audits resume text for potential hiring bias indicators.
 */
export function auditResumeForBiasRisk(data: CandidateRawData): BiasAuditReport {
  const biasTypes: BiasAuditReport['detectedBiasTypes'] = [];
  const recs: string[] = [];
  let riskScore = 0;

  const textLower = data.rawResumeText.toLowerCase();

  // Gender bias check
  const hasGenderPronoun = GENDER_PRONOUN_TERMS.some((term) => textLower.includes(term));
  if (hasGenderPronoun || data.genderPronouns) {
    biasTypes.push('GENDER');
    riskScore += 25;
    recs.push('Remove gender pronouns and gendered salutations from candidate profile.');
  }

  // Age bias check (Graduation year older than 15 years or explicit mention)
  if (data.graduationYear && new Date().getFullYear() - data.graduationYear > 15) {
    biasTypes.push('AGE');
    riskScore += 25;
    recs.push('Redact graduation dates older than 10 years to prevent age-related bias.');
  }

  // Geographic bias check
  if (data.addressLocation) {
    biasTypes.push('GEOGRAPHIC');
    riskScore += 20;
    recs.push('Hide candidate street address and postal location during initial screening.');
  }

  // University prestige bias check
  const isPrestige = PRESTIGE_UNIVERSITIES.some((uni) => data.universityName.toLowerCase().includes(uni.toLowerCase()));
  if (isPrestige) {
    biasTypes.push('UNIVERISTY_PRESTIGE');
    riskScore += 20;
    recs.push('Mask university names to ensure skill-based candidate evaluation.');
  }

  let status: BiasAuditReport['auditStatus'] = 'COMPLIANT_BLIND_HIRING';
  if (riskScore >= 60) status = 'HIGH_BIAS_EXPOSURE';
  else if (riskScore >= 25) status = 'POTENTIAL_BIAS_RISK';

  return {
    candidateId: data.candidateId,
    detectedBiasTypes: biasTypes,
    biasRiskScore: riskScore,
    auditStatus: status,
    anonymizationRecommendations: recs,
  };
}
