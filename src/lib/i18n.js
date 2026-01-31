import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import en from "../locales/en.json";
import hi from "../locales/hi.json";
import ta from "../locales/ta.json";
import ml from "../locales/ml.json";
import kn from "../locales/kn.json";
import te from "../locales/te.json";

const resources = {
    en: { translation: en },
    hi: { translation: hi },
    ta: { translation: ta },
    ml: { translation: ml },
    kn: { translation: kn },
    te: { translation: te }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage']
        }
    });

export default i18n;
