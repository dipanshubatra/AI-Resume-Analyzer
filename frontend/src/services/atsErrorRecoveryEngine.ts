/**
 * ATS Parsing Error Diagnostics & File Recovery Engine
 * Error taxonomies, diagnostic checkers, and step-by-step recovery step definitions.
 */

export interface AtsParsingError {
    code: 'SCANNED_IMAGE_PDF' | 'PASSWORD_PROTECTED' | 'CORRUPTED_STREAM' | 'COMPLEX_TABLE_LAYOUT';
    title: string;
    description: string;
    severity: 'critical' | 'warning';
    suggestedFixes: string[];
}

export const ATS_ERROR_TAXONOMY: Record<string, AtsParsingError> = {
    SCANNED_IMAGE_PDF: {
        code: 'SCANNED_IMAGE_PDF',
        title: 'Unreadable PDF Text Layer (Scanned Image)',
        description: 'The uploaded PDF appears to be a flattened image scan. ATS scanners (like Workday & Taleo) cannot extract selectable text from image files.',
        severity: 'critical',
        suggestedFixes: [
            "Re-export document as a selectable PDF directly from Microsoft Word or Google Docs.",
            "Use OCR text layer embedding tool or convert file to .docx format.",
            "Avoid saving resumes using smartphone camera scanner apps without OCR text layers."
        ]
    },
    PASSWORD_PROTECTED: {
        code: 'PASSWORD_PROTECTED',
        title: 'Encrypted or Password Protected File',
        description: 'The document file permissions prevent automated OCR parsers from reading structural sections.',
        severity: 'critical',
        suggestedFixes: [
            "Remove print/copy permission passwords from your PDF export settings.",
            "Save a clean copy without encryption before uploading."
        ]
    },
    CORRUPTED_STREAM: {
        code: 'CORRUPTED_STREAM',
        title: 'Malformed Document Syntax',
        description: 'File headers or binary streams were truncated during upload transmission.',
        severity: 'critical',
        suggestedFixes: [
            "Re-download or export a fresh copy of your resume.",
            "Try converting the file to standard plain text (.txt) or DOCX."
        ]
    }
};

export const diagnoseUploadedResume = (fileName: string): AtsParsingError => {
    if (fileName.toLowerCase().includes("scan") || fileName.toLowerCase().includes("image")) {
        return ATS_ERROR_TAXONOMY.SCANNED_IMAGE_PDF;
    }
    if (fileName.toLowerCase().includes("protected") || fileName.toLowerCase().includes("lock")) {
        return ATS_ERROR_TAXONOMY.PASSWORD_PROTECTED;
    }
    return ATS_ERROR_TAXONOMY.SCANNED_IMAGE_PDF;
};
