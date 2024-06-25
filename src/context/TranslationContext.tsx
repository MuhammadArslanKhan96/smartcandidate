"use client";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import English from "@/locales/en/translations.json";
import Portuguese from "@/locales/pt/translations.json";

export const languages = {
  en: {
    label: "English",
    translation: English
  },
  pt: {
    label: "Portuguese",
    translation: Portuguese
  }
};

const defaultLanguage = "en";

const TranslationContext = createContext({
  selectedLang: "en", setSelectedLang: (lang: string) => { }, translations: {}
});

export default function TranslationContextProvider({ children }: { children: ReactNode }) {
  const [selectedLang, setSelectedLang] = useState(defaultLanguage);
  const [translations, setTranslations] = useState(languages[selectedLang].translation);

  // Effect to update translations when language changes
  useEffect(() => {
    setTranslations(languages[selectedLang].translation);
  }, [selectedLang]);

  return (
    <TranslationContext.Provider value={{ selectedLang, translations, setSelectedLang }}>
      {children}
    </TranslationContext.Provider>
  );
};



export const useTranslation = () => useContext(TranslationContext);