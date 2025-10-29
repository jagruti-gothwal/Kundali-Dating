import React from 'react';
import { Flame, Star, MessageCircle, User } from 'lucide-react';

interface NavigationProps {
  currentView: 'browse' | 'matches' | 'profile';
  onNavigate: (view: 'browse' | 'matches' | 'profile') => void;
  matchCount: number;
}

export function Navigation({ currentView, onNavigate, matchCount }: NavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
      <div className="max-w-md mx-auto flex items-center justify-around py-3">
        <button 
          onClick={() => onNavigate('browse')}
          className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-colors ${
            currentView === 'browse' ? 'text-pink-500' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Flame className={`w-6 h-6 ${currentView === 'browse' ? 'fill-current' : ''}`} />
          <span>Browse</span>
        </button>
        
        <button 
          onClick={() => onNavigate('matches')}
          className={`relative flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-colors ${
            currentView === 'matches' ? 'text-pink-500' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Star className={`w-6 h-6 ${currentView === 'matches' ? 'fill-current' : ''}`} />
          <span>Matches</span>
          {matchCount > 0 && (
            <div className="absolute -top-1 right-2 w-5 h-5 bg-pink-500 text-white rounded-full flex items-center justify-center">
              {matchCount}
            </div>
          )}
        </button>
        
        <button 
          onClick={() => onNavigate('profile')}
          className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-colors ${
            currentView === 'profile' ? 'text-pink-500' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <User className={`w-6 h-6 ${currentView === 'profile' ? 'fill-current' : ''}`} />
          <span>Profile</span>
        </button>
      </div>
    </div>
  );
}
