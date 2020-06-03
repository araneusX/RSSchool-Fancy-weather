import {
  ipgeolocation, opencagedataByCoord,
  opencagedataByName, flickrByTags
} from './apiResponses';
import { IPGEOLOCATION_KEY, OPENCAGEDATA_KEY, FLICKR_KEY } from './keys';
import { status, UserLocation } from './types';
import { extractCity, shuffleArr } from './utils';

export const imagesLinks = {
  index: 0,
  isList: false,
  store: [] as String[],
  cash: {
    season: '',
    time: '',
  },

  async generate(season: string, time: string): Promise<void> {
    if (!(this.cash.season === season && this.cash.time === time)) {
      this.cash = { season, time },
      console.log(`Show images by request: ${season}, ${time}`);
      this.index = 0;
      let data = await fetch(flickrByTags(FLICKR_KEY, season, time));
      if (data.ok) {
        let output = await data.json();
        let photos = output.photos.photo.filter((photo) => photo.url_h);
        if (photos.length > 0) {
          this.store = shuffleArr(photos.map((photo) => photo.url_h));
        }
      }
      if (this.store.length === 0) {
        this.store[0] = `/src/img/${season}/${time}.jpg`;
      }
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
      console.error(error);
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
    console.log(locationObj);
    
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
      console.log(locationObj);
      
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
    console.error(error);
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
    console.error(error);
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

  return result;
}
