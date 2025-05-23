import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationEnglish from '../locales/en/translation.json';
import translationItalian from '../locales/it/translation.json';

const resources = {
  en: {
    translation: translationEnglish,
  },
  it: {
    translation: translationItalian,
  },
};

i18n.use(LanguageDetector).use(initReactI18next).init({
  fallbackLng: 'it',
  debug: true,
  resources,
});

export default i18n;
