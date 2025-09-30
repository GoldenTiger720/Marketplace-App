import { LeadPackage, SubscriptionFeatures, SubscriptionPlan } from '../types';

// Lead Pricing Configuration
export const LEAD_PRICE_SINGLE = 15; // $15 per lead
export const LEAD_PRICE_WEEKLY = 75; // $75 for 6 leads (save 25%)
export const LEAD_PRICE_MONTHLY = 240; // $240 for 20 leads (save 20%)

export const LEAD_PACKAGES: LeadPackage[] = [
  {
    id: 'single_lead',
    name: 'Single Lead',
    leadsCount: 1,
    price: LEAD_PRICE_SINGLE,
    duration: 'single',
  },
  {
    id: 'weekly_pack',
    name: 'Weekly Package',
    leadsCount: 6,
    price: LEAD_PRICE_WEEKLY,
    duration: 'weekly',
    savingsPercentage: 17, // ($90 - $75) / $90 * 100
  },
  {
    id: 'monthly_pack',
    name: 'Monthly Package',
    leadsCount: 20,
    price: LEAD_PRICE_MONTHLY,
    duration: 'monthly',
    savingsPercentage: 20, // ($300 - $240) / $300 * 100
  },
];

// Subscription Pricing & Features
export const SUBSCRIPTION_FEATURES: Record<SubscriptionPlan, SubscriptionFeatures | null> = {
  none: null,
  bronze: {
    featuredTimesPerWeek: 2,
    priorityInSearch: false,
    highlightedProfile: true,
    analyticsAccess: false,
    customerSupportLevel: 'basic',
    price: 29.99,
  },
  silver: {
    featuredTimesPerWeek: 4,
    priorityInSearch: true,
    highlightedProfile: true,
    analyticsAccess: true,
    customerSupportLevel: 'priority',
    price: 59.99,
  },
  gold: {
    featuredTimesPerWeek: 7, // Daily
    priorityInSearch: true,
    highlightedProfile: true,
    analyticsAccess: true,
    customerSupportLevel: 'premium',
    price: 99.99,
  },
};

/**
 * Calculate the price per lead for a package
 */
export const calculatePricePerLead = (packageItem: LeadPackage): number => {
  return packageItem.price / packageItem.leadsCount;
};

/**
 * Calculate savings amount for a package
 */
export const calculateSavings = (packageItem: LeadPackage): number => {
  const regularPrice = packageItem.leadsCount * LEAD_PRICE_SINGLE;
  return regularPrice - packageItem.price;
};

/**
 * Format currency in USD
 */
export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

/**
 * Get subscription plan display name
 */
export const getSubscriptionPlanName = (plan: SubscriptionPlan): string => {
  const names: Record<SubscriptionPlan, string> = {
    none: 'Free Plan',
    bronze: 'Bronze Plan',
    silver: 'Silver Plan',
    gold: 'Gold Plan',
  };
  return names[plan];
};

/**
 * Get subscription features description
 */
export const getSubscriptionDescription = (plan: SubscriptionPlan): string => {
  const features = SUBSCRIPTION_FEATURES[plan];
  if (!features) return 'Basic access to the platform';

  const descriptions: Record<SubscriptionPlan, string> = {
    none: 'Basic access to the platform',
    bronze: 'Featured profile 2 times per week with highlighted visibility',
    silver: 'Featured profile 4 times per week with priority search ranking',
    gold: 'Featured profile daily with maximum visibility and priority support',
  };

  return descriptions[plan];
};

/**
 * Check if a subscription plan includes a feature
 */
export const hasPlanFeature = (
  plan: SubscriptionPlan,
  feature: keyof SubscriptionFeatures
): boolean => {
  const features = SUBSCRIPTION_FEATURES[plan];
  if (!features) return false;
  return Boolean(features[feature]);
};

/**
 * Get payment gateway fee
 * Stripe: 2.9% + $0.30
 * Braintree: 2.9% + $0.30
 */
export const calculatePaymentGatewayFee = (amount: number): number => {
  return amount * 0.029 + 0.3;
};

/**
 * Calculate total with payment gateway fee
 */
export const calculateTotalWithFee = (amount: number): number => {
  return amount + calculatePaymentGatewayFee(amount);
};