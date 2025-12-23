import React, { useState, useEffect } from 'react';
import { AppState, CitizenData, INITIAL_DATA, STEPS, Language } from './types.ts';
import StepWizard from './components/StepWizard.tsx';
import { CensusMap } from './components/CensusMap.tsx';
import { InputWithVoice, SelectionCard } from './components/InputControls.tsx';
import { saveProgress, loadProgress, clearProgress } from './services/idParser.ts';
import { translations } from './services/translations.ts';
import { Icons as AppIcons, FinderLogo } from './components/Icons.tsx';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    view: 'home',
    currentStep: 1,
    fontSizeMode: 'large',
    language: 'zh-HK',
    data: INITIAL_DATA
  });

  const t = translations[appState.language];

  useEffect(() => {
    const saved = loadProgress();
    if (saved) setAppState(prev => ({ ...prev, data: saved }));
  }, []);

  useEffect(() => {
    if (appState.view === 'wizard' && appState.data !== INITIAL_DATA) {
      saveProgress(appState.data);
    }
  }, [appState.data, appState.view]);

  const updateData = (field: keyof CitizenData, value: any) => {
    setAppState(prev => {
      const newData = { ...prev.data, [field]: value };
      if (field === 'birthDate' && value) {
        const birthDate = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) age--;
        newData.age = age;
      }
      return { ...prev, data: newData };
    });
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      updateData('address', `Dist. (${pos.coords.latitude.toFixed(2)}N, ${pos.coords.longitude.toFixed(2)}E)`);
    });
  };

  const nextStep = () => {
    if (appState.currentStep < STEPS.length) {
      setAppState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
    } else {
      clearProgress();
      setAppState(prev => ({ ...prev, view: 'map' }));
    }
  };

  const isLarge = appState.fontSizeMode === 'large';
  const currentStepInfo = STEPS.find(s => s.id === appState.currentStep)!;

  const canProceed = () => {
    const d = appState.data;
    switch (appState.currentStep) {
      case 1: return !!d.fullName && !!d.birthDate && !!d.gender;
      case 2: return !!d.address && !!d.phoneNumber;
      case 3: return !!d.education && !!d.maritalStatus;
      case 4: return !!d.housingType && !!d.employmentStatus;
      default: return true;
    }
  };

  const getTranslatedValue = (field: keyof CitizenData, value: any) => {
    if (!value) return '-';
    const dict = t as any;
    switch (field) {
      case 'gender': return dict[value.toLowerCase()] || value;
      case 'employmentStatus': return t.employmentStatus[value.toLowerCase() as keyof typeof t.employmentStatus] || value;
      case 'housingType': {
        const key = value.toLowerCase().replace(/\s/g, '');
        return (t.housingTypes as any)[key] || value;
      }
      case 'education': {
        const keyMap: any = { 'Junior High School': 'junior', 'High School': 'high', 'Undergraduate': 'undergrad', 'Graduate': 'grad' };
        return (t.educationLevels as any)[keyMap[value]] || value;
      }
      case 'maritalStatus': return t.maritalStatus[value.toLowerCase() as keyof typeof t.maritalStatus] || value;
      default: return value;
    }
  };

  return (
    <div className="screen-container">
      {appState.view === 'wizard' && (
        <header className="bg-white/90 backdrop-blur-xl border-b border-slate-100 px-6 pt-12 pb-4 flex justify-between items-center z-50 shrink-0">
          <div className="flex items-center gap-2">
            <FinderLogo className="w-8 h-8" />
            <span className="font-black text-lg text-slate-900 tracking-tighter uppercase">{t.appName}</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setAppState(prev => ({ ...prev, language: prev.language === 'en' ? 'zh-HK' : 'en' }))}
              className="bg-slate-100 px-3 py-1.5 rounded-xl font-black text-[10px] text-slate-600 border border-slate-200"
            >
              {appState.language === 'en' ? '繁' : 'EN'}
            </button>
            <button 
              onClick={() => setAppState(prev => ({ ...prev, fontSizeMode: prev.fontSizeMode === 'large' ? 'extra-large' : 'large' }))}
              className="bg-indigo-50 text-indigo-900 w-10 h-10 rounded-xl flex items-center justify-center border border-indigo-100"
            >
              {isLarge ? <AppIcons.ZoomIn size={18} /> : <AppIcons.ZoomOut size={18} />}
            </button>
          </div>
        </header>
      )}

      <main className="flex-1 overflow-hidden relative">
        {appState.view === 'home' ? (
          <div className="w-full h-full flex flex-col items-center justify-between bg-[#f8fafc] p-12 pt-24 pb-12">
            <div className="flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-1000 w-full">
              <FinderLogo className="w-36 h-36 mb-10" />
              <h1 className="text-[6rem] font-black text-slate-900 tracking-tighter mb-4 leading-none uppercase">
                Finder
              </h1>
              <p className="text-3xl text-slate-400 font-semibold max-w-[420px] tracking-tight leading-snug">
                Next-Gen Census Discovery for the Silver Generation.
              </p>
            </div>

            <div className="w-full max-w-lg flex flex-col gap-6">
              <button 
                onClick={() => setAppState(prev => ({ ...prev, view: 'wizard' }))}
                className="bg-indigo-950 text-white rounded-[2.5rem] py-10 text-4xl font-black shadow-2xl shadow-indigo-200 hover:bg-black transition-all active:scale-[0.98] flex items-center justify-center gap-4"
              >
                Get Started <AppIcons.Next size={32} />
              </button>
              
              <div className="flex gap-4 justify-center">
                {(['en', 'zh-HK'] as Language[]).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setAppState(prev => ({ ...prev, language: lang }))}
                    className={`flex-1 py-5 rounded-2xl font-black text-base tracking-widest uppercase transition-all border-2 ${appState.language === lang ? 'bg-white border-indigo-600 text-indigo-900 shadow-xl shadow-indigo-100/50' : 'bg-transparent border-slate-200 text-slate-400'}`}
                  >
                    {lang === 'en' ? 'English' : '繁體中文'}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[12px] font-bold text-slate-300 tracking-[0.5em] uppercase text-center mt-6">
               Secure • Digital Native • iPad Optimized • 2025
            </div>
          </div>
        ) : appState.view === 'map' ? (
          <CensusMap userData={appState.data} onReset={() => setAppState(prev => ({ ...prev, view: 'home', currentStep: 1 }))} fontSizeMode={appState.fontSizeMode} language={appState.language} />
        ) : (
          <StepWizard
            currentStep={appState.currentStep}
            totalSteps={STEPS.length}
            title={(t as any)[currentStepInfo.key]}
            description={t.reviewMsg}
            onBack={() => setAppState(prev => ({ ...prev, currentStep: Math.max(1, prev.currentStep - 1) }))}
            onNext={nextStep}
            canNext={canProceed()}
            fontSizeMode={appState.fontSizeMode}
            language={appState.language}
          >
            <div className="space-y-8 pb-20">
              {appState.currentStep === 1 && (
                <>
                  <InputWithVoice label={t.fullName} value={appState.data.fullName} onChange={v => updateData('fullName', v)} fontSizeMode={appState.fontSizeMode} language={appState.language} placeholder={t.placeholders.name} />
                  <InputWithVoice label={t.birthDate} type="date" value={appState.data.birthDate} onChange={v => updateData('birthDate', v)} fontSizeMode={appState.fontSizeMode} language={appState.language} />
                  <div className="space-y-4">
                    <label className="block font-black text-slate-900 uppercase tracking-widest text-[11px] opacity-40">{t.gender}</label>
                    <div className="flex flex-col gap-3">
                      {['Male', 'Female'].map(g => (
                        <SelectionCard key={g} label={(t as any)[g.toLowerCase()]} selected={appState.data.gender === g} onClick={() => updateData('gender', g)} fontSizeMode={appState.fontSizeMode} />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {appState.currentStep === 2 && (
                <>
                  <InputWithVoice label={t.phone} value={appState.data.phoneNumber} onChange={v => updateData('phoneNumber', v)} fontSizeMode={appState.fontSizeMode} type="tel" language={appState.language} placeholder={t.placeholders.phone} />
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="block font-black text-slate-900 uppercase tracking-widest text-[11px] opacity-40">{t.address}</label>
                      <button onClick={handleGeolocation} className="text-emerald-600 font-black text-[11px] flex items-center gap-1">
                        <AppIcons.Address size={14} /> {t.gps}
                      </button>
                    </div>
                    <InputWithVoice label="" value={appState.data.address} onChange={v => updateData('address', v)} fontSizeMode={appState.fontSizeMode} language={appState.language} placeholder={t.placeholders.address} />
                  </div>
                </>
              )}

              {appState.currentStep === 3 && (
                <div className="space-y-12">
                  <div>
                    <h3 className="font-black text-slate-900 text-[11px] uppercase tracking-[0.2em] mb-5 opacity-40">{t.education}</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {['High School', 'Undergraduate'].map(opt => (
                        <SelectionCard key={opt} label={(t.educationLevels as any)[opt.toLowerCase().split(' ')[0]] || opt} selected={appState.data.education === opt} onClick={() => updateData('education', opt)} fontSizeMode={appState.fontSizeMode} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-[11px] uppercase tracking-[0.2em] mb-5 opacity-40">{t.marital}</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {['Married', 'Single'].map(m => (
                        <SelectionCard key={m} label={(t.maritalStatus as any)[m.toLowerCase()]} selected={appState.data.maritalStatus === m} onClick={() => updateData('maritalStatus', m)} fontSizeMode={appState.fontSizeMode} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {appState.currentStep === 4 && (
                <div className="space-y-12">
                  <div>
                    <h3 className="font-black text-slate-900 text-[11px] uppercase tracking-[0.2em] mb-5 opacity-40">{t.housing}</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {['Owned', 'Rented'].map(h => (
                        <SelectionCard key={h} label={(t.housingTypes as any)[h.toLowerCase()] || h} selected={appState.data.housingType === h} onClick={() => updateData('housingType', h)} fontSizeMode={appState.fontSizeMode} icon={AppIcons.Home} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-[11px] uppercase tracking-[0.2em] mb-5 opacity-40">{t.employment}</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {['Retired', 'Working'].map(e => (
                        <SelectionCard key={e} label={t.employmentStatus[e.toLowerCase() as keyof typeof t.employmentStatus]} selected={appState.data.employmentStatus === e} onClick={() => updateData('employmentStatus', e)} fontSizeMode={appState.fontSizeMode} icon={AppIcons.Job} />
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6 pt-10 border-t border-slate-100">
                    <InputWithVoice label={t.occupation} value={appState.data.occupation} onChange={v => updateData('occupation', v)} fontSizeMode={appState.fontSizeMode} language={appState.language} />
                    <InputWithVoice label={t.hobby} value={appState.data.hobby} onChange={v => updateData('hobby', v)} fontSizeMode={appState.fontSizeMode} language={appState.language} />
                  </div>
                </div>
              )}

              {appState.currentStep === 5 && (
                <div className="space-y-8 animate-in zoom-in-95 duration-500">
                  <div className="bg-indigo-950 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-10">
                        <AppIcons.Check size={160} />
                     </div>
                     <h3 className="text-5xl font-black mb-4 relative z-10">Verified.</h3>
                     <p className="text-indigo-200 text-xl font-medium leading-relaxed relative z-10">{t.reviewMsg}</p>
                  </div>
                  <div className="space-y-4">
                    <SummaryCard label={t.fullName} value={appState.data.fullName} isLarge={isLarge} />
                    <SummaryCard label={t.phone} value={appState.data.phoneNumber} isLarge={isLarge} />
                    <SummaryCard label={t.housing} value={getTranslatedValue('housingType', appState.data.housingType)} isLarge={isLarge} />
                    <SummaryCard label={t.hobby} value={appState.data.hobby || '-'} isLarge={isLarge} />
                  </div>
                </div>
              )}
            </div>
          </StepWizard>
        )}
      </main>
    </div>
  );
};

const SummaryCard = ({ label, value, isLarge }: any) => (
  <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-md flex justify-between items-center transition-all hover:border-indigo-200">
    <div className="text-slate-400 text-[11px] font-black uppercase tracking-widest">{label}</div>
    <div className={`font-black text-slate-900 ${isLarge ? 'text-xl' : 'text-2xl'}`}>{value || '-'}</div>
  </div>
);

export default App;