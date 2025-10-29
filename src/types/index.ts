export interface BirthDetails {
  date: string;
  time: string;
  place: string;
  latitude?: number;
  longitude?: number;
}

export interface KundaliData {
  moonSign: string;
  nakshatra: string;
  rashi: string;
  gana: 'Deva' | 'Manushya' | 'Rakshasa';
  nadi: 'Adi' | 'Madhya' | 'Antya';
  varna: 'Brahmin' | 'Kshatriya' | 'Vaishya' | 'Shudra';
  yoni: string;
  tara: number;
}

export interface CompatibilityScore {
  total: number;
  maxPoints: 36;
  varna: number;
  vashya: number;
  tara: number;
  yoni: number;
  grahaMaitri: number;
  gana: number;
  bhakoot: number;
  nadi: number;
  recommendation: 'Excellent' | 'Good' | 'Average' | 'Poor';
}

export interface User {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  photos: string[];
  bio: string;
  location: string;
  education: string;
  profession: string;
  height: string;
  birthDetails: BirthDetails;
  kundali: KundaliData;
  interests: string[];
}

export interface Match {
  user: User;
  compatibility: CompatibilityScore;
  matchedAt: Date;
  chatId: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  read: boolean;
}

export interface Chat {
  id: string;
  match: Match;
  messages: Message[];
  lastMessage?: Message;
}
