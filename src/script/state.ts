import { copyObject } from './utils';
import {
  State, actionLocation, actionLanguage, actionCommand,
  actionBackground, actionVoice, actionUnit, actionNow,
  actionWeather, actionError, actionReady, actionVolume,
} from './types';


let state: State = {
  ready: false,
  backgroundURL: '',
  language: 'en',
  unit: 'c',
  now: 0,
  volume: 0.6,
  command: true,
  error: '',
  city: {
    name: '',
    formatted: ''
  },
  lat: 0,
  lon: 0,
  latStr: '',
  lonStr: '',
  timeOffsetSec: 0,
  condition: 1000,
  temperatureNow: {
    c: 0,
    f: 0,
  },
  feels: {
    c: 0,
    f: 0,
  },
  wind: 0,
  humidity: 0,
  season: '',
  period: '',
  isDay: 0,
  nextDays: [
    {
      temperature: {
        min: {
          c: 0,
          f: 0
          },
        max: {
          c: 0,
          f: 0
          }
      },
      condition: 1000,
    },
    {
      temperature: {
        min: {
          c: 0,
          f: 0
          },
        max: {
          c: 0,
          f: 0
          }
      },
      condition: 1000,
    },
    {
      temperature: {
        min: {
          c: 0,
          f: 0
          },
        max: {
          c: 0,
          f: 0
          }
      },
      condition: 1000,
    },
  ]
};

if (localStorage && localStorage.weatherState) {
  state = JSON.parse(localStorage.weatherState);
}

state.language = state.language.slice(0, 2); // fix wrong data from localStorage // it will be deleted

type myAction = actionLocation | actionLanguage | actionCommand | actionBackground
| actionVoice | actionUnit | actionNow | actionWeather | actionError | actionReady
| actionVolume;

const stateBackup: State[] = [];
let stateIndex: number = -1;

export function setState(action: myAction):void {
  if (action.type !== 'SET_NOW' && action.type !== 'SET_ERROR') {
    stateBackup.push(copyObject(state));
    stateIndex += 1;
    if (stateBackup.length > 10) {
      stateBackup.shift();
      stateIndex -= 1;
    }
  }

  switch (action.type) {
    case 'SET_LOCATION': {
      const { value } = action;
      state.lon = value.lon;
      state.lat = value.lat;
      state.city = copyObject(value.city);
      state.lonStr = value.lonStr;
      state.latStr = value.latStr;
      state.timeOffsetSec = value.timeOffsetSec;
      break;
    };
    case 'SET_LANGUAGE': {
      const { value } = action;
      state.language = value.slice(0, 2);
      break;
    };
    case 'SET_NOW': {
      const { value } = action;
      const { now, period, season } = value;
      state.now = value.now;
      state.period = value.period;
      state.season = value.season;
      break;
    };
    case 'SET_UNIT': {
      const { value } = action;
      state.unit = value;
      break;
    };
    case 'SET_WEATHER': {
      const { value } = action;
      state.temperatureNow = value.temperatureNow;
      state.feels = value.feels;
      state.condition = value.condition;
      state.wind = value.wind;
      state.humidity = value.humidity;
      state.isDay = value.isDay;
      state.nextDays = value.nextDays;
      break;
    };
    case 'SET_ERROR': {
      const { value } = action;
      state.error = value;
      break;
    };
    case 'SET_READY': {
      const { value } = action;
      state.ready = value;
      break;
    };
    case 'SET_BACKGROUND': {
      const { value } = action;
      state.backgroundURL = value;
      break;
    }
    case 'SET_VOLUME': {
      const { value } = action;
      if (!state.volume) {
        state.volume = 1;
      }
      if (value === 'louder' && state.volume < 1) {
        state.volume += 0.1;
        break;
      }
      if (value === 'quieter' && state.volume > 0.1) {
        state.volume -= 0.1;
      }
      break;
    }
    case 'SET_COMMAND': {
      const { value } = action;
      state.command = value;
      break;
    }
  }

  if (localStorage && action.type !== 'SET_NOW' && action.type !== 'SET_READY') {
    localStorage.setItem('weatherState', JSON.stringify(state));
  }
}

export default state;

