export function  replaceInnerHTML(element: HTMLElement, newHTML: Array<Node | string> | Node | string): void {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
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