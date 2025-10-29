import React from 'react';
import { User } from '../types';
import { Settings, MapPin, Briefcase, GraduationCap, Star, Calendar, Clock, Edit, LogOut } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { supabase } from '../utils/supabase-client';

interface ProfileViewProps {
  user: User;
}

export function ProfileView({ user }: ProfileViewProps) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h2>My Profile</h2>
        <div className="flex gap-2">
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Profile photo */}
      <div className="relative w-full aspect-square max-w-md mx-auto mb-6 rounded-3xl overflow-hidden">
        <ImageWithFallback 
          src={user.photos[0]} 
          alt={user.name}
          className="w-full h-full object-cover"
        />
        <button className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg">
          <Edit className="w-5 h-5 text-pink-500" />
        </button>
      </div>

      {/* Basic info */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
        <h3 className="mb-4">{user.name}, {user.age}</h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-700">
            <MapPin className="w-5 h-5 text-gray-400" />
            <span>{user.location}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Briefcase className="w-5 h-5 text-gray-400" />
            <span>{user.profession}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <GraduationCap className="w-5 h-5 text-gray-400" />
            <span>{user.education}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <p className="text-gray-700">{user.bio}</p>
        </div>
      </div>

      {/* Birth details */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
        <h3 className="mb-4">Birth Details</h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-700">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-gray-500">Date of Birth</div>
              <div>{new Date(user.birthDetails.date).toLocaleDateString('en-IN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Clock className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-gray-500">Time of Birth</div>
              <div>{user.birthDetails.time}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <MapPin className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-gray-500">Place of Birth</div>
              <div>{user.birthDetails.place}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Kundali details */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl shadow-md p-6 border border-orange-100 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-orange-600" />
          <h3 className="text-orange-900">My Kundali</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/60 rounded-xl p-3">
            <div className="text-orange-600 mb-1">Moon Sign</div>
            <div className="text-orange-900">{user.kundali.moonSign}</div>
          </div>
          <div className="bg-white/60 rounded-xl p-3">
            <div className="text-orange-600 mb-1">Nakshatra</div>
            <div className="text-orange-900">{user.kundali.nakshatra}</div>
          </div>
          <div className="bg-white/60 rounded-xl p-3">
            <div className="text-orange-600 mb-1">Rashi</div>
            <div className="text-orange-900">{user.kundali.rashi}</div>
          </div>
          <div className="bg-white/60 rounded-xl p-3">
            <div className="text-orange-600 mb-1">Gana</div>
            <div className="text-orange-900">{user.kundali.gana}</div>
          </div>
          <div className="bg-white/60 rounded-xl p-3">
            <div className="text-orange-600 mb-1">Nadi</div>
            <div className="text-orange-900">{user.kundali.nadi}</div>
          </div>
          <div className="bg-white/60 rounded-xl p-3">
            <div className="text-orange-600 mb-1">Varna</div>
            <div className="text-orange-900">{user.kundali.varna}</div>
          </div>
          <div className="bg-white/60 rounded-xl p-3">
            <div className="text-orange-600 mb-1">Yoni</div>
            <div className="text-orange-900">{user.kundali.yoni}</div>
          </div>
          <div className="bg-white/60 rounded-xl p-3">
            <div className="text-orange-600 mb-1">Tara</div>
            <div className="text-orange-900">{user.kundali.tara}</div>
          </div>
        </div>
      </div>

      {/* Interests */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="mb-3">Interests</h3>
        <div className="flex flex-wrap gap-2">
          {user.interests.map((interest) => (
            <span key={interest} className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full border border-purple-200">
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
