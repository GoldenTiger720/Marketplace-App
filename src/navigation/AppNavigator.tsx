import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ProviderProfileScreen from '../screens/ProviderProfileScreen';
import CustomerProfileScreen from '../screens/CustomerProfileScreen';
import ChatScreen from '../screens/ChatScreen';
import CustomerDashboardScreen from '../screens/CustomerDashboardScreen';
import ProviderDashboardScreen from '../screens/ProviderDashboardScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import InsuranceUploadScreen from '../screens/InsuranceUploadScreen';
import VerificationPaymentScreen from '../screens/VerificationPaymentScreen';
import SubmitReviewScreen from '../screens/SubmitReviewScreen';
import DisputeReviewScreen from '../screens/DisputeReviewScreen';
import LeadPurchaseScreen from '../screens/LeadPurchaseScreen';
import PaymentProcessingScreen from '../screens/PaymentProcessingScreen';
import BackgroundCheckConsentScreen from '../screens/BackgroundCheckConsentScreen';
import BackgroundCheckStatusScreen from '../screens/BackgroundCheckStatusScreen';

// Types and Data
import { Provider, Customer, ServiceRequest, Lead, SubscriptionPlan } from '../types';
import { MOCK_PROVIDERS, MOCK_CUSTOMERS } from '../data/mockData';
import { useApp } from '../contexts/AppContext';
import { authenticateUser, registerUser } from '../database/userService';
import { Alert } from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

interface TabsProps {
  onLogout: () => void;
}

