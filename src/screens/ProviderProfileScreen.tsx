import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
  Alert,
  ActionSheetIOS,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import { Provider, Review } from '../types';
import { MOCK_REVIEWS } from '../data/mockData';
import { getProviderLevel, getLevelBadgeColor, getLevelBadgeText } from '../utils/providerUtils';
import { updateUser } from '../database/userService';
import { useApp } from '../contexts/AppContext';

const { width } = Dimensions.get('window');

interface Props {
  provider: Provider;
  onBack: () => void;
  onContactPress: () => void;
}

export default function ProviderProfileScreen({ provider, onBack, onContactPress }: Props) {
  const { t } = useTranslation();
  const { currentUser, setCurrentUser } = useApp();
  const [selectedTab, setSelectedTab] = useState<'about' | 'portfolio' | 'reviews'>('about');
  const [profileImage, setProfileImage] = useState(provider.profileImage);
  const reviews = MOCK_REVIEWS.filter((r) => r.providerId === provider.id);

  const updateProfileImage = async (imageUri: string) => {
    try {
      // Update in database
      await updateUser(provider.id, { profileImage: imageUri });

      // Update local state
      setProfileImage(imageUri);

      // Update context with new profile image
      if (currentUser) {
        setCurrentUser({
          ...currentUser,
          profileImage: imageUri,
        });
      }

      Alert.alert(t('common.success'), t('profile.avatarUpdated'));
    } catch (error) {
      console.error('Error updating profile image:', error);
      Alert.alert(t('common.error'), t('profile.avatarUpdateFailed'));
    }
  };

  const handleChangeAvatar = async () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [t('common.cancel'), t('profile.takePhoto'), t('profile.choosePhoto')],
          cancelButtonIndex: 0,
        },
        async (buttonIndex) => {
          if (buttonIndex === 1) {
            await takePhoto();
          } else if (buttonIndex === 2) {
            await choosePhoto();
          }
        }
      );
    } else {
      Alert.alert(
        t('profile.changeAvatar'),
        '',
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('profile.takePhoto'), onPress: takePhoto },
          { text: t('profile.choosePhoto'), onPress: choosePhoto },
        ],
        { cancelable: true }
      );
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('profile.permissionRequired'), t('profile.cameraPermissionMessage'));
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await updateProfileImage(result.assets[0].uri);
    }
  };

  const choosePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('profile.permissionRequired'), t('profile.libraryPermissionMessage'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await updateProfileImage(result.assets[0].uri);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? 'star' : star - 0.5 <= rating ? 'star-half' : 'star-outline'}
            size={18}
            color="#FFD700"
          />
        ))}
      </View>
    );
  };

  const renderLevelBadge = () => {
    const level = getProviderLevel(provider.rating);
    const color = getLevelBadgeColor(level);
    const text = getLevelBadgeText(level);

    return (
      <View style={[styles.levelBadge, { backgroundColor: color }]}>
        <Ionicons name="star" size={14} color="white" />
        <Text style={styles.levelBadgeText}>{text}</Text>
      </View>
    );
  };

  const renderAbout = () => (
    <View style={styles.tabContent}>
      <Text style={styles.bio}>{provider.bio}</Text>

      <View style={styles.infoGrid}>
        <View style={styles.infoCard}>
          <Ionicons name="briefcase-outline" size={24} color="#667eea" />
          <Text style={styles.infoLabel}>{t('provider.experience')}</Text>
          <Text style={styles.infoValue}>{provider.experience}</Text>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="checkmark-done-outline" size={24} color="#667eea" />
          <Text style={styles.infoLabel}>{t('provider.completedJobs')}</Text>
          <Text style={styles.infoValue}>{provider.completedJobs}</Text>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="time-outline" size={24} color="#667eea" />
          <Text style={styles.infoLabel}>{t('provider.responseTime')}</Text>
          <Text style={styles.infoValue}>{'< 1 hour'}</Text>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="location-outline" size={24} color="#667eea" />
          <Text style={styles.infoLabel}>Location</Text>
          <Text style={styles.infoValue}>{provider.city}, {provider.state}</Text>
        </View>
      </View>

      <View style={styles.servicesSection}>
        <Text style={styles.sectionTitle}>{t('provider.services')}</Text>
        <View style={styles.servicesList}>
          {provider.services.map((service, index) => (
            <View key={index} style={styles.serviceChip}>
              <Text style={styles.serviceChipText}>{service}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderPortfolio = () => (
    <View style={styles.tabContent}>
      <View style={styles.portfolioGrid}>
        {provider.portfolio.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.portfolioImage} />
        ))}
      </View>
    </View>
  );

  const renderReviews = () => (
    <View style={styles.tabContent}>
      {reviews.length === 0 ? (
        <Text style={styles.noReviews}>No reviews yet</Text>
      ) : (
        reviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Image source={{ uri: review.customerImage }} style={styles.reviewerImage} />
              <View style={styles.reviewerInfo}>
                <Text style={styles.reviewerName}>{review.customerName}</Text>
                <View style={styles.reviewRating}>
                  {renderStars(review.rating)}
                  <Text style={styles.reviewDate}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>
            <Text style={styles.reviewService}>{review.serviceType}</Text>
            {review.providerResponse && (
              <View style={styles.providerResponse}>
                <Text style={styles.providerResponseLabel}>Provider Response:</Text>
                <Text style={styles.providerResponseText}>{review.providerResponse}</Text>
              </View>
            )}
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
        <Text style={styles.headerTitle}>{t('provider.profile')}</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView>
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={handleChangeAvatar} style={styles.profileImageContainer}>
            <Image source={{ uri: profileImage || provider.profileImage }} style={styles.profileImage} />
            <View style={styles.cameraIconContainer}>
              <Ionicons name="camera" size={20} color="white" />
            </View>
          </TouchableOpacity>
          <Text style={styles.businessName}>{provider.businessName}</Text>
          <Text style={styles.ownerName}>{provider.name}</Text>

          <View style={styles.ratingSection}>
            {renderStars(provider.rating)}
            <Text style={styles.ratingText}>
              {provider.rating.toFixed(1)} ({provider.reviewCount} {t('provider.reviews')})
            </Text>
          </View>

          <View style={styles.badges}>
            {renderLevelBadge()}
            {provider.isVerified && provider.hasInsurance && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="shield-checkmark" size={16} color="white" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>

          {provider.isVerified && provider.hasInsurance && (
            <View style={styles.verificationInfo}>
              <Ionicons name="information-circle" size={16} color="#4CAF50" />
              <Text style={styles.verificationText}>
                Insured & Verified Provider
              </Text>
            </View>
          )}

          <View style={styles.priceSection}>
            <Text style={styles.priceLabel}>{t('provider.priceRange')}</Text>
            <Text style={styles.priceValue}>
              ${provider.priceRange.min} - ${provider.priceRange.max}
            </Text>
          </View>
        </View>

        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'about' && styles.tabActive]}
            onPress={() => setSelectedTab('about')}
          >
            <Text style={[styles.tabText, selectedTab === 'about' && styles.tabTextActive]}>
              {t('provider.about')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'portfolio' && styles.tabActive]}
            onPress={() => setSelectedTab('portfolio')}
          >
            <Text style={[styles.tabText, selectedTab === 'portfolio' && styles.tabTextActive]}>
              {t('provider.portfolio')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'reviews' && styles.tabActive]}
            onPress={() => setSelectedTab('reviews')}
          >
            <Text style={[styles.tabText, selectedTab === 'reviews' && styles.tabTextActive]}>
              {t('provider.reviews')} ({reviews.length})
            </Text>
          </TouchableOpacity>
        </View>

        {selectedTab === 'about' && renderAbout()}
        {selectedTab === 'portfolio' && renderPortfolio()}
        {selectedTab === 'reviews' && renderReviews()}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.contactButton} onPress={onContactPress}>
          <Ionicons name="chatbubble-outline" size={20} color="white" />
          <Text style={styles.contactButtonText}>{t('provider.contactProvider')}</Text>
        </TouchableOpacity>
      </View>
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
  headerRight: {
    width: 34,
  },
  profileHeader: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#667eea',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  businessName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  ownerName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 15,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  badges: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    gap: 4,
  },
  levelBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  verificationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  verificationText: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '500',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    gap: 5,
  },
  verifiedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  insuranceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    gap: 5,
  },
  insuranceText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  priceSection: {
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#667eea',
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
  bio: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 20,
  },
  infoCard: {
    flex: 1,
    minWidth: '45%',
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
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
    textAlign: 'center',
  },
  servicesSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  servicesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  serviceChip: {
    backgroundColor: '#e8eaf6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  serviceChipText: {
    fontSize: 13,
    color: '#667eea',
    fontWeight: '500',
  },
  portfolioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  portfolioImage: {
    width: (width - 50) / 2,
    height: (width - 50) / 2,
    borderRadius: 12,
  },
  noReviews: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 20,
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
    flexDirection: 'row',
    marginBottom: 10,
  },
  reviewerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  reviewComment: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewService: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '500',
  },
  providerResponse: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  providerResponseLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  providerResponseText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  footer: {
    backgroundColor: 'white',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#667eea',
    paddingVertical: 15,
    borderRadius: 12,
    gap: 10,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});