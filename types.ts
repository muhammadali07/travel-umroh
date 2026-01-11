
export type Role = 'JAMAAH' | 'ADMIN';

export interface TravelPackage {
  id: string;
  title: string;
  category: 'Umroh' | 'Haji';
  price: number;
  duration: string;
  hotelStar: number;
  description: string;
  image: string;
  isPopular?: boolean;
}

export interface RoadmapStep {
  title: string;
  description: string;
  icon: string;
}

export interface Prayer {
  id: string;
  category: 'Umroh' | 'Haji' | 'Umum';
  title: string;
  arabic: string;
  latin: string;
  translation: string;
}

export interface Lead {
  id: string;
  packageId: string;
  packageName: string;
  fullName: string;
  whatsappNumber: string;
  numberOfPax: number;
  hasPassport: 'YES' | 'NO' | 'EXPIRED';
  isFirstTime: boolean;
  roomPreference: 'QUAD' | 'TRIPLE' | 'DOUBLE';
  healthNotes?: string;
  status: 'Pending' | 'FollowedUp' | 'Completed';
  checkoutCode: string;
  createdAt: string;
}
