import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SERVICE_CATEGORIES } from '../data/services';
import { FilterOptions } from '../types';

interface Props {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

export default function FilterModal({ visible, onClose, onApply, currentFilters }: Props) {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);

  const handleReset = () => {
    const resetFilters: FilterOptions = {};
    setFilters(resetFilters);
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const renderStarRating = () => {
    const ratings = [5, 4, 3, 2, 1];
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Minimum Rating</Text>
        <View style={styles.ratingOptions}>
          {ratings.map((rating) => (
            <TouchableOpacity
              key={rating}
              style={[
                styles.ratingButton,
                filters.minRating === rating && styles.ratingButtonActive,
              ]}
              onPress={() =>
                setFilters({
                  ...filters,
                  minRating: filters.minRating === rating ? undefined : rating,
                })
              }
            >
              <View style={styles.stars}>
                {[...Array(rating)].map((_, i) => (
                  <Ionicons
                    key={i}
                    name="star"
                    size={16}
                    color={filters.minRating === rating ? '#fff' : '#FFD700'}
                  />
                ))}
              </View>
              <Text
                style={[
                  styles.ratingText,
                  filters.minRating === rating && styles.ratingTextActive,
                ]}
              >
                {rating}+ Stars
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderServiceType = () => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Service Type</Text>
        <View style={styles.categoryGrid}>
          {SERVICE_CATEGORIES.filter((cat) => cat !== 'All').map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                filters.serviceType === category && styles.categoryChipActive,
              ]}
              onPress={() =>
                setFilters({
                  ...filters,
                  serviceType: filters.serviceType === category ? undefined : category,
                })
              }
            >
              <Text
                style={[
                  styles.categoryChipText,
                  filters.serviceType === category && styles.categoryChipTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderProximity = () => {
    const distances = [5, 10, 25, 50, 100];
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Distance (miles)</Text>
        <View style={styles.distanceOptions}>
          {distances.map((distance) => (
            <TouchableOpacity
              key={distance}
              style={[
                styles.distanceButton,
                filters.maxDistance === distance && styles.distanceButtonActive,
              ]}
              onPress={() =>
                setFilters({
                  ...filters,
                  maxDistance: filters.maxDistance === distance ? undefined : distance,
                })
              }
            >
              <Text
                style={[
                  styles.distanceText,
                  filters.maxDistance === distance && styles.distanceTextActive,
                ]}
              >
                {distance}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderLocation = () => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="City"
          value={filters.city || ''}
          onChangeText={(text) => setFilters({ ...filters, city: text || undefined })}
        />
        <TextInput
          style={styles.input}
          placeholder="State (e.g., CA, NY)"
          value={filters.state || ''}
          onChangeText={(text) => setFilters({ ...filters, state: text || undefined })}
          maxLength={2}
          autoCapitalize="characters"
        />
      </View>
    );
  };

  const renderPriceRange = () => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Price Range</Text>
        <View style={styles.priceInputs}>
          <View style={styles.priceInputContainer}>
            <Text style={styles.priceLabel}>Min ($)</Text>
            <TextInput
              style={styles.priceInput}
              placeholder="0"
              value={filters.priceRange?.min?.toString() || ''}
              onChangeText={(text) => {
                const min = text ? parseInt(text) : undefined;
                setFilters({
                  ...filters,
                  priceRange: {
                    min,
                    max: filters.priceRange?.max,
                  },
                });
              }}
              keyboardType="number-pad"
            />
          </View>
          <Text style={styles.priceSeparator}>-</Text>
          <View style={styles.priceInputContainer}>
            <Text style={styles.priceLabel}>Max ($)</Text>
            <TextInput
              style={styles.priceInput}
              placeholder="1000"
              value={filters.priceRange?.max?.toString() || ''}
              onChangeText={(text) => {
                const max = text ? parseInt(text) : undefined;
                setFilters({
                  ...filters,
                  priceRange: {
                    min: filters.priceRange?.min,
                    max,
                  },
                });
              }}
              keyboardType="number-pad"
            />
          </View>
        </View>
      </View>
    );
  };

  const renderVerifiedOnly = () => {
    return (
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.verifiedToggle}
          onPress={() =>
            setFilters({ ...filters, verifiedOnly: !filters.verifiedOnly })
          }
        >
          <View style={styles.verifiedLeft}>
            <Ionicons name="shield-checkmark" size={24} color="#4CAF50" />
            <Text style={styles.verifiedText}>Verified Providers Only</Text>
          </View>
          <View
            style={[
              styles.toggle,
              filters.verifiedOnly && styles.toggleActive,
            ]}
          >
            <View
              style={[
                styles.toggleThumb,
                filters.verifiedOnly && styles.toggleThumbActive,
              ]}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filters</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {renderStarRating()}
            {renderServiceType()}
            {renderProximity()}
            {renderLocation()}
            {renderPriceRange()}
            {renderVerifiedOnly()}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>
                Reset {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.applyButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.applyButtonText}>
                  Apply Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  ratingOptions: {
    gap: 10,
  },
  ratingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  ratingButtonActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  stars: {
    flexDirection: 'row',
    marginRight: 10,
  },
  ratingText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  ratingTextActive: {
    color: '#fff',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  categoryChipActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  distanceOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  distanceButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  distanceButtonActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  distanceText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  distanceTextActive: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
  },
  priceInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  priceInputContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  priceInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  priceSeparator: {
    fontSize: 18,
    color: '#999',
    marginTop: 20,
  },
  verifiedToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  verifiedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  verifiedText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ddd',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#4CAF50',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  toggleThumbActive: {
    transform: [{ translateX: 22 }],
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  resetButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  applyButton: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  applyButtonGradient: {
    padding: 15,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});