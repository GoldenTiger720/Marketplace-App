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

interface Props {
  onBack: () => void;
  onComplete: (insuranceData: { fileName: string; fileType: string }) => void;
}

export default function InsuranceUploadScreen({ onBack, onComplete }: Props) {
  const [uploadedFile, setUploadedFile] = useState<{ fileName: string; fileType: string } | null>(null);

  const handleFileUpload = () => {
    // Simulate file picker
    Alert.alert(
      'Upload Insurance',
      'Select insurance document type',
      [
        {
          text: 'PDF Document',
          onPress: () => {
            const mockFile = {
              fileName: 'liability_insurance_2024.pdf',
              fileType: 'application/pdf',
            };
            setUploadedFile(mockFile);
            Alert.alert('Success', 'Insurance document uploaded successfully!');
          },
        },
        {
          text: 'Photo/Image',
          onPress: () => {
            const mockFile = {
              fileName: 'insurance_certificate.jpg',
              fileType: 'image/jpeg',
            };
            setUploadedFile(mockFile);
            Alert.alert('Success', 'Insurance document uploaded successfully!');
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleContinue = () => {
    if (uploadedFile) {
      onComplete(uploadedFile);
    } else {
      Alert.alert('Required', 'Please upload your insurance documentation first.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Insurance Upload</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <View style={styles.iconContainer}>
            <Ionicons name="shield-checkmark" size={48} color="#4CAF50" />
          </View>
          <Text style={styles.infoTitle}>Get Verified Badge</Text>
          <Text style={styles.infoText}>
            Upload your liability insurance documentation to get the Verified Badge and stand out to customers!
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          <View style={styles.requirementsList}>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.requirementText}>Valid liability insurance policy</Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.requirementText}>Policy must be current and active</Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.requirementText}>Clear, readable document (PDF or image)</Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.requirementText}>Shows provider name and coverage details</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload Document</Text>

          {uploadedFile ? (
            <View style={styles.uploadedCard}>
              <View style={styles.fileIcon}>
                <Ionicons
                  name={uploadedFile.fileType.includes('pdf') ? 'document' : 'image'}
                  size={32}
                  color="#667eea"
                />
              </View>
              <View style={styles.fileInfo}>
                <Text style={styles.fileName}>{uploadedFile.fileName}</Text>
                <Text style={styles.fileType}>
                  {uploadedFile.fileType.includes('pdf') ? 'PDF Document' : 'Image File'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setUploadedFile(null)}>
                <Ionicons name="close-circle" size={24} color="#F44336" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadButton} onPress={handleFileUpload}>
              <Ionicons name="cloud-upload-outline" size={48} color="#667eea" />
              <Text style={styles.uploadTitle}>Tap to Upload</Text>
              <Text style={styles.uploadSubtitle}>PDF, JPG, or PNG</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Steps</Text>
          <View style={styles.stepsCard}>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>Upload insurance document</Text>
            </View>
            <View style={styles.stepDivider} />
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>Complete payment ($25/month)</Text>
            </View>
            <View style={styles.stepDivider} />
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>Get verified badge instantly</Text>
            </View>
          </View>
        </View>

        <View style={styles.noteCard}>
          <Ionicons name="information-circle" size={20} color="#667eea" />
          <Text style={styles.noteText}>
            Your verification will be reviewed within 24 hours. The verification badge will remain active as long as your monthly fee is paid.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, !uploadedFile && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!uploadedFile}
        >
          <LinearGradient
            colors={uploadedFile ? ['#667eea', '#764ba2'] : ['#ccc', '#999']}
            style={styles.continueButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.continueButtonText}>Continue to Payment</Text>
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
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  requirementsList: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  requirementText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    flex: 1,
  },
  uploadButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#667eea',
    borderStyle: 'dashed',
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
    marginTop: 12,
  },
  uploadSubtitle: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  uploadedCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  fileIcon: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#e8eaf6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  fileType: {
    fontSize: 12,
    color: '#999',
  },
  stepsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  stepDivider: {
    width: 2,
    height: 20,
    backgroundColor: '#e0e0e0',
    marginLeft: 15,
    marginVertical: 8,
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
  continueButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});