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
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
      Alert.alert(t('backgroundCheck.requiredFields'), t('backgroundCheck.requiredFieldsMessage'));
      return;
    }

    if (!agreedToConsent || !agreedToTerms) {
      Alert.alert(t('backgroundCheck.consentRequired'), t('backgroundCheck.consentRequiredMessage'));
      return;
    }

    if (socialSecurityNumber.replace(/\D/g, '').length !== 9) {
      Alert.alert(t('backgroundCheck.invalidSSN'), t('backgroundCheck.invalidSSNMessage'));
      return;
    }

    Alert.alert(
      t('backgroundCheck.confirmSubmission'),
      t('backgroundCheck.confirmMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('backgroundCheck.authorize'),
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
        <Text style={styles.headerTitle}>{t('backgroundCheck.title')}</Text>
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
            <Text style={styles.securityTitle}>{t('backgroundCheck.consent')}</Text>
            <Text style={styles.securitySubtitle}>
              {t('backgroundCheck.requiredForProviders')}
            </Text>
          </LinearGradient>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>{t('backgroundCheck.whyRequired')}</Text>
          <Text style={styles.infoText}>
            {t('backgroundCheck.whyRequiredText')}
          </Text>
        </View>

        <View style={styles.checksCard}>
          <Text style={styles.checksTitle}>{t('backgroundCheck.whatWeCheck')}</Text>
          <View style={styles.checkItem}>
            <Ionicons name="search" size={20} color="#F44336" />
            <Text style={styles.checkText}>
              <Text style={styles.checkBold}>{t('backgroundCheck.criminalRecords')}</Text> {t('backgroundCheck.criminalRecordsDesc')}
            </Text>
          </View>
          <View style={styles.checkItem}>
            <Ionicons name="alert-circle" size={20} color="#F44336" />
            <Text style={styles.checkText}>
              <Text style={styles.checkBold}>{t('backgroundCheck.sexOffenderRegistry')}</Text> {t('backgroundCheck.sexOffenderRegistryDesc')}
            </Text>
          </View>
          <View style={styles.checkItem}>
            <Ionicons name="shield-checkmark" size={20} color="#F44336" />
            <Text style={styles.checkText}>
              <Text style={styles.checkBold}>{t('backgroundCheck.specialFocus')}</Text> {t('backgroundCheck.specialFocusDesc')}
            </Text>
          </View>
          <View style={styles.checkItem}>
            <Ionicons name="document-text" size={20} color="#2196F3" />
            <Text style={styles.checkText}>
              <Text style={styles.checkBold}>{t('backgroundCheck.identityVerification')}</Text> {t('backgroundCheck.identityVerificationDesc')}
            </Text>
          </View>
          <View style={styles.checkItem}>
            <Ionicons name="globe" size={20} color="#2196F3" />
            <Text style={styles.checkText}>
              <Text style={styles.checkBold}>{t('backgroundCheck.nationalDatabase')}</Text> {t('backgroundCheck.nationalDatabaseDesc')}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('backgroundCheck.personalInfo')}</Text>
          <Text style={styles.sectionSubtitle}>
            {t('backgroundCheck.personalInfoDesc')}
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{t('backgroundCheck.fullLegalName')} *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t('backgroundCheck.namePlaceholder')}
                value={fullLegalName}
                onChangeText={setFullLegalName}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{t('backgroundCheck.dateOfBirth')} *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="calendar-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t('backgroundCheck.dateOfBirthPlaceholder')}
                value={dateOfBirth}
                onChangeText={(text) => setDateOfBirth(formatDateOfBirth(text))}
                keyboardType="number-pad"
                maxLength={10}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{t('backgroundCheck.ssn')} *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t('backgroundCheck.ssnPlaceholder')}
                value={socialSecurityNumber}
                onChangeText={(text) => setSocialSecurityNumber(formatSSN(text))}
                keyboardType="number-pad"
                maxLength={11}
                secureTextEntry
              />
            </View>
            <Text style={styles.inputHelp}>
              {t('backgroundCheck.ssnHelp')}
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{t('backgroundCheck.driversLicense')}</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="card-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t('backgroundCheck.licensePlaceholder')}
                value={driversLicenseNumber}
                onChangeText={setDriversLicenseNumber}
                autoCapitalize="characters"
              />
            </View>
          </View>
        </View>

        <View style={styles.consentSection}>
          <Text style={styles.consentTitle}>{t('backgroundCheck.requiredConsent')}</Text>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAgreedToConsent(!agreedToConsent)}
          >
            <View style={[styles.checkbox, agreedToConsent && styles.checkboxChecked]}>
              {agreedToConsent && <Ionicons name="checkmark" size={18} color="white" />}
            </View>
            <Text style={styles.checkboxText}>
              {t('backgroundCheck.consentAuthorize')}
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
              {t('backgroundCheck.consentTerms')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.warningCard}>
          <Ionicons name="warning" size={24} color="#FF9800" />
          <View style={styles.warningContent}>
            <Text style={styles.warningTitle}>{t('backgroundCheck.importantNotice')}</Text>
            <Text style={styles.warningText}>
              {t('backgroundCheck.noticePoints')}
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
            <Text style={styles.submitButtonText}>{t('backgroundCheck.submitButton')}</Text>
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