import handleError from './error';
import { ipgeolocation, opencagedataByCoord, opencagedataByName } from './apiResponses';
import { IPGEOLOCATION_KEY, OPENCAGEDATA_KEY } from './keys';
import { status, UserLocation } from './types';
import { confirmLocation } from './messages';

export async function loadImage(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  const base64Image = URL.createObjectURL(blob);
  return base64Image;
}

export async function getCityListByName(name: string, lang: string):
  Promise<{
    status: status,
    list: UserLocation[]
  }> {
    const result = {} as {status: status, list: UserLocation[]}
    try {
      const data = await fetch(opencagedataByName(OPENCAGEDATA_KEY, name, lang));
      if (!data.ok) {
        throw new Error();
      }
      const locationsObj = await data.json();
      result.status = 'ok';
      result.list = locationsObj.results.map((i) => (
        {
          status: 'ok',
          city: i.formatted,
          lon: i.geometry.lng,
          lat: i.geometry.lat,
          lang
        }
      ));

    } catch (error) {
      console.error(error);
      result.status = 'error';
    }
    return result;
 }

export async function getCityByCoord(lat: number, lon: number, lang?: string):
  Promise<UserLocation> {
  const result = {} as UserLocation;

  try {
    let data: any;
    if (lang) {
      data = await fetch(opencagedataByCoord(OPENCAGEDATA_KEY, lat, lon, lang));
    } else {
      data = await fetch(opencagedataByCoord(OPENCAGEDATA_KEY, lat, lon));
    }

    if (!data.ok) {
      throw new Error();
    }

    const locationObj = await data.json();

    if (locationObj.status.code === 200) {
      result.status = 'ok';
      const results = locationObj.results;
      const cityObj = results.reduce((acc, i) => acc.confidence < i.confidence ? i : acc);
      result.city = cityObj.formatted;
      result.lang = lang;
      result.lat = lat;
      result.lon = lon;
    }
  } catch (error) {
    console.error(error);
    result.status = 'error';
  }

  return result;
}

export async function detectLocationByIp(): Promise<UserLocation> {
  const result = {} as UserLocation;
  let locationObj = {} as any;

  try {
    const data = await fetch(ipgeolocation(IPGEOLOCATION_KEY));
    if (!data.ok) {
      throw new Error();
    }

    locationObj = await data.json();
    result.lang = locationObj.languages.includes('ru') ? 'ru' : 'en';
    result.lat = Number(locationObj.latitude);
    result.lon = Number(locationObj.longitude);
    result.city = locationObj.city;
    result.status = 'ok';
  } catch (error) {
    console.error(error);
    result.status = 'error';
  }

  return result;
}

export async function  detectLocationByGeolocation(): Promise<UserLocation> {
  const result = {} as UserLocation;

  function getCurrentPosition(options = {}) {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  }

  try {
    const position: any = await getCurrentPosition();
    result.lat = position.coords.latitude;
    result.lon = position.coords.longitude;
    result.status = 'ok';
} catch (error) {
  result.status = 'error';
}
  return result;
}

export async function getLocation(): Promise<UserLocation> {
  let result = await detectLocationByGeolocation();
  result.lang = navigator.language || 'en';

  if (result.status === 'error') {
    result = await detectLocationByIp();
    result.lang = navigator.language || result.lang;

    if (result.lang === 'ru') {
      const userCity = await (getCityByCoord(result.lat, result.lon, 'ru'));
      if (userCity.status === 'ok') {
        result = userCity;
      }
    }
  } else {
    const userCity = await getCityByCoord(result.lat, result.lon, result.lang);
    if (userCity.status === 'ok') {
      result = userCity;
    }
  }

  result = await confirmLocation(result);

  return result;
}