import { projectId, publicAnonKey } from './supabase/info';
import { ProfileData } from '../components/ProfileSetup';
import { CompatibilityScore } from '../types';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-3a47c9c1`;

export async function signup(email: string, password: string) {
  const response = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to sign up');
  }
  
  return data;
}

export async function createProfile(accessToken: string, profileData: ProfileData) {
  const response = await fetch(`${API_URL}/profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify(profileData)
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to create profile');
  }
  
  return data;
}

export async function getProfile(accessToken: string) {
  const response = await fetch(`${API_URL}/profile`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (response.status === 404) {
    return null; // Profile doesn't exist yet
  }

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to get profile');
  }
  
  return data.profile;
}

export async function getProfiles(accessToken: string) {
  const response = await fetch(`${API_URL}/profiles`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to get profiles');
  }
  
  return data.profiles;
}

export async function recordLike(accessToken: string, targetUserId: string, compatibility: CompatibilityScore) {
  const response = await fetch(`${API_URL}/like`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({ targetUserId, compatibility })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to record like');
  }
  
  return data;
}

export async function getMatches(accessToken: string) {
  const response = await fetch(`${API_URL}/matches`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to get matches');
  }
  
  return data.matches;
}

export async function sendMessage(accessToken: string, matchId: string, text: string) {
  const response = await fetch(`${API_URL}/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({ matchId, text })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to send message');
  }
  
  return data.message;
}

export async function getMessages(accessToken: string, matchId: string) {
  const response = await fetch(`${API_URL}/messages/${matchId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to get messages');
  }
  
  return data.messages;
}
