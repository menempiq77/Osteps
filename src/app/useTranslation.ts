"use client";

import { useLanguage } from "./LanguageContext";

type TranslationObject = {
  en: string;
  ar: string;
};

export function useTranslation() {
  const { language } = useLanguage();

  const t = (text: string | TranslationObject): string => {
    if (typeof text === "string") {
      return text;
    }
    return text[language] || text.en;
  };

  return { t, language };
}
