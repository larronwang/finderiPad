import React, { useState } from 'react';
import { Icons } from './Icons';
import { Language } from '../types';

interface BaseProps {
  fontSizeMode: 'large' | 'extra-large';
  language: Language;
}

interface InputWithVoiceProps extends BaseProps {
  label: string;
  value: string | number;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: 'text' | 'tel' | 'number' | 'date';
  readOnly?: boolean;
}

export const InputWithVoice: React.FC<InputWithVoiceProps> = ({
  label,
  value,
  onChange,
  fontSizeMode,
  language,
  placeholder,
  type = 'text',
  readOnly = false
}) => {
  const [isListening, setIsListening] = useState(false);
  const isLarge = fontSizeMode === 'large';

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'en' ? 'en-US' : 'zh-HK';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e: any) => onChange(e.results[0][0].transcript);
    recognition.start();
  };

  return (
    <div className="w-full">
      {label && <label className="block font-black text-slate-900 mb-2 uppercase tracking-widest text-[10px] opacity-60">{label}</label>}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            readOnly={readOnly}
            className={`w-full border-2 transition-all duration-300 rounded-2xl px-5 shadow-sm outline-none font-bold
              ${readOnly ? 'bg-slate-50 border-slate-100 text-slate-400' : 'bg-white border-slate-100 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 text-slate-900'}
              ${isLarge ? 'text-lg h-14' : 'text-xl h-16'}`}
            placeholder={placeholder}
          />
        </div>
        {!readOnly && type !== 'date' && (
          <button 
            onClick={startListening} 
            className={`flex-shrink-0 aspect-square rounded-2xl flex items-center justify-center border-2 transition-all duration-300
              ${isListening ? 'bg-indigo-600 border-indigo-600 text-white mic-active scale-105' : 'bg-white border-slate-100 text-indigo-600 shadow-sm'}
              ${isLarge ? 'w-14' : 'w-16'}`}
          >
            <Icons.Mic size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

interface SelectionCardProps {
  label: string;
  icon?: React.ElementType;
  selected: boolean;
  onClick: () => void;
  fontSizeMode: 'large' | 'extra-large';
}

export const SelectionCard: React.FC<SelectionCardProps> = ({ label, icon: Icon, selected, onClick, fontSizeMode }) => {
  const isLarge = fontSizeMode === 'large';
  return (
    <button 
      onClick={onClick} 
      className={`w-full text-left relative rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 px-5 py-4
        ${selected ? 'bg-indigo-950 border-indigo-950 text-white shadow-xl shadow-indigo-100' : 'bg-white border-slate-100 text-slate-600 shadow-sm active:bg-slate-50'}`}
    >
      <div className={`transition-all duration-300 rounded-full flex items-center justify-center shrink-0
        ${selected ? 'bg-white text-indigo-950' : 'bg-slate-100 text-slate-400'}
        ${isLarge ? 'w-10 h-10' : 'w-12 h-12'}`}>
        {selected ? <Icons.Check size={20} /> : Icon && <Icon size={20} />}
      </div>
      <span className={`font-black tracking-tight transition-colors duration-300 ${isLarge ? 'text-lg' : 'text-xl'}`}>
        {label}
      </span>
    </button>
  );
};