function CustomerTabs({ onLogout }: TabsProps) {
  const { t } = useTranslation();
  const { currentUser } = useApp();

  if (!currentUser || currentUser.role !== 'customer') {
    return null;
  }

  const customer = currentUser as Customer;
  const navigation = useNavigation();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#667eea',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#eee',
          paddingBottom: 20,
          paddingTop: 10,
          height: 85,
          backgroundColor: 'white',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 5,
        },
        tabBarIconStyle: {
          marginTop: 5,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarLabel: t('common.search'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      >
        {() => (
          <HomeScreen
            onProviderPress={(provider: Provider) => (navigation as any).navigate('ProviderProfile', { provider })}
            onFilterPress={() => {}}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Dashboard"
        options={{
          tabBarLabel: t('common.dashboard'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      >
        {() => (
          <CustomerDashboardScreen
            customer={customer}
            onRequestPress={() => {}}
            onCreateRequest={() => {}}
            onLogout={onLogout}
            onViewProfile={() => (navigation as any).navigate('CustomerProfile')}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Messages"
        options={{
          tabBarLabel: t('dashboard.messages'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" size={size} color={color} />
          ),
        }}
      >
        {() => (
          <ChatScreen
            currentUserId={customer.id}
            otherUser={MOCK_PROVIDERS[0]}
            onBack={() => {}}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Profile"
        options={{
          tabBarLabel: t('provider.profile'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      >
        {(props) => (
          <CustomerProfileScreen
            customer={customer}
            onBack={() => (props.navigation as any).navigate('Dashboard')}
            onEditProfile={() => {}}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

function ProviderTabs({ onLogout }: TabsProps) {
  const { t } = useTranslation();
  const { currentUser } = useApp();

  if (!currentUser || currentUser.role !== 'provider') {
    return null;
  }

  const provider = currentUser as Provider;
  const navigation = useNavigation();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#667eea',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#eee',
          paddingBottom: 20,
          paddingTop: 10,
          height: 85,
          backgroundColor: 'white',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 5,
        },
        tabBarIconStyle: {
          marginTop: 5,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        options={{
          tabBarLabel: t('common.dashboard'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      >
        {() => (
          <ProviderDashboardScreen
            provider={provider}
            onLeadPress={() => {}}
            onSubscriptionPress={() => (navigation as any).navigate('Subscription')}
            onLogout={onLogout}
            onViewProfile={() => {}}
            onVerificationPress={() => (navigation as any).navigate('InsuranceUpload')}
            onPurchaseLeads={() => (navigation as any).navigate('LeadPurchase')}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Leads"
        options={{
          tabBarLabel: t('dashboard.myLeads'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="briefcase-outline" size={size} color={color} />
          ),
        }}
      >
        {() => (
          <ProviderDashboardScreen
            provider={provider}
            onLeadPress={() => {}}
            onSubscriptionPress={() => (navigation as any).navigate('Subscription')}
            onLogout={onLogout}
            onViewProfile={() => {}}
            onVerificationPress={() => (navigation as any).navigate('InsuranceUpload')}
            onPurchaseLeads={() => (navigation as any).navigate('LeadPurchase')}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Messages"
        options={{
          tabBarLabel: t('dashboard.messages'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" size={size} color={color} />
          ),
        }}
      >
        {() => (
          <ChatScreen
            currentUserId={provider.id}
            otherUser={MOCK_CUSTOMERS[0]}
            onBack={() => {}}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Profile"
        options={{
          tabBarLabel: t('provider.profile'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      >
        {() => (
          <ProviderProfileScreen
            provider={provider}
            onBack={() => {}}
            onContactPress={() => (navigation as any).navigate('Chat', { otherUser: MOCK_CUSTOMERS[0] })}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { setCurrentUser, isProvider, currentUser } = useApp();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    try {
      const user = await authenticateUser(email, password);

      if (user) {
        setIsAuthenticated(true);
        setCurrentUser(user);
      } else {
        Alert.alert('Login Failed', 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Error', error instanceof Error ? error.message : 'An error occurred during login');
    }
  };

  const handleRegister = async (data: any, navigation?: any) => {
    try {
      const user = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        role: data.role,
        zipCode: data.zipCode,
        city: data.city,
        state: data.state,
        businessName: data.businessName,
      });

      if (data.role === 'provider') {
        // Providers must complete background check before activation
        // Don't authenticate yet, let them complete background check first
        setCurrentUser(user);
        if (navigation) {
          setTimeout(() => {
            navigation.navigate('BackgroundCheckConsent');
          }, 100);
        }
      } else {
        // Customers can be authenticated immediately
        setCurrentUser(user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Registration Error', error instanceof Error ? error.message : 'An error occurred during registration');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const handleSubscribe = (plan: SubscriptionPlan) => {
    if (currentUser && 'subscriptionPlan' in currentUser) {
      const updatedProvider = { ...currentUser, subscriptionPlan: plan };
      setCurrentUser(updatedProvider);
    }
  };

  if (!isAuthenticated) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login">
          {(props) => (
            <LoginScreen
              {...props}
              onLogin={handleLogin}
              onNavigateToRegister={() => props.navigation.navigate('Register' as never)}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Register">
          {(props) => (
            <RegisterScreen
              {...props}
              onRegister={(data) => handleRegister(data, props.navigation)}
              onNavigateToLogin={() => props.navigation.navigate('Login' as never)}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="BackgroundCheckConsent">
          {(props) => (
            <BackgroundCheckConsentScreen
              onBack={() => props.navigation.goBack()}
              onSubmit={(consentData) => {
                console.log('Background check consent submitted:', consentData);
                (props.navigation as any).navigate('BackgroundCheckStatus');
              }}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="BackgroundCheckStatus">
          {(props) => {
            const mockBackgroundCheck = {
              id: 'bg_new',
              providerId: currentUser?.id || '',
              status: 'in_progress' as const,
              initiatedAt: new Date().toISOString(),
              provider: 'Checkr',
              results: {
                criminalRecordsCheck: {
                  status: 'pending' as const,
                  checkedAt: new Date().toISOString(),
                },
                sexOffenderRegistryCheck: {
                  status: 'pending' as const,
                  checkedAt: new Date().toISOString(),
                },
                nationalDatabaseCheck: {
                  status: 'pending' as const,
                  checkedAt: new Date().toISOString(),
                },
                stateRecordsCheck: {
                  status: 'pending' as const,
                  checkedAt: new Date().toISOString(),
                },
                identityVerification: {
                  status: 'pending' as const,
                  checkedAt: new Date().toISOString(),
                },
                clearanceLevel: 'review_required' as const,
              },
            };

            return (
              <BackgroundCheckStatusScreen
                onBack={() => {
                  // After viewing status, authenticate them so they can see dashboard
                  setIsAuthenticated(true);
                }}
                backgroundCheck={mockBackgroundCheck}
              />
            );
          }}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs">
        {() => (isProvider ? <ProviderTabs onLogout={handleLogout} /> : <CustomerTabs onLogout={handleLogout} />)}
      </Stack.Screen>
      <Stack.Screen name="ProviderProfile">
        {(props) => (
          <ProviderProfileScreen
            provider={(props.route.params as any)?.provider || (currentUser as Provider)}
            onBack={() => props.navigation.goBack()}
            onContactPress={() => props.navigation.navigate('MainTabs' as never)}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="CustomerProfile">
        {(props) => (
          <CustomerProfileScreen
            customer={currentUser as Customer}
            onBack={() => props.navigation.goBack()}
            onEditProfile={() => {}}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Chat">
        {(props) => (
          <ChatScreen
            currentUserId={currentUser.id}
            otherUser={(props.route.params as any)?.otherUser}
            onBack={() => props.navigation.goBack()}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Subscription">
        {(props) => (
          <SubscriptionScreen
            currentPlan={(currentUser as Provider)?.subscriptionPlan || 'none'}
            onBack={() => props.navigation.goBack()}
            onSubscribe={(plan) => {
              handleSubscribe(plan);
              props.navigation.goBack();
            }}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="InsuranceUpload">
        {(props) => (
          <InsuranceUploadScreen
            onBack={() => props.navigation.goBack()}
            onComplete={(insuranceData) => {
              (props.navigation as any).navigate('VerificationPayment', { insuranceData });
            }}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="VerificationPayment">
        {(props) => (
          <VerificationPaymentScreen
            onBack={() => props.navigation.goBack()}
            insuranceData={(props.route.params as any)?.insuranceData}
            onComplete={() => {
              // Update provider to verified status
              if (currentUser && 'hasInsurance' in currentUser) {
                const updatedProvider = {
                  ...currentUser,
                  hasInsurance: true,
                  isVerified: true,
                };
                setCurrentUser(updatedProvider);
              }
              props.navigation.navigate('MainTabs' as never);
            }}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="SubmitReview">
        {(props) => (
          <SubmitReviewScreen
            onBack={() => props.navigation.goBack()}
            reviewee={(props.route.params as any)?.reviewee}
            isProviderReviewing={(props.route.params as any)?.isProviderReviewing || false}
            onSubmit={(rating, comment) => {
              // In real app, save review to backend
              console.log('Review submitted:', { rating, comment });
              props.navigation.goBack();
            }}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="DisputeReview">
        {(props) => (
          <DisputeReviewScreen
            onBack={() => props.navigation.goBack()}
            review={(props.route.params as any)?.review}
            onSubmit={(description, attachments) => {
              // In real app, submit dispute to backend
              console.log('Dispute submitted:', { description, attachments });
              props.navigation.goBack();
            }}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="LeadPurchase">
        {(props) => (
          <LeadPurchaseScreen
            onBack={() => props.navigation.goBack()}
            currentLeads={
              currentUser && 'availableLeads' in currentUser
                ? currentUser.availableLeads
                : 0
            }
            onPurchase={(packageItem) => {
              // Navigate to payment processing
              (props.navigation as any).navigate('PaymentProcessing', {
                amount: packageItem.price,
                description: `${packageItem.name} - ${packageItem.leadsCount} lead${packageItem.leadsCount > 1 ? 's' : ''}`,
                paymentType: 'lead_purchase',
                onSuccess: () => {
                  // Update provider leads count
                  if (currentUser && 'availableLeads' in currentUser) {
                    const updatedProvider = {
                      ...currentUser,
                      availableLeads: currentUser.availableLeads + packageItem.leadsCount,
                    };
                    setCurrentUser(updatedProvider);
                  }
                  props.navigation.navigate('MainTabs' as never);
                },
              });
            }}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="PaymentProcessing">
        {(props) => (
          <PaymentProcessingScreen
            onBack={() => props.navigation.goBack()}
            amount={(props.route.params as any)?.amount || 0}
            description={(props.route.params as any)?.description || ''}
            paymentType={(props.route.params as any)?.paymentType || 'lead_purchase'}
            onComplete={() => {
              const onSuccess = (props.route.params as any)?.onSuccess;
              if (onSuccess) {
                onSuccess();
              } else {
                props.navigation.navigate('MainTabs' as never);
              }
            }}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}