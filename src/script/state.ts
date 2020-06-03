import { copyObject } from './utils';
export interface State{
  ready: boolean;
  backgroundURL: string,
  language: string,
  unit: 'c' | 'f',
  voice: boolean,
  command: boolean,
  now: number,
  error: string,
  city: {
    name: string,
    formatted: string,
  },
  lat: number,
  lon: number,
  latStr: string,
  lonStr: string,
  timeOffsetSec: number,
  temperatureNow: number,
  condition: {
    icon: number,
    text: string,
  }
  feels: number,
  wind: number,
  humidity: number,
  period: string,
  season: string,
  nextDays: {
    temperature: number,
    icon: number,
  }[],
};

type actionLocation = {
  type: 'SET_LOCATION',
  value: {
    lat: number,
    lon: number,
    city: {
      name: string,
      formatted: string;
    },
    latStr: string;
    lonStr: string;
    timeOffsetSec: number;
  }
}

type actionLanguage = {
  type: 'SET_LANGUAGE',
  value: string,
}

type actionCommand = {
  type: 'SET_COMMAND',
  value: boolean,
}

type actionVoice = {
  type: 'SET_VOICE',
  value: boolean,
}

type actionUnit = {
  type: 'SET_UNIT',
  value: 'c' | 'f',
}

type actionNow = {
  type: 'SET_NOW',
  value: {
    now: number,
    period: string,
    season: string,
  },
}

type actionError = {
  type: 'SET_ERROR',
  value: string,
}

type actionReady = {
  type: 'SET_READY',
  value: boolean,
}

type actionBackground = {
  type: 'SET_BACKGROUND',
  value: string,
}

type actionWeather = {
  type: 'SET_WEATHER',
  value: {
    temperatureNow: number,
    condition: {
      icon: number,
      text: string,
    }
    feels: number,
    wind: number,
    humidity: number,
    period: 0|1,
    nextDays: {
      temperature: number,
      icon: number,
    }[],
  }
}

const state: State = {
  ready: false,
  backgroundURL: '',
  language: 'en',
  unit: 'c',
  voice: false,
  command: false,
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
  condition: {
    icon: 0,
    text: '',
  },
  temperatureNow: 0,
  feels: 0,
  wind: 0,
  humidity: 0,
  now: 0,
  season: '',
  period: '',
  nextDays: [
    {
      temperature: 0,
      icon: 0,
    },
    {
      temperature: 0,
      icon: 0,
    },
    {
      temperature: 0,
      icon: 0,
    },
  ]
};

type myAction = actionLocation | actionLanguage | actionCommand | actionBackground
| actionVoice | actionUnit | actionNow | actionWeather | actionError | actionReady;

const stateBackup: State[] = [];
let stateIndex: number = -1;

function saveState(): void {
  
}

export function setState(action: myAction):void {
  if (action.type !== 'SET_NOW' && action.type !== 'SET_ERROR') {
    stateBackup.push(copyObject(state));
    stateIndex += 1;
    if (stateBackup.length > 10) {
      stateBackup.shift();
      stateIndex -+ 1;
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
    case 'SET_COMMAND': {
      const { value } = action;
      break;
    };
    case 'SET_LANGUAGE': {
      const { value } = action;
      state.language = value;
      break;
    };
    case 'SET_NOW': {
      const { value } = action;
      state.now = value.now;
      state.period = value.period;
      state.season = value.season;
      break;
    };
    case 'SET_UNIT': {
      const { value } = action;
      break;
    };
    case 'SET_WEATHER': {
      const { value } = action;
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
    }
  }
  
}

export default state;

