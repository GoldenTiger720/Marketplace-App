import React from 'react';
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
import { BackgroundCheck, BackgroundCheckStatus } from '../types';
import { useTranslation } from 'react-i18next';

interface Props {
  onBack: () => void;
  backgroundCheck: BackgroundCheck;
}

export default function BackgroundCheckStatusScreen({ onBack, backgroundCheck }: Props) {
  const { t } = useTranslation();
  const getStatusColor = (status: BackgroundCheckStatus) => {
    const colors = {
      pending: '#FF9800',
      in_progress: '#2196F3',
      clear: '#4CAF50',
      flagged: '#F44336',
      rejected: '#D32F2F',
      expired: '#757575',
    };
    return colors[status];
  };

  const getStatusIcon = (status: BackgroundCheckStatus) => {
    const icons = {
      pending: 'time-outline',
      in_progress: 'hourglass-outline',
      clear: 'checkmark-circle',
      flagged: 'warning',
      rejected: 'close-circle',
      expired: 'alert-circle',
    };
    return icons[status] as any;
  };

  const getStatusText = (status: BackgroundCheckStatus) => {
    const texts = {
      pending: t('backgroundCheck.pending'),
      in_progress: t('backgroundCheck.inProgress'),
      clear: t('backgroundCheck.clear'),
      flagged: t('backgroundCheck.flagged'),
      rejected: t('backgroundCheck.rejected'),
      expired: t('backgroundCheck.expired'),
    };
    return texts[status];
  };

  const getCheckResultIcon = (status: 'clear' | 'flagged' | 'pending') => {
    if (status === 'clear') return 'checkmark-circle';
    if (status === 'flagged') return 'alert-circle';
    return 'time-outline';
  };

  const getCheckResultColor = (status: 'clear' | 'flagged' | 'pending') => {
    if (status === 'clear') return '#4CAF50';
    if (status === 'flagged') return '#F44336';
    return '#FF9800';
  };

  const renderStatusBanner = () => {
    const statusColor = getStatusColor(backgroundCheck.status);
    const statusIcon = getStatusIcon(backgroundCheck.status);
    const statusText = getStatusText(backgroundCheck.status);

    return (
      <View style={[styles.statusBanner, { backgroundColor: statusColor }]}>
        <Ionicons name={statusIcon} size={48} color="white" />
        <Text style={styles.statusTitle}>{statusText}</Text>
        {backgroundCheck.completedAt && (
          <Text style={styles.statusDate}>
            {t('backgroundCheck.completed')}: {new Date(backgroundCheck.completedAt).toLocaleDateString()}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('backgroundCheck.status')}</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {renderStatusBanner()}

        <View style={styles.providerCard}>
          <Text style={styles.providerLabel}>{t('backgroundCheck.backgroundCheckProvider')}</Text>
          <Text style={styles.providerName}>{backgroundCheck.provider}</Text>
          <Text style={styles.providerSubtitle}>
            ID: {backgroundCheck.id}
          </Text>
        </View>

        {backgroundCheck.status === 'in_progress' && (
          <View style={styles.progressCard}>
            <Ionicons name="information-circle" size={24} color="#2196F3" />
            <View style={styles.progressContent}>
              <Text style={styles.progressTitle}>{t('backgroundCheck.checkInProgress')}</Text>
              <Text style={styles.progressText}>
                {t('backgroundCheck.checkInProgressText')}
              </Text>
            </View>
          </View>
        )}

        {backgroundCheck.status === 'pending' && (
          <View style={styles.progressCard}>
            <Ionicons name="time-outline" size={24} color="#FF9800" />
            <View style={styles.progressContent}>
              <Text style={styles.progressTitle}>{t('backgroundCheck.pendingSubmission')}</Text>
              <Text style={styles.progressText}>
                {t('backgroundCheck.pendingSubmissionText')}
              </Text>
            </View>
          </View>
        )}

        {backgroundCheck.results && (
          <>
            <Text style={styles.sectionTitle}>{t('backgroundCheck.checkResults')}</Text>

            <View style={styles.checksContainer}>
              <View style={styles.checkResultCard}>
                <View style={styles.checkResultHeader}>
                  <Ionicons
                    name={getCheckResultIcon(backgroundCheck.results.criminalRecordsCheck.status)}
                    size={28}
                    color={getCheckResultColor(backgroundCheck.results.criminalRecordsCheck.status)}
                  />
                  <Text style={styles.checkResultTitle}>{t('backgroundCheck.criminalRecords')} Check</Text>
                </View>
                <Text style={styles.checkResultStatus}>
                  {t('backgroundCheck.statusLabel')}: {backgroundCheck.results.criminalRecordsCheck.status.toUpperCase()}
                </Text>
                {backgroundCheck.results.criminalRecordsCheck.details && (
                  <Text style={styles.checkResultDetails}>
                    {backgroundCheck.results.criminalRecordsCheck.details}
                  </Text>
                )}
              </View>

              <View style={styles.checkResultCard}>
                <View style={styles.checkResultHeader}>
                  <Ionicons
                    name={getCheckResultIcon(backgroundCheck.results.sexOffenderRegistryCheck.status)}
                    size={28}
                    color={getCheckResultColor(backgroundCheck.results.sexOffenderRegistryCheck.status)}
                  />
                  <Text style={styles.checkResultTitle}>{t('backgroundCheck.sexOffenderRegistry')}</Text>
                </View>
                <Text style={styles.checkResultStatus}>
                  {t('backgroundCheck.statusLabel')}: {backgroundCheck.results.sexOffenderRegistryCheck.status.toUpperCase()}
                </Text>
                <Text style={styles.checkResultImportant}>
                  {t('backgroundCheck.sexOffenderWarning')}
                </Text>
              </View>

              <View style={styles.checkResultCard}>
                <View style={styles.checkResultHeader}>
                  <Ionicons
                    name={getCheckResultIcon(backgroundCheck.results.nationalDatabaseCheck.status)}
                    size={28}
                    color={getCheckResultColor(backgroundCheck.results.nationalDatabaseCheck.status)}
                  />
                  <Text style={styles.checkResultTitle}>{t('backgroundCheck.nationalDatabase')}</Text>
                </View>
                <Text style={styles.checkResultStatus}>
                  {t('backgroundCheck.statusLabel')}: {backgroundCheck.results.nationalDatabaseCheck.status.toUpperCase()}
                </Text>
              </View>

              <View style={styles.checkResultCard}>
                <View style={styles.checkResultHeader}>
                  <Ionicons
                    name={getCheckResultIcon(backgroundCheck.results.stateRecordsCheck.status)}
                    size={28}
                    color={getCheckResultColor(backgroundCheck.results.stateRecordsCheck.status)}
                  />
                  <Text style={styles.checkResultTitle}>{t('backgroundCheck.stateRecords')}</Text>
                </View>
                <Text style={styles.checkResultStatus}>
                  {t('backgroundCheck.statusLabel')}: {backgroundCheck.results.stateRecordsCheck.status.toUpperCase()}
                </Text>
              </View>

              <View style={styles.checkResultCard}>
                <View style={styles.checkResultHeader}>
                  <Ionicons
                    name={getCheckResultIcon(backgroundCheck.results.identityVerification.status)}
                    size={28}
                    color={getCheckResultColor(backgroundCheck.results.identityVerification.status)}
                  />
                  <Text style={styles.checkResultTitle}>{t('backgroundCheck.identityVerification')}</Text>
                </View>
                <Text style={styles.checkResultStatus}>
                  {t('backgroundCheck.statusLabel')}: {backgroundCheck.results.identityVerification.status.toUpperCase()}
                </Text>
              </View>
            </View>

            {backgroundCheck.results.flags && backgroundCheck.results.flags.length > 0 && (
              <View style={styles.flagsSection}>
                <Text style={styles.flagsTitle}>{t('backgroundCheck.flagsDetected')}</Text>
                {backgroundCheck.results.flags.map((flag) => (
                  <View
                    key={flag.id}
                    style={[
                      styles.flagCard,
                      flag.severity === 'critical' && styles.flagCardCritical,
                    ]}
                  >
                    <View style={styles.flagHeader}>
                      <Text style={styles.flagType}>
                        {flag.type.replace(/_/g, ' ').toUpperCase()}
                      </Text>
                      <Text
                        style={[
                          styles.flagSeverity,
                          { color: flag.severity === 'critical' ? '#D32F2F' : '#F57C00' },
                        ]}
                      >
                        {flag.severity.toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.flagDescription}>{flag.description}</Text>
                    {flag.jurisdiction && (
                      <Text style={styles.flagJurisdiction}>
                        Jurisdiction: {flag.jurisdiction}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            <View style={styles.clearanceCard}>
              <Text style={styles.clearanceTitle}>{t('backgroundCheck.finalClearance')}</Text>
              <View
                style={[
                  styles.clearanceBadge,
                  {
                    backgroundColor:
                      backgroundCheck.results.clearanceLevel === 'approved'
                        ? '#4CAF50'
                        : backgroundCheck.results.clearanceLevel === 'review_required'
                        ? '#FF9800'
                        : '#F44336',
                  },
                ]}
              >
                <Text style={styles.clearanceBadgeText}>
                  {backgroundCheck.results.clearanceLevel === 'approved'
                    ? t('backgroundCheck.approved')
                    : backgroundCheck.results.clearanceLevel === 'review_required'
                    ? t('backgroundCheck.reviewRequired')
                    : t('backgroundCheck.denied')}
                </Text>
              </View>
            </View>
          </>
        )}

        {backgroundCheck.status === 'clear' && (
          <View style={styles.successCard}>
            <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
            <Text style={styles.successTitle}>{t('backgroundCheck.profileActivated')}</Text>
            <Text style={styles.successText}>
              {t('backgroundCheck.profileActivatedText')}
            </Text>
          </View>
        )}

        {backgroundCheck.status === 'rejected' && (
          <View style={styles.rejectionCard}>
            <Ionicons name="close-circle" size={48} color="#F44336" />
            <Text style={styles.rejectionTitle}>{t('backgroundCheck.profileNotApproved')}</Text>
            <Text style={styles.rejectionText}>
              {t('backgroundCheck.profileNotApprovedText')}
            </Text>
          </View>
        )}
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
  headerRight: {
    width: 34,
  },
  content: {
    flex: 1,
  },
  statusBanner: {
    padding: 40,
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
    textAlign: 'center',
  },
  statusDate: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
  },
  providerCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  providerLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  providerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  providerSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  progressCard: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
    gap: 12,
  },
  progressContent: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 16,
  },
  checksContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  checkResultCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkResultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  checkResultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  checkResultStatus: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  checkResultDetails: {
    fontSize: 13,
    color: '#999',
    marginTop: 8,
  },
  checkResultImportant: {
    fontSize: 13,
    color: '#F57C00',
    fontWeight: '600',
    marginTop: 8,
  },
  flagsSection: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  flagsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 12,
  },
  flagCard: {
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  flagCardCritical: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
  },
  flagHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  flagType: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  flagSeverity: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  flagDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  flagJurisdiction: {
    fontSize: 12,
    color: '#999',
  },
  clearanceCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 24,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clearanceTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  clearanceBadge: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  clearanceBadgeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successCard: {
    backgroundColor: '#E8F5E9',
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 24,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 16,
    marginBottom: 8,
  },
  successText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  rejectionCard: {
    backgroundColor: '#FFEBEE',
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 24,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F44336',
  },
  rejectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#C62828',
    marginTop: 16,
    marginBottom: 8,
  },
  rejectionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});