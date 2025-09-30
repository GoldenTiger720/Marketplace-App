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

// Types and Data
import { Provider, Customer, ServiceRequest, Lead, SubscriptionPlan } from '../types';
import { MOCK_PROVIDERS, MOCK_CUSTOMERS } from '../data/mockData';
import { useApp } from '../contexts/AppContext';

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
          tabBarLabel: 'Dashboard',
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
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      >
        {() => (
          <CustomerProfileScreen
            customer={customer}
            onBack={() => {}}
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
          tabBarLabel: 'Dashboard',
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

  const handleLogin = (_email: string, _password: string) => {
    // Mock login - in real app, this would authenticate with backend
    setIsAuthenticated(true);
    setCurrentUser(MOCK_CUSTOMERS[0]);
  };

  const handleRegister = (data: any) => {
    // Mock registration
    setIsAuthenticated(true);
    if (data.role === 'provider') {
      setCurrentUser(MOCK_PROVIDERS[0]);
    } else {
      setCurrentUser(MOCK_CUSTOMERS[0]);
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
              onRegister={handleRegister}
              onNavigateToLogin={() => props.navigation.navigate('Login' as never)}
            />
          )}
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
    </Stack.Navigator>
  );
}