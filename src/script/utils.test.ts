import { getIconPath } from './utils';

const input: Array<[string, number, number]> = [
  ['summer', 1, 1261],
  ['winter', 10, 1249],
  ['fall', 3, 1006],
  ['spring', 22, 1030],
  ['summer', 10, 1000]
]

describe('getIconPath', () => {
  test('should return "../img/1/rainy5.svg"', () => {
    expect(getIconPath('summer', 12, 1243)).toBe('/src/img/icons/day/rainy5.svg');
  });

  test('should return "../img/0/snowy1.svg"', () => {
    expect(getIconPath('winter', 14, 1255)).toBe('/src/img/icons/day/snowy1.svg');
  });

  test('output should to match regexp "/^\.\.\/img\/(0|1)\/[a-z]{3,}\d?\.svg$/"', () => {
    input.forEach((i) => expect(getIconPath(i[0], i[1], i[2])).toMatch(/^\/src\/img\/icons\/(day|night)\/[a-z]{3,}\d?.svg$/)); 
  });

  test('should processed wrong code', () => {
    expect(getIconPath('fall', 1, 1)).toMatch(/^\/src\/img\/icons\/(day|night)\/clear.svg$/);
  });
});