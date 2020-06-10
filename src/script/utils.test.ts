import {
  getIconPath, copyObject, formatGeo, getFutureDay,
  shuffleArr, extractCity, formatNowUTC, getTimes
} from './utils';


const input: [0|1, number][] = [
  [1, 1261],
  [0, 1249],
  [1, 1006],
  [0, 1030],
  [1, 1000],
]
describe('getIconPath', () => {
  test('should return "../img/1/rainy5.svg"', () => {
    expect(getIconPath(1, 1243)).toBe('./src/img/icons/day/rainy5.svg');
  });

  test('should return "../img/0/snowy1.svg"', () => {
    expect(getIconPath(1, 1255)).toBe('./src/img/icons/day/snowy1.svg');
  });
  input.forEach((i) => {
    test('output should to match regexp "/^\.\.\/img\/(0|1)\/[a-z]{3,}\d?\.svg$/"', () => {
      expect(getIconPath(i[0], i[1])).toMatch(/^\.\/src\/img\/icons\/(day|night)\/[a-z]{3,}\d?.svg$/);
    });
  });

  test('should processed wrong code', () => {
    expect(getIconPath(1, 1)).toBe('./src/img/icons/day/clear.svg');
  });
});


const a = {};
const b = {
  first: 'a',
  second: 2,
  third: [1, 2],
  fourth: {
    foo: 'bar',
    baz: [1, 'q'],
  }
}
describe('copyObject', () => {
  test('should return other object', () => {
    expect(copyObject(a)).not.toBe(a);
  });
  test('should return to match object', () => {
    expect(copyObject(b)).toStrictEqual(b);
  })
})


const geoCoords = [
  [`53° 52' 59.59200'' N`, `53° 52' N`],
  [`26° 38' 43.032'' E`, `26° 38' E`],
  [`53° 30' 57.5520'' N`, `53° 30' N`],
  [`53° 30' 57.5530'' N`, `53° 30' N`],
  [`"28° 6' 35.34840'' E`, `"28° 6' E`],
  [`54° 33' 8.71596'' N`, `54° 33' N`]
]
describe('formatGeo', () => {
  geoCoords.forEach((i) => {
    test('should return right result', () => {
      expect(formatGeo(i[0])).toBe(i[1]);
    })
  });
})


const testArray = (new Array(50)).fill(0).map((i, k) => k);
describe('shuffleArr', () => {
  test('should return other array, not link', () => {
    expect(shuffleArr(testArray)).not.toBe(testArray);
  })
  for(let i = 0; i < 10; i++) {
    test('should return shuffled array', () => {
      const testArr = (new Array(50)).fill(0).map((_i, k) => k);
      expect(JSON.stringify(shuffleArr(testArr))).not.toBe(JSON.stringify(testArr));
    })
  }
  for(let i = 0; i < 10; i++) {
    test('should return shuffled array to equal original array', () => {
      const testArr = (new Array(50)).fill(0).map((_i, k) => k);
      expect(shuffleArr(testArr)).toEqual(expect.arrayContaining(testArr));
      expect(shuffleArr(testArr).length).toBe(testArr.length);
    });
  }
})


