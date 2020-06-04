import {
  ipgeolocation, opencagedataByCoord,
  opencagedataByName, flickrByTags, weatherapiNow, weatherapiForecast
} from './apiResponses';
import { IPGEOLOCATION_KEY, OPENCAGEDATA_KEY, FLICKR_KEY, WEATHERAPI_KEY } from './keys';
import { status, UserLocation, Weather } from './types';
import { extractCity, shuffleArr } from './utils';

export const imagesLinks = {
  index: 0,
  isList: false,
  store: [] as string[],
  cash: {
    season: '',
    time: '',
  },

  async generate(season: string, time: string): Promise<void> {
    if (!(this.cash.season === season && this.cash.time === time)) {
      try {
        // tslint:disable-next-line:no-console
        console.log(`Show images by request: ${season}, ${time}`);
        const data = await fetch(flickrByTags(FLICKR_KEY, season, time));
        if (data.ok) {
          const output = await data.json();
          const photos = output.photos.photo.filter((photo) => photo.url_h);
          if (photos.length > 0) {
            this.store = shuffleArr(photos.map((photo) => photo.url_h));
          }
        }
        this.cash = { season, time };
        if (this.store.length === 0) {
          this.store[0] = `/src/img/backgrounds/${season}/${time}.jpg`;
        }
      } catch (e) {
        this.store[0] = `/src/img/backgrounds/${season}/${time}.jpg`;
      }
      this.index = 0;
      this.isList = true;
      }
  },

  getLink(): { status: status, value: string } {
    if (!this.isList) {
      throw new Error('list not generated')
    }
    let result = {
      status: 'error' as status,
      value: this.store[0],
    }

    if (this.store.length > 1) {
      result = {
        value: this.store[this.index],
        status: 'ok',
      }
      if (this.index < this.store.length) {
        this.index += 1;
      } else {
        this.index = 0;
      }
    }
    return result;
  }
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

      result.list = locationsObj.results
        .filter((item) => item.components._category === 'place'
            && (!item.components.neighbourhood
                || item.components.neighbourhood.toLowerCase() !== name.toLowerCase()))
        .slice(0, 10)
        .map((i) => (
          {
            status: 'ok',
            city: extractCity(i),
            lon: i.geometry.lng,
            lat: i.geometry.lat,
            DMS: {
              lon: i.annotations.DMS.lng,
              lat: i.annotations.DMS.lat,
            },
            timeOffsetSec: i.annotations.timezone.offset_sec,
            lang
          }
        ));
        if (result.list.length === 0) {
          result.status = 'error';
        }
    } catch (error) {
      result.status = 'error';
    }
    return result;
 }

export async function getCityByCoord(lat: number, lon: number, lang?: string):
  Promise<UserLocation> {
  const result = new UserLocation();

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
      const place = locationObj.results[0].components;
      if (place._type === 'place') {
        result.city = extractCity(place);
      } else {
        result.city = {
          name: place.hamlet || place.town || place.village
             || place.locality|| place.city,
          formatted: place.state
          ? `${place.state}, ${place.country}`
          : `${place.country}`,
        }
      }

      result.DMS = {
        lon: locationObj.results[0].annotations.DMS.lng,
        lat: locationObj.results[0].annotations.DMS.lat,
      },
      result.timeOffsetSec = locationObj.results[0].annotations.timezone.offset_sec,
      result.lang = lang;
      result.lat = lat;
      result.lon = lon;
    }
  } catch (error) {
    result.status = 'error';
  }

  return result;
}

export async function detectLocationByIp(): Promise<UserLocation> {
  const result = new UserLocation();
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
    result.city = {
      name: locationObj.city,
      formatted: locationObj.country_name,
    }
    result.status = 'ok';
  } catch (error) {
    result.status = 'error';
  }

  return result;
}

export async function  detectLocationByGeolocation(): Promise<UserLocation> {
  const result = new UserLocation();

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

export async function getLocation(language?: string | false): Promise<UserLocation> {
  let result = await detectLocationByGeolocation();
  result.lang = language || navigator.language || 'en';

  if (result.status === 'error') {
    result = await detectLocationByIp();
    result.lang = language || navigator.language || result.lang;
  }

  const userCity = await getCityByCoord(result.lat, result.lon, result.lang);

  if (userCity.status === 'ok') {
      result = userCity;
  }

  return result;
}

export async function getWeather(lat: number, lon: number): Promise<{
  status: status,
  value: Weather
}> {
  let resultStatus: status;
  let resultValue: Weather;
  let forecastObj;

  try {
    const forecastData = await fetch(weatherapiForecast(WEATHERAPI_KEY, lat, lon, 4));
    if (!forecastData.ok) {
      throw new Error();
    };
    forecastObj = await forecastData.json();

    resultStatus = 'ok';
    resultValue = {
      temperatureNow: {
        c: forecastObj.current.temp_c,
        f: forecastObj.current.temp_f,
      },
      feels: {
        c: forecastObj.current.feelslike_c,
        f: forecastObj.current.feelslike_f,
      },
      condition: forecastObj.current.condition.code,
      wind: forecastObj.current.wind_kph,
      humidity: forecastObj.current.humidity,
      isDay: forecastObj.current.is_day,
      nextDays: forecastObj.forecast.forecastday
        .map((day) => ({
          temperature: {
            min: {
              c: day.day.mintemp_c,
              f: day.day.mintemp_f
            },
            max: {
              c: day.day.maxtemp_c,
              f: day.day.maxtemp_f
            }
          },
          condition: day.day.condition.code,
        })),
    };
  } catch (error) {
    resultStatus = 'error';
  }
  return {
    status: resultStatus,
    value: resultValue,
  }
}
