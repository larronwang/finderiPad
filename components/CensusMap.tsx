import React, { useState } from 'react';
import { CitizenData, Language } from '../types';
import { Icons } from './Icons';
import { translations } from '../services/translations';

interface CensusMapProps {
  userData: CitizenData;
  onReset: () => void;
  fontSizeMode: 'large' | 'extra-large';
  language: Language;
}

const HK_SVG_DISTRICTS = [
  { id: 'NORTH', name: { en: 'North', 'zh-CN': '北区', 'zh-HK': '北區' }, path: "M280,30 L400,30 L400,80 L350,110 L280,90 Z", lx: 340, ly: 60 },
  { id: 'YUENLONG', name: { en: 'Yuen Long', 'zh-CN': '元朗', 'zh-HK': '元朗' }, path: "M50,40 L275,40 L275,90 L220,130 L120,130 L50,100 Z", lx: 160, ly: 75 },
  { id: 'TAIPO', name: { en: 'Tai Po', 'zh-CN': '大埔', 'zh-HK': '大埔' }, path: "M280,95 L350,115 L430,115 L430,180 L330,200 L280,180 Z", lx: 355, ly: 145 },
  { id: 'TUENMUN', name: { en: 'Tuen Mun', 'zh-CN': '屯门', 'zh-HK': '屯門' }, path: "M40,110 L115,135 L115,220 L20,220 L20,150 Z", lx: 65, ly: 175 },
  { id: 'TSUENWAN', name: { en: 'Tsuen Wan', 'zh-CN': '荃湾', 'zh-HK': '荃灣' }, path: "M120,140 L215,140 L215,190 L120,200 Z", lx: 165, ly: 170 },
  { id: 'SHATIN', name: { en: 'Sha Tin', 'zh-CN': '沙田', 'zh-HK': '沙田' }, path: "M220,145 L275,100 L325,200 L220,240 Z", lx: 275, ly: 170 },
  { id: 'SAIKUNG', name: { en: 'Sai Kung', 'zh-CN': '西贡', 'zh-HK': '西貢' }, path: "M330,205 L440,185 L440,340 L330,340 L310,250 Z", lx: 385, ly: 260 },
  { id: 'KWAITSING', name: { en: 'Kwai Tsing', 'zh-CN': '葵青', 'zh-HK': '葵青' }, path: "M140,205 L215,195 L215,245 L140,245 Z", lx: 175, ly: 225 },
  { id: 'KOWLOON', name: { en: 'Kowloon', 'zh-CN': '九龙', 'zh-HK': '九龍' }, path: "M170,250 L310,250 L310,320 L170,320 Z", lx: 240, ly: 285 },
  { id: 'HK_ISLAND', name: { en: 'HK Island', 'zh-CN': '港岛', 'zh-HK': '港島' }, path: "M160,350 L380,350 L380,430 L160,450 Z", lx: 270, ly: 400 },
  { id: 'LANTAU', name: { en: 'Lantau', 'zh-CN': '大屿山', 'zh-HK': '大嶼山' }, path: "M20,240 L120,240 L120,400 L20,400 Z", lx: 70, ly: 320 },
];

export const CensusMap: React.FC<CensusMapProps> = ({ userData, onReset, fontSizeMode, language }) => {
  const [activeFilter, setActiveFilter] = useState('age');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const t = translations[language];

  const getDensityColor = (id: string) => {
    const seed = (id.length * 7 + activeFilter.length * 3) % 4;
    const palettes: Record<string, string[]> = {
      age: ['fill-indigo-100', 'fill-indigo-300', 'fill-indigo-500', 'fill-indigo-700'],
      housing: ['fill-emerald-100', 'fill-emerald-300', 'fill-emerald-500', 'fill-emerald-700'],
      occupation: ['fill-blue-100', 'fill-blue-300', 'fill-blue-500', 'fill-blue-700'],
      hobby: ['fill-rose-100', 'fill-rose-300', 'fill-rose-500', 'fill-rose-700'],
    };
    const currentPalette = palettes[activeFilter] || palettes.age;
    return currentPalette[seed];
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] overflow-hidden">
      {/* Mobile Map Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 pt-12 pb-4 flex justify-between items-center z-40 shrink-0">
        <div className="flex items-center gap-2">
          <Icons.Map size={24} className="text-indigo-900" />
          <h1 className="font-black text-lg text-slate-900 tracking-tighter uppercase truncate max-w-[150px]">{t.mapTitle}</h1>
        </div>
        <button onClick={onReset} className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-xs">
          Home
        </button>
      </header>

      <div className="flex-1 relative bg-slate-50 overflow-hidden flex items-center justify-center p-4">
        <svg 
          viewBox="0 0 500 500" 
          className="w-full h-auto drop-shadow-2xl animate-in zoom-in-95 duration-1000"
          preserveAspectRatio="xMidYMid meet"
        >
          {HK_SVG_DISTRICTS.map(d => (
            <g key={d.id} className="group">
              <path 
                d={d.path} 
                className={`${getDensityColor(d.id)} stroke-white stroke-[2] transition-all duration-700`}
              />
              <text 
                x={d.lx} y={d.ly} 
                textAnchor="middle"
                className="fill-white font-black text-[12px] pointer-events-none select-none"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                {d.name[language as keyof typeof d.name]}
              </text>
            </g>
          ))}
        </svg>

        {/* Floating Legends Button */}
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="absolute bottom-6 right-6 bg-indigo-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center animate-bounce"
        >
          <Icons.Filter size={24} />
        </button>
      </div>

      {/* Bottom Drawer for Mobile Insights */}
      <div className={`fixed inset-x-0 bottom-0 bg-white rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] z-50 transition-transform duration-500 ease-in-out transform ${isDrawerOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-4" onClick={() => setIsDrawerOpen(false)} />
        <div className="px-8 pb-12 max-h-[60vh] overflow-y-auto no-scrollbar">
          <section className="mb-8">
            <h2 className="text-indigo-900 font-black text-[10px] uppercase tracking-widest mb-4">Your Profile</h2>
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                <Icons.User size={24} />
              </div>
              <div>
                <div className="text-slate-900 font-black text-lg">{userData.fullName || 'Citizen'}</div>
                <div className="text-slate-400 font-bold text-[10px] uppercase">{userData.age}Y • {userData.gender}</div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Map Views</h2>
            <div className="grid grid-cols-2 gap-3">
              <MapFilterBtn label="Age" active={activeFilter === 'age'} onClick={() => setActiveFilter('age')} />
              <MapFilterBtn label="Housing" active={activeFilter === 'housing'} onClick={() => setActiveFilter('housing')} />
              {userData.occupation && <MapFilterBtn label="Job" active={activeFilter === 'occupation'} onClick={() => setActiveFilter('occupation')} />}
              {userData.hobby && <MapFilterBtn label="Hobby" active={activeFilter === 'hobby'} onClick={() => setActiveFilter('hobby')} />}
            </div>
          </section>
          
          <button 
            onClick={() => setIsDrawerOpen(false)}
            className="w-full mt-8 py-4 bg-slate-100 text-slate-900 font-black rounded-2xl uppercase text-xs tracking-widest"
          >
            Close Insights
          </button>
        </div>
      </div>
      
      {/* Overlay */}
      {isDrawerOpen && <div className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />}
    </div>
  );
};

const MapFilterBtn = ({ label, active, onClick }: any) => (
  <button onClick={onClick} className={`py-4 rounded-2xl font-black text-xs uppercase transition-all border-2 ${active ? 'bg-indigo-900 border-indigo-900 text-white' : 'bg-white border-slate-100 text-slate-500'}`}>
    {label}
  </button>
);