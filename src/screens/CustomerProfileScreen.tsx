import React, { useState } from 'react';
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
import { Customer, ServiceRequest, Review } from '../types';
import { MOCK_SERVICE_REQUESTS, MOCK_REVIEWS } from '../data/mockData';

interface Props {
  customer: Customer;
  onBack: () => void;
  onEditProfile: () => void;
}

export default function CustomerProfileScreen({ customer, onBack, onEditProfile }: Props) {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState<'requests' | 'reviews'>('requests');

  const customerRequests = MOCK_SERVICE_REQUESTS.filter((r) => r.customerId === customer.id);
  const customerReviews = MOCK_REVIEWS.filter((r) => r.customerId === customer.id);

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

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={14}
            color="#FFD700"
          />
        ))}
      </View>
    );
  };

  const renderRequests = () => (
    <View style={styles.tabContent}>
      {customerRequests.length === 0 ? (
        <Text style={styles.emptyText}>No service requests yet</Text>
      ) : (
        customerRequests.map((request) => (
          <View key={request.id} style={styles.requestCard}>
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
          </View>
        ))
      )}
    </View>
  );

  const renderReviews = () => (
    <View style={styles.tabContent}>
      {customerReviews.length === 0 ? (
        <Text style={styles.emptyText}>No reviews written yet</Text>
      ) : (
        customerReviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.reviewInfo}>
                <Text style={styles.reviewService}>{review.serviceType}</Text>
                <View style={styles.reviewRating}>
                  {renderStars(review.rating)}
                  <Text style={styles.reviewDate}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>
          </View>
        ))
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={onEditProfile} style={styles.editButton}>
          <Ionicons name="pencil" size={20} color="#667eea" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.profileHeader}>
          <Image source={{ uri: customer.profileImage }} style={styles.profileImage} />
          <Text style={styles.customerName}>{customer.name}</Text>
          <Text style={styles.customerEmail}>{customer.email}</Text>
          <Text style={styles.customerPhone}>{customer.phone}</Text>

          <View style={styles.locationSection}>
            <Ionicons name="location" size={16} color="#667eea" />
            <Text style={styles.locationText}>
              {customer.city}, {customer.state} {customer.zipCode}
            </Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="document-text-outline" size={28} color="#667eea" />
            <Text style={styles.statValue}>{customerRequests.length}</Text>
            <Text style={styles.statLabel}>Total Requests</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-done-outline" size={28} color="#4CAF50" />
            <Text style={styles.statValue}>
              {customerRequests.filter((r) => r.status === 'completed').length}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="star-outline" size={28} color="#FFD700" />
            <Text style={styles.statValue}>{customerReviews.length}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>

        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'requests' && styles.tabActive]}
            onPress={() => setSelectedTab('requests')}
          >
            <Text style={[styles.tabText, selectedTab === 'requests' && styles.tabTextActive]}>
              My Requests ({customerRequests.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'reviews' && styles.tabActive]}
            onPress={() => setSelectedTab('reviews')}
          >
            <Text style={[styles.tabText, selectedTab === 'reviews' && styles.tabTextActive]}>
              My Reviews ({customerReviews.length})
            </Text>
          </TouchableOpacity>
        </View>

        {selectedTab === 'requests' && renderRequests()}
        {selectedTab === 'reviews' && renderReviews()}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 40,
    paddingBottom: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    padding: 5,
  },
  profileHeader: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  customerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  customerEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  customerPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 5,
  },
  locationText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
    backgroundColor: '#f8f9fa',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#667eea',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#667eea',
    fontWeight: 'bold',
  },
  tabContent: {
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 20,
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
  budget: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#667eea',
  },
  reviewCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reviewHeader: {
    marginBottom: 10,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewService: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  reviewComment: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});