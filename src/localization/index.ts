import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import el from './locales/el.json';
import en from './locales/en.json'

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {el,en},
    lng: "en",
    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;