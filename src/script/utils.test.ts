import { getIconPath } from './utils';

const input: [0|1, number][] = [
  [1, 1261],
  [0, 1249],
  [1, 1006],
  [0, 1030],
  [1, 1000],
]

describe('getIconPath', () => {
  test('should return "../img/1/rainy5.svg"', () => {
    expect(getIconPath(1, 1243)).toBe('/src/img/icons/day/rainy5.svg');
  });

  test('should return "../img/0/snowy1.svg"', () => {
    expect(getIconPath(1, 1255)).toBe('/src/img/icons/day/snowy1.svg');
  });

  test('output should to match regexp "/^\.\.\/img\/(0|1)\/[a-z]{3,}\d?\.svg$/"', () => {
    input.forEach((i) => expect(getIconPath(i[0], i[1])).toMatch(/^\/src\/img\/icons\/(day|night)\/[a-z]{3,}\d?.svg$/));
  });

  test('should processed wrong code', () => {
    expect(getIconPath(1, 1)).toBe('/src/img/icons/day/clear.svg');
  });
});