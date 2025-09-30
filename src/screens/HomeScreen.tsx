import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Provider, FilterOptions } from '../types';
import { MOCK_PROVIDERS } from '../data/mockData';
import { SERVICE_CATEGORIES } from '../data/services';
import LanguageSwitcher from '../components/LanguageSwitcher';
import FilterModal from '../components/FilterModal';

interface Props {
  onProviderPress: (provider: Provider) => void;
  onFilterPress: () => void;
}

export default function HomeScreen({ onProviderPress, onFilterPress }: Props) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [providers, setProviders] = useState(MOCK_PROVIDERS);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});

  const getCategoryTranslation = (category: string) => {
    const categoryMap: Record<string, string> = {
      'All': t('categories.all'),
      'Cleaning': t('categories.cleaning'),
      'Home Repair': t('categories.homeRepair'),
      'Home Improvement': t('categories.homeImprovement'),
      'Outdoor': t('categories.outdoor'),
      'Moving': t('categories.moving'),
      'Home Services': t('categories.homeServices'),
      'Pet Services': t('categories.petServices'),
      'Events': t('categories.events'),
      'Fitness': t('categories.fitness'),
      'Business': t('categories.business'),
      'Tech': t('categories.tech'),
      'Automotive': t('categories.automotive'),
    };
    return categoryMap[category] || category;
  };

  const filterProviders = (query: string, category: string, appliedFilters: FilterOptions) => {
    let filtered = MOCK_PROVIDERS;

    // Search query filter
    if (query) {
      filtered = filtered.filter(
        (p) =>
          p.businessName.toLowerCase().includes(query.toLowerCase()) ||
          p.services.some((s) => s.toLowerCase().includes(query.toLowerCase()))
      );
    }

    // Category filter
    if (category !== 'All') {
      filtered = filtered.filter((p) =>
        p.services.some((s) => s.includes(category))
      );
    }

    // Star rating filter
    if (appliedFilters.minRating) {
      filtered = filtered.filter((p) => p.rating >= appliedFilters.minRating!);
    }

    // Service type filter
    if (appliedFilters.serviceType) {
      filtered = filtered.filter((p) =>
        p.services.some((s) => s.includes(appliedFilters.serviceType!))
      );
    }

    // City filter
    if (appliedFilters.city) {
      filtered = filtered.filter((p) =>
        p.city.toLowerCase().includes(appliedFilters.city!.toLowerCase())
      );
    }

    // State filter
    if (appliedFilters.state) {
      filtered = filtered.filter((p) =>
        p.state.toLowerCase() === appliedFilters.state!.toLowerCase()
      );
    }

    // Price range filter
    if (appliedFilters.priceRange) {
      if (appliedFilters.priceRange.min) {
        filtered = filtered.filter((p) => p.priceRange.min >= appliedFilters.priceRange!.min!);
      }
      if (appliedFilters.priceRange.max) {
        filtered = filtered.filter((p) => p.priceRange.max <= appliedFilters.priceRange!.max!);
      }
    }

    // Verified only filter
    if (appliedFilters.verifiedOnly) {
      filtered = filtered.filter((p) => p.isVerified);
    }

    setProviders(filtered);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    filterProviders(text, selectedCategory, filters);
  };

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
    filterProviders(searchQuery, category, filters);
  };

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    filterProviders(searchQuery, selectedCategory, newFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.minRating) count++;
    if (filters.serviceType) count++;
    if (filters.maxDistance) count++;
    if (filters.city) count++;
    if (filters.state) count++;
    if (filters.priceRange?.min || filters.priceRange?.max) count++;
    if (filters.verifiedOnly) count++;
    return count;
  };

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? 'star' : star - 0.5 <= rating ? 'star-half' : 'star-outline'}
            size={16}
            color="#FFD700"
          />
        ))}
      </View>
    );
  };

  const renderProviderCard = ({ item }: { item: Provider }) => (
    <TouchableOpacity style={styles.providerCard} onPress={() => onProviderPress(item)}>
      <Image source={{ uri: item.profileImage }} style={styles.providerImage} />
      <View style={styles.providerInfo}>
        <View style={styles.providerHeader}>
          <Text style={styles.providerName}>{item.businessName}</Text>
          {item.isVerified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            </View>
          )}
        </View>

        <View style={styles.ratingContainer}>
          {renderStars(item.rating)}
          <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
          <Text style={styles.reviews}>({item.reviewCount})</Text>
        </View>

        <Text style={styles.services} numberOfLines={1}>
          {item.services.join(' • ')}
        </Text>

        <View style={styles.providerFooter}>
          <Text style={styles.priceRange}>
            ${item.priceRange.min} - ${item.priceRange.max}
          </Text>
          <View style={styles.badges}>
            {item.subscriptionPlan !== 'none' && (
              <View style={[styles.badge, item.subscriptionPlan === 'bronze' ? styles.badgeBronze : item.subscriptionPlan === 'silver' ? styles.badgeSilver : styles.badgeGold]}>
                <Text style={styles.badgeText}>{item.subscriptionPlan.toUpperCase()}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Hello!</Text>
            <Text style={styles.title}>{t('home.title')}</Text>
          </View>
          <View style={styles.headerActions}>
            <LanguageSwitcher />
            <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilterModal(true)}>
              <Ionicons name="options-outline" size={24} color="#667eea" />
              {getActiveFiltersCount() > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('home.searchPlaceholder')}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.categories')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {SERVICE_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.categoryChipActive,
                ]}
                onPress={() => handleCategoryPress(category)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === category && styles.categoryChipTextActive,
                  ]}
                >
                  {getCategoryTranslation(category)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.resultsHeader}>
            <View>
              <Text style={styles.sectionTitle}>{t('home.topRated')}</Text>
              <Text style={styles.resultsCount}>{providers.length} {t('search.providersFound')}</Text>
            </View>
            {getActiveFiltersCount() > 0 && (
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={() => handleApplyFilters({})}
              >
                <Text style={styles.clearFiltersText}>{t('search.clearFilters')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <FlatList
          data={providers}
          renderItem={renderProviderCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.providerList}
        />
      </ScrollView>

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleApplyFilters}
        currentFilters={filters}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  greeting: {
    fontSize: 14,
    color: '#999',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#F44336',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    paddingBottom: 10,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  resultsCount: {
    fontSize: 14,
    color: '#999',
  },
  clearFiltersButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
  },
  clearFiltersText: {
    fontSize: 13,
    color: '#667eea',
    fontWeight: '600',
  },
  categoriesScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  categoryChipActive: {
    backgroundColor: '#667eea',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: 'white',
  },
  providerList: {
    padding: 20,
    paddingTop: 10,
  },
  providerCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  providerImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  providerInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  providerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  verifiedBadge: {
    marginLeft: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 5,
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 5,
  },
  reviews: {
    fontSize: 12,
    color: '#999',
    marginLeft: 3,
  },
  services: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5,
  },
  providerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceRange: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
  },
  badges: {
    flexDirection: 'row',
    gap: 5,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeBronze: {
    backgroundColor: '#CD7F32',
  },
  badgeSilver: {
    backgroundColor: '#C0C0C0',
  },
  badgeGold: {
    backgroundColor: '#FFD700',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
});