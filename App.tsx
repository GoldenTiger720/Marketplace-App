import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { AppProvider } from './src/contexts/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import './src/i18n/i18n';
import { initDatabase } from './src/database/schema';
import { seedDatabase } from './src/database/dataMigration';

export default function App() {
  const [isDbReady, setIsDbReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Initializing database...');
        await initDatabase();
        console.log('Database initialized');

        console.log('Seeding database...');
        await seedDatabase();
        console.log('Database seeded');

        setIsDbReady(true);
      } catch (error) {
        console.error('Database initialization error:', error);
        setDbError(error instanceof Error ? error.message : 'Unknown error');
      }
    };

    initializeApp();
  }, []);

  if (dbError) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Database Error: {dbError}</Text>
      </View>
    );
  }

  if (!isDbReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Initializing app...</Text>
      </View>
    );
  }

  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <AppNavigator />
      </NavigationContainer>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 14,
    color: '#F44336',
    textAlign: 'center',
    padding: 20,
  },
});