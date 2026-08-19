import React from 'react';
import { AlertOctagon, CheckCircle2, ArrowRight, Lightbulb } from 'lucide-react';
import { AtsParsingError } from '../../services/atsErrorRecoveryEngine';

interface AtsErrorDiagnosticCardProps {
    error: AtsParsingError;
    onReuploadClick: () => void;
}

export const AtsErrorDiagnosticCard: React.FC<AtsErrorDiagnosticCardProps> = ({ error, onReuploadClick }) => {
    return (
        <div className="bg-rose-950/40 border border-rose-500/40 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-start gap-3">
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
                    <AlertOctagon className="w-6 h-6" />
                </div>
                <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-rose-400 block">
                        ATS Parsing Diagnostic Failure
                    </span>
                    <h3 className="text-base font-bold text-slate-100 mt-0.5">{error.title}</h3>
                    <p className="text-xs text-rose-200/90 leading-relaxed mt-1">{error.description}</p>
                </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-400" /> Recommended Fixes:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-400 pl-2">
                    {error.suggestedFixes.map((fix, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                            <span className="text-indigo-400 font-bold">•</span>
                            <span>{fix}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <button
                type="button"
                onClick={onReuploadClick}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2"
            >
                <span>Upload Fixed Document</span>
                <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
};
