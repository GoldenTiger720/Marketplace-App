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
  backgroundCheckStatus: BackgroundCheckStatus;
  backgroundCheckDate?: string;
  profileActivated: boolean;
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

export interface LeadPackage {
  id: string;
  name: string;
  leadsCount: number;
  price: number;
  duration: 'single' | 'weekly' | 'monthly';
  savingsPercentage?: number;
}

export interface LeadPurchase {
  id: string;
  providerId: string;
  packageId: string;
  leadsCount: number;
  totalPrice: number;
  purchasedAt: string;
  expiresAt?: string;
}

export interface SubscriptionFeatures {
  featuredTimesPerWeek: number;
  priorityInSearch: boolean;
  highlightedProfile: boolean;
  analyticsAccess: boolean;
  customerSupportLevel: 'basic' | 'priority' | 'premium';
  price: number;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account';
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  amount: number;
  currency: 'USD';
  type: 'lead_purchase' | 'subscription' | 'verification';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethodId: string;
  description: string;
  createdAt: string;
}

export type PaymentGateway = 'stripe' | 'braintree';

export type BackgroundCheckStatus =
  | 'pending'
  | 'in_progress'
  | 'clear'
  | 'flagged'
  | 'rejected'
  | 'expired';

export interface BackgroundCheck {
  id: string;
  providerId: string;
  status: BackgroundCheckStatus;
  initiatedAt: string;
  completedAt?: string;
  provider: string; // Background check service provider (e.g., 'Checkr', 'Sterling')
  results: BackgroundCheckResults;
}

export interface BackgroundCheckResults {
  criminalRecordsCheck: CheckResult;
  sexOffenderRegistryCheck: CheckResult;
  nationalDatabaseCheck: CheckResult;
  stateRecordsCheck: CheckResult;
  identityVerification: CheckResult;
  flags?: BackgroundCheckFlag[];
  clearanceLevel: 'approved' | 'review_required' | 'denied';
}

export interface CheckResult {
  status: 'clear' | 'flagged' | 'pending';
  checkedAt: string;
  details?: string;
}

export interface BackgroundCheckFlag {
  id: string;
  type: 'criminal_record' | 'sex_offender' | 'identity_mismatch' | 'incomplete_data';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recordDate?: string;
  jurisdiction?: string;
}

export interface BackgroundCheckConsent {
  providerId: string;
  consentGivenAt: string;
  ipAddress: string;
  fullLegalName: string;
  dateOfBirth: string;
  socialSecurityNumber: string; // Encrypted in real implementation
  driversLicenseNumber?: string;
  agreedToTerms: boolean;
}