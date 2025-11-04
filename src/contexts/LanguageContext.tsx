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
  const [language, setLanguage] = useState<Language>(
    (localStorage.getItem('language') as Language) || 'ar'
  );
  const [direction, setDirection] = useState<Direction>(
    language === 'ar' ? 'rtl' : 'ltr'
  );

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
            fontFamily:
              language === 'ar'
                ? "'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                : "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          },
        }}
      >
        {children}
      </ConfigProvider>
    </LanguageContext.Provider>
  );
};
