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
import { Review, DisputeAttachment } from '../types';

interface Props {
  onBack: () => void;
  onSubmit: (description: string, attachments: DisputeAttachment[]) => void;
  review: Review;
}

export default function DisputeReviewScreen({ onBack, onSubmit, review }: Props) {
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<DisputeAttachment[]>([]);

  const handleAddAttachment = (type: DisputeAttachment['type']) => {
    Alert.alert(
      'Upload Evidence',
      `Select ${type} file`,
      [
        {
          text: 'Choose File',
          onPress: () => {
            const mockAttachment: DisputeAttachment = {
              id: `att_${Date.now()}`,
              type,
              fileName:
                type === 'message'
                  ? 'conversation_screenshot.png'
                  : type === 'audio'
                  ? 'phone_recording.mp3'
                  : type === 'image'
                  ? 'evidence_photo.jpg'
                  : 'contract_document.pdf',
              fileUrl: 'https://example.com/file',
            };
            setAttachments([...attachments, mockAttachment]);
            Alert.alert('Success', 'File uploaded successfully!');
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter((att) => att.id !== id));
  };

  const handleSubmit = () => {
    if (!description.trim()) {
      Alert.alert('Description Required', 'Please describe why you are disputing this review.');
      return;
    }

    if (attachments.length === 0) {
      Alert.alert(
        'Evidence Required',
        'Please upload at least one piece of supporting evidence.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Submit Dispute',
      'Your dispute will be reviewed within 24-48 hours. You will be notified of the decision.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: () => {
            onSubmit(description, attachments);
          },
        },
      ]
    );
  };

  const getFileIcon = (type: DisputeAttachment['type']) => {
    switch (type) {
      case 'message':
        return 'chatbubble';
      case 'audio':
        return 'mic';
      case 'image':
        return 'image';
      case 'document':
        return 'document-text';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dispute Review</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <Ionicons name="warning" size={24} color="#FF9800" />
            <Text style={styles.reviewTitle}>Review Being Disputed</Text>
          </View>
          <View style={styles.reviewContent}>
            <View style={styles.reviewRating}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= review.rating ? 'star' : 'star-outline'}
                  size={18}
                  color="#FFD700"
                />
              ))}
              <Text style={styles.reviewDate}>
                {new Date(review.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>
            <Text style={styles.reviewAuthor}>- {review.customerName}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dispute Reason *</Text>
          <Text style={styles.sectionSubtitle}>
            Explain why this review is inaccurate or unfair
          </Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Provide a detailed explanation of your dispute..."
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
          />
          <Text style={styles.characterCount}>{description.length} / 1000</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Supporting Evidence *</Text>
          <Text style={styles.sectionSubtitle}>
            Upload messages, recordings, or documents that support your case
          </Text>

          <View style={styles.attachmentButtons}>
            <TouchableOpacity
              style={styles.attachmentButton}
              onPress={() => handleAddAttachment('message')}
            >
              <Ionicons name="chatbubble-outline" size={24} color="#667eea" />
              <Text style={styles.attachmentButtonText}>Messages</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.attachmentButton}
              onPress={() => handleAddAttachment('audio')}
            >
              <Ionicons name="mic-outline" size={24} color="#667eea" />
              <Text style={styles.attachmentButtonText}>Audio</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.attachmentButton}
              onPress={() => handleAddAttachment('image')}
            >
              <Ionicons name="image-outline" size={24} color="#667eea" />
              <Text style={styles.attachmentButtonText}>Photos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.attachmentButton}
              onPress={() => handleAddAttachment('document')}
            >
              <Ionicons name="document-text-outline" size={24} color="#667eea" />
              <Text style={styles.attachmentButtonText}>Documents</Text>
            </TouchableOpacity>
          </View>

          {attachments.length > 0 && (
            <View style={styles.attachmentsList}>
              {attachments.map((attachment) => (
                <View key={attachment.id} style={styles.attachmentItem}>
                  <View style={styles.attachmentIcon}>
                    <Ionicons
                      name={getFileIcon(attachment.type)}
                      size={20}
                      color="#667eea"
                    />
                  </View>
                  <View style={styles.attachmentInfo}>
                    <Text style={styles.attachmentName}>{attachment.fileName}</Text>
                    <Text style={styles.attachmentType}>
                      {attachment.type.charAt(0).toUpperCase() + attachment.type.slice(1)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRemoveAttachment(attachment.id)}
                  >
                    <Ionicons name="close-circle" size={24} color="#F44336" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#667eea" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Dispute Review Process</Text>
            <Text style={styles.infoText}>
              1. Your dispute will be reviewed by our team within 24-48 hours{'\n'}
              2. We will examine all evidence provided{'\n'}
              3. You will be notified of our decision via email{'\n'}
              4. If approved, the review will be removed or modified
            </Text>
          </View>
        </View>

        <View style={styles.warningCard}>
          <Ionicons name="alert-circle" size={20} color="#F44336" />
          <Text style={styles.warningText}>
            Submitting false disputes may result in account penalties. Only dispute reviews that are genuinely inaccurate or violate our guidelines.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.submitButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.submitButtonText}>Submit Dispute</Text>
            <Ionicons name="send" size={20} color="white" />
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
  reviewCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  reviewContent: {
    paddingLeft: 32,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
  reviewComment: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewAuthor: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
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
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  descriptionInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
    fontSize: 15,
    color: '#333',
    minHeight: 160,
  },
  characterCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  attachmentButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  attachmentButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#667eea',
    borderStyle: 'dashed',
  },
  attachmentButtonText: {
    fontSize: 13,
    color: '#667eea',
    fontWeight: '600',
    marginTop: 8,
  },
  attachmentsList: {
    gap: 12,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  attachmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#e8eaf6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  attachmentType: {
    fontSize: 12,
    color: '#999',
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
  warningCard: {
    flexDirection: 'row',
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
    gap: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#D32F2F',
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