// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome to our Movie Tickets Website",
      "header": "Header Section",
      "changeLanguage": "Change Language",
    },
  },
  vi: {
    translation: {
      "welcome": "Chào mừng bạn đến với trang web Vé Xem Phim",
      "header": "Phần Header",
      "changeLanguage": "Thay đổi ngôn ngữ",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // Ngôn ngữ mặc định là tiếng Anh
  interpolation: {
    escapeValue: false, // React đã tự xử lý việc escape
  },
});

export default i18n;
