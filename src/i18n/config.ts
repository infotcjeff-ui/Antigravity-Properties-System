'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import zhHK from './locales/zh-HK.json';
import en from './locales/en.json';

const resources = {
    'zh-HK': {
        translation: zhHK,
    },
    en: {
        translation: en,
    },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'zh-HK', // Default language - Hong Kong Chinese
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
