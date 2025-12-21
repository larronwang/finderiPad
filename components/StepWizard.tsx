import React, { ReactNode } from 'react';
import { STEPS, Language } from '../types';
import { Icons } from './Icons';
import { translations } from '../services/translations';

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

      {/* Hero Header (Smaller for Mobile) */}
      <div className="bg-white px-6 py-8 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2 mb-2">
           <span className="text-indigo-600 font-black text-[10px] uppercase tracking-widest">
             Step {currentStep} of {totalSteps}
           </span>
        </div>
        <h1 className={`font-black text-slate-900 tracking-tight leading-tight ${isLarge ? 'text-3xl' : 'text-4xl'}`}>{title}</h1>
      </div>

      {/* Content Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-6">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {children}
        </div>
      </div>

      {/* Bottom Action Bar (Fixed at bottom of screen) */}
      <div className="px-6 pt-4 pb-10 bg-white/80 backdrop-blur-xl border-t border-slate-100 shrink-0">
        <div className="flex gap-3">
          {currentStep > 1 && (
            <button 
              onClick={onBack} 
              className="w-16 h-16 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-sm"
            >
              <Icons.Back size={24} />
            </button>
          )}

          <button 
            onClick={onNext} 
            disabled={!canNext}
            className={`flex-1 rounded-2xl py-5 flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg
              ${canNext 
                ? 'bg-indigo-950 text-white' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}`}
          >
            <span className={`font-black uppercase tracking-widest ${isLarge ? 'text-lg' : 'text-xl'}`}>
              {currentStep === totalSteps ? t.submit : t.next}
            </span>
            {currentStep !== totalSteps && <Icons.Next size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepWizard;