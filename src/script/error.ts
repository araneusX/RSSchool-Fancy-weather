import { showNotification } from "../components/notification/showNotification";
import createTranslator from "./int";
import state from "./state";

// tslint:disable-next-line:one-variable-per-declaration
const // error types
  NO_LOCATION = 'NO_LOCATION',
  NO_SEARCH = 'NO_SEARCH',
  NO_CITY_TRANSLATE = 'NO_CITY_TRANSLATE',
  NO_BACKGROUND = 'NO_BACKGROUND',
  NO_FORECAST = 'NO_FORECAST';

export default function handleError(type: string, error?: Error | string): string {
  let result: string;
  switch (type) {
    case NO_LOCATION:
      result = 'NO_LOCATION';
      break;
    case NO_SEARCH:
      result = 'NO_SEARCH';
      break;
    case NO_CITY_TRANSLATE:
      result = 'NO_CITY_TRANSLATE';
      break;
    case NO_BACKGROUND:
      result = 'NO_BACKGROUND';
      break;
    case NO_FORECAST:
      result = 'NO_FORECAST';
    default:
      result = 'SOME FEATURES ARE CURRENTLY UNAVAILABLE';
  }

  const t = createTranslator(state.language);
  showNotification(t(result));
  return result;
}