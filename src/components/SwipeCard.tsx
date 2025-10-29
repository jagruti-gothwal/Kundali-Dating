import React, { useState } from 'react';
import { User, CompatibilityScore } from '../types';
import { Heart, X, Star, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SwipeCardProps {
  user: User;
  compatibility: CompatibilityScore;
  onSwipe: (direction: 'left' | 'right') => void;
  onViewDetails: () => void;
}

export function SwipeCard({ user, compatibility, onSwipe, onViewDetails }: SwipeCardProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  
  const compatibilityPercentage = Math.round((compatibility.total / compatibility.maxPoints) * 100);
  
  const getCompatibilityColor = () => {
    if (compatibilityPercentage >= 75) return 'bg-gradient-to-r from-green-500 to-emerald-500';
    if (compatibilityPercentage >= 55) return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    if (compatibilityPercentage >= 35) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    return 'bg-gradient-to-r from-red-500 to-pink-500';
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setDragOffset(e.movementX);
    }
  };

  const handleMouseUp = () => {
    if (Math.abs(dragOffset) > 100) {
      onSwipe(dragOffset > 0 ? 'right' : 'left');
    }
    setIsDragging(false);
    setDragOffset(0);
  };

  return (
    <div 
      className="relative w-full max-w-md h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing"
      style={{ transform: `translateX(${dragOffset}px) rotate(${dragOffset / 20}deg)` }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Photo */}
      <div className="relative h-[400px]">
        <ImageWithFallback 
          src={user.photos[currentPhotoIndex]} 
          alt={user.name}
          className="w-full h-full object-cover"
        />
        
        {/* Photo indicators */}
        <div className="absolute top-4 left-0 right-0 flex gap-1 px-4">
          {user.photos.map((_, index) => (
            <div 
              key={index} 
              className={`flex-1 h-1 rounded ${index === currentPhotoIndex ? 'bg-white' : 'bg-white/40'}`}
              onClick={() => setCurrentPhotoIndex(index)}
            />
          ))}
        </div>
        
        {/* Compatibility badge */}
        <div className="absolute top-4 right-4">
          <div className={`${getCompatibilityColor()} text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg`}>
            <Star className="w-4 h-4 fill-current" />
            <span>{compatibilityPercentage}% Match</span>
          </div>
        </div>

        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Info section */}
      <div className="p-6 space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-white">{user.name}, {user.age}</h2>
          </div>
          <div className="flex items-center gap-4 mt-2 text-gray-400">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{user.location}</span>
            </div>
          </div>
        </div>

        <p className="text-gray-300 line-clamp-2">{user.bio}</p>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 text-gray-400">
            <Briefcase className="w-4 h-4" />
            <span>{user.profession}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <GraduationCap className="w-4 h-4" />
            <span>{user.education.split(',')[0]}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-6 pt-4">
          <button 
            onClick={() => onSwipe('left')}
            className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <X className="w-8 h-8 text-red-500" />
          </button>
          
          <button 
            onClick={onViewDetails}
            className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Star className="w-6 h-6 text-blue-500" />
          </button>
          
          <button 
            onClick={() => onSwipe('right')}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Heart className="w-8 h-8 text-white fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
}
