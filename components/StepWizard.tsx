import React, { ReactNode } from 'react';
import { STEPS } from '../types';
import { Icons } from './Icons';

interface StepWizardProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  description: string;
  onBack: () => void;
  onNext: () => void;
  canNext: boolean;
  children: ReactNode;
  fontSizeMode: 'large' | 'extra-large';
}

const StepWizard: React.FC<StepWizardProps> = ({
  currentStep,
  totalSteps,
  title,
  description,
  onBack,
  onNext,
  canNext,
  children,
  fontSizeMode
}) => {
  const isLarge = fontSizeMode === 'large';
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="flex flex-col h-full">
      {/* Progress Header */}
      <div className="bg-white border-b-4 border-blue-900 sticky top-0 z-10 shadow-sm">
        <div className="w-full bg-slate-200 h-4">
          <div 
            className="bg-green-600 h-4 transition-all duration-500 ease-out" 
            style={{ width: `${Math.max(5, progressPercentage)}%` }}
          />
        </div>
        
        <div className="p-4 md:p-6 flex justify-between items-center">
          <div>
            <span className={`font-bold text-blue-800 ${isLarge ? 'text-lg' : 'text-xl'} uppercase tracking-wider`}>
              Step {currentStep} of {totalSteps}
            </span>
            <h1 className={`font-bold text-slate-900 leading-tight mt-1 ${isLarge ? 'text-3xl' : 'text-5xl'}`}>
              {title}
            </h1>
            <p className={`text-slate-600 mt-2 ${isLarge ? 'text-xl' : 'text-2xl'}`}>
              {description}
            </p>
          </div>
          
          <div className="hidden md:block">
             {/* Visual step indicator for larger screens */}
             <div className="flex space-x-2">
                {STEPS.map(s => (
                  <div 
                    key={s.id} 
                    className={`w-4 h-4 rounded-full ${s.id <= currentStep ? 'bg-blue-800' : 'bg-slate-300'}`}
                  />
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-8 pb-32">
        <div className="max-w-3xl mx-auto w-full">
          {children}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="bg-white border-t border-slate-200 p-4 md:p-6 sticky bottom-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="max-w-3xl mx-auto w-full flex justify-between gap-4">
          {currentStep > 1 ? (
            <button 
              onClick={onBack}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border-2 border-slate-300 rounded-2xl py-4 md:py-6 flex items-center justify-center gap-3 transition-colors active:scale-95"
            >
              <Icons.Back size={isLarge ? 32 : 48} />
              <span className={`font-bold ${isLarge ? 'text-2xl' : 'text-3xl'}`}>Back</span>
            </button>
          ) : (
            <div className="flex-1" /> /* Spacer */
          )}

          <button 
            onClick={onNext}
            disabled={!canNext}
            className={`flex-[2] rounded-2xl py-4 md:py-6 flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg
              ${canNext 
                ? 'bg-blue-800 hover:bg-blue-900 text-white border-2 border-blue-900' 
                : 'bg-slate-300 text-slate-500 cursor-not-allowed border-2 border-slate-300'}`}
          >
            <span className={`font-bold ${isLarge ? 'text-2xl' : 'text-3xl'}`}>
              {currentStep === totalSteps ? 'Confirm & Submit' : 'Next Step'}
            </span>
            {currentStep !== totalSteps && <Icons.Next size={isLarge ? 32 : 48} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepWizard;