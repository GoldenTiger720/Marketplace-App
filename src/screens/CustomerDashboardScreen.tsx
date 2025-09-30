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
import { Customer, ServiceRequest } from '../types';
import { MOCK_SERVICE_REQUESTS } from '../data/mockData';
import LanguageSwitcher from '../components/LanguageSwitcher';

interface Props {
  customer: Customer;
  onRequestPress: (request: ServiceRequest) => void;
  onCreateRequest: () => void;
}

export default function CustomerDashboardScreen({ customer, onRequestPress, onCreateRequest }: Props) {
  const { t } = useTranslation();
  const requests = MOCK_SERVICE_REQUESTS.filter((r) => r.customerId === customer.id);

  const getStatusColor = (status: string) => {
    const colors = {
      open: '#2196F3',
      in_progress: '#FF9800',
      completed: '#4CAF50',
      cancelled: '#F44336',
    };
    return colors[status as keyof typeof colors] || '#999';
  };

  const getStatusIcon = (status: string): 'time-outline' | 'hourglass-outline' | 'checkmark-circle-outline' | 'close-circle-outline' | 'help-outline' => {
    const icons = {
      open: 'time-outline' as const,
      in_progress: 'hourglass-outline' as const,
      completed: 'checkmark-circle-outline' as const,
      cancelled: 'close-circle-outline' as const,
    };
    return icons[status as keyof typeof icons] || 'help-outline';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Image source={{ uri: customer.profileImage }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.userName}>{customer.name}</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <LanguageSwitcher />
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="document-text-outline" size={32} color="#667eea" />
            <Text style={styles.statValue}>{requests.length}</Text>
            <Text style={styles.statLabel}>Active Requests</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-done-outline" size={32} color="#4CAF50" />
            <Text style={styles.statValue}>{requests.filter((r) => r.status === 'completed').length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="chatbubbles-outline" size={32} color="#FF9800" />
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Messages</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('dashboard.myRequests')}</Text>
            <TouchableOpacity onPress={onCreateRequest}>
              <Text style={styles.seeAll}>+ New Request</Text>
            </TouchableOpacity>
          </View>

          {requests.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-outline" size={60} color="#ccc" />
              <Text style={styles.emptyStateText}>No service requests yet</Text>
              <TouchableOpacity style={styles.createButton} onPress={onCreateRequest}>
                <Text style={styles.createButtonText}>Create Your First Request</Text>
              </TouchableOpacity>
            </View>
          ) : (
            requests.map((request) => (
              <TouchableOpacity
                key={request.id}
                style={styles.requestCard}
                onPress={() => onRequestPress(request)}
              >
                <View style={styles.requestHeader}>
                  <View style={styles.requestIcon}>
                    <Ionicons name="construct-outline" size={24} color="#667eea" />
                  </View>
                  <View style={styles.requestInfo}>
                    <Text style={styles.requestTitle}>{request.serviceName}</Text>
                    <Text style={styles.requestDate}>
                      {new Date(request.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <View
                    style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) }]}
                  >
                    <Ionicons name={getStatusIcon(request.status)} size={16} color="white" />
                  </View>
                </View>
                <Text style={styles.requestDescription} numberOfLines={2}>
                  {request.description}
                </Text>
                <View style={styles.requestFooter}>
                  <View style={styles.locationInfo}>
                    <Ionicons name="location-outline" size={14} color="#999" />
                    <Text style={styles.locationText}>
                      {request.city}, {request.state}
                    </Text>
                  </View>
                  {request.budget && (
                    <Text style={styles.budget}>
                      ${request.budget.min} - ${request.budget.max}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="search-outline" size={28} color="#667eea" />
              <Text style={styles.actionText}>Find Providers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="star-outline" size={28} color="#667eea" />
              <Text style={styles.actionText}>My Reviews</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="heart-outline" size={28} color="#667eea" />
              <Text style={styles.actionText}>Favorites</Text>
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
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
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
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
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
  section: {
    padding: 20,
    paddingTop: 10,
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
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  requestCard: {
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
  requestHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  requestIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#e8eaf6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  requestInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  requestDate: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  requestFooter: {
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
    fontSize: 14,
    fontWeight: 'bold',
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