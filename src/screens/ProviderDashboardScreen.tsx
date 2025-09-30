import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Provider, Lead } from '../types';
import { MOCK_LEADS, MOCK_REVIEWS } from '../data/mockData';
import LanguageSwitcher from '../components/LanguageSwitcher';
import UserMenu from '../components/UserMenu';
import GamificationCard from '../components/GamificationCard';
import { getProviderLevel, VERIFICATION_FEE } from '../utils/providerUtils';

interface Props {
  provider: Provider;
  onLeadPress: (lead: Lead) => void;
  onSubscriptionPress: () => void;
  onLogout: () => void;
  onViewProfile: () => void;
  onVerificationPress?: () => void;
  onPurchaseLeads?: () => void;
}

export default function ProviderDashboardScreen({ provider, onLeadPress, onSubscriptionPress, onLogout, onViewProfile, onVerificationPress, onPurchaseLeads }: Props) {
  const { t } = useTranslation();
  const availableLeads = MOCK_LEADS.filter((l) => l.status === 'available');
  const currentLevel = getProviderLevel(provider.rating);
  const isVerified = provider.isVerified && provider.hasInsurance;

  const getPlanColor = (plan: string) => {
    const colors = {
      bronze: '#CD7F32',
      silver: '#C0C0C0',
      gold: '#FFD700',
    };
    return colors[plan as keyof typeof colors] || '#999';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.profileInfo}>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{provider.name}</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <LanguageSwitcher />
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>5</Text>
            </View>
          </TouchableOpacity>
          <UserMenu
            user={provider}
            onLogout={onLogout}
            onViewProfile={onViewProfile}
          />
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Provider Level & Verification Status */}
        <View style={styles.levelVerificationCard}>
          <View style={styles.levelSection}>
            <View style={styles.levelHeader}>
              <Ionicons name="star" size={32} color="#FFD700" />
              <View style={styles.levelInfo}>
                <Text style={styles.levelTitle}>Level {currentLevel} Provider</Text>
                <Text style={styles.levelSubtitle}>
                  {provider.rating.toFixed(1)} stars ({provider.reviewCount} reviews)
                </Text>
              </View>
            </View>
            <Text style={styles.levelDescription}>
              {currentLevel === 2
                ? 'Excellent! Keep up the great work to maintain Level 2.'
                : 'Get 4+ stars to reach Level 2 status.'}
            </Text>
          </View>

          {!isVerified && (
            <TouchableOpacity
              style={styles.verificationPrompt}
              onPress={onVerificationPress}
            >
              <View style={styles.verificationPromptLeft}>
                <View style={styles.verificationIcon}>
                  <Ionicons name="shield-checkmark-outline" size={28} color="#667eea" />
                </View>
                <View style={styles.verificationInfo}>
                  <Text style={styles.verificationTitle}>Get Verified Badge</Text>
                  <Text style={styles.verificationSubtitle}>
                    ${VERIFICATION_FEE}/month • Boost credibility
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#999" />
            </TouchableOpacity>
          )}

          {isVerified && (
            <View style={styles.verifiedStatus}>
              <Ionicons name="shield-checkmark" size={24} color="#4CAF50" />
              <View style={styles.verifiedInfo}>
                <Text style={styles.verifiedTitle}>✓ Verified Provider</Text>
                <Text style={styles.verifiedSubtitle}>
                  Insurance verified • Badge active
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Gamification Rewards */}
        <GamificationCard
          providerId={provider.id}
          reviews={MOCK_REVIEWS}
          currentBonusLeads={provider.bonusLeads}
        />

        {/* Subscription Status */}
        <TouchableOpacity style={styles.subscriptionCard} onPress={onSubscriptionPress}>
          <View style={styles.subscriptionHeader}>
            <View style={styles.subscriptionIcon}>
              <Ionicons name="trophy" size={28} color={getPlanColor(provider.subscriptionPlan)} />
            </View>
            <View style={styles.subscriptionInfo}>
              <Text style={styles.subscriptionTitle}>
                {provider.subscriptionPlan === 'none' ? 'Basic Plan' : `${provider.subscriptionPlan.toUpperCase()} Plan`}
              </Text>
              <Text style={styles.subscriptionSubtitle}>
                {provider.subscriptionPlan === 'none' ? 'Upgrade to get more leads' : 'Active subscription'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </View>
        </TouchableOpacity>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.statCard} onPress={onPurchaseLeads}>
            <Ionicons name="briefcase-outline" size={32} color="#667eea" />
            <Text style={styles.statValue}>{provider.availableLeads}</Text>
            <Text style={styles.statLabel}>{t('stats.availableLeads')}</Text>
            <View style={styles.statAction}>
              <Ionicons name="add-circle" size={20} color="#667eea" />
              <Text style={styles.statActionText}>{t('quickActions.buyMore')}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-done-outline" size={32} color="#4CAF50" />
            <Text style={styles.statValue}>{provider.completedJobs}</Text>
            <Text style={styles.statLabel}>{t('stats.completedJobs')}</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="star-outline" size={32} color="#FFD700" />
            <Text style={styles.statValue}>{provider.rating.toFixed(1)}</Text>
            <Text style={styles.statLabel}>{t('stats.rating')}</Text>
          </View>
        </View>

        {/* Revenue Card */}
        <View style={styles.revenueCard}>
          <View style={styles.revenueHeader}>
            <Text style={styles.revenueTitle}>{t('dashboard.earnings')}</Text>
            <TouchableOpacity>
              <Text style={styles.viewDetails}>{t('quickActions.viewDetails')}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.revenueAmount}>$12,450</Text>
          <Text style={styles.revenueSubtitle}>{t('stats.thisMonth')}</Text>
          <View style={styles.revenueChart}>
            <View style={[styles.revenueBar, { height: 40 }]} />
            <View style={[styles.revenueBar, { height: 60 }]} />
            <View style={[styles.revenueBar, { height: 45 }]} />
            <View style={[styles.revenueBar, { height: 80 }]} />
            <View style={[styles.revenueBar, { height: 55 }]} />
            <View style={[styles.revenueBar, { height: 70 }]} />
            <View style={[styles.revenueBar, { height: 90 }]} />
          </View>
        </View>

        {/* Available Leads */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('dashboard.availableLeads')}</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>{t('quickActions.seeAll')}</Text>
            </TouchableOpacity>
          </View>

          {availableLeads.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="briefcase-outline" size={60} color="#ccc" />
              <Text style={styles.emptyStateText}>No leads available right now</Text>
            </View>
          ) : (
            availableLeads.map((lead) => (
              <TouchableOpacity
                key={lead.id}
                style={styles.leadCard}
                onPress={() => onLeadPress(lead)}
              >
                <View style={styles.leadHeader}>
                  <View style={styles.leadIcon}>
                    <Ionicons name="construct-outline" size={24} color="#667eea" />
                  </View>
                  <View style={styles.leadInfo}>
                    <Text style={styles.leadTitle}>{lead.serviceRequest.serviceName}</Text>
                    <Text style={styles.leadDate}>
                      Posted {new Date(lead.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.leadPrice}>
                    <Text style={styles.leadPriceText}>${lead.price.toFixed(2)}</Text>
                  </View>
                </View>
                <Text style={styles.leadDescription} numberOfLines={2}>
                  {lead.serviceRequest.description}
                </Text>
                <View style={styles.leadFooter}>
                  <View style={styles.locationInfo}>
                    <Ionicons name="location-outline" size={14} color="#999" />
                    <Text style={styles.locationText}>
                      {lead.serviceRequest.city}, {lead.serviceRequest.state}
                    </Text>
                  </View>
                  {lead.serviceRequest.budget && (
                    <Text style={styles.budget}>
                      Budget: ${lead.serviceRequest.budget.min} - ${lead.serviceRequest.budget.max}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('quickActions.title')}</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="calendar-outline" size={28} color="#667eea" />
              <Text style={styles.actionText}>{t('quickActions.mySchedule')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="star-outline" size={28} color="#667eea" />
              <Text style={styles.actionText}>{t('quickActions.reviews')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="images-outline" size={28} color="#667eea" />
              <Text style={styles.actionText}>{t('quickActions.portfolio')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="settings-outline" size={28} color="#667eea" />
              <Text style={styles.actionText}>{t('quickActions.settings')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileInfo: {
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 14,
    color: '#999',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationButton: {
    position: 'relative',
    padding: 5,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#F44336',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  levelVerificationCard: {
    backgroundColor: 'white',
    margin: 20,
    marginBottom: 10,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  levelSection: {
    marginBottom: 16,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelInfo: {
    flex: 1,
    marginLeft: 12,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  levelSubtitle: {
    fontSize: 13,
    color: '#999',
  },
  levelDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  verificationPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f0f0ff',
    borderWidth: 1,
    borderColor: '#667eea',
  },
  verificationPromptLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  verificationIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  verificationInfo: {
    flex: 1,
  },
  verificationTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 2,
  },
  verificationSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  verifiedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
  },
  verifiedInfo: {
    marginLeft: 12,
    flex: 1,
  },
  verifiedTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 2,
  },
  verifiedSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  subscriptionCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subscriptionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  subscriptionInfo: {
    flex: 1,
  },
  subscriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  subscriptionSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 15,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
  statAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  statActionText: {
    fontSize: 11,
    color: '#667eea',
    fontWeight: '600',
  },
  revenueCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  revenueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  revenueTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewDetails: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  revenueAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 5,
  },
  revenueSubtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
  },
  revenueChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 100,
  },
  revenueBar: {
    flex: 1,
    backgroundColor: '#667eea',
    marginHorizontal: 3,
    borderRadius: 4,
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    marginTop: 15,
  },
  leadCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leadHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  leadIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#e8eaf6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  leadInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  leadTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  leadDate: {
    fontSize: 12,
    color: '#999',
  },
  leadPrice: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    justifyContent: 'center',
  },
  leadPriceText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  leadDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  leadFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  locationText: {
    fontSize: 12,
    color: '#999',
  },
  budget: {
    fontSize: 12,
    fontWeight: '600',
    color: '#667eea',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
});