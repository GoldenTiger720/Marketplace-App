import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { SubscriptionPlan } from '../types';
import { SUBSCRIPTION_FEATURES, formatCurrency } from '../utils/pricingUtils';

interface Props {
  currentPlan: SubscriptionPlan;
  onBack: () => void;
  onSubscribe: (plan: SubscriptionPlan) => void;
}

interface PlanDetails {
  name: string;
  price: number;
  features: string[];
  color: [string, string];
  icon: string;
  popular?: boolean;
}

export default function SubscriptionScreen({ currentPlan, onBack, onSubscribe }: Props) {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(currentPlan);

  const plans: Record<SubscriptionPlan, PlanDetails> = {
    none: {
      name: 'Free Plan',
      price: 0,
      features: [
        'Access to all service requests',
        'Pay per lead ($15 each)',
        'Basic profile listing',
        'Email support',
      ],
      color: ['#9E9E9E', '#757575'],
      icon: 'person-outline',
    },
    bronze: {
      name: 'Bronze',
      price: SUBSCRIPTION_FEATURES.bronze?.price || 29.99,
      features: [
        'All Free Plan features',
        '✨ Profile featured 2x per week',
        'Highlighted profile badge',
        'Basic customer support',
        'Pay-per-lead pricing',
      ],
      color: ['#CD7F32', '#8B5A2B'],
      icon: 'medal-outline',
    },
    silver: {
      name: 'Silver',
      price: SUBSCRIPTION_FEATURES.silver?.price || 59.99,
      features: [
        'All Bronze features',
        '✨ Profile featured 4x per week',
        '⚡ Priority in search results',
        'Analytics dashboard access',
        'Priority customer support',
      ],
      color: ['#C0C0C0', '#A8A8A8'],
      icon: 'trophy-outline',
      popular: true,
    },
    gold: {
      name: 'Gold',
      price: SUBSCRIPTION_FEATURES.gold?.price || 99.99,
      features: [
        'All Silver features',
        '✨ Profile featured DAILY',
        '⚡ Maximum visibility boost',
        'Advanced analytics dashboard',
        'Premium customer support',
        'Dedicated account manager',
      ],
      color: ['#FFD700', '#FFA500'],
      icon: 'star-outline',
    },
  };

  const renderPlanCard = (planKey: SubscriptionPlan, plan: PlanDetails) => {
    const isSelected = selectedPlan === planKey;
    const isCurrent = currentPlan === planKey;

    return (
      <TouchableOpacity
        key={planKey}
        style={[styles.planCard, isSelected && styles.planCardSelected]}
        onPress={() => setSelectedPlan(planKey)}
      >
        {plan.popular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>MOST POPULAR</Text>
          </View>
        )}

        <LinearGradient colors={plan.color} style={styles.planHeader}>
          <Ionicons name={plan.icon as any} size={40} color="white" />
          <Text style={styles.planName}>{plan.name}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.currency}>$</Text>
            <Text style={styles.price}>{plan.price}</Text>
            <Text style={styles.period}>/month</Text>
          </View>
        </LinearGradient>

        <View style={styles.planBody}>
          {plan.features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}

          {isCurrent && (
            <View style={styles.currentPlanBadge}>
              <Text style={styles.currentPlanText}>Current Plan</Text>
            </View>
          )}
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
        <Text style={styles.headerTitle}>Subscription Plans</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.intro}>
          <Text style={styles.introTitle}>Choose the plan that's right for you</Text>
          <Text style={styles.introSubtitle}>
            Upgrade your plan to get more visibility and grow your business
          </Text>
        </View>

        <View style={styles.plansContainer}>
          {(Object.keys(plans) as SubscriptionPlan[]).map((planKey) =>
            renderPlanCard(planKey, plans[planKey])
          )}
        </View>

        <View style={styles.benefitsSection}>
          <Text style={styles.benefitsTitle}>All plans include:</Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Ionicons name="shield-checkmark" size={24} color="#667eea" />
              <Text style={styles.benefitText}>Background check verification</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="lock-closed" size={24} color="#667eea" />
              <Text style={styles.benefitText}>Secure payment processing</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="people" size={24} color="#667eea" />
              <Text style={styles.benefitText}>Access to customer base</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="trending-up" size={24} color="#667eea" />
              <Text style={styles.benefitText}>Business growth tools</Text>
            </View>
          </View>
        </View>

        <View style={styles.faqSection}>
          <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Can I cancel anytime?</Text>
            <Text style={styles.faqAnswer}>
              Yes, you can cancel your subscription at any time. No long-term commitment required.
            </Text>
          </View>
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>What payment methods do you accept?</Text>
            <Text style={styles.faqAnswer}>
              We accept all major credit cards, debit cards, and digital wallets through Stripe.
            </Text>
          </View>
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Can I switch plans later?</Text>
            <Text style={styles.faqAnswer}>
              Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
            </Text>
          </View>
        </View>
      </ScrollView>

      {selectedPlan !== currentPlan && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.subscribeButton}
            onPress={() => onSubscribe(selectedPlan)}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.subscribeButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.subscribeButtonText}>
                {selectedPlan === 'none' ? 'Downgrade to Basic' : `Subscribe to ${plans[selectedPlan].name}`}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
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
  },
  intro: {
    padding: 20,
    alignItems: 'center',
  },
  introTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  introSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  plansContainer: {
    padding: 20,
    paddingTop: 10,
  },
  planCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planCardSelected: {
    borderColor: '#667eea',
  },
  popularBadge: {
    backgroundColor: '#FF9800',
    paddingVertical: 5,
    alignItems: 'center',
  },
  popularText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planHeader: {
    padding: 25,
    alignItems: 'center',
  },
  planName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
    marginBottom: 15,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  currency: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 5,
  },
  price: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  period: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  planBody: {
    padding: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    flex: 1,
  },
  currentPlanBadge: {
    backgroundColor: '#e8eaf6',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  currentPlanText: {
    color: '#667eea',
    fontWeight: 'bold',
    fontSize: 14,
  },
  benefitsSection: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  benefitsList: {
    gap: 15,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitText: {
    fontSize: 15,
    color: '#666',
    marginLeft: 15,
    flex: 1,
  },
  faqSection: {
    padding: 20,
    paddingTop: 0,
  },
  faqTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  faqItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    backgroundColor: 'white',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  subscribeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  subscribeButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});