export interface SubService {
  name: string;
  description?: string;
}

export interface ServiceCategory {
  id: string;
  number: string;
  name: string;
  description: string;
  longDescription: string;
  image: string;
  startingPrice: string;
  subservices: SubService[];
  popular?: boolean;
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  subServiceName: string;
  customerName: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  address: string;
  instructions?: string;
  status: 'pending' | 'dispatched' | 'completed' | 'cancelled';
  technician?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface UserState {
  isAuthenticated: boolean;
  email: string;
  fullName: string;
  loginMethod: 'email' | 'google' | null;
  twoFactorVerified: boolean;
  faceBiometricVerified: boolean;
}
