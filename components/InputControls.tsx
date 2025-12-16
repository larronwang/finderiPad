import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';

interface BaseProps {
  fontSizeMode: 'large' | 'extra-large';
}

interface InputWithVoiceProps extends BaseProps {
  label: string;
  value: string | number;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: 'text' | 'tel' | 'number';
  readOnly?: boolean;
}

export const InputWithVoice: React.FC<InputWithVoiceProps> = ({
  label,
  value,
  onChange,
  fontSizeMode,
  placeholder,
  type = 'text',
  readOnly = false
}) => {
  const [isListening, setIsListening] = useState(false);
  const isLarge = fontSizeMode === 'large';

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onChange(transcript);
    };

    recognition.start();
  };

  return (
    <div className="mb-8">
      <label className={`block font-bold text-slate-800 mb-3 ${isLarge ? 'text-2xl' : 'text-4xl'}`}>
        {label}
      </label>
      <div className="flex gap-3">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          className={`flex-1 border-4 ${readOnly ? 'bg-slate-100 border-slate-300' : 'bg-white border-blue-200 focus:border-blue-600'} rounded-xl p-4 text-slate-900 shadow-inner outline-none transition-colors
            ${isLarge ? 'text-2xl h-16' : 'text-4xl h-24'}`}
          placeholder={placeholder}
        />
        {!readOnly && (
          <button
            onClick={startListening}
            className={`flex-shrink-0 aspect-square rounded-xl flex items-center justify-center border-4 transition-all
              ${isListening 
                ? 'bg-red-100 border-red-500 text-red-600 animate-pulse' 
                : 'bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200'}
              ${isLarge ? 'w-16' : 'w-24'}`}
            aria-label="Voice Input"
          >
            <Icons.Mic size={isLarge ? 32 : 48} />
          </button>
        )}
      </div>
    </div>
  );
};

interface SelectionCardProps extends BaseProps {
  label: string;
  icon?: React.ElementType;
  selected: boolean;
  onClick: () => void;
}

export const SelectionCard: React.FC<SelectionCardProps> = ({
  label,
  icon: Icon,
  selected,
  onClick,
  fontSizeMode
}) => {
  const isLarge = fontSizeMode === 'large';

  return (
    <button
      onClick={onClick}
      className={`w-full text-left relative rounded-2xl border-4 transition-all duration-200 active:scale-[0.98]
        ${selected 
          ? 'bg-blue-50 border-blue-800 shadow-inner' 
          : 'bg-white border-slate-200 shadow-md hover:border-blue-300'}
        ${isLarge ? 'p-6' : 'p-8'}`}
    >
      <div className="flex items-center gap-6">
        {selected ? (
          <div className="bg-blue-800 text-white rounded-full p-2">
            <Icons.Check size={isLarge ? 32 : 48} />
          </div>
        ) : (
          <div className={`rounded-full border-4 border-slate-300 ${isLarge ? 'w-12 h-12' : 'w-16 h-16'}`} />
        )}
        
        <div className="flex-1">
           <span className={`font-bold block text-slate-900 ${isLarge ? 'text-2xl' : 'text-4xl'}`}>
             {label}
           </span>
        </div>

        {Icon && (
          <div className={`${selected ? 'text-blue-800' : 'text-slate-400'}`}>
            <Icon size={isLarge ? 48 : 64} />
          </div>
        )}
      </div>
    </button>
  );
};