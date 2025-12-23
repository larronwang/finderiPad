import React, { ReactNode } from 'react';
import { STEPS, Language } from '../types.ts';
import { Icons } from './Icons.tsx';
import { translations } from '../services/translations.ts';

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
  language: Language;
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
  fontSizeMode,
  language
}) => {
  const isLarge = fontSizeMode === 'large';
  const t = translations[language];
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Dynamic Progress Bar */}
      <div className="h-1.5 w-full bg-slate-100 overflow-hidden shrink-0">
        <div 
          className="h-full bg-indigo-600 transition-all duration-700 ease-in-out" 
          style={{ width: `${progressPercentage}%` }} 
        />
      </div>

      {/* Hero Header */}
      <div className="bg-white px-8 py-10 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2 mb-2">
           <span className="text-indigo-600 font-black text-[12px] uppercase tracking-widest">
             Step {currentStep} of {totalSteps}
           </span>
        </div>
        <h1 className={`font-black text-slate-900 tracking-tight leading-tight ${isLarge ? 'text-4xl' : 'text-5xl'}`}>{title}</h1>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-8 py-8">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {children}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="px-8 pt-6 pb-12 bg-white/80 backdrop-blur-xl border-t border-slate-100 shrink-0">
        <div className="flex gap-4">
          {currentStep > 1 && (
            <button 
              onClick={onBack} 
              className="w-20 h-20 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-sm"
            >
              <Icons.Back size={32} />
            </button>
          )}

          <button 
            onClick={onNext} 
            disabled={!canNext}
            className={`flex-1 rounded-2xl py-6 flex items-center justify-center gap-4 transition-all active:scale-[0.98] shadow-lg
              ${canNext 
                ? 'bg-indigo-950 text-white' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}`}
          >
            <span className={`font-black uppercase tracking-widest ${isLarge ? 'text-xl' : 'text-2xl'}`}>
              {currentStep === totalSteps ? t.submit : t.next}
            </span>
            {currentStep !== totalSteps && <Icons.Next size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepWizard;