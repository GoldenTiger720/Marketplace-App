import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { UserRole } from '../types';

interface Props {
  onRegister: (data: any) => void;
  onNavigateToLogin: () => void;
}

export default function RegisterScreen({ onRegister, onNavigateToLogin }: Props) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = () => {
    if (name && email && phone && password && zipCode && city && state) {
      const registrationData: any = {
        name,
        email,
        phone,
        password,
        zipCode,
        city,
        state,
        role
      };

      // Add business name for providers
      if (role === 'provider' && businessName) {
        registrationData.businessName = businessName;
      }

      onRegister(registrationData);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.header}
          >
            <TouchableOpacity onPress={onNavigateToLogin} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t('auth.register')}</Text>
          </LinearGradient>

          <View style={styles.formContainer}>
            <Text style={styles.title}>{t('auth.signUp')}</Text>

            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t('auth.name')}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t('auth.email')}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t('auth.phone')}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t('auth.zipCode')}
                value={zipCode}
                onChangeText={setZipCode}
                keyboardType="number-pad"
                maxLength={5}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="business-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t('auth.city')}
                value={city}
                onChangeText={setCity}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="map-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t('auth.state')}
                value={state}
                onChangeText={setState}
                autoCapitalize="characters"
                maxLength={2}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t('auth.password')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.roleContainer}>
              <Text style={styles.roleLabel}>{t('auth.role')}:</Text>
              <View style={styles.roleButtons}>
                <TouchableOpacity
                  style={[styles.roleButton, role === 'customer' && styles.roleButtonActive]}
                  onPress={() => setRole('customer')}
                >
                  <Ionicons
                    name="person"
                    size={20}
                    color={role === 'customer' ? 'white' : '#667eea'}
                  />
                  <Text style={[styles.roleButtonText, role === 'customer' && styles.roleButtonTextActive]}>
                    {t('auth.customer')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.roleButton, role === 'provider' && styles.roleButtonActive]}
                  onPress={() => setRole('provider')}
                >
                  <Ionicons
                    name="hammer"
                    size={20}
                    color={role === 'provider' ? 'white' : '#667eea'}
                  />
                  <Text style={[styles.roleButtonText, role === 'provider' && styles.roleButtonTextActive]}>
                    {t('auth.provider')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {role === 'provider' && (
              <View style={styles.inputContainer}>
                <Ionicons name="briefcase-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Business Name (Optional)"
                  value={businessName}
                  onChangeText={setBusinessName}
                />
              </View>
            )}

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.registerButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.registerButtonText}>{t('auth.signUp')}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>{t('auth.hasAccount')} </Text>
              <TouchableOpacity onPress={onNavigateToLogin}>
                <Text style={styles.loginLink}>{t('auth.signIn')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 70,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 10,
  },
  formContainer: {
    flex: 1,
    padding: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
  },
  roleContainer: {
    marginBottom: 25,
  },
  roleLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    fontWeight: '600',
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderWidth: 2,
    borderColor: '#667eea',
    borderRadius: 12,
    gap: 8,
  },
  roleButtonActive: {
    backgroundColor: '#667eea',
  },
  roleButtonText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  roleButtonTextActive: {
    color: 'white',
  },
  registerButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  registerButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  loginText: {
    color: '#666',
    fontSize: 15,
  },
  loginLink: {
    color: '#667eea',
    fontSize: 15,
    fontWeight: 'bold',
  },
});