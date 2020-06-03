export interface State {
  ready: boolean;
  backgroundURL: string,
  language: string,
  unit: string,
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
  temperatureNow: {
    c: number,
    f: number,
  },
  feels: {
    c: number,
    f: number,
  },
  condition: number,
  wind: number,
  humidity: number,
  isDay: 0|1,
  period: string,
  season: string,
  nextDays: {
    temperature: {
      min: {
        c: number,
        f: number
        },
      max: {
        c: number,
        f: number
        }
  },
    condition: number,
  }[],
};

export type actionLocation = {
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

export type actionLanguage = {
  type: 'SET_LANGUAGE',
  value: string,
}

export type actionCommand = {
  type: 'SET_COMMAND',
  value: boolean,
}

export type actionVoice = {
  type: 'SET_VOICE',
  value: boolean,
}

export type actionUnit = {
  type: 'SET_UNIT',
  value: string,
}

export type actionNow = {
  type: 'SET_NOW',
  value: {
    now: number,
    period: string,
    season: string,
  },
}

export type actionError = {
  type: 'SET_ERROR',
  value: string,
}

export type actionReady = {
  type: 'SET_READY',
  value: boolean,
}

export type actionBackground = {
  type: 'SET_BACKGROUND',
  value: string,
}

export type actionWeather = {
  type: 'SET_WEATHER',
  value: Weather,
}

export type status = 'ok' | 'error';

export class UserLocation {
  status: status;
  lon: number;
  lat: number;
  lang: string;
  city?: {
    name: string;
    formatted: string;
  }
  DMS: {
    lon: string;
    lat: string;
  }
  timeOffsetSec: number;
};

export interface Weather {
  temperatureNow: {
    c: number,
    f: number,
  },
  feels: {
    c: number,
    f: number,
  },
  condition: number,
  wind: number,
  humidity: number,
  isDay: 0|1,
  nextDays: {
    temperature: {
      min: {
        c: number,
        f: number
      },
      max: {
        c: number,
        f: number
      }
    },
    condition: number,
  }[],
}

export interface RenderState {
  app: State;
  background: HTMLImageElement;
}