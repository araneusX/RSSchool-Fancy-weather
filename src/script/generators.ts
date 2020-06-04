import { getLocation, getCityByCoord, imagesLinks, getWeather } from './getData';
import state, { setState } from './state';
import handleError from './error';
import { RequestLocation } from '../components/confirmLocation/reqestLocation';
import { getUserSearch } from '../components/addUserSearch/addUserSearch';
import { status, UserLocation, State } from './types';
import preloader from '../components/preloader/preloader';
import { getTimes, createPhrases } from './utils';
import createTranslator from './int';
import { showNotification } from '../components/notification/showNotification';

type startStatus = 'ok' | 'error' | 'auto';
export async function setStartData(onResultCallback?: (status: startStatus) => any): Promise<startStatus> {
  let savedState: State;
  let autoDetectedLocation: string;
  let myStatus: startStatus;
  if (localStorage) {
    if (localStorage.weatherState) {
      savedState = JSON.parse(localStorage.weatherState);
    }

    if (localStorage.autoDetectedLocation) {
      autoDetectedLocation = localStorage.autoDetectedLocation;
    }
  }

  const location = await getLocation(savedState ? savedState.language : false);
  if (savedState || location.status === 'ok') {
    if (savedState
      && (!(location.status === 'ok') || location.city.name === autoDetectedLocation)) {
      const {lon, lat, city, timeOffsetSec, latStr, lonStr} = savedState;
      setState({
        type: 'SET_LOCATION',
        value: { lon, lat, city, timeOffsetSec, latStr, lonStr }
      });
      const time = getTimes(timeOffsetSec, lat);
      setState({type: 'SET_NOW', value: time});
      setState({type: 'SET_LANGUAGE', value: savedState.language});
      await setStateBackground(time.season, time.period);
      await setWeather();
      myStatus = 'auto';
    } else {
      const {lon, lat, city, timeOffsetSec, DMS} = location;
      setState({
        type: 'SET_LOCATION',
        value: {
          lon, lat, city, timeOffsetSec,
          latStr: DMS.lat,
          lonStr: DMS.lon,
        }
      });
      const time = getTimes(timeOffsetSec, lat);
      setState({type: 'SET_NOW', value: time});
      setState({type: 'SET_LANGUAGE', value: location.lang});
      await setStateBackground(time.season, time.period);
      await setWeather();
      myStatus = 'ok';
    }
  } else {
    setState({type: 'SET_ERROR', value: handleError('NO_LOCATION')});
    status = 'error';
  };
  if (onResultCallback) {
    onResultCallback(myStatus)
  };
  if (localStorage) {
    localStorage.setItem('autoDetectedLocation', location.city.name);
  }
  return myStatus;
}

export async function askUserHisLocation(onResultCallback?: (status: status) => any): Promise<status> {
  let location = new UserLocation();

  const requestLocation = new RequestLocation();
  location = await requestLocation.getUserLocation();

  if (location.status === 'ok') {
    const {lon, lat, city, timeOffsetSec, DMS} = location;
    setState({
      type: 'SET_LOCATION',
      value: {
        lon, lat, city, timeOffsetSec,
        latStr: DMS.lat,
        lonStr: DMS.lon,
      }
    });

    const time = getTimes(timeOffsetSec, lat);
    await imagesLinks.generate(time.season, time.period);

    setState({type: 'SET_NOW', value: time});
    setState({type: 'SET_LANGUAGE', value: location.lang});
    setState({type: 'SET_BACKGROUND', value: (imagesLinks.getLink()).value});
    await setWeather();
  }

  if (onResultCallback) {
    onResultCallback(location.status)
  }
  return location.status;
}

export function initUserSearch(onResultCallback?: (status: status) => any): void {
  const searchInp = document.getElementById('js-searchInp') as HTMLInputElement;
  const searchForm = document.getElementById('js-searchForm') as HTMLFormElement;
  let isCancel = false;
  const searchSubmit = () => new Promise(resolve => {
    function removeListeners(): void {
      searchForm.removeEventListener('submit', onSubmit)
      document.removeEventListener('click', onCancel);
    }

    function onSubmit(e:Event): void {
      e.preventDefault();
      removeListeners();
      resolve('submit');
    }

    function onCancel(e:Event): void {
      const target = e.target as HTMLElement;
      if (!target.closest('#js-searchForm')) {
        removeListeners();
        isCancel = true;
        resolve('cancel');
      }
    }
    searchForm.addEventListener('submit', onSubmit);
    document.addEventListener('click', onCancel);
  });

  async function searchOn(): Promise<void> {
    const newPlace = await getUserSearch(searchForm, searchInp, searchSubmit);
    if (newPlace.status === 'ok') {
      const {lon, lat, city, timeOffsetSec, DMS} = newPlace;
      setState({
        type: 'SET_LOCATION',
        value: {
          lon, lat, city, timeOffsetSec,
          latStr: DMS.lat,
          lonStr: DMS.lon,
        }
      });

      const time = getTimes(timeOffsetSec, lat);
      setState({type: 'SET_NOW', value: time});
      await setStateBackground(time.season, time.period);
      await setWeather();
    } else {
      if (!isCancel) {
        setState({type: 'SET_ERROR', value: handleError('NO_SEARCH')});
      }
    }
    if (onResultCallback) {
      onResultCallback(newPlace.status)
    }
    searchInp.addEventListener('focus', async () => {await searchOn()}, { once: true });
  }
  searchForm.addEventListener('submit', e => {if (searchInp.value === '') e.preventDefault()});
  searchInp.addEventListener('focus', async () => {await searchOn()}, { once: true });
}

