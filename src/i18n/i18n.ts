import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ptBR from './locales/pt-BR.json';
import ptPT from './locales/pt-PT.json';
import es from './locales/es.json';
import zhCN from './locales/zh-CN.json';
import zhHK from './locales/zh-HK.json';
import tl from './locales/tl.json';
import ar from './locales/ar.json';
import vi from './locales/vi.json';

const resources = {
  en,
  'pt-BR': ptBR,
  'pt-PT': ptPT,
  es,
  'zh-CN': zhCN,
  'zh-HK': zhHK,
  tl,
  ar,
  vi,
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;