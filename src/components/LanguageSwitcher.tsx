import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Language } from '../types';

interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)', flag: '🇧🇷' },
  { code: 'pt-PT', name: 'Portuguese (Portugal)', nativeName: 'Português (Portugal)', flag: '🇵🇹' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'zh-CN', name: 'Chinese (Mandarin)', nativeName: '中文 (普通话)', flag: '🇨🇳' },
  { code: 'zh-HK', name: 'Chinese (Cantonese)', nativeName: '中文 (粵語)', flag: '🇭🇰' },
  { code: 'tl', name: 'Tagalog', nativeName: 'Tagalog', flag: '🇵🇭' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
];

interface Props {
  onLanguageChange?: (language: Language) => void;
}

export default function LanguageSwitcher({ onLanguageChange }: Props) {
  const { i18n } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const currentLanguage = LANGUAGES.find((lang) => lang.code === i18n.language) || LANGUAGES[0];

  const handleLanguageSelect = (language: Language) => {
    i18n.changeLanguage(language);
    onLanguageChange?.(language);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.flag}>{currentLanguage.flag}</Text>
        <Ionicons name="chevron-down" size={16} color="#667eea" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.languageList}>
              {LANGUAGES.map((language) => {
                const isSelected = language.code === i18n.language;
                return (
                  <TouchableOpacity
                    key={language.code}
                    style={[
                      styles.languageItem,
                      isSelected && styles.languageItemSelected,
                    ]}
                    onPress={() => handleLanguageSelect(language.code)}
                  >
                    <View style={styles.languageInfo}>
                      <Text style={styles.languageFlag}>{language.flag}</Text>
                      <View style={styles.languageText}>
                        <Text style={styles.languageName}>{language.name}</Text>
                        <Text style={styles.languageNative}>{language.nativeName}</Text>
                      </View>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark" size={24} color="#667eea" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    gap: 4,
  },
  flag: {
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  languageList: {
    padding: 10,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 12,
    marginBottom: 8,
  },
  languageItemSelected: {
    backgroundColor: '#f0f0ff',
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  languageFlag: {
    fontSize: 28,
  },
  languageText: {
    gap: 2,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  languageNative: {
    fontSize: 14,
    color: '#666',
  },
});