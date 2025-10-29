import React from 'react';
import { User, CompatibilityScore } from '../types';
import { X, MapPin, Briefcase, GraduationCap, Heart, Star, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProfileDetailsModalProps {
  user: User;
  compatibility: CompatibilityScore;
  onClose: () => void;
  onLike: () => void;
}

export function ProfileDetailsModal({ user, compatibility, onClose, onLike }: ProfileDetailsModalProps) {
  const compatibilityPercentage = Math.round((compatibility.total / compatibility.maxPoints) * 100);
  
  const gunMilanDetails = [
    { name: 'Varna', score: compatibility.varna, max: 1, description: 'Spiritual compatibility' },
    { name: 'Vashya', score: compatibility.vashya, max: 2, description: 'Mutual attraction' },
    { name: 'Tara', score: compatibility.tara, max: 3, description: 'Health & well-being' },
    { name: 'Yoni', score: compatibility.yoni, max: 4, description: 'Intimacy & nature' },
    { name: 'Graha Maitri', score: compatibility.grahaMaitri, max: 5, description: 'Mental compatibility' },
    { name: 'Gana', score: compatibility.gana, max: 6, description: 'Temperament match' },
    { name: 'Bhakoot', score: compatibility.bhakoot, max: 7, description: 'Love & affection' },
    { name: 'Nadi', score: compatibility.nadi, max: 8, description: 'Health of progeny' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with photo */}
        <div className="relative h-80">
          <ImageWithFallback 
            src={user.photos[0]} 
            alt={user.name}
            className="w-full h-full object-cover"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <h2 className="text-white">{user.name}, {user.age}</h2>
            <div className="flex items-center gap-2 text-white/90 mt-1">
              <MapPin className="w-4 h-4" />
              <span>{user.location}</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Compatibility score */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-purple-600" />
                  <h3 className="text-purple-900">Kundali Match Score</h3>
                </div>
                <p className="text-purple-600 mt-1">Gun Milan Compatibility</p>
              </div>
              <div className="text-right">
                <div className="text-purple-900">{compatibility.total}/{compatibility.maxPoints}</div>
                <div className="text-purple-600">{compatibilityPercentage}%</div>
              </div>
            </div>
            
            <div className="bg-white/60 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span className="text-purple-900">Recommendation: <strong>{compatibility.recommendation}</strong></span>
              </div>
            </div>
          </div>

          {/* Detailed compatibility breakdown */}
          <div>
            <h3 className="mb-3">Compatibility Breakdown</h3>
            <div className="space-y-3">
              {gunMilanDetails.map((detail) => (
                <div key={detail.name} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div>{detail.name}</div>
                      <p className="text-gray-600">{detail.description}</p>
                    </div>
                    <div className="text-right">
                      <span className={detail.score === detail.max ? 'text-green-600' : detail.score > detail.max / 2 ? 'text-blue-600' : 'text-gray-600'}>
                        {detail.score}/{detail.max}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${detail.score === detail.max ? 'bg-green-500' : detail.score > detail.max / 2 ? 'bg-blue-500' : 'bg-gray-400'}`}
                      style={{ width: `${(detail.score / detail.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="mb-2">About</h3>
            <p className="text-gray-700">{user.bio}</p>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Briefcase className="w-4 h-4" />
                <span>Profession</span>
              </div>
              <div>{user.profession}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <GraduationCap className="w-4 h-4" />
                <span>Education</span>
              </div>
              <div>{user.education}</div>
            </div>
          </div>

          {/* Kundali details */}
          <div>
            <h3 className="mb-3">Birth Chart Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
                <div className="text-orange-600 mb-1">Moon Sign</div>
                <div className="text-orange-900">{user.kundali.moonSign}</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
                <div className="text-orange-600 mb-1">Nakshatra</div>
                <div className="text-orange-900">{user.kundali.nakshatra}</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
                <div className="text-orange-600 mb-1">Gana</div>
                <div className="text-orange-900">{user.kundali.gana}</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
                <div className="text-orange-600 mb-1">Nadi</div>
                <div className="text-orange-900">{user.kundali.nadi}</div>
              </div>
            </div>
          </div>

          {/* Interests */}
          <div>
            <h3 className="mb-2">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest) => (
                <span key={interest} className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full border border-purple-200">
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Action button */}
          <button 
            onClick={onLike}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-2xl flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
          >
            <Heart className="w-5 h-5 fill-current" />
            <span>Like {user.name}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
