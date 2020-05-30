import { getIconPath } from './utils';

const input: Array<number[]> = [
  [1, 1261],
  [0, 1249],
  [1, 1006],
  [1, 1030],
  [0, 1000]
]

describe('getIconPath', () => {
  test('should return "../img/1/rainy5.svg"', () => {
    expect(getIconPath(1, 1243)).toBe('../img/1/rainy5.svg');
  });

  test('should return "../img/0/snowy1.svg"', () => {
    expect(getIconPath(1, 1255)).toBe('../img/1/snowy1.svg');
  });

  test('output should to match regexp "/^\.\.\/img\/(0|1)\/[a-z]{3,}\d?\.svg$/"', () => {
    input.forEach((i) => expect(getIconPath(i[0], i[1])).toMatch(/^\.\.\/img\/(0|1)\/[a-z]{3,}\d?.svg$/)); 
  });

  test('should processed wrong code', () => {
    expect(getIconPath(1, 1)).toBe('../img/1/clear.svg');
  })
});