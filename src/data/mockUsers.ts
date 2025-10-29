import { User } from '../types';
import { calculateKundali } from '../utils/kundali';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    age: 26,
    gender: 'female',
    photos: ['https://images.unsplash.com/photo-1595231712612-754e8fe9d29b?w=800'],
    bio: 'Software engineer who loves traveling and classical music. Looking for someone who values family and tradition.',
    location: 'Mumbai, India',
    education: 'BTech in Computer Science',
    profession: 'Software Engineer',
    height: '5\'5"',
    birthDetails: {
      date: '1999-03-15',
      time: '08:30',
      place: 'Mumbai'
    },
    kundali: calculateKundali('1999-03-15', '08:30'),
    interests: ['Travel', 'Music', 'Cooking', 'Yoga']
  },
  {
    id: '2',
    name: 'Arjun Patel',
    age: 28,
    gender: 'male',
    photos: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800'],
    bio: 'Investment banker with a passion for cricket and photography. Family-oriented and seeking meaningful connection.',
    location: 'Bangalore, India',
    education: 'MBA from IIM',
    profession: 'Investment Banker',
    height: '5\'11"',
    birthDetails: {
      date: '1997-07-22',
      time: '14:15',
      place: 'Bangalore'
    },
    kundali: calculateKundali('1997-07-22', '14:15'),
    interests: ['Cricket', 'Photography', 'Finance', 'Fitness']
  },
  {
    id: '3',
    name: 'Ananya Reddy',
    age: 25,
    gender: 'female',
    photos: ['https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=800'],
    bio: 'Doctor and dance enthusiast. Believer in destiny and looking for my perfect match.',
    location: 'Hyderabad, India',
    education: 'MBBS',
    profession: 'Doctor',
    height: '5\'4"',
    birthDetails: {
      date: '2000-11-08',
      time: '18:45',
      place: 'Hyderabad'
    },
    kundali: calculateKundali('2000-11-08', '18:45'),
    interests: ['Dance', 'Healthcare', 'Reading', 'Spirituality']
  },
  {
    id: '4',
    name: 'Rohan Malhotra',
    age: 29,
    gender: 'male',
    photos: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800'],
    bio: 'Entrepreneur building sustainable solutions. Love adventure sports and meaningful conversations.',
    location: 'Delhi, India',
    education: 'BTech, Startup Founder',
    profession: 'Entrepreneur',
    height: '6\'0"',
    birthDetails: {
      date: '1996-05-30',
      time: '11:20',
      place: 'Delhi'
    },
    kundali: calculateKundali('1996-05-30', '11:20'),
    interests: ['Startups', 'Adventure', 'Reading', 'Meditation']
  },
  {
    id: '5',
    name: 'Kavya Iyer',
    age: 27,
    gender: 'female',
    photos: ['https://images.unsplash.com/photo-1601412436009-d964bd02edbc?w=800'],
    bio: 'Marketing professional who loves art and literature. Seeking someone with good values and sense of humor.',
    location: 'Chennai, India',
    education: 'Masters in Marketing',
    profession: 'Marketing Manager',
    height: '5\'6"',
    birthDetails: {
      date: '1998-09-12',
      time: '06:00',
      place: 'Chennai'
    },
    kundali: calculateKundali('1998-09-12', '06:00'),
    interests: ['Art', 'Literature', 'Travel', 'Food']
  },
  {
    id: '6',
    name: 'Aditya Singh',
    age: 30,
    gender: 'male',
    photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'],
    bio: 'Architect with love for heritage and design. Looking for a life partner to build dreams together.',
    location: 'Jaipur, India',
    education: 'BArch',
    profession: 'Architect',
    height: '5\'10"',
    birthDetails: {
      date: '1995-01-25',
      time: '16:30',
      place: 'Jaipur'
    },
    kundali: calculateKundali('1995-01-25', '16:30'),
    interests: ['Architecture', 'History', 'Travel', 'Music']
  },
  {
    id: '7',
    name: 'Ishita Gupta',
    age: 24,
    gender: 'female',
    photos: ['https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800'],
    bio: 'Teacher with a passion for making a difference. Love nature, books, and deep conversations.',
    location: 'Pune, India',
    education: 'BEd',
    profession: 'Teacher',
    height: '5\'3"',
    birthDetails: {
      date: '2001-04-18',
      time: '09:45',
      place: 'Pune'
    },
    kundali: calculateKundali('2001-04-18', '09:45'),
    interests: ['Teaching', 'Reading', 'Nature', 'Volunteering']
  },
  {
    id: '8',
    name: 'Vikram Chopra',
    age: 31,
    gender: 'male',
    photos: ['https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800'],
    bio: 'CA working in Big4. Family is everything to me. Looking for someone who shares similar values.',
    location: 'Kolkata, India',
    education: 'CA, BCom',
    profession: 'Chartered Accountant',
    height: '5\'9"',
    birthDetails: {
      date: '1994-12-03',
      time: '20:15',
      place: 'Kolkata'
    },
    kundali: calculateKundali('1994-12-03', '20:15'),
    interests: ['Finance', 'Family', 'Cricket', 'Movies']
  }
];

export const currentUser: User = {
  id: 'current',
  name: 'You',
  age: 27,
  gender: 'male',
  photos: ['https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=800'],
  bio: 'Tech professional who believes in the power of stars and compatibility.',
  location: 'Mumbai, India',
  education: 'BTech',
  profession: 'Product Manager',
  height: '5\'10"',
  birthDetails: {
    date: '1998-06-10',
    time: '12:00',
    place: 'Mumbai'
  },
  kundali: calculateKundali('1998-06-10', '12:00'),
  interests: ['Technology', 'Astrology', 'Fitness', 'Travel']
};
