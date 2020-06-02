export const languages = {
  en: {
    'MESSAGE_CONFIRM_LOCATION': 'Check your location',
    'MESSAGE_ASK_LOCATION': 'Input your location here',
    'CONFIRM': 'confirm',
    'CHANGE': 'change',
    'CANCEL': 'cancel',
    'SOME FEATURES ARE CURRENTLY UNAVAILABLE': 'Sorry, some features are currently unavailable',
    'SEARCH FAILED': 'Search failed',
    'UNABLE TO DETERMINE LOCATION': 'Sorry, unable to determine your location',
    'CITY NAME DOESNT TRANSLATE': 'Failed to get translation for locality name',
    'NO_BACKGROUND': 'Failed to load background images',
    'LATITUDE': 'Latitude',
    'LONGITUDE': 'Longitude',
    'SEARCH PLACEHOLDER': 'Search city...',
    'SEARCH SUBMIT': 'search'

  },
  ru: {
    'MESSAGE_CONFIRM_LOCATION': 'Подтвердите Ваше местоположение',
    'MESSAGE_ASK_LOCATION': 'Введите Ваше местоположение',
    'CONFIRM': 'принять',
    'CHANGE': 'изменить',
    'CANCEL': 'отмена',
    'SOME FEATURES ARE CURRENTLY UNAVAILABLE': 'Некоторые функции сайта недоступны в настоящее время',
    'SEARCH FAILED': 'Поиск не удался по Вышему запросу',
    'UNABLE TO DETERMINE LOCATION': 'Не удалось определить Ваше местоположение',
    'CITY NAME DOESNT TRANSLATE': 'Не удалось получить перевод для названия местности',
    'NO_BACKGROUND': 'Не удалось загрузить фоновые изображения',
    'LATITUDE': 'Широта',
    'LONGITUDE': 'Долгота',
    'SEARCH PLACEHOLDER': 'Найти город...',
    'SEARCH SUBMIT': 'поиск'

  },
  be: {
    'MESSAGE_CONFIRM_LOCATION': 'Праверце Ваша месцазнаходжанне',
    'MESSAGE_ASK_LOCATION': 'Укажыце Ваша месцазнаходжанне',
    'CONFIRM': 'згадзiцца',
    'CHANGE': 'змянiць',
    'CANCEL': 'адмянiць',
    'SOME FEATURES ARE CURRENTLY UNAVAILABLE': 'Некаторыя функцыi старонкi не працуюць ў дадзены момант',
    'SEARCH FAILED': 'Немагчыма нiчога знайсцi па Вашаму запыту',
    'UNABLE TO DETERMINE LOCATION': 'Не выпала атрымаць Ваша месцазнаходжанне',
    'CITY NAME DOESNT TRANSLATE': 'Не атрымалася перавесцi назву мясцiны',
    'NO_BACKGROUND': 'Фотаздымкi для фону не дасягальныя ў дадзены момант',
    'LATITUDE': 'Шырата',
    'LONGITUDE': 'Даўгата',
    'SEARCH PLACEHOLDER': 'Пошук месца...',
    'SEARCH SUBMIT': 'пошук'
  },
}

export default function createTranslator(language: string): (text: string) => string {
  return (text) => {
    return languages[language][text];
  };
}