export function initLanguageSelect(onResultCallback?: () => any): void {
  const selectNode = document.getElementById('js-language') as HTMLSelectElement;
  selectNode.addEventListener('change', async() => {
    preloader.show();
    const location = await getCityByCoord(state.lat, state.lon, selectNode.value);
    if (location.status === 'ok') {
      setState({
        type: 'SET_LOCATION',
        value: {
          lon: state.lon, lat: state.lat, city: location.city,
          latStr: location.DMS.lat,
          lonStr: location.DMS.lon,
          timeOffsetSec: location.timeOffsetSec,
        }
      });
    } else {
      setState({type: 'SET_ERROR', value: handleError('NO_CITY_TRANSLATE')});
    }
    preloader.hide();
    setState({type: 'SET_LANGUAGE', value: selectNode.value});
    if (onResultCallback) {
      onResultCallback();
    }
  })
}

export function initBackgroundRefresh(onResultCallback?: () => any): void {
  const button = document.getElementById('js-backgrBtn');
  button.addEventListener('click', () => {
    const backgroundUrl = imagesLinks.getLink();
    if (backgroundUrl.status === 'error') {
      setState({type: 'SET_ERROR', value: handleError('NO_BACKGROUND')});
    } else {
      setState({type: 'SET_BACKGROUND', value: backgroundUrl.value});
    }
    if (onResultCallback) {
      onResultCallback();
    }
  })
}

export function initUnitChange(onResultCallback?: () => any): void {
  const button = document.getElementById('js-unitBtn');
  button.addEventListener('click', (e:MouseEvent) => {
    const target = e.target as HTMLElement;
    setState({type: 'SET_UNIT', value: target.dataset.btn});
    if (onResultCallback) {
      onResultCallback();
    }
  })
}

export function initClock(onResultCallback?: () => any): void {
  setInterval(() => {
    const time = getTimes(state.timeOffsetSec, state.lat);
    setState({type: 'SET_NOW', value: time});
    if (onResultCallback) {
      onResultCallback();
    }
  }, 1000);
}

export async function setStateBackground(season?: string, time?: string): Promise<void> {
  let backgroundURL: { status: status, value: string };
  if (season && time) {
    await imagesLinks.generate(season, time);
  }
  backgroundURL = imagesLinks.getLink();
  if (backgroundURL.status === 'error') {
    setState({type: 'SET_ERROR', value: handleError('NO_BACKGROUND')});
  }
  setState({type: 'SET_BACKGROUND', value: backgroundURL.value});
}

export async function setWeather(onResultCallback?: (status: status) => any): Promise<status> {
  const weather = await getWeather(state.lat, state.lon);
  if (weather.status === 'ok') {
    setState({type: 'SET_WEATHER', value: weather.value});
  } else {
    setState({type: 'SET_ERROR', value: 'NO_FORECAST'});
  }

  if (onResultCallback) {
    onResultCallback(weather.status);
  }
  return weather.status;
}

export function initSpeakWeather(): void {
  const synth = window.speechSynthesis;
  synth.addEventListener('voiceschanged', () => {
    (document.getElementById('js-voiceBtn')).addEventListener('click', () => {
      synth.cancel();
      let lang: string = state.language;
      const t = createTranslator(lang);
      const voices = synth.getVoices();
      if (voices.filter((voice) => voice.lang.slice(0, 2) === lang).length < 1) {
        let notification = `${t('NO VOICE')}: `
        switch (lang) {
          case 'be':
            if (voices.filter((voice) => voice.lang.slice(0, 2) === 'ru').length > 0) {
              notification += 'руская';
              lang = 'ru';
            } else {
              notification += 'English';
              lang  ='en';
            }
            break;
          default:
            notification += 'English';
            lang  ='en';
        };
          showNotification(notification);
      };
      const baseVoice = voices.filter((voice) => voice.lang.slice(0, 2) === lang)[0];

      const phrases = createPhrases(
        lang,
        state.city.name,
        state.condition,
        state.unit === 'c' ? state.temperatureNow.c : state.temperatureNow.f,
        state.wind,
        state.humidity,
        state.unit === 'c'
        ? state.nextDays[0].temperature.min.c
        : state.nextDays[0].temperature.min.f,
        state.unit === 'c'
        ? state.nextDays[0].temperature.max.c
        : state.nextDays[0].temperature.max.f,
        state.nextDays[0].condition,
        state.isDay
      );

      phrases.forEach((phrase) => {
        const utterance = new SpeechSynthesisUtterance(phrase);
        utterance.voice = baseVoice;
        synth.speak(utterance)
      })
    });
  });
}