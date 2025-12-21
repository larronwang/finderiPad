import React, { useState, useRef, useEffect, useCallback } from 'react';
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

export const CensusMap: React.FC<CensusMapProps> = ({ userData, onReset, language }) => {
  const [activeFilter, setActiveFilter] = useState('age');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const t = translations[language];

  const getDensityColor = (id: string) => {
    const seed = (id.length * 7 + activeFilter.length * 3) % 4;
    const palettes: Record<string, string[]> = {
      age: ['fill-indigo-100', 'fill-indigo-300', 'fill-indigo-500', 'fill-indigo-700'],
      housing: ['fill-emerald-100', 'fill-emerald-300', 'fill-emerald-500', 'fill-emerald-700'],
      occupation: ['fill-blue-100', 'fill-blue-300', 'fill-blue-500', 'fill-blue-700'],
      hobby: ['fill-rose-100', 'fill-rose-300', 'fill-rose-500', 'fill-rose-700'],
    };
    return palettes[activeFilter][seed] || palettes.age[seed];
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomSpeed = 0.001;
    const delta = -e.deltaY;
    const zoomFactor = 1 + delta * zoomSpeed;
    
    setTransform(prev => {
      const nextScale = Math.max(0.5, Math.min(8, prev.scale * zoomFactor));
      return { ...prev, scale: nextScale };
    });
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className="flex flex-col h-full bg-slate-900 overflow-hidden select-none">
      <header className="bg-white/95 backdrop-blur-xl border-b border-slate-100 px-6 pt-12 pb-4 flex justify-between items-center z-40 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-100">
            <Icons.Map size={18} />
          </div>
          <h1 className="font-black text-lg text-slate-900 tracking-tighter uppercase">{t.mapTitle}</h1>
        </div>
        <button onClick={onReset} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all active:scale-95">
          {t.backHome}
        </button>
      </header>

      <div 
        ref={containerRef}
        className={`flex-1 relative overflow-hidden bg-[#f1f5f9] transition-colors duration-300 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
      >
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ 
          backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', 
          backgroundSize: '40px 40px',
          transform: `translate(${transform.x % 40}px, ${transform.y % 40}px)` 
        }} />

        <div 
          className="w-full h-full flex items-center justify-center will-change-transform"
          style={{ 
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`,
            transition: isDragging ? 'none' : 'transform 0.1s cubic-bezier(0.2, 0, 0, 1)'
          }}
        >
          <svg 
            viewBox="0 0 500 500" 
            className="w-[90%] max-w-[900px] h-auto drop-shadow-[0_40px_80px_rgba(0,0,0,0.12)]"
          >
            {HK_SVG_DISTRICTS.map(d => (
              <g key={d.id} className="group cursor-pointer">
                <path 
                  d={d.path} 
                  className={`${getDensityColor(d.id)} stroke-white stroke-[1.5] transition-all duration-300 group-hover:brightness-90 group-hover:stroke-[3]`}
                />
                <text 
                  x={d.lx} y={d.ly} 
                  textAnchor="middle"
                  className="fill-white font-black pointer-events-none select-none uppercase tracking-tight"
                  style={{ 
                    fontSize: `${18 / transform.scale}px`,
                    paintOrder: 'stroke', 
                    stroke: 'rgba(0,0,0,0.4)', 
                    strokeWidth: `${2 / transform.scale}px`
                  }}
                >
                  {d.name[language as keyof typeof d.name]}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="absolute top-8 left-8 flex flex-col gap-3 pointer-events-none">
           <div className="bg-white shadow-xl px-4 py-2.5 rounded-2xl border border-slate-100 flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Interactive View</span>
           </div>
           <div className="bg-indigo-600 shadow-lg px-4 py-2.5 rounded-2xl text-white">
              <span className="text-[10px] font-black uppercase tracking-widest">Zoom: {Math.round(transform.scale * 100)}%</span>
           </div>
        </div>

        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 pointer-events-none opacity-60">
           <div className="bg-slate-900/10 backdrop-blur-sm px-6 py-2 rounded-full flex items-center gap-4 border border-white/20">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-900/70">
                {language === 'en' ? 'Drag to Pan • Wheel to Zoom' : '按住鼠標拖動 • 滾輪縮放'}
              </span>
           </div>
        </div>

        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="absolute bottom-10 right-10 bg-indigo-600 text-white w-16 h-16 rounded-2xl shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40 border-4 border-white group"
        >
          <Icons.Filter size={24} className="group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      <div className={`fixed inset-x-0 bottom-0 bg-white rounded-t-[40px] shadow-[0_-20px_80px_rgba(0,0,0,0.15)] z-50 transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) transform ${isDrawerOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="w-16 h-1.5 bg-slate-200 rounded-full mx-auto my-6 cursor-pointer" onClick={() => setIsDrawerOpen(false)} />
        <div className="px-10 pb-16 max-h-[75vh] overflow-y-auto no-scrollbar">
          <section className="mb-10">
            <h2 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mb-6">Participant Info</h2>
            <div className="flex items-center gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <div className="w-16 h-16 bg-indigo-950 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <Icons.User size={32} />
              </div>
              <div>
                <div className="text-slate-900 font-black text-2xl tracking-tighter mb-0.5">{userData.fullName || 'Citizen'}</div>
                <div className="flex gap-2">
                  <span className="text-indigo-600 font-black text-[10px] uppercase tracking-wider">{userData.age || '—'} Years</span>
                  <span className="text-slate-400 font-black text-[10px] uppercase tracking-wider">• {userData.gender || 'N/A'}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">Select Map Layer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <MapFilterBtn label="Age Density" active={activeFilter === 'age'} onClick={() => setActiveFilter('age')} icon={Icons.Users} />
              <MapFilterBtn label="Housing Trends" active={activeFilter === 'housing'} onClick={() => setActiveFilter('housing')} icon={Icons.Home} />
              {userData.occupation && <MapFilterBtn label="Work History" active={activeFilter === 'occupation'} onClick={() => setActiveFilter('occupation')} icon={Icons.Job} />}
              {userData.hobby && <MapFilterBtn label="Interests" active={activeFilter === 'hobby'} onClick={() => setActiveFilter('hobby')} icon={Icons.Hobby} />}
            </div>
          </section>
          
          <button 
            onClick={() => setIsDrawerOpen(false)}
            className="w-full mt-10 py-5 bg-indigo-950 text-white font-black rounded-2xl uppercase text-[12px] tracking-[0.2em] shadow-xl active:scale-[0.98] transition-all hover:bg-black"
          >
            Close Layers
          </button>
        </div>
      </div>
      
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-indigo-950/20 z-40 backdrop-blur-md transition-opacity duration-500" 
          onClick={() => setIsDrawerOpen(false)} 
        />
      )}
    </div>
  );
};

const MapFilterBtn = ({ label, active, onClick, icon: Icon }: any) => (
  <button 
    onClick={onClick} 
    className={`w-full py-4 px-6 rounded-2xl flex items-center gap-4 font-black text-[13px] uppercase tracking-tight transition-all border-2 
      ${active 
        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
        : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-200 active:bg-slate-50'}`}
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
        <Icon size={20} />
    </div>
    <span className="flex-1 text-left">{label}</span>
  </button>
);