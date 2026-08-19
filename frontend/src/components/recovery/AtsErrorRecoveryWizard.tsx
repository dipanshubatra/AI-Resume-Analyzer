import React, { useState } from 'react';
import { 
    Wrench, 
    FileCheck, 
    AlertTriangle, 
    CheckCircle2, 
    ArrowLeft 
} from 'lucide-react';
import { 
    AtsParsingError, 
    ATS_ERROR_TAXONOMY, 
    diagnoseUploadedResume 
} from '../../services/atsErrorRecoveryEngine';
import { AtsErrorDiagnosticCard } from './AtsErrorDiagnosticCard';

export const AtsErrorRecoveryWizard: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<'diagnostic' | 'reupload' | 'success'>('diagnostic');
    const [activeError, setActiveError] = useState<AtsParsingError>(ATS_ERROR_TAXONOMY.SCANNED_IMAGE_PDF);

    const handleMockReupload = () => {
        setCurrentStep('reupload');
        setTimeout(() => {
            setCurrentStep('success');
        }, 1200);
    };

    return (
        <div className="w-full max-w-xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold mb-2">
                    <Wrench className="w-4 h-4" /> ATS Parsing Recovery Wizard
                </div>
                <h2 className="text-2xl font-black text-slate-100">Document Parsing Error</h2>
                <p className="text-xs text-slate-400">Our OCR engine encountered formatting issues with your uploaded file.</p>
            </div>

            {currentStep === 'diagnostic' && (
                <AtsErrorDiagnosticCard
                    error={activeError}
                    onReuploadClick={handleMockReupload}
                />
            )}

            {currentStep === 'reupload' && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto animate-pulse">
                        <Wrench className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-100">Reparsing Fixed Resume...</h3>
                    <p className="text-xs text-slate-400">Re-evaluating ATS text layers and formatting structures.</p>
                </div>
            )}

            {currentStep === 'success' && (
                <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-6 text-center space-y-4">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                    <div>
                        <h3 className="text-base font-bold text-slate-100">ATS Parsing Successful!</h3>
                        <p className="text-xs text-emerald-400 mt-1">100% of text layers and keywords extracted cleanly.</p>
                    </div>
                    <button
                        onClick={() => setCurrentStep('diagnostic')}
                        className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300"
                    >
                        Test Another Error State
                    </button>
                </div>
            )}
        </div>
    );
};
