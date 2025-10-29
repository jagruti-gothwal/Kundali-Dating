import { KundaliData, CompatibilityScore } from '../types';

// Simplified Kundali calculation based on birth details
export function calculateKundali(date: string, time: string): KundaliData {
  const birthDate = new Date(date);
  const day = birthDate.getDate();
  const month = birthDate.getMonth();
  
  // Simplified calculations (in real app, would use actual Vedic astrology calculations)
  const moonSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const nakshatras = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
  const yonis = ['Horse', 'Elephant', 'Sheep', 'Snake', 'Dog', 'Cat', 'Rat', 'Cow', 'Buffalo', 'Tiger', 'Deer', 'Monkey', 'Lion', 'Mongoose'];
  
  const moonSignIndex = (day + month) % 12;
  const nakshatraIndex = (day * 3 + month * 2) % 27;
  const ganaIndex = nakshatraIndex % 3;
  const nadiIndex = nakshatraIndex % 3;
  const varnaIndex = moonSignIndex % 4;
  const yoniIndex = nakshatraIndex % 14;
  
  return {
    moonSign: moonSigns[moonSignIndex],
    nakshatra: nakshatras[nakshatraIndex],
    rashi: moonSigns[moonSignIndex],
    gana: ganaIndex === 0 ? 'Deva' : ganaIndex === 1 ? 'Manushya' : 'Rakshasa',
    nadi: nadiIndex === 0 ? 'Adi' : nadiIndex === 1 ? 'Madhya' : 'Antya',
    varna: varnaIndex === 0 ? 'Brahmin' : varnaIndex === 1 ? 'Kshatriya' : varnaIndex === 2 ? 'Vaishya' : 'Shudra',
    yoni: yonis[yoniIndex],
    tara: (nakshatraIndex % 9) + 1
  };
}

// Gun Milan - 36 point compatibility system
export function calculateCompatibility(user1Kundali: KundaliData, user2Kundali: KundaliData): CompatibilityScore {
  let varna = 0;
  let vashya = 0;
  let tara = 0;
  let yoni = 0;
  let grahaMaitri = 0;
  let gana = 0;
  let bhakoot = 0;
  let nadi = 0;
  
  // Varna (1 point)
  const varnaOrder = ['Brahmin', 'Kshatriya', 'Vaishya', 'Shudra'];
  if (varnaOrder.indexOf(user1Kundali.varna) >= varnaOrder.indexOf(user2Kundali.varna)) {
    varna = 1;
  }
  
  // Vashya (2 points)
  vashya = Math.random() > 0.3 ? 2 : 0;
  
  // Tara (3 points)
  const taraDiff = Math.abs(user1Kundali.tara - user2Kundali.tara);
  tara = taraDiff <= 2 ? 3 : taraDiff <= 4 ? 1.5 : 0;
  
  // Yoni (4 points)
  if (user1Kundali.yoni === user2Kundali.yoni) {
    yoni = 4;
  } else {
    yoni = Math.random() > 0.5 ? 2 : 0;
  }
  
  // Graha Maitri (5 points)
  if (user1Kundali.moonSign === user2Kundali.moonSign) {
    grahaMaitri = 5;
  } else {
    grahaMaitri = Math.floor(Math.random() * 4) + 1;
  }
  
  // Gana (6 points)
  if (user1Kundali.gana === user2Kundali.gana) {
    gana = 6;
  } else if (
    (user1Kundali.gana === 'Deva' && user2Kundali.gana === 'Manushya') ||
    (user1Kundali.gana === 'Manushya' && user2Kundali.gana === 'Deva')
  ) {
    gana = 3;
  } else {
    gana = 0;
  }
  
  // Bhakoot (7 points)
  const rashiSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const rashi1Index = rashiSigns.indexOf(user1Kundali.rashi);
  const rashi2Index = rashiSigns.indexOf(user2Kundali.rashi);
  const rashiDiff = Math.abs(rashi1Index - rashi2Index);
  
  if (rashiDiff === 6 || rashiDiff === 0 || rashiDiff === 8) {
    bhakoot = 0;
  } else {
    bhakoot = 7;
  }
  
  // Nadi (8 points) - Most important
  if (user1Kundali.nadi !== user2Kundali.nadi) {
    nadi = 8;
  } else {
    nadi = 0;
  }
  
  const total = varna + vashya + tara + yoni + grahaMaitri + gana + bhakoot + nadi;
  
  let recommendation: 'Excellent' | 'Good' | 'Average' | 'Poor';
  if (total >= 28) recommendation = 'Excellent';
  else if (total >= 20) recommendation = 'Good';
  else if (total >= 12) recommendation = 'Average';
  else recommendation = 'Poor';
  
  return {
    total,
    maxPoints: 36,
    varna,
    vashya,
    tara,
    yoni,
    grahaMaitri,
    gana,
    bhakoot,
    nadi,
    recommendation
  };
}

export function getCompatibilityColor(score: number): string {
  const percentage = (score / 36) * 100;
  if (percentage >= 75) return 'text-green-600';
  if (percentage >= 55) return 'text-blue-600';
  if (percentage >= 35) return 'text-yellow-600';
  return 'text-red-600';
}

export function getCompatibilityBgColor(score: number): string {
  const percentage = (score / 36) * 100;
  if (percentage >= 75) return 'bg-green-50 border-green-200';
  if (percentage >= 55) return 'bg-blue-50 border-blue-200';
  if (percentage >= 35) return 'bg-yellow-50 border-yellow-200';
  return 'bg-red-50 border-red-200';
}
