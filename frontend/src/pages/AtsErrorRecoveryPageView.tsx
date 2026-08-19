import React from 'react';
import { AtsErrorRecoveryWizard } from '../components/recovery/AtsErrorRecoveryWizard';

export const AtsErrorRecoveryPageView: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
            <AtsErrorRecoveryWizard />
        </div>
    );
};

export default AtsErrorRecoveryPageView;
