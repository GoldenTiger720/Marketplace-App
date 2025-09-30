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
import { MOCK_LEADS } from '../data/mockData';
import LanguageSwitcher from '../components/LanguageSwitcher';
import UserMenu from '../components/UserMenu';

interface Props {
  provider: Provider;
  onLeadPress: (lead: Lead) => void;
  onSubscriptionPress: () => void;
  onLogout: () => void;
  onViewProfile: () => void;
}

export default function ProviderDashboardScreen({ provider, onLeadPress, onSubscriptionPress, onLogout, onViewProfile }: Props) {
  const { t } = useTranslation();
  const availableLeads = MOCK_LEADS.filter((l) => l.status === 'available');

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
          <View style={styles.statCard}>
            <Ionicons name="briefcase-outline" size={32} color="#667eea" />
            <Text style={styles.statValue}>{provider.availableLeads}</Text>
            <Text style={styles.statLabel}>Available Leads</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-done-outline" size={32} color="#4CAF50" />
            <Text style={styles.statValue}>{provider.completedJobs}</Text>
            <Text style={styles.statLabel}>Completed Jobs</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="star-outline" size={32} color="#FFD700" />
            <Text style={styles.statValue}>{provider.rating.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Revenue Card */}
        <View style={styles.revenueCard}>
          <View style={styles.revenueHeader}>
            <Text style={styles.revenueTitle}>{t('dashboard.earnings')}</Text>
            <TouchableOpacity>
              <Text style={styles.viewDetails}>View Details</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.revenueAmount}>$12,450</Text>
          <Text style={styles.revenueSubtitle}>This month</Text>
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
              <Text style={styles.seeAll}>See All</Text>
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
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="calendar-outline" size={28} color="#667eea" />
              <Text style={styles.actionText}>My Schedule</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="star-outline" size={28} color="#667eea" />
              <Text style={styles.actionText}>Reviews</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="images-outline" size={28} color="#667eea" />
              <Text style={styles.actionText}>Portfolio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="settings-outline" size={28} color="#667eea" />
              <Text style={styles.actionText}>Settings</Text>
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