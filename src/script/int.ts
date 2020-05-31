export const languages = {
  en: {
    MESSAGE_CONFIRM_LOCATION: 'Check your location',
    CONFIRM: 'confirm',
    CHANGE: 'change',
    CANCEL: 'cancel',
  },
  ru: {
    MESSAGE_CONFIRM_LOCATION: 'Подтвердите Ваше местоположение',
    CONFIRM: 'принять',
    CHANGE: 'изменить',
    CANCEL: 'отмена',
  },
  be: {
    MESSAGE_CONFIRM_LOCATION: 'Праверце Ваша месцазнаходжанне',
    CONFIRM: 'згадзiцца',
    CHANGE: 'змянiць',
    CANCEL: 'адмянiць',
  },
}

export default function createTranslator(language: string): (text: string) => string {
  return (text) => {
    return languages[language][text];
  };
}