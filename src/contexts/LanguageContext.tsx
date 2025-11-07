import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConfigProvider } from 'antd';
import arEG from 'antd/locale/ar_EG';
import enUS from 'antd/locale/en_US';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import 'dayjs/locale/ar';
import 'dayjs/locale/en';

type Language = 'ar' | 'en';
type Direction = 'rtl' | 'ltr';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  changeLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const { i18n } = useTranslation();
  // Always default to Arabic, even if localStorage has a different value
  const [language, setLanguage] = useState<Language>('ar');
  const [direction, setDirection] = useState<Direction>('rtl');

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    setDirection(lang === 'ar' ? 'rtl' : 'ltr');
    i18n.changeLanguage(lang);
    dayjs.locale(lang);
    localStorage.setItem('language', lang);
  };

  useEffect(() => {
    // Set initial language
    i18n.changeLanguage(language);
    dayjs.locale(language);
    
    // Set document direction
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [language, direction, i18n]);

  const antdLocale = language === 'ar' ? arEG : enUS;

  return (
    <LanguageContext.Provider value={{ language, direction, changeLanguage }}>
      <ConfigProvider
        locale={antdLocale}
        direction={direction}
        theme={{
          token: {
            // Typography
            fontFamily: "'Cairo', 'Amiri', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            fontFamilyCode: "'Courier New', monospace",
            fontSize: 16,
            lineHeight: 1.8,
            
            // Primary Colors - Emerald Green
            colorPrimary: '#047857',
            colorPrimaryHover: '#10b981',
            colorPrimaryActive: '#065f46',
            colorPrimaryBg: '#d1fae5',
            colorPrimaryBgHover: '#a7f3d0',
            colorPrimaryBorder: '#6ee7b7',
            
            // Success, Warning, Error, Info
            colorSuccess: '#16a34a',
            colorWarning: '#ea580c',
            colorError: '#dc2626',
            colorInfo: '#0284c7',
            
            // Background Colors
            colorBgContainer: '#ffffff',
            colorBgElevated: '#fef9e7',
            colorBgLayout: '#fef3c7',
            colorBgSpotlight: '#fde68a',
            
            // Text Colors
            colorText: '#1c1917',
            colorTextSecondary: '#57534e',
            colorTextTertiary: '#a8a29e',
            colorTextQuaternary: '#d6d3d1',
            
            // Border
            colorBorder: '#e7e5e4',
            colorBorderSecondary: '#f5f5f4',
            borderRadius: 8,
            
            // Link
            colorLink: '#047857',
            colorLinkHover: '#10b981',
            colorLinkActive: '#065f46',
          },
          components: {
            Button: {
              primaryColor: '#ffffff',
              colorPrimary: '#047857',
              colorPrimaryHover: '#10b981',
              colorPrimaryActive: '#065f46',
              algorithm: true,
            },
            Input: {
              colorBorder: '#e7e5e4',
              colorPrimaryHover: '#10b981',
              activeBorderColor: '#047857',
              hoverBorderColor: '#10b981',
            },
            Card: {
              colorBgContainer: '#ffffff',
              colorBorderSecondary: '#f5f5f4',
            },
            Menu: {
              colorItemBg: 'transparent',
              colorItemBgSelected: '#d1fae5',
              colorItemTextSelected: '#047857',
              colorItemBgHover: '#f0fdf4',
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </LanguageContext.Provider>
  );
};
