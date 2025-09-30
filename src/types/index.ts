export type UserRole = 'customer' | 'provider';

export type ProviderLevel = 1 | 2 | 3;

export type SubscriptionPlan = 'none' | 'bronze' | 'silver' | 'gold';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  zipCode: string;
  city: string;
  state: string;
  profileImage?: string;
  createdAt: string;
}

export interface Provider extends User {
  role: 'provider';
  businessName: string;
  services: string[];
  priceRange: {
    min: number;
    max: number;
  };
  rating: number;
  reviewCount: number;
  level: ProviderLevel;
  isVerified: boolean;
  hasInsurance: boolean;
  portfolio: string[];
  bio: string;
  experience: string;
  subscriptionPlan: SubscriptionPlan;
  availableLeads: number;
  completedJobs: number;
  bonusLeads: number;
  customerRating?: number;
}

export interface Customer extends User {
  role: 'customer';
  requestsCount: number;
  rating?: number;
  reviewCount?: number;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  icon: string;
}

export interface ServiceRequest {
  id: string;
  customerId: string;
  serviceId: string;
  serviceName: string;
  description: string;
  zipCode: string;
  city: string;
  state: string;
  budget?: {
    min: number;
    max: number;
  };
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  scheduledDate?: string;
}

export interface Review {
  id: string;
  providerId: string;
  customerId: string;
  customerName: string;
  customerImage?: string;
  rating: number;
  comment: string;
  createdAt: string;
  serviceType: string;
  providerResponse?: string;
  disputed: boolean;
  disputeEvidence?: DisputeEvidence;
  reviewerType: 'customer' | 'provider';
}

export interface DisputeEvidence {
  id: string;
  reviewId: string;
  providerId: string;
  description: string;
  attachments: DisputeAttachment[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface DisputeAttachment {
  id: string;
  type: 'message' | 'audio' | 'image' | 'document';
  fileName: string;
  fileUrl: string;
}

export interface GamificationReward {
  id: string;
  providerId: string;
  rewardType: '7reviews_4stars' | '10reviews_5stars';
  bonusLeads: number;
  awardedAt: string;
  expiresAt?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  originalLanguage: string;
  translatedText?: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: {
    customer: Customer;
    provider: Provider;
  };
  lastMessage: Message;
  unreadCount: number;
  serviceRequest: ServiceRequest;
}

export interface Lead {
  id: string;
  serviceRequest: ServiceRequest;
  customer: Customer;
  price: number;
  status: 'available' | 'purchased' | 'expired';
  createdAt: string;
}

export interface FilterOptions {
  serviceType?: string;
  minRating?: number;
  maxDistance?: number;
  priceRange?: {
    min: number;
    max: number;
  };
  city?: string;
  state?: string;
  verifiedOnly?: boolean;
  providerLevel?: ProviderLevel;
}

export type Language = 'en' | 'pt-BR' | 'pt-PT' | 'es' | 'zh-CN' | 'zh-HK' | 'tl' | 'ar' | 'vi';