const testApiRes = [
  {
    "components": {
      "ISO_3166-1_alpha-2": "LT",
      "ISO_3166-1_alpha-3": "LTU",
      "_category": "place",
      "_type": "city",
      "city": "Вевис",
      "continent": "Europe",
      "country": "Литва",
      "country_code": "lt",
      "county": "Vievio seniūnija",
      "political_union": "European Union",
      "state": "Вильнюсский уезд",
      "state_district": "Электренское самоуправление"
    },
    "formatted": "Вевис, Vievio seniūnija, Литва",
  },
  {
    "components": {
      "ISO_3166-1_alpha-2": "BY",
      "ISO_3166-1_alpha-3": "BLR",
      "_category": "place",
      "_type": "city",
      "city": "Ивье",
      "continent": "Europe",
      "country": "Беларусь",
      "country_code": "by",
      "county": "Ивьевский район",
      "postcode": "231337",
      "state": "Гродненская область"
    },
    "formatted": "Ивье, Ивьевский район, Беларусь",
  },
  {
    "components": {
      "ISO_3166-1_alpha-2": "RS",
      "ISO_3166-1_alpha-3": "SRB",
      "_category": "natural/water",
      "_type": "peak",
      "city": "Општина Беочин",
      "continent": "Europe",
      "country": "Сербия",
      "country_code": "rs",
      "county": "Южно-Бачский административный округ",
      "peak": "Иве",
      "state": "Воеводина"
    },
    "formatted": "Иве, Општина Беочин, Южно-Бачский административный округ, Сербия",
  },
  {
    "components": {
      "ISO_3166-1_alpha-2": "RU",
      "ISO_3166-1_alpha-3": "RUS",
      "_category": "place",
      "_type": "village",
      "continent": "Europe",
      "country": "Россия",
      "country_code": "ru",
      "county": "Волотовский муниципальный округ",
      "hamlet": "Ивье",
      "state": "Новгородская область"
    },
    "formatted": "Ивье, Волотовский муниципальный округ, Россия",
  },
  {
    "components": {
      "ISO_3166-1_alpha-2": "BY",
      "ISO_3166-1_alpha-3": "BLR",
      "_category": "place",
      "_type": "neighbourhood",
      "city": "Ивьевский сельский Совет",
      "continent": "Europe",
      "country": "Беларусь",
      "country_code": "by",
      "county": "Ивьевский район",
      "state": "Гродненская область",
      "suburb": "Ивье"
    },
    "formatted": "Ивье, Ивьевский сельский Совет, Ивьевский район, Беларусь",
  },
  {
    "components": {
      "ISO_3166-1_alpha-2": "LU",
      "ISO_3166-1_alpha-3": "LUX",
      "_category": "commerce",
      "_type": "restaurant",
      "city": "Люксембург",
      "continent": "Europe",
      "country": "Люксембург",
      "country_code": "lu",
      "county": "Canton Luxembourg",
      "pedestrian": "Rue Louvigny",
      "political_union": "European Union",
      "postcode": "1946",
      "restaurant": "Ivi",
      "suburb": "Ville-Haute"
    },
    "formatted": "Ivi, Rue Louvigny, 1946 Люксембург, Люксембург",
  },
  {
    "components": {
      "ISO_3166-1_alpha-2": "ES",
      "ISO_3166-1_alpha-3": "ESP",
      "_category": "health",
      "_type": "clinic",
      "city": "Саламанка",
      "city_district": "Centro",
      "clinic": "IVI",
      "continent": "Europe",
      "country": "Испания",
      "country_code": "es",
      "county": "Salamanca",
      "county_code": "SA",
      "house_number": "72,90",
      "political_union": "European Union",
      "postcode": "37001",
      "road": "Calle Gran Vía",
      "state": "Кастилия и Леон"
    },
    "formatted": "IVI, Calle Gran Vía, 72, 90, 37001 Саламанка, Испания",
  },
  {
    "components": {
      "ISO_3166-1_alpha-2": "ES",
      "ISO_3166-1_alpha-3": "ESP",
      "_category": "health",
      "_type": "clinic",
      "city": "Бургос",
      "clinic": "Ivi",
      "continent": "Europe",
      "country": "Испания",
      "country_code": "es",
      "county": "Бургос",
      "neighbourhood": "San Julián",
      "political_union": "European Union",
      "postcode": "09005",
      "road": "Avenida Reyes Católicos",
      "state": "Кастилия и Леон",
      "suburb": "Vadillos"
    },
    "formatted": "Ivi, Avenida Reyes Católicos, 09005 Бургос, Испания",
  },
  {
    "components": {
      "ISO_3166-1_alpha-2": "ES",
      "ISO_3166-1_alpha-3": "ESP",
      "_category": "health",
      "_type": "doctors",
      "city": "Пальма",
      "continent": "Europe",
      "country": "Испания",
      "country_code": "es",
      "county": "Балеарские острова",
      "doctors": "Ivi",
      "neighbourhood": "el Patatí",
      "political_union": "European Union",
      "postcode": "07013",
      "road": "carrer de Bartomeu Cabrer",
      "state": "Балеарские острова",
      "suburb": "Son Peretó"
    },
    "formatted": "Ivi, carrer de Bartomeu Cabrer, 07013 Пальма, Испания",
  },
  {
    "components": {
      "ISO_3166-1_alpha-2": "ES",
      "ISO_3166-1_alpha-3": "ESP",
      "_category": "health",
      "_type": "clinic",
      "city": "Льейда",
      "clinic": "IVI",
      "continent": "Europe",
      "country": "Испания",
      "country_code": "es",
      "county": "Сегрия",
      "house_number": "35",
      "neighbourhood": "Rambla de Ferran - Estació",
      "political_union": "European Union",
      "postcode": "25007",
      "road": "Rambla de Ferran",
      "state": "Каталония",
      "suburb": "Torre del Forner"
    },
    "formatted": "IVI, Rambla de Ferran, 35, 25007 Льейда, Испания",
  },
];

