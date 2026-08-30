import { sanitizeCandidateResumeText } from './privacyRedactionService';

describe('PrivacyRedactionService', () => {
  it('redacts sensitive contact details and social media links', () => {
    const raw = 'Reach Jane at jane@example.com or 555-123-4567. LinkedIn: linkedin.com/in/janedoe';

    const result = sanitizeCandidateResumeText(raw);

    expect(result.redactedText).toContain('[EMAIL_REDACTED]');
    expect(result.redactedText).toContain('[PHONE_REDACTED]');
    expect(result.redactedText).toContain('[SOCIAL_URL_REDACTED]');
    expect(result.redactionCount).toBe(3);
  });
});
