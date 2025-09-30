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

interface Props {
  onBack: () => void;
  onSubmit: (consentData: {
    fullLegalName: string;
    dateOfBirth: string;
    socialSecurityNumber: string;
    driversLicenseNumber: string;
  }) => void;
}

export default function BackgroundCheckConsentScreen({ onBack, onSubmit }: Props) {
  const [fullLegalName, setFullLegalName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [socialSecurityNumber, setSocialSecurityNumber] = useState('');
  const [driversLicenseNumber, setDriversLicenseNumber] = useState('');
  const [agreedToConsent, setAgreedToConsent] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const formatSSN = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 5) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5, 9)}`;
  };

  const formatDateOfBirth = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
  };

  const handleSubmit = () => {
    if (!fullLegalName || !dateOfBirth || !socialSecurityNumber) {
      Alert.alert('Required Fields', 'Please fill in all required fields.');
      return;
    }

    if (!agreedToConsent || !agreedToTerms) {
      Alert.alert('Consent Required', 'You must agree to the background check consent and terms of service to continue.');
      return;
    }

    if (socialSecurityNumber.replace(/\D/g, '').length !== 9) {
      Alert.alert('Invalid SSN', 'Please enter a valid 9-digit Social Security Number.');
      return;
    }

    Alert.alert(
      'Confirm Submission',
      'By submitting, you authorize us to conduct a comprehensive criminal background check. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'I Authorize',
          onPress: () => {
            onSubmit({
              fullLegalName,
              dateOfBirth,
              socialSecurityNumber,
              driversLicenseNumber,
            });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Background Check</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.securityBanner}>
          <LinearGradient
            colors={['#1565C0', '#0D47A1']}
            style={styles.securityGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="shield-checkmark" size={48} color="white" />
            <Text style={styles.securityTitle}>Criminal Background Check</Text>
            <Text style={styles.securitySubtitle}>
              Required for all service providers
            </Text>
          </LinearGradient>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Why This is Required</Text>
          <Text style={styles.infoText}>
            To ensure the safety of our customers, all service providers must complete a comprehensive criminal background check before their profile can be activated on the platform.
          </Text>
        </View>

        <View style={styles.checksCard}>
          <Text style={styles.checksTitle}>What We Check</Text>
          <View style={styles.checkItem}>
            <Ionicons name="search" size={20} color="#F44336" />
            <Text style={styles.checkText}>
              <Text style={styles.checkBold}>Criminal Records:</Text> County, state, and federal databases
            </Text>
          </View>
          <View style={styles.checkItem}>
            <Ionicons name="alert-circle" size={20} color="#F44336" />
            <Text style={styles.checkText}>
              <Text style={styles.checkBold}>Sex Offender Registry:</Text> National and state registries
            </Text>
          </View>
          <View style={styles.checkItem}>
            <Ionicons name="shield-checkmark" size={20} color="#F44336" />
            <Text style={styles.checkText}>
              <Text style={styles.checkBold}>Special Focus:</Text> Sex crimes, pedophilia, violent offenses
            </Text>
          </View>
          <View style={styles.checkItem}>
            <Ionicons name="document-text" size={20} color="#2196F3" />
            <Text style={styles.checkText}>
              <Text style={styles.checkBold}>Identity Verification:</Text> Validate your identity
            </Text>
          </View>
          <View style={styles.checkItem}>
            <Ionicons name="globe" size={20} color="#2196F3" />
            <Text style={styles.checkText}>
              <Text style={styles.checkBold}>National Database:</Text> Comprehensive nationwide search
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <Text style={styles.sectionSubtitle}>
            This information is required for the background check and will be kept confidential
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Legal Name *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="First Middle Last"
                value={fullLegalName}
                onChangeText={setFullLegalName}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Date of Birth *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="calendar-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="MM/DD/YYYY"
                value={dateOfBirth}
                onChangeText={(text) => setDateOfBirth(formatDateOfBirth(text))}
                keyboardType="number-pad"
                maxLength={10}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Social Security Number *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="XXX-XX-XXXX"
                value={socialSecurityNumber}
                onChangeText={(text) => setSocialSecurityNumber(formatSSN(text))}
                keyboardType="number-pad"
                maxLength={11}
                secureTextEntry
              />
            </View>
            <Text style={styles.inputHelp}>
              Encrypted and stored securely. Required by law for background checks.
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Driver's License Number (Optional)</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="card-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="License Number"
                value={driversLicenseNumber}
                onChangeText={setDriversLicenseNumber}
                autoCapitalize="characters"
              />
            </View>
          </View>
        </View>

        <View style={styles.consentSection}>
          <Text style={styles.consentTitle}>Required Consent</Text>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAgreedToConsent(!agreedToConsent)}
          >
            <View style={[styles.checkbox, agreedToConsent && styles.checkboxChecked]}>
              {agreedToConsent && <Ionicons name="checkmark" size={18} color="white" />}
            </View>
            <Text style={styles.checkboxText}>
              I authorize the platform to conduct a comprehensive criminal background check, including searches of criminal records, sex offender registries, and identity verification.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
          >
            <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
              {agreedToTerms && <Ionicons name="checkmark" size={18} color="white" />}
            </View>
            <Text style={styles.checkboxText}>
              I agree to the Terms of Service and understand that my profile will not be activated until the background check is completed and cleared.
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.warningCard}>
          <Ionicons name="warning" size={24} color="#FF9800" />
          <View style={styles.warningContent}>
            <Text style={styles.warningTitle}>Important Notice</Text>
            <Text style={styles.warningText}>
              • Background checks typically take 3-5 business days{'\n'}
              • You will be notified via email when results are ready{'\n'}
              • Your profile will remain inactive until clearance{'\n'}
              • Providing false information may result in permanent ban
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!agreedToConsent || !agreedToTerms) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!agreedToConsent || !agreedToTerms}
        >
          <LinearGradient
            colors={
              agreedToConsent && agreedToTerms
                ? ['#1565C0', '#0D47A1']
                : ['#ccc', '#999']
            }
            style={styles.submitButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.submitButtonText}>Submit for Background Check</Text>
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
  securityBanner: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  securityGradient: {
    padding: 30,
    alignItems: 'center',
  },
  securityTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
  },
  securitySubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  checksCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checksTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  checkText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  checkBold: {
    fontWeight: '600',
    color: '#333',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
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
  inputHelp: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
    marginLeft: 4,
  },
  consentSection: {
    marginBottom: 24,
  },
  consentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#1565C0',
    borderColor: '#1565C0',
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'flex-start',
    gap: 12,
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#F57C00',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});