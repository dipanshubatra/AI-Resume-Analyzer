/**
 * Candidate Demographics Redaction & Privacy Compliance Rule Engine
 * Implements strict GDPR/CCPA data redaction rules for candidate resume text before storing or sharing across hiring teams.
 */

export interface PrivacyRedactionConfig {
  redactPhone: boolean;
  redactEmail: boolean;
  redactAddress: boolean;
  redactSocialMediaLinks: boolean;
}

export interface RedactionResult {
  originalLength: number;
  sanitizedLength: number;
  redactedText: string;
  redactionCount: number;
}

/**
 * Redacts sensitive candidate demographic information according to privacy policy settings.
 */
export function sanitizeCandidateResumeText(
  rawText: string,
  config: PrivacyRedactionConfig = { redactPhone: true, redactEmail: true, redactAddress: true, redactSocialMediaLinks: true }
): RedactionResult {
  if (!rawText) {
    return {
      originalLength: 0,
      sanitizedLength: 0,
      redactedText: '',
      redactionCount: 0,
    };
  }

  let text = rawText;
  let count = 0;

  if (config.redactEmail) {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const matches = text.match(emailRegex) || [];
    count += matches.length;
    text = text.replace(emailRegex, '[EMAIL_REDACTED]');
  }

  if (config.redactPhone) {
    const phoneRegex = /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const matches = text.match(phoneRegex) || [];
    count += matches.length;
    text = text.replace(phoneRegex, '[PHONE_REDACTED]');
  }

  if (config.redactSocialMediaLinks) {
    const socialRegex = /(https?:\/\/)?(www\.)?(linkedin|twitter|facebook|instagram)\.com\/[a-zA-Z0-9_.-]+/gi;
    const matches = text.match(socialRegex) || [];
    count += matches.length;
    text = text.replace(socialRegex, '[SOCIAL_URL_REDACTED]');
  }

  return {
    originalLength: rawText.length,
    sanitizedLength: text.length,
    redactedText: text,
    redactionCount: count,
  };
}
