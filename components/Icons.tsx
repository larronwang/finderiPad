
import React from 'react';
import { 
  User, 
  CreditCard, 
  MapPin, 
  Phone, 
  BookOpen, 
  Users, 
  Briefcase, 
  Home, 
  CheckCircle, 
  Mic, 
  ZoomIn, 
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Save,
  RotateCcw,
  Map as MapIcon,
  Filter,
  BarChart3,
  Flag,
  Globe,
  Heart,
  Search
} from 'lucide-react';

export const Icons = {
  User,
  // Add Users icon to avoid property access error in CensusMap.tsx
  Users,
  ID: CreditCard,
  Address: MapPin,
  Phone,
  Education: BookOpen,
  Marital: Users,
  Job: Briefcase,
  Home,
  Check: CheckCircle,
  Mic,
  ZoomIn,
  ZoomOut,
  Back: ChevronLeft,
  Next: ChevronRight,
  Save,
  Reset: RotateCcw,
  Map: MapIcon,
  Filter,
  Chart: BarChart3,
  Ethnicity: Flag,
  Ancestry: Globe,
  Hobby: Heart,
  Search
};

export const FinderLogo = ({ className = "w-16 h-16" }: { className?: string }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <div className="absolute inset-0 bg-indigo-600 rounded-2xl rotate-6 opacity-20 animate-pulse"></div>
    <div className="absolute inset-0 bg-indigo-500 rounded-2xl -rotate-3 opacity-40"></div>
    <div className="relative bg-indigo-900 rounded-2xl w-full h-full flex items-center justify-center shadow-xl shadow-indigo-200 border border-indigo-400/30">
      <Search className="text-white w-1/2 h-1/2" strokeWidth={3} />
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-indigo-900 animate-bounce"></div>
    </div>
  </div>
);
