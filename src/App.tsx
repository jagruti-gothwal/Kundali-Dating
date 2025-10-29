import React, { useState, useEffect } from 'react';
import { User, Match } from './types';
import { calculateCompatibility, calculateKundali } from './utils/kundali';
import { SwipeCard } from './components/SwipeCard';
import { ProfileDetailsModal } from './components/ProfileDetailsModal';
import { MatchesList } from './components/MatchesList';
import { ChatView } from './components/ChatView';
import { Navigation } from './components/Navigation';
import { ProfileView } from './components/ProfileView';
import { AuthScreen } from './components/AuthScreen';
import { ProfileSetup, ProfileData } from './components/ProfileSetup';
import { supabase } from './utils/supabase-client';
import * as api from './utils/api';
import { Sparkles, Loader2 } from 'lucide-react';

type AppState = 'loading' | 'auth' | 'setup' | 'app';

export default function App() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [currentView, setCurrentView] = useState<'browse' | 'matches' | 'chat' | 'profile'>('browse');
  const [profiles, setProfiles] = useState<User[]>([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<User | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        setAccessToken(session.access_token);
        
        // Check if user has a profile
        const profile = await api.getProfile(session.access_token);
        
        if (profile) {
          // Convert profile data to User format
          const user: User = {
            id: profile.userId,
            name: profile.name,
            age: profile.age,
            gender: profile.gender,
            photos: profile.photos || [],
            bio: profile.bio,
            location: profile.location,
            education: profile.education,
            profession: profile.profession,
            height: profile.height,
            birthDetails: profile.birthDetails,
            kundali: calculateKundali(profile.birthDetails.date, profile.birthDetails.time),
            interests: profile.interests
          };
          setCurrentUser(user);
          
          // Load profiles and matches
          await loadData(session.access_token, user);
          setAppState('app');
        } else {
          setAppState('setup');
        }
      } else {
        setAppState('auth');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setAppState('auth');
    }
  }

  async function loadData(token: string, user: User) {
    try {
      // Load available profiles
      const profilesData = await api.getProfiles(token);
      const formattedProfiles = profilesData.map((p: any) => ({
        id: p.userId,
        name: p.name,
        age: p.age,
        gender: p.gender,
        photos: p.photos || [],
        bio: p.bio,
        location: p.location,
        education: p.education,
        profession: p.profession,
        height: p.height,
        birthDetails: p.birthDetails,
        kundali: calculateKundali(p.birthDetails.date, p.birthDetails.time),
        interests: p.interests
      }));
      setProfiles(formattedProfiles);

      // Load matches
      const matchesData = await api.getMatches(token);
      const formattedMatches = matchesData.map((m: any) => ({
        user: {
          id: m.profile.userId,
          name: m.profile.name,
          age: m.profile.age,
          gender: m.profile.gender,
          photos: m.profile.photos || [],
          bio: m.profile.bio,
          location: m.profile.location,
          education: m.profile.education,
          profession: m.profile.profession,
          height: m.profile.height,
          birthDetails: m.profile.birthDetails,
          kundali: calculateKundali(m.profile.birthDetails.date, m.profile.birthDetails.time),
          interests: m.profile.interests
        },
        compatibility: m.compatibility,
        matchedAt: new Date(m.matchedAt),
        chatId: `match:${m.users.sort().join(':')}`
      }));
      setMatches(formattedMatches);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }

  async function handleLogin(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      throw new Error(error.message);
    }
    
    if (data.session) {
      setAccessToken(data.session.access_token);
      
      // Check if user has a profile
      const profile = await api.getProfile(data.session.access_token);
      
      if (profile) {
        const user: User = {
          id: profile.userId,
          name: profile.name,
          age: profile.age,
          gender: profile.gender,
          photos: profile.photos || [],
          bio: profile.bio,
          location: profile.location,
          education: profile.education,
          profession: profile.profession,
          height: profile.height,
          birthDetails: profile.birthDetails,
          kundali: calculateKundali(profile.birthDetails.date, profile.birthDetails.time),
          interests: profile.interests
        };
        setCurrentUser(user);
        await loadData(data.session.access_token, user);
        setAppState('app');
      } else {
        setAppState('setup');
      }
    }
  }

  async function handleSignup(email: string, password: string) {
    await api.signup(email, password);
    
    // After signup, sign them in
    await handleLogin(email, password);
  }

  async function handleProfileComplete(profileData: ProfileData) {
    if (!accessToken) return;
    
    // Calculate kundali
    const kundali = calculateKundali(profileData.birthDetails.date, profileData.birthDetails.time);
    
    // Create profile on server
    await api.createProfile(accessToken, {
      ...profileData,
      photos: ['https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=800'] // Default photo
    });
    
    // Create user object
    const { data: { user } } = await supabase.auth.getUser(accessToken);
    const userProfile: User = {
      id: user?.id || '',
      ...profileData,
      photos: ['https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=800'],
      kundali
    };
    
    setCurrentUser(userProfile);
    await loadData(accessToken, userProfile);
    setAppState('app');
  }

  const currentProfile = profiles[currentProfileIndex];
  const compatibility = currentProfile && currentUser
    ? calculateCompatibility(currentUser.kundali, currentProfile.kundali)
    : null;

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (direction === 'right' && currentProfile && compatibility && accessToken && currentUser) {
      try {
        // Record like on server
        const result = await api.recordLike(accessToken, currentProfile.id, compatibility);
        
        if (result.matched) {
          // It's a match! Add to matches list
          const newMatch: Match = {
            user: currentProfile,
            compatibility,
            matchedAt: new Date(),
            chatId: result.matchId
          };
          setMatches([...matches, newMatch]);
        }
      } catch (error) {
        console.error('Failed to record like:', error);
      }
    }

    // Move to next profile
    if (currentProfileIndex < profiles.length - 1) {
      setCurrentProfileIndex(currentProfileIndex + 1);
    } else {
      // Reset to beginning
      setCurrentProfileIndex(0);
    }
  };

  const handleViewDetails = () => {
    setSelectedProfile(currentProfile);
  };

  const handleCloseDetails = () => {
    setSelectedProfile(null);
  };

  const handleLikeFromDetails = () => {
    handleSwipe('right');
    setSelectedProfile(null);
  };

  const handleSelectMatch = (match: Match) => {
    setSelectedMatch(match);
    setCurrentView('chat');
  };

  const handleBackFromChat = () => {
    setCurrentView('matches');
    setSelectedMatch(null);
  };

  const handleViewProfileFromChat = () => {
    if (selectedMatch) {
      setSelectedProfile(selectedMatch.user);
    }
  };

  // Loading state
  if (appState === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-pink-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Auth screen
  if (appState === 'auth') {
    return <AuthScreen onLogin={handleLogin} onSignup={handleSignup} />;
  }

  // Profile setup
  if (appState === 'setup') {
    return <ProfileSetup onComplete={handleProfileComplete} />;
  }

  // Main app
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      {currentView !== 'chat' && (
        <div className="bg-white border-b shadow-sm sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-pink-500" />
              <h1 className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Kundali Match
              </h1>
            </div>
            <p className="text-center text-gray-600 mt-1">Find your perfect match through the stars</p>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="pb-20">
        {currentView === 'browse' && (
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
            {currentProfile && compatibility ? (
              <SwipeCard 
                user={currentProfile}
                compatibility={compatibility}
                onSwipe={handleSwipe}
                onViewDetails={handleViewDetails}
              />
            ) : (
              <div className="text-center">
                <h3 className="text-gray-600 mb-2">No more profiles</h3>
                <p className="text-gray-500">Check back later for new matches!</p>
              </div>
            )}
          </div>
        )}

        {currentView === 'matches' && (
          <MatchesList 
            matches={matches}
            onSelectMatch={handleSelectMatch}
          />
        )}

        {currentView === 'chat' && selectedMatch && (
          <ChatView 
            match={selectedMatch}
            onBack={handleBackFromChat}
            onViewProfile={handleViewProfileFromChat}
          />
        )}

        {currentView === 'profile' && currentUser && (
          <ProfileView user={currentUser} />
        )}
      </div>

      {/* Navigation */}
      {currentView !== 'chat' && (
        <Navigation 
          currentView={currentView}
          onNavigate={setCurrentView}
          matchCount={matches.length}
        />
      )}

      {/* Profile details modal */}
      {selectedProfile && compatibility && (
        <ProfileDetailsModal 
          user={selectedProfile}
          compatibility={currentView === 'chat' && selectedMatch 
            ? selectedMatch.compatibility 
            : compatibility}
          onClose={handleCloseDetails}
          onLike={handleLikeFromDetails}
        />
      )}
    </div>
  );
}
