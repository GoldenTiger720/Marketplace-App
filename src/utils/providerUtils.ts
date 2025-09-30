import { Provider, ProviderLevel } from '../types';

/**
 * Determines provider level based on star rating:
 * - Level 1: 1-3 stars
 * - Level 2: 4-5 stars
 */
export const getProviderLevel = (rating: number): ProviderLevel => {
  if (rating >= 4) {
    return 2;
  }
  return 1;
};

/**
 * Gets the level badge color
 */
export const getLevelBadgeColor = (level: ProviderLevel): string => {
  const colors = {
    1: '#CD7F32', // Bronze
    2: '#FFD700',  // Gold
  };
  return colors[level] || colors[1];
};

/**
 * Gets the level badge text
 */
export const getLevelBadgeText = (level: ProviderLevel): string => {
  return `Level ${level}`;
};

/**
 * Checks if provider can get verified (has insurance and pays fee)
 */
export const canGetVerified = (provider: Provider): boolean => {
  return provider.hasInsurance;
};

/**
 * Gets verification badge requirements text
 */
export const getVerificationRequirements = (): string[] => {
  return [
    'Upload valid liability insurance documentation',
    'Pay monthly verification fee of $25 USD',
    'Maintain active insurance coverage',
  ];
};

/**
 * Calculates monthly verification fee
 */
export const VERIFICATION_FEE = 25; // USD per month