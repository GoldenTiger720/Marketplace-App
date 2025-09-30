import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { VERIFICATION_FEE } from '../utils/providerUtils';

interface Props {
  onBack: () => void;
  onComplete: () => void;
  insuranceData: { fileName: string; fileType: string };
}

export default function VerificationPaymentScreen({ onBack, onComplete, insuranceData }: Props) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19);
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handlePayment = () => {
    if (!cardNumber || !expiryDate || !cvv || !cardName) {
      Alert.alert('Required', 'Please fill in all payment details.');
      return;
    }

    if (cardNumber.replace(/\s/g, '').length !== 16) {
      Alert.alert('Invalid Card', 'Please enter a valid 16-digit card number.');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        'Payment Successful!',
        'Your verification badge is now active. You will be charged $25 monthly.',
        [
          {
            text: 'Done',
            onPress: onComplete,
          },
        ]
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Verification Summary</Text>

          <View style={styles.summaryItem}>
            <View style={styles.summaryIcon}>
              <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
            </View>
            <View style={styles.summaryText}>
              <Text style={styles.summaryLabel}>Verified Badge</Text>
              <Text style={styles.summaryValue}>Monthly Subscription</Text>
            </View>
          </View>

          <View style={styles.summaryItem}>
            <View style={styles.summaryIcon}>
              <Ionicons name="document" size={20} color="#667eea" />
            </View>
            <View style={styles.summaryText}>
              <Text style={styles.summaryLabel}>Insurance Document</Text>
              <Text style={styles.summaryValue}>{insuranceData.fileName}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Monthly Fee</Text>
            <Text style={styles.totalAmount}>${VERIFICATION_FEE}.00</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          <View style={styles.paymentMethodCard}>
            <Ionicons name="card" size={24} color="#667eea" />
            <Text style={styles.paymentMethodText}>Credit/Debit Card</Text>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Card Details</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Card Number</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="card-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                keyboardType="number-pad"
                maxLength={19}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Cardholder Name</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="John Smith"
                value={cardName}
                onChangeText={setCardName}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Expiry Date</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="calendar-outline" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                  keyboardType="number-pad"
                  maxLength={5}
                />
              </View>
            </View>

            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>CVV</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="123"
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="number-pad"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>What You Get:</Text>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.benefitText}>Verified Badge on your profile</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.benefitText}>Increased customer trust</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.benefitText}>Higher ranking in search results</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.benefitText}>Priority customer support</Text>
          </View>
        </View>

        <View style={styles.noteCard}>
          <Ionicons name="information-circle" size={20} color="#667eea" />
          <Text style={styles.noteText}>
            You will be charged ${VERIFICATION_FEE} today and then monthly. You can cancel anytime from your account settings.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.payButton}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.payButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {isProcessing ? (
              <>
                <Text style={styles.payButtonText}>Processing...</Text>
                <Ionicons name="hourglass-outline" size={20} color="white" />
              </>
            ) : (
              <>
                <Text style={styles.payButtonText}>Pay ${VERIFICATION_FEE}/month</Text>
                <Ionicons name="checkmark" size={20} color="white" />
              </>
            )}
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
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  summaryText: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#999',
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  paymentMethodCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: '#667eea',
  },
  paymentMethodText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  benefitsCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  noteCard: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
  },
  noteText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  payButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  payButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});