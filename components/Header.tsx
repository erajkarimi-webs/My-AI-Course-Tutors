
import React from 'react';
import { WaterDropIcon } from './Icons';

interface HeaderProps {
  onNewSession: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNewSession }) => {
  return (
    <header className="flex items-center justify-between p-3 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 h-16 shadow-lg">
      <div className="flex items-center gap-3">
        <WaterDropIcon className="h-8 w-8 text-blue-400" />
        <h1 className="text-xl font-bold text-gray-100 tracking-tight">Hydraulics AI Tutor</h1>
      </div>
      <button 
        onClick={onNewSession}
        className="px-4 py-2 text-sm font-semibold text-gray-200 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      >
        New Session
      </button>
    </header>
  );
};
