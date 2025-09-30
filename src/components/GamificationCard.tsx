import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Review } from '../types';
import { getGamificationStatus, formatBonusLeadsText } from '../utils/gamificationUtils';

interface Props {
  providerId: string;
  reviews: Review[];
  currentBonusLeads: number;
  onViewDetails?: () => void;
}

export default function GamificationCard({
  providerId,
  reviews,
  currentBonusLeads,
  onViewDetails,
}: Props) {
  const status = getGamificationStatus(reviews, providerId);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFD700', '#FFA500']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="trophy" size={28} color="white" />
            <View>
              <Text style={styles.title}>Bonus Leads</Text>
              <Text style={styles.subtitle}>Gamification Rewards</Text>
            </View>
          </View>
          {onViewDetails && (
            <TouchableOpacity onPress={onViewDetails}>
              <Ionicons name="information-circle-outline" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.bonusSection}>
          <Text style={styles.bonusValue}>{currentBonusLeads}</Text>
          <Text style={styles.bonusLabel}>Bonus Leads Earned</Text>
        </View>

        <View style={styles.progressSection}>
          {/* 7 Reviews with 4+ stars */}
          <View style={styles.progressItem}>
            <View style={styles.progressHeader}>
              <View style={styles.progressIconContainer}>
                <Ionicons
                  name={status.sevenReviewsProgress.qualified ? 'checkmark-circle' : 'star'}
                  size={20}
                  color={status.sevenReviewsProgress.qualified ? '#4CAF50' : 'white'}
                />
              </View>
              <View style={styles.progressInfo}>
                <Text style={styles.progressTitle}>7 Reviews, 4+ Stars</Text>
                <Text style={styles.progressSubtitle}>Earn 2 bonus leads</Text>
              </View>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${Math.min(
                        (status.sevenReviewsProgress.current /
                          status.sevenReviewsProgress.required) *
                          100,
                        100
                      )}%`,
                      backgroundColor: status.sevenReviewsProgress.qualified
                        ? '#4CAF50'
                        : 'white',
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {status.sevenReviewsProgress.current}/{status.sevenReviewsProgress.required}
              </Text>
            </View>
          </View>

          {/* 10 Perfect Reviews in 30 days */}
          <View style={styles.progressItem}>
            <View style={styles.progressHeader}>
              <View style={styles.progressIconContainer}>
                <Ionicons
                  name={status.tenPerfectProgress.qualified ? 'checkmark-circle' : 'star'}
                  size={20}
                  color={status.tenPerfectProgress.qualified ? '#4CAF50' : 'white'}
                />
              </View>
              <View style={styles.progressInfo}>
                <Text style={styles.progressTitle}>10 Perfect 5-Star Reviews (30 days)</Text>
                <Text style={styles.progressSubtitle}>Earn 5 bonus leads</Text>
              </View>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${Math.min(
                        (status.tenPerfectProgress.current / status.tenPerfectProgress.required) *
                          100,
                        100
                      )}%`,
                      backgroundColor: status.tenPerfectProgress.qualified
                        ? '#4CAF50'
                        : 'white',
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {status.tenPerfectProgress.current}/{status.tenPerfectProgress.required}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  gradient: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  bonusSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  bonusValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  bonusLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  progressSection: {
    gap: 16,
  },
  progressItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  progressInfo: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginBottom: 2,
  },
  progressSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    minWidth: 40,
    textAlign: 'right',
  },
});