describe('extractCity', () => {
  test('should return {name: "Вевис"}', () => {
    expect(extractCity(testApiRes[0]).name).toBe('Вевис');
  });
  test('should return {name: "Ивье"}', () => {
    expect(extractCity(testApiRes[1]).name).toBe('Ивье');
  });
  test('should return {name: "Иве"}', () => {
    expect(extractCity(testApiRes[2]).name).toBe('Иве');
  });
  test('should return {name: "Ивье"}', () => {
    expect(extractCity(testApiRes[3]).name).toBe('Ивье');
  });
  test('should return {name: "Ивье"}', () => {
    expect(extractCity(testApiRes[4]).name).toBe('Ивье');
  });
  test('should return {name: "Ivi"}', () => {
    expect(extractCity(testApiRes[5]).name).toBe('Ivi');
  });
  test('should return {name: "IVI"}', () => {
    expect(extractCity(testApiRes[6]).name).toBe('IVI');
  });
  test('should return {name: "Ivi"}', () => {
    expect(extractCity(testApiRes[7]).name).toBe('Ivi');
  });
  test('should return {name: "Ivi"}', () => {
    expect(extractCity(testApiRes[8]).name).toBe('Ivi');
  });
  test('should return {name: "IVI"}', () => {
    expect(extractCity(testApiRes[9]).name).toBe('IVI');
  });
})

const testTimes: [number, string, string][] = [
  [1577836800000, 'en', 'Wed 01.01 00:00:00'],
  [562206000000, 'ru', 'Пн 26.10 00:20:00'],
  [1580601600000, 'be', 'Няд 02.02 00:00:00'],
  [2211753600000, 'en', 'Thu 02.02 00:00:00'],
  [1590969600000, 'ru', 'Пн 01.06 00:00:00'],
]
describe('formatNowUTC', () => {
  testTimes.forEach((i) => {
    test('should return right string', () => {
      expect(formatNowUTC(i[0], i[1])).toBe(i[2]);
    })
  });
})


const testDays: [number, number, string, string][] = [
  [562206000000, 0, 'ru', 'Понедельник'],
  [562206000000, 1, 'be', 'Аўторак'],
  [562206000000, 2, 'ru', 'Среда'],
  [562206000000, 3, 'ru', 'Четверг'],
  [562206000000, 4, 'ru', 'Пятница'],
  [562206000000, 5, 'ru', 'Суббота'],
  [562206000000, 6, 'ru', 'Воскресенье'],
  [562206000000, 7, 'en', 'Monday'],
]
describe('getFutureDay', () => {
  testDays.forEach((i) => {
    test('should return right string', () => {
      expect(getFutureDay(i[0], i[1], i[2])).toBe(i[3]);
    })
  });
});
