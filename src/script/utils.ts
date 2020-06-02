export function  clearInnerHTML(element: HTMLElement): void {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

export function  replaceInnerHTML(element: HTMLElement, newHTML: (Node | string)[] | Node | string): void {
  clearInnerHTML(element);
  if (newHTML instanceof Array) {
    element.append(...newHTML);
  } else {
    element.append(newHTML);
  }
}

export function getIconPath(period: number, condition: number) {
  let fileName: string;
  switch (condition) {
    case 1000:
    case 1072:
      fileName = 'clear';
      break;
    case 1003:
    case 1171:
      fileName = 'cloudy1';
      break;
    case 1006:
      fileName = 'cloudy3';
      break;
    case 1009:
    case 1030:
    case 1135:
    case 1147:
      fileName = 'cloudy0';
      break;
    case 1063:
    case 1180:
      fileName = 'rainy1';
      break;
    case 1183:
    case 1186:
      fileName = 'rainy2';
      break;
    case 1189:
    case 1192:
      fileName = 'rainy3';
      break;
    case 1066:
    case 1114:
    case 1210:
    case 1255:
      fileName = 'snowy1';
      break;
    case 1213:
    case 1222:
    case 1258:
      fileName = 'snowy2';
      break;
    case 1216:
      fileName = 'snowy3';
      break;
    case 1219:
      fileName = 'snowy4';
      break;
    case 1069:
    case 1204:
    case 1207:
    case 1237:
    case 1249:
    case 1252:
    case 1261:
    case 1264:
      fileName = 'rainy7';
      break;
    case 1087:
    case 1273:
    case 1276:
    case 1279:
    case 1282:
      fileName = 'thunder';
      break;
    case 1117:
    case 1225:
      fileName = 'snowy6';
      break;
    case 1150:
    case 1198:
    case 1240:
      fileName = 'rainy4';
      break;
    case 1153:
    case 1201:
    case 1243:
      fileName = 'rainy5';
      break;
    case 1195:
    case 1246:
      fileName = 'rainy6';
      break;
    default:
      fileName = 'clear';
      console.error('Received wrong weathers condition code: ', condition);
      break;
  }
  return `../img/${period}/${fileName}.svg`
}

export function extractCity(apiObj: any) : {name:string, formatted: string} {
  let name: string = '';
  let formatted: string = apiObj.formatted;
  const fields = apiObj.components;

  if (fields.hamlet || fields.town || fields.village || fields.suburb || fields.locality) {
    name = fields.hamlet || fields.town || fields.village || fields.suburb || fields.locality;
  }

  if (name.length > 1) {
    if (fields.city) {
      formatted = `${fields.city}`;
      if (fields.state) {
        formatted += `, ${fields.state}, ${fields.country}`;
      } else {
        formatted += `, ${fields.country}`;
      }
    } else if (fields.state) {
      formatted = `${fields.state}, ${fields.country}`;
    }
  } else {
    const split = formatted.split(', ');
    name = fields.country === split[0] ? split.pop() : split.shift();
    formatted = split.join(', ');
  }

  name = name.replace(/\d/g, '');
  return {name, formatted};
}


export function copyObject<T>(source: T): T {
  return JSON.parse(JSON.stringify(source));
}

export function formatGeo(coordinate: number): string {
  const grad: number = Math.floor(coordinate);
  const min: number = Math.floor((coordinate - grad) * 60);
  return `${grad}\u00B0 ${min}'`;
}

export function shuffleArr(arr: Array<any>): Array<any> {
  const shuffledArr = Array.from(arr);
  let j: number; 
  let temp: any;
  for (let i = shuffledArr.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1));
    temp = shuffledArr[j];
    shuffledArr[j] = shuffledArr[i];
    shuffledArr[i] = temp;
  }
  return shuffledArr;
}

export async function createBackground(src: string): Promise<HTMLImageElement> {
  const backgroundImg = document.createElement('img') as HTMLImageElement;
  backgroundImg.classList.add('background');
  const imageLoading = () => new Promise((resolve, reject) => {
    backgroundImg.src = src;
    backgroundImg.addEventListener('load', () => resolve(), {once: true});
    backgroundImg.addEventListener('error', () => reject(), {once: true});
  });
  await imageLoading();
  return backgroundImg;
}