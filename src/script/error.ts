const //error types
  NO_LOCATION = 'NO_LOCATION',
  NO_SEARCH = 'NO_SEARCH',
  NO_CITY_TRANSLATE = 'NO_CITY_TRANSLATE',
  NO_BACKGROUND = 'NO_BACKGROUND';

export default function handleError(type: string, error?: Error | string): string {
  let result: string;
  switch (type) {
    case NO_LOCATION:
      result = 'UNABLE TO DETERMINE LOCATION';
      break;
    case NO_SEARCH:
      result = 'SEARCH FAILED';
      break;
    case NO_CITY_TRANSLATE:
      result = 'CITY NAME DOESNT TRANSLATE'
      break;
    case NO_BACKGROUND:
      result = 'NO BACKGROUND'
      break;
    default:
      result = 'SOME FEATURES ARE CURRENTLY UNAVAILABLE';
  }

  return result;
}