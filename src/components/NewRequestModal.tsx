import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SERVICE_CATEGORIES } from '../data/services';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (request: {
    serviceName: string;
    description: string;
    zipCode: string;
    city: string;
    state: string;
    budgetMin: string;
    budgetMax: string;
    scheduledDate: string;
  }) => void;
  userCity: string;
  userState: string;
  userZipCode: string;
}

export default function NewRequestModal({
  visible,
  onClose,
  onSubmit,
  userCity,
  userState,
  userZipCode,
}: Props) {
  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [zipCode, setZipCode] = useState(userZipCode);
  const [city, setCity] = useState(userCity);
  const [state, setState] = useState(userState);
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [showCategories, setShowCategories] = useState(false);

  const handleSubmit = () => {
    if (serviceName && description && zipCode && city && state) {
      onSubmit({
        serviceName,
        description,
        zipCode,
        city,
        state,
        budgetMin,
        budgetMax,
        scheduledDate,
      });
      // Reset form
      setServiceName('');
      setDescription('');
      setZipCode(userZipCode);
      setCity(userCity);
      setState(userState);
      setBudgetMin('');
      setBudgetMax('');
      setScheduledDate('');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>New Service Request</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
              <View style={styles.section}>
                <Text style={styles.label}>Service Type *</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowCategories(!showCategories)}
                >
                  <Text style={[styles.inputText, !serviceName && styles.placeholder]}>
                    {serviceName || 'Select a service'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#999" />
                </TouchableOpacity>

                {showCategories && (
                  <View style={styles.categoriesList}>
                    {SERVICE_CATEGORIES.filter((cat) => cat !== 'All').map((category) => (
                      <TouchableOpacity
                        key={category}
                        style={styles.categoryItem}
                        onPress={() => {
                          setServiceName(category);
                          setShowCategories(false);
                        }}
                      >
                        <Text style={styles.categoryItemText}>{category}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>Description *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe what you need..."
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>Location</Text>
                <View style={styles.row}>
                  <View style={styles.inputHalf}>
                    <TextInput
                      style={styles.input}
                      placeholder="City"
                      value={city}
                      onChangeText={setCity}
                    />
                  </View>
                  <View style={styles.inputQuarter}>
                    <TextInput
                      style={styles.input}
                      placeholder="State"
                      value={state}
                      onChangeText={setState}
                      maxLength={2}
                      autoCapitalize="characters"
                    />
                  </View>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Zip Code"
                  value={zipCode}
                  onChangeText={setZipCode}
                  keyboardType="number-pad"
                  maxLength={5}
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>Budget Range (Optional)</Text>
                <View style={styles.row}>
                  <View style={styles.inputHalf}>
                    <TextInput
                      style={styles.input}
                      placeholder="Min ($)"
                      value={budgetMin}
                      onChangeText={setBudgetMin}
                      keyboardType="number-pad"
                    />
                  </View>
                  <View style={styles.inputHalf}>
                    <TextInput
                      style={styles.input}
                      placeholder="Max ($)"
                      value={budgetMax}
                      onChangeText={setBudgetMax}
                      keyboardType="number-pad"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>Preferred Date (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/DD/YYYY"
                  value={scheduledDate}
                  onChangeText={setScheduledDate}
                />
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.submitButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.submitButtonText}>Submit Request</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
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
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  placeholder: {
    color: '#999',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  inputHalf: {
    flex: 1,
  },
  inputQuarter: {
    width: 80,
  },
  categoriesList: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginTop: 5,
    maxHeight: 200,
  },
  categoryItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryItemText: {
    fontSize: 15,
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  submitButton: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  submitButtonGradient: {
    padding: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});