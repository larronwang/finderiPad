import React, { useState, useEffect, useCallback } from 'react';
import { AppState, CitizenData, INITIAL_DATA, STEPS } from './types';
import StepWizard from './components/StepWizard';
import { CensusMap } from './components/CensusMap';
import { InputWithVoice, SelectionCard } from './components/InputControls';
import { Icons } from './components/Icons';
import { saveProgress, loadProgress, clearProgress, parseIdCard } from './services/idParser';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    view: 'wizard',
    currentStep: 1,
    fontSizeMode: 'large',
    highContrast: false,
    data: INITIAL_DATA
  });

  // Load auto-save on mount
  useEffect(() => {
    const saved = loadProgress();
    if (saved) {
      setAppState(prev => ({ ...prev, data: saved }));
    }
  }, []);

  // Auto-save on data change, only if in wizard mode
  useEffect(() => {
    if (appState.view === 'wizard' && appState.data !== INITIAL_DATA) {
      saveProgress(appState.data);
    }
  }, [appState.data, appState.view]);

  const updateData = (field: keyof CitizenData, value: any) => {
    setAppState(prev => ({
      ...prev,
      data: { ...prev.data, [field]: value }
    }));
  };

  const handleIdChange = (id: string) => {
    const newData = { ...appState.data, idNumber: id };
    
    // Smart Parsing
    if (id.length === 18) {
      const parsed = parseIdCard(id);
      Object.assign(newData, parsed);
    }
    
    setAppState(prev => ({ ...prev, data: newData }));
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const mockAddress = `Loc: ${latitude.toFixed(4)}, ${longitude.toFixed(4)} (Auto-detected)`;
        updateData('address', mockAddress);
      },
      () => {
        alert("Unable to retrieve your location");
      }
    );
  };

  const toggleFontSize = () => {
    setAppState(prev => ({
      ...prev,
      fontSizeMode: prev.fontSizeMode === 'large' ? 'extra-large' : 'large'
    }));
  };

  const nextStep = () => {
    if (appState.currentStep < STEPS.length) {
      setAppState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
    } else {
      // Submit and go to map
      clearProgress();
      setAppState(prev => ({ ...prev, view: 'map' }));
    }
  };

  const prevStep = () => {
    if (appState.currentStep > 1) {
      setAppState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
    }
  };

  const resetApp = () => {
    setAppState({
      view: 'wizard',
      currentStep: 1,
      fontSizeMode: 'large',
      highContrast: false,
      data: INITIAL_DATA
    });
  };

  const isLarge = appState.fontSizeMode === 'large';
  const step = STEPS.find(s => s.id === appState.currentStep)!;

  // Validation
  const canProceed = () => {
    const d = appState.data;
    switch (appState.currentStep) {
      case 1: return !!d.fullName && d.idNumber.length >= 15;
      case 2: return !!d.address && !!d.phoneNumber;
      case 3: return !!d.education && !!d.maritalStatus;
      case 4: return !!d.housingType && !!d.employmentStatus;
      default: return true;
    }
  };

  // Device Frame Wrapper - iPad Pro 12.9 (2021) Landscape aspect ratio ~ 1366x1024
  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4 md:p-8 overflow-hidden">
      {/* Simulated Device Frame */}
      <div 
        className="relative bg-black rounded-[2.5rem] p-[12px] shadow-2xl overflow-hidden ring-4 ring-slate-700"
        style={{
          width: '100%',
          maxWidth: '1366px', // Landscape Width
          aspectRatio: '1366/1024', // Landscape Ratio
          maxHeight: '90vh',
        }}
      >
        {/* Screen Content */}
        <div className={`w-full h-full bg-slate-50 rounded-[2rem] overflow-hidden flex flex-col relative ${appState.highContrast ? 'grayscale contrast-125' : ''}`}>
          
          {/* Universal Header for Accessibility Controls (only in Wizard) */}
          {appState.view === 'wizard' && (
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm z-50 shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl text-blue-900 tracking-tighter">SilverAge</span>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={toggleFontSize}
                  className="flex items-center gap-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-900 px-4 py-2 rounded-lg font-bold border-2 border-yellow-300 transition-colors"
                >
                  {appState.fontSizeMode === 'large' ? <Icons.ZoomIn size={24} /> : <Icons.ZoomOut size={24} />}
                  <span className="hidden sm:inline">Text Size</span>
                </button>
              </div>
            </div>
          )}

          {/* Main Content Switcher */}
          <div className="flex-1 overflow-hidden relative">
            {appState.view === 'map' ? (
              <CensusMap 
                userData={appState.data} 
                onReset={resetApp} 
                fontSizeMode={appState.fontSizeMode}
              />
            ) : (
              <StepWizard
                currentStep={appState.currentStep}
                totalSteps={STEPS.length}
                title={step.title}
                description={step.description}
                onBack={prevStep}
                onNext={nextStep}
                canNext={canProceed()}
                fontSizeMode={appState.fontSizeMode}
              >
                {/* Step 1: Identity */}
                {appState.currentStep === 1 && (
                  <div className="space-y-6">
                    <InputWithVoice 
                      label="Full Name" 
                      value={appState.data.fullName} 
                      onChange={(v) => updateData('fullName', v)} 
                      fontSizeMode={appState.fontSizeMode}
                      placeholder="e.g. John Doe"
                    />
                    
                    <InputWithVoice 
                      label="ID Number (Smart Fill)" 
                      value={appState.data.idNumber} 
                      onChange={handleIdChange} 
                      fontSizeMode={appState.fontSizeMode}
                      placeholder="18-digit ID Card Number"
                      type="tel"
                    />

                    {/* Auto-filled read-only section */}
                    <div className={`grid grid-cols-2 gap-4 p-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-100/50 ${appState.data.birthDate ? 'opacity-100' : 'opacity-50'}`}>
                      <div className="col-span-2 text-slate-500 font-bold uppercase tracking-wide text-sm mb-2">Auto-detected Information</div>
                      <div>
                          <label className="block text-slate-500 text-sm font-bold">Gender</label>
                          <div className={`font-bold text-slate-900 ${isLarge ? 'text-xl' : 'text-2xl'}`}>{appState.data.gender || '-'}</div>
                      </div>
                      <div>
                          <label className="block text-slate-500 text-sm font-bold">Age</label>
                          <div className={`font-bold text-slate-900 ${isLarge ? 'text-xl' : 'text-2xl'}`}>{appState.data.age || '-'}</div>
                      </div>
                      <div className="col-span-2">
                          <label className="block text-slate-500 text-sm font-bold">Date of Birth</label>
                          <div className={`font-bold text-slate-900 ${isLarge ? 'text-xl' : 'text-2xl'}`}>{appState.data.birthDate || '-'}</div>
                      </div>
                    </div>

                    {/* Additional Optional Fields for Step 1 */}
                    <div className="pt-4 border-t border-slate-200">
                      <h4 className="font-bold text-slate-400 uppercase tracking-widest mb-4">Optional Details</h4>
                      <div className="space-y-6">
                        <InputWithVoice 
                          label="Ethnicity (Optional)" 
                          value={appState.data.ethnicity} 
                          onChange={(v) => updateData('ethnicity', v)} 
                          fontSizeMode={appState.fontSizeMode}
                          placeholder="e.g. Han"
                        />
                         <InputWithVoice 
                          label="Ancestry / Hometown (Optional)" 
                          value={appState.data.ancestry} 
                          onChange={(v) => updateData('ancestry', v)} 
                          fontSizeMode={appState.fontSizeMode}
                          placeholder="e.g. Guangdong"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Contact */}
                {appState.currentStep === 2 && (
                  <div className="space-y-6">
                    <InputWithVoice 
                      label="Phone Number" 
                      value={appState.data.phoneNumber} 
                      onChange={(v) => updateData('phoneNumber', v)} 
                      fontSizeMode={appState.fontSizeMode}
                      type="tel"
                      placeholder="Mobile or Home"
                    />

                    <div>
                      <div className="flex justify-between items-end mb-3">
                        <label className={`block font-bold text-slate-800 ${isLarge ? 'text-2xl' : 'text-4xl'}`}>Current Address</label>
                        <button 
                          onClick={handleGeolocation}
                          className="bg-green-100 hover:bg-green-200 text-green-800 border-2 border-green-400 px-4 py-2 rounded-lg font-bold flex items-center gap-2 active:scale-95 transition-transform"
                        >
                          <Icons.Address size={24} />
                          <span>GPS Locate</span>
                        </button>
                      </div>
                      <InputWithVoice 
                        label="" // handled above
                        value={appState.data.address} 
                        onChange={(v) => updateData('address', v)} 
                        fontSizeMode={appState.fontSizeMode}
                        placeholder="Tap GPS or type address"
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Demographics */}
                {appState.currentStep === 3 && (
                  <div className="space-y-8">
                    <div>
                      <h3 className={`font-bold text-slate-600 mb-4 ${isLarge ? 'text-xl' : 'text-2xl'}`}>Education Level</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {['Primary', 'High School', 'University', 'None'].map((opt) => (
                          <SelectionCard
                            key={opt}
                            label={opt}
                            selected={appState.data.education === opt}
                            onClick={() => updateData('education', opt)}
                            fontSizeMode={appState.fontSizeMode}
                            icon={Icons.Education}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className={`font-bold text-slate-600 mb-4 ${isLarge ? 'text-xl' : 'text-2xl'}`}>Marital Status</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {['Married', 'Widowed', 'Divorced', 'Single'].map((opt) => (
                          <SelectionCard
                            key={opt}
                            label={opt}
                            selected={appState.data.maritalStatus === opt}
                            onClick={() => updateData('maritalStatus', opt)}
                            fontSizeMode={appState.fontSizeMode}
                            icon={Icons.Marital}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Living & Work */}
                {appState.currentStep === 4 && (
                    <div className="space-y-8">
                    <div>
                      <h3 className={`font-bold text-slate-600 mb-4 ${isLarge ? 'text-xl' : 'text-2xl'}`}>Living Situation</h3>
                      <div className="grid grid-cols-1 gap-4">
                        {[
                            { l: 'Owned House', v: 'Owned' }, 
                            { l: 'Rented', v: 'Rented' }, 
                            { l: 'With Children', v: 'With Children' }, 
                            { l: 'Nursing Home', v: 'Nursing Home' }
                        ].map((opt) => (
                          <SelectionCard
                            key={opt.v}
                            label={opt.l}
                            selected={appState.data.housingType === opt.v}
                            onClick={() => updateData('housingType', opt.v)}
                            fontSizeMode={appState.fontSizeMode}
                            icon={Icons.Home}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className={`font-bold text-slate-600 mb-4 ${isLarge ? 'text-xl' : 'text-2xl'}`}>Current Employment</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {['Retired', 'Working', 'Unemployed'].map((opt) => (
                          <SelectionCard
                            key={opt}
                            label={opt}
                            selected={appState.data.employmentStatus === opt}
                            onClick={() => updateData('employmentStatus', opt)}
                            fontSizeMode={appState.fontSizeMode}
                            icon={Icons.Job}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Optional Occupation Field */}
                    {(appState.data.employmentStatus === 'Working' || !appState.data.employmentStatus) && (
                       <div className="pt-4 border-t border-slate-200">
                         <InputWithVoice 
                           label="Occupation (Optional)" 
                           value={appState.data.occupation} 
                           onChange={(v) => updateData('occupation', v)} 
                           fontSizeMode={appState.fontSizeMode}
                           placeholder="e.g. Teacher, Engineer"
                         />
                       </div>
                    )}
                  </div>
                )}

                {/* Step 5: Review */}
                {appState.currentStep === 5 && (
                  <div className="space-y-8">
                    <div className="bg-yellow-50 border-l-8 border-yellow-400 p-6 rounded-r-xl">
                      <p className={`font-bold text-yellow-900 ${isLarge ? 'text-xl' : 'text-2xl'}`}>
                        Please check your information carefully. If everything is correct, click the "Confirm & Submit" button below.
                      </p>
                    </div>

                    <div className="space-y-6">
                        <ReviewSection title="Identity" fontSizeMode={appState.fontSizeMode}>
                            <ReviewItem label="Full Name" value={appState.data.fullName} isLarge={isLarge} />
                            <ReviewItem label="ID Number" value={appState.data.idNumber} isLarge={isLarge} />
                            <ReviewItem label="Gender" value={appState.data.gender} isLarge={isLarge} />
                            <ReviewItem label="Ethnicity" value={appState.data.ethnicity} isLarge={isLarge} />
                            <ReviewItem label="Ancestry" value={appState.data.ancestry} isLarge={isLarge} />
                        </ReviewSection>

                        <ReviewSection title="Contact" fontSizeMode={appState.fontSizeMode}>
                            <ReviewItem label="Phone" value={appState.data.phoneNumber} isLarge={isLarge} />
                            <ReviewItem label="Address" value={appState.data.address} isLarge={isLarge} />
                        </ReviewSection>

                        <ReviewSection title="Details" fontSizeMode={appState.fontSizeMode}>
                            <ReviewItem label="Education" value={appState.data.education} isLarge={isLarge} />
                            <ReviewItem label="Marital Status" value={appState.data.maritalStatus} isLarge={isLarge} />
                            <ReviewItem label="Housing" value={appState.data.housingType} isLarge={isLarge} />
                            <ReviewItem label="Employment" value={appState.data.employmentStatus} isLarge={isLarge} />
                            <ReviewItem label="Occupation" value={appState.data.occupation} isLarge={isLarge} />
                        </ReviewSection>
                    </div>
                  </div>
                )}
              </StepWizard>
            )}
          </div>
          
          {/* Home Indicator (iOS style) */}
          <div className="h-4 w-full flex justify-center pb-2 absolute bottom-2 pointer-events-none">
            <div className="w-32 h-1.5 bg-slate-400 rounded-full opacity-50"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Subcomponents for Review Page
const ReviewSection: React.FC<{ title: string; children: React.ReactNode; fontSizeMode: 'large' | 'extra-large' }> = ({ title, children, fontSizeMode }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className={`bg-slate-100 px-6 py-4 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider ${fontSizeMode === 'large' ? 'text-lg' : 'text-xl'}`}>
            {title}
        </div>
        <div className="p-6 space-y-4">
            {children}
        </div>
    </div>
);

const ReviewItem: React.FC<{ label: string; value: any; isLarge: boolean }> = ({ label, value, isLarge }) => (
    <div className="border-b border-slate-100 pb-2 last:border-0 last:pb-0">
        <div className="text-slate-500 text-sm font-semibold mb-1">{label}</div>
        <div className={`font-bold text-slate-900 ${isLarge ? 'text-2xl' : 'text-3xl'}`}>{value || <span className="text-slate-300 italic">Not set</span>}</div>
    </div>
);

export default App;