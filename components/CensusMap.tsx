import React, { useState } from 'react';
import { CitizenData } from '../types';
import { Icons } from './Icons';

interface CensusMapProps {
  userData: CitizenData;
  onReset: () => void;
  fontSizeMode: 'large' | 'extra-large';
}

type FilterType = 'age' | 'marital' | 'education' | 'gender' | 'ethnicity' | 'occupation' | 'ancestry';

// Simplified geometric representation of HK regions for the prototype
const HK_REGIONS = [
  { id: 'NT_NORTH', name: 'North NT', x: 200, y: 80, width: 140, height: 100 },
  { id: 'NT_WEST', name: 'Yuen Long / Tuen Mun', x: 40, y: 100, width: 140, height: 120 },
  { id: 'NT_EAST', name: 'Sai Kung / Sha Tin', x: 220, y: 200, width: 120, height: 100 },
  { id: 'KOWLOON', name: 'Kowloon', x: 190, y: 310, width: 100, height: 60 },
  { id: 'HK_ISLAND', name: 'Hong Kong Island', x: 180, y: 390, width: 130, height: 50 },
  { id: 'LANTAU', name: 'Lantau Island', x: 20, y: 350, width: 140, height: 80 },
];

export const CensusMap: React.FC<CensusMapProps> = ({ userData, onReset, fontSizeMode }) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('age');
  const isLarge = fontSizeMode === 'large';

  // Mock density calculation based on filters
  const getDensityColor = (regionId: string) => {
    // Deterministic pseudo-random based on region char code and active filter
    // This simulates different distributions for different stats
    const seed = regionId.charCodeAt(0) + activeFilter.length;
    const level = seed % 4; 
    
    switch(level) {
      case 0: return 'fill-blue-100 text-blue-800'; // Low
      case 1: return 'fill-blue-300 text-blue-900'; // Med
      case 2: return 'fill-blue-500 text-white';    // High
      case 3: return 'fill-blue-800 text-white';    // Very High
      default: return 'fill-slate-200 text-slate-600';
    }
  };

  const getLabel = (regionId: string) => {
    const seed = regionId.charCodeAt(0) + activeFilter.length;
    const level = seed % 4; 
    const densities = ['Low', 'Medium', 'High', 'Very High'];
    return densities[level];
  };

  const getFilterTitle = () => {
    switch(activeFilter) {
      case 'age': return `Age Group: ${userData.age || 'Unknown'}`;
      case 'marital': return `Status: ${userData.maritalStatus || 'Unknown'}`;
      case 'education': return `Education: ${userData.education || 'Unknown'}`;
      case 'gender': return `Gender: ${userData.gender || 'Unknown'}`;
      case 'ethnicity': return `Ethnicity: ${userData.ethnicity || 'Not Set'}`;
      case 'occupation': return `Occupation: ${userData.occupation || 'Not Set'}`;
      case 'ancestry': return `Ancestry: ${userData.ancestry || 'Not Set'}`;
      default: return 'Distribution';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b-4 border-blue-900 p-6 shadow-md z-10 shrink-0">
        <div className="flex items-center gap-4 mb-2">
          <Icons.Map size={isLarge ? 40 : 56} className="text-blue-800" />
          <h1 className={`font-bold text-slate-900 ${isLarge ? 'text-3xl' : 'text-4xl'}`}>
            Community Map
          </h1>
        </div>
        <p className={`text-slate-600 ${isLarge ? 'text-lg' : 'text-xl'}`}>
          See population distribution by category (HK TPUs).
        </p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Controls - Scrollable list of filters */}
        <div className="w-full md:w-80 lg:w-96 bg-white border-r border-slate-200 p-4 flex flex-col shadow-lg z-20 overflow-y-auto shrink-0">
          <div className={`font-bold text-slate-500 uppercase tracking-wider mb-4 ${isLarge ? 'text-lg' : 'text-xl'}`}>
            Filter By Personal Data:
          </div>
          
          <div className="flex flex-col gap-3 pb-24 lg:pb-0">
            <FilterButton 
              label="Age Group" 
              subLabel={`${userData.age || '?'} years`}
              active={activeFilter === 'age'} 
              onClick={() => setActiveFilter('age')} 
              icon={Icons.User}
              isLarge={isLarge}
            />
            <FilterButton 
              label="Gender" 
              subLabel={userData.gender || 'Not specified'}
              active={activeFilter === 'gender'} 
              onClick={() => setActiveFilter('gender')} 
              icon={Icons.User} // Using User icon for gender generic
              isLarge={isLarge}
            />
            <FilterButton 
              label="Marital Status" 
              subLabel={userData.maritalStatus || 'Not specified'}
              active={activeFilter === 'marital'} 
              onClick={() => setActiveFilter('marital')} 
              icon={Icons.Marital}
              isLarge={isLarge}
            />
            <FilterButton 
              label="Education" 
              subLabel={userData.education || 'Not specified'}
              active={activeFilter === 'education'} 
              onClick={() => setActiveFilter('education')} 
              icon={Icons.Education}
              isLarge={isLarge}
            />
             <FilterButton 
              label="Ethnicity" 
              subLabel={userData.ethnicity || 'Not specified'}
              active={activeFilter === 'ethnicity'} 
              onClick={() => setActiveFilter('ethnicity')} 
              icon={Icons.Ethnicity}
              isLarge={isLarge}
            />
             <FilterButton 
              label="Occupation" 
              subLabel={userData.occupation || 'Not specified'}
              active={activeFilter === 'occupation'} 
              onClick={() => setActiveFilter('occupation')} 
              icon={Icons.Job}
              isLarge={isLarge}
            />
             <FilterButton 
              label="Ancestry" 
              subLabel={userData.ancestry || 'Not specified'}
              active={activeFilter === 'ancestry'} 
              onClick={() => setActiveFilter('ancestry')} 
              icon={Icons.Ancestry}
              isLarge={isLarge}
            />

            <div className="mt-4 pt-4 border-t border-slate-100">
              <button
                onClick={onReset}
                className="w-full bg-yellow-100 hover:bg-yellow-200 text-yellow-900 border-2 border-yellow-400 rounded-xl p-4 flex items-center justify-center gap-3 transition-colors active:scale-95"
              >
                <Icons.Reset size={32} />
                <span className={`font-bold ${isLarge ? 'text-xl' : 'text-2xl'}`}>Back to Home</span>
              </button>
            </div>
          </div>
        </div>

        {/* Map Visualization Area */}
        <div className="flex-1 bg-slate-100 relative overflow-hidden flex flex-col h-full">
          {/* Overlay Stats */}
          <div className="absolute top-4 left-4 right-4 lg:left-8 lg:right-auto bg-white/90 backdrop-blur border-2 border-blue-100 p-4 rounded-xl shadow-lg z-10 max-w-md pointer-events-none">
            <div className="flex items-center gap-3 mb-2">
              <Icons.Chart className="text-blue-600" size={32} />
              <span className={`font-bold text-blue-900 ${isLarge ? 'text-xl' : 'text-2xl'}`}>
                {getFilterTitle()}
              </span>
            </div>
            <p className={`text-slate-600 leading-snug ${isLarge ? 'text-lg' : 'text-xl'}`}>
              Map showing estimated density.
            </p>
          </div>

          {/* SVG Map Container */}
          <div className="flex-1 p-4 flex items-center justify-center overflow-hidden">
            <svg 
              viewBox="0 0 400 500" 
              className="w-full h-full max-w-3xl drop-shadow-2xl"
              style={{ filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.1))', maxHeight: '100%' }}
              preserveAspectRatio="xMidYMid meet"
            >
              {HK_REGIONS.map(region => (
                <g key={region.id} className="transition-all duration-700 ease-in-out hover:opacity-90 cursor-pointer group">
                  <rect
                    x={region.x}
                    y={region.y}
                    width={region.width}
                    height={region.height}
                    rx="15"
                    className={`${getDensityColor(region.id)} stroke-white stroke-[3] transition-colors duration-500`}
                  />
                  {/* Region Label */}
                  <text
                    x={region.x + region.width / 2}
                    y={region.y + region.height / 2 - 10}
                    textAnchor="middle"
                    className="fill-current font-bold text-lg pointer-events-none"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
                  >
                    {region.name}
                  </text>
                  {/* Density Label */}
                  <text
                    x={region.x + region.width / 2}
                    y={region.y + region.height / 2 + 15}
                    textAnchor="middle"
                    className="fill-current text-sm uppercase tracking-widest font-semibold pointer-events-none opacity-80"
                  >
                    {getLabel(region.id)}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Legend */}
          <div className="p-4 bg-white border-t border-slate-200 flex justify-center gap-2 md:gap-8 flex-wrap shrink-0 z-20">
            <LegendItem color="bg-blue-100 border-blue-200" label="Low" />
            <LegendItem color="bg-blue-300 border-blue-400" label="Medium" />
            <LegendItem color="bg-blue-500 border-blue-600" label="High" />
            <LegendItem color="bg-blue-800 border-blue-900" label="Max" />
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterButton: React.FC<{ 
  label: string; 
  subLabel: string;
  active: boolean; 
  onClick: () => void; 
  icon: React.ElementType;
  isLarge: boolean;
}> = ({ label, subLabel, active, onClick, icon: Icon, isLarge }) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-3 rounded-xl border-4 transition-all duration-200 active:scale-95
      ${active 
        ? 'bg-blue-50 border-blue-800 shadow-inner' 
        : 'bg-white border-slate-100 hover:border-blue-200 shadow-sm'}
    `}
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-full shrink-0 ${active ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-500'}`}>
        <Icon size={isLarge ? 20 : 24} />
      </div>
      <div className="min-w-0">
        <div className={`font-bold text-slate-900 truncate ${isLarge ? 'text-lg' : 'text-xl'}`}>{label}</div>
        <div className={`text-slate-500 truncate ${isLarge ? 'text-sm' : 'text-base'}`}>{subLabel}</div>
      </div>
    </div>
  </button>
);

const LegendItem: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className={`w-5 h-5 rounded ${color} border-2 shadow-sm`}></div>
    <span className="text-slate-600 font-bold text-sm md:text-base">{label}</span>
  </div>
);