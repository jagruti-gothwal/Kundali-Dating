import React, { useState } from 'react';
import { User2, Calendar, Clock, MapPin, Briefcase, GraduationCap, Heart, Sparkles } from 'lucide-react';
import { BirthDetails } from '../types';

interface ProfileSetupProps {
  onComplete: (profileData: ProfileData) => Promise<void>;
}

export interface ProfileData {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  bio: string;
  location: string;
  education: string;
  profession: string;
  height: string;
  birthDetails: BirthDetails;
  interests: string[];
}

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<ProfileData>({
    name: '',
    age: 25,
    gender: 'male',
    bio: '',
    location: '',
    education: '',
    profession: '',
    height: '',
    birthDetails: {
      date: '',
      time: '',
      place: ''
    },
    interests: []
  });

  const predefinedInterests = [
    'Travel', 'Music', 'Cooking', 'Yoga', 'Cricket', 'Photography', 
    'Fitness', 'Dance', 'Reading', 'Spirituality', 'Art', 'Movies',
    'Adventure', 'Meditation', 'Food', 'Technology', 'Fashion', 'Sports'
  ];

  const handleInterestToggle = (interest: string) => {
    if (formData.interests.includes(interest)) {
      setFormData({
        ...formData,
        interests: formData.interests.filter(i => i !== interest)
      });
    } else if (formData.interests.length < 6) {
      setFormData({
        ...formData,
        interests: [...formData.interests, interest]
      });
    }
  };

  const handleNext = () => {
    if (step === 1 && !formData.name) {
      setError('Please enter your name');
      return;
    }
    if (step === 2 && (!formData.birthDetails.date || !formData.birthDetails.time || !formData.birthDetails.place)) {
      setError('Please fill all birth details');
      return;
    }
    if (step === 3 && !formData.bio) {
      setError('Please write a short bio');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (formData.interests.length === 0) {
      setError('Please select at least one interest');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await onComplete(formData);
    } catch (err: any) {
      setError(err.message || 'Failed to create profile');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Step {step} of 4</span>
            <span className="text-gray-600">{Math.round((step / 4) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User2 className="w-12 h-12 mx-auto mb-3 text-pink-500" />
              <h2 className="mb-2">Basic Information</h2>
              <p className="text-gray-600">Tell us about yourself</p>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Age *</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                  min="18"
                  max="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Gender *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="City, Country"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Profession</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    placeholder="Your profession"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Education</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    placeholder="Your education"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Height</label>
              <input
                type="text"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                placeholder="e.g., 5'10&quot;"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>
        )}

        {/* Step 2: Birth Details */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Sparkles className="w-12 h-12 mx-auto mb-3 text-pink-500" />
              <h2 className="mb-2">Birth Details</h2>
              <p className="text-gray-600">Required for Kundali matching</p>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Date of Birth *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.birthDetails.date}
                  onChange={(e) => setFormData({
                    ...formData,
                    birthDetails: { ...formData.birthDetails, date: e.target.value }
                  })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Time of Birth *</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="time"
                  value={formData.birthDetails.time}
                  onChange={(e) => setFormData({
                    ...formData,
                    birthDetails: { ...formData.birthDetails, time: e.target.value }
                  })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                />
              </div>
              <p className="text-gray-500 mt-1">Check your birth certificate for accurate time</p>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Place of Birth *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.birthDetails.place}
                  onChange={(e) => setFormData({
                    ...formData,
                    birthDetails: { ...formData.birthDetails, place: e.target.value }
                  })}
                  placeholder="City, State/Province"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-purple-900">
                💫 Your birth details are used to calculate your Kundali and find compatible matches based on Vedic astrology.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Bio */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Heart className="w-12 h-12 mx-auto mb-3 text-pink-500" />
              <h2 className="mb-2">About You</h2>
              <p className="text-gray-600">Tell others what makes you special</p>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Bio *</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Write a few lines about yourself, your interests, and what you're looking for..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 resize-none"
              />
              <p className="text-gray-500 mt-1">{formData.bio.length}/500 characters</p>
            </div>
          </div>
        )}

        {/* Step 4: Interests */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Sparkles className="w-12 h-12 mx-auto mb-3 text-pink-500" />
              <h2 className="mb-2">Your Interests</h2>
              <p className="text-gray-600">Select up to 6 interests</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {predefinedInterests.map((interest) => (
                <button
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  className={`px-4 py-2 rounded-full border-2 transition-colors ${
                    formData.interests.includes(interest)
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-transparent'
                      : 'border-gray-300 text-gray-700 hover:border-pink-300'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>

            <p className="text-gray-600">
              Selected: {formData.interests.length}/6
            </p>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-4 mt-8">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
          )}
          
          {step < 4 ? (
            <button
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-shadow"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50"
            >
              {loading ? 'Creating Profile...' : 'Complete Profile'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
