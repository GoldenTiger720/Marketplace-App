import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Customer, Provider, Language } from '../types';
import { MOCK_CUSTOMERS, MOCK_PROVIDERS } from '../data/mockData';

interface AppContextType {
  currentUser: Customer | Provider | null;
  setCurrentUser: (user: Customer | Provider | null) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isProvider: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Customer | Provider | null>(MOCK_CUSTOMERS[0]);
  const [language, setLanguage] = useState<Language>('en');

  const isProvider = currentUser?.role === 'provider';

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        language,
        setLanguage,
        isProvider,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};