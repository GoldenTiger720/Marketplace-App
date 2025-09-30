import { Review, Provider, GamificationReward } from '../types';

/**
 * Check if provider qualifies for 7 reviews with 4+ star average bonus
 * Rewards: 2 Free Leads
 */
export const checkSevenReviewsBonus = (
  reviews: Review[],
  providerId: string
): boolean => {
  const providerReviews = reviews.filter(
    (r) => r.providerId === providerId && r.reviewerType === 'customer'
  );

  if (providerReviews.length < 7) {
    return false;
  }

  const totalRating = providerReviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = totalRating / providerReviews.length;

  return averageRating > 4;
};

/**
 * Check if provider qualifies for 10 perfect 5-star reviews in 30 days bonus
 * Rewards: 5 Free Leads
 */
export const checkTenPerfectReviewsBonus = (
  reviews: Review[],
  providerId: string
): boolean => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentReviews = reviews.filter(
    (r) =>
      r.providerId === providerId &&
      r.reviewerType === 'customer' &&
      new Date(r.createdAt) >= thirtyDaysAgo
  );

  if (recentReviews.length < 10) {
    return false;
  }

  // Check if all 10+ reviews are perfect 5 stars
  const perfectReviews = recentReviews.filter((r) => r.rating === 5);
  return perfectReviews.length >= 10;
};

/**
 * Calculate total bonus leads earned by a provider
 */
export const calculateBonusLeads = (
  reviews: Review[],
  providerId: string,
  existingRewards: GamificationReward[]
): number => {
  let bonusLeads = 0;

  // Check for 7 reviews with 4+ average
  const qualifiesForSevenReviews = checkSevenReviewsBonus(reviews, providerId);
  const hasSevenReviewsReward = existingRewards.some(
    (r) => r.rewardType === '7reviews_4stars' && r.providerId === providerId
  );

  if (qualifiesForSevenReviews && !hasSevenReviewsReward) {
    bonusLeads += 2;
  }

  // Check for 10 perfect reviews in 30 days
  const qualifiesForTenPerfect = checkTenPerfectReviewsBonus(reviews, providerId);
  const hasTenPerfectReward = existingRewards.some(
    (r) => r.rewardType === '10reviews_5stars' && r.providerId === providerId
  );

  if (qualifiesForTenPerfect && !hasTenPerfectReward) {
    bonusLeads += 5;
  }

  return bonusLeads;
};

/**
 * Create a gamification reward record
 */
export const createGamificationReward = (
  providerId: string,
  rewardType: '7reviews_4stars' | '10reviews_5stars'
): GamificationReward => {
  const bonusLeads = rewardType === '7reviews_4stars' ? 2 : 5;

  return {
    id: `reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    providerId,
    rewardType,
    bonusLeads,
    awardedAt: new Date().toISOString(),
  };
};

/**
 * Get gamification status message for provider dashboard
 */
export const getGamificationStatus = (
  reviews: Review[],
  providerId: string
): {
  sevenReviewsProgress: { current: number; required: number; qualified: boolean };
  tenPerfectProgress: { current: number; required: number; qualified: boolean };
  totalBonusAvailable: number;
} => {
  const providerReviews = reviews.filter(
    (r) => r.providerId === providerId && r.reviewerType === 'customer'
  );

  const totalRating = providerReviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = providerReviews.length > 0 ? totalRating / providerReviews.length : 0;

  // 7 reviews with 4+ average progress
  const sevenReviewsQualified = providerReviews.length >= 7 && averageRating > 4;

  // 10 perfect reviews in 30 days progress
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentPerfectReviews = reviews.filter(
    (r) =>
      r.providerId === providerId &&
      r.reviewerType === 'customer' &&
      r.rating === 5 &&
      new Date(r.createdAt) >= thirtyDaysAgo
  ).length;

  const tenPerfectQualified = recentPerfectReviews >= 10;

  let totalBonusAvailable = 0;
  if (sevenReviewsQualified) totalBonusAvailable += 2;
  if (tenPerfectQualified) totalBonusAvailable += 5;

  return {
    sevenReviewsProgress: {
      current: providerReviews.length,
      required: 7,
      qualified: sevenReviewsQualified,
    },
    tenPerfectProgress: {
      current: recentPerfectReviews,
      required: 10,
      qualified: tenPerfectQualified,
    },
    totalBonusAvailable,
  };
};

/**
 * Format bonus leads display text
 */
export const formatBonusLeadsText = (bonusLeads: number): string => {
  if (bonusLeads === 0) {
    return 'No bonus leads';
  } else if (bonusLeads === 1) {
    return '1 bonus lead';
  } else {
    return `${bonusLeads} bonus leads`;
  }
};