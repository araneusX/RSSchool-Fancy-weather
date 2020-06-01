export const languages = {
  en: {
    MESSAGE_CONFIRM_LOCATION: 'Check your location',
    MESSAGE_ASK_LOCATION: 'Input your location here',
    CONFIRM: 'confirm',
    CHANGE: 'change',
    CANCEL: 'cancel',
  },
  ru: {
    MESSAGE_CONFIRM_LOCATION: 'Подтвердите Ваше местоположение',
    MESSAGE_ASK_LOCATION: 'Введите Ваше местоположение',
    CONFIRM: 'принять',
    CHANGE: 'изменить',
    CANCEL: 'отмена',
  },
  be: {
    MESSAGE_CONFIRM_LOCATION: 'Праверце Ваша месцазнаходжанне',
    MESSAGE_ASK_LOCATION: 'Укажыце Ваша месцазнаходжанне',
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