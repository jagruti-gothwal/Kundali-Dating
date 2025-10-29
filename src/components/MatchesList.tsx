import React from 'react';
import { Match } from '../types';
import { Star, MessageCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MatchesListProps {
  matches: Match[];
  onSelectMatch: (match: Match) => void;
}

export function MatchesList({ matches, onSelectMatch }: MatchesListProps) {
  const getCompatibilityColor = (score: number) => {
    const percentage = (score / 36) * 100;
    if (percentage >= 75) return 'text-green-600 bg-green-50';
    if (percentage >= 55) return 'text-blue-600 bg-blue-50';
    if (percentage >= 35) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="mb-6">Your Matches</h2>
      
      {matches.length === 0 ? (
        <div className="text-center py-20">
          <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-600 mb-2">No matches yet</h3>
          <p className="text-gray-500">Start swiping to find your perfect Kundali match!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map((match) => {
            const compatibilityPercentage = Math.round((match.compatibility.total / match.compatibility.maxPoints) * 100);
            
            return (
              <div 
                key={match.user.id}
                onClick={() => onSelectMatch(match)}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden"
              >
                <div className="flex gap-4 p-4">
                  <div className="relative flex-shrink-0">
                    <ImageWithFallback 
                      src={match.user.photos[0]} 
                      alt={match.user.name}
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                    <div className={`absolute -top-2 -right-2 w-12 h-12 rounded-full ${getCompatibilityColor(match.compatibility.total)} flex items-center justify-center shadow-lg`}>
                      <span>{compatibilityPercentage}%</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="truncate">{match.user.name}, {match.user.age}</h3>
                    <p className="text-gray-600 mb-2">{match.user.location}</p>
                    
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                      <Star className="w-4 h-4" />
                      <span>{match.compatibility.total}/{match.compatibility.maxPoints} Gun Milan</span>
                    </div>
                    
                    <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:shadow-md transition-shadow">
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>
                
                <div className="px-4 pb-4">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-100">
                    <div className="flex items-center justify-between text-purple-900">
                      <span>Match Quality:</span>
                      <strong>{match.compatibility.recommendation}</strong>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
