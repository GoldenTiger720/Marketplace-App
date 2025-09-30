import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { LeadPackage } from '../types';
import {
  LEAD_PACKAGES,
  calculatePricePerLead,
  calculateSavings,
  formatCurrency,
} from '../utils/pricingUtils';

interface Props {
  onBack: () => void;
  onPurchase: (packageItem: LeadPackage) => void;
  currentLeads: number;
}

export default function LeadPurchaseScreen({ onBack, onPurchase, currentLeads }: Props) {
  const [selectedPackage, setSelectedPackage] = useState<LeadPackage | null>(null);

  const handlePurchase = () => {
    if (!selectedPackage) {
      Alert.alert('Selection Required', 'Please select a lead package to purchase.');
      return;
    }

    Alert.alert(
      'Confirm Purchase',
      `Purchase ${selectedPackage.leadsCount} lead${
        selectedPackage.leadsCount > 1 ? 's' : ''
      } for ${formatCurrency(selectedPackage.price)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Purchase',
          onPress: () => onPurchase(selectedPackage),
        },
      ]
    );
  };

  const renderPackageCard = (pkg: LeadPackage) => {
    const isSelected = selectedPackage?.id === pkg.id;
    const pricePerLead = calculatePricePerLead(pkg);
    const savings = pkg.savingsPercentage ? calculateSavings(pkg) : 0;

    return (
      <TouchableOpacity
        key={pkg.id}
        style={[styles.packageCard, isSelected && styles.packageCardSelected]}
        onPress={() => setSelectedPackage(pkg)}
      >
        {pkg.savingsPercentage && (
          <View style={styles.savingsBadge}>
            <Text style={styles.savingsBadgeText}>Save {pkg.savingsPercentage}%</Text>
          </View>
        )}

        <View style={styles.packageHeader}>
          <View style={styles.packageIconContainer}>
            <Ionicons
              name={
                pkg.duration === 'single'
                  ? 'person-outline'
                  : pkg.duration === 'weekly'
                  ? 'calendar-outline'
                  : 'calendar'
              }
              size={32}
              color={isSelected ? '#667eea' : '#999'}
            />
          </View>
          <View style={styles.packageInfo}>
            <Text style={[styles.packageName, isSelected && styles.packageNameSelected]}>
              {pkg.name}
            </Text>
            <Text style={styles.packageDuration}>
              {pkg.duration === 'single' && 'Pay as you go'}
              {pkg.duration === 'weekly' && 'Valid for 7 days'}
              {pkg.duration === 'monthly' && 'Valid for 30 days'}
            </Text>
          </View>
          {isSelected && (
            <View style={styles.checkmarkContainer}>
              <Ionicons name="checkmark-circle" size={28} color="#667eea" />
            </View>
          )}
        </View>

        <View style={styles.packageDetails}>
          <View style={styles.packageRow}>
            <Text style={styles.packageLabel}>Number of Leads</Text>
            <Text style={styles.packageValue}>{pkg.leadsCount}</Text>
          </View>
          <View style={styles.packageRow}>
            <Text style={styles.packageLabel}>Price per Lead</Text>
            <Text style={styles.packageValue}>{formatCurrency(pricePerLead)}</Text>
          </View>
          {savings > 0 && (
            <View style={styles.packageRow}>
              <Text style={styles.packageLabelSavings}>You Save</Text>
              <Text style={styles.packageValueSavings}>{formatCurrency(savings)}</Text>
            </View>
          )}
        </View>

        <View style={styles.packageFooter}>
          <Text style={styles.packagePrice}>{formatCurrency(pkg.price)}</Text>
          <Text style={styles.packagePriceLabel}>Total Price</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Purchase Leads</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.currentLeadsCard}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.currentLeadsGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="briefcase" size={32} color="white" />
            <View style={styles.currentLeadsInfo}>
              <Text style={styles.currentLeadsValue}>{currentLeads}</Text>
              <Text style={styles.currentLeadsLabel}>Available Leads</Text>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select a Package</Text>
          <Text style={styles.sectionSubtitle}>
            Choose the best option for your business needs
          </Text>
        </View>

        <View style={styles.packagesContainer}>
          {LEAD_PACKAGES.map((pkg) => renderPackageCard(pkg))}
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#667eea" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>How Lead Purchasing Works</Text>
            <Text style={styles.infoText}>
              • Each lead represents a customer service request{'\n'}
              • You pay only for leads you want to pursue{'\n'}
              • Weekly and monthly packages offer significant savings{'\n'}
              • Unused leads from packages expire after their validity period{'\n'}
              • All payments are processed securely via Stripe
            </Text>
          </View>
        </View>

        <View style={styles.securityCard}>
          <View style={styles.securityBadge}>
            <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
            <Text style={styles.securityText}>Secure Payment via Stripe</Text>
          </View>
          <View style={styles.securityBadge}>
            <Ionicons name="lock-closed" size={20} color="#4CAF50" />
            <Text style={styles.securityText}>256-bit SSL Encryption</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.purchaseButton, !selectedPackage && styles.purchaseButtonDisabled]}
          onPress={handlePurchase}
          disabled={!selectedPackage}
        >
          <LinearGradient
            colors={selectedPackage ? ['#667eea', '#764ba2'] : ['#ccc', '#999']}
            style={styles.purchaseButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.purchaseButtonText}>
              {selectedPackage
                ? `Purchase for ${formatCurrency(selectedPackage.price)}`
                : 'Select a Package'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </LinearGradient>
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
  content: {
    flex: 1,
    padding: 20,
  },
  currentLeadsCard: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentLeadsGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  currentLeadsInfo: {
    flex: 1,
  },
  currentLeadsValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  currentLeadsLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  packagesContainer: {
    gap: 16,
    marginBottom: 24,
  },
  packageCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#eee',
    position: 'relative',
  },
  packageCardSelected: {
    borderColor: '#667eea',
    backgroundColor: '#f5f7ff',
  },
  savingsBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  savingsBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  packageIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  packageInfo: {
    flex: 1,
  },
  packageName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  packageNameSelected: {
    color: '#667eea',
  },
  packageDuration: {
    fontSize: 13,
    color: '#666',
  },
  checkmarkContainer: {
    marginLeft: 8,
  },
  packageDetails: {
    gap: 12,
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  packageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  packageLabel: {
    fontSize: 14,
    color: '#666',
  },
  packageValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  packageLabelSavings: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  packageValueSavings: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  packageFooter: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  packagePrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 4,
  },
  packagePriceLabel: {
    fontSize: 13,
    color: '#666',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'flex-start',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  securityCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  securityText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  purchaseButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  purchaseButtonDisabled: {
    opacity: 0.6,
  },
  purchaseButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  purchaseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});