import { copyObject } from './utils';
export interface State{
  backgroundURL: string,
  language: string,
  unit: 'c' | 'f',
  voice: boolean,
  command: boolean,
  now: Date,
  error: string,
  city: {
    name: string,
    formatted: string,
  },
  lat: number,
  lon: number,
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
  value: Date,
}

type actionError = {
  type: 'SET_ERROR',
  value: string,
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
  backgroundURL: 'https://images.unsplash.com/photo-1542202858-f881811262f7?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEwMTM5NX0',
  language: 'be',
  unit: 'c',
  voice: false,
  command: true,
  error: '',
  city: {
    name: 'Minsk',
    formatted: 'Belarus, Best City!'
  },
  lat: 53.902334,
  lon: 27.5618791,
  condition: {
    icon: 1240,
    text: 'Light rain shower',
  },
  temperatureNow: 10,
  feels: 9,
  wind: 12,
  humidity: 89,
  now: new Date(),
  period: 1,
  nextDays: [
    {
      temperature: 45,
      icon: 1003,
    },
    {
      temperature: 32,
      icon: 1006,
    },
    {
      temperature: -9,
      icon: 1009,
    },
  ]
};

type myAction = actionLocation | actionLanguage | actionCommand | actionBackground
| actionVoice | actionUnit | actionNow | actionWeather | actionError;

const stateBackup: State[] = [];
let stateIndex: number = -1;

export function setState(action: myAction):void {
  stateBackup.push(copyObject(state));
  stateIndex += 1;
  
  if (stateBackup.length > 10) {
    stateBackup.shift();
    stateIndex -+ 1;
  }
  switch (action.type) {
    case 'SET_LOCATION': {
      const { value } = action;
      state.lon = value.lon;
      state.lat = value.lat;
      state.city = copyObject(value.city);
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
    case 'SET_BACKGROUND': {
      const { value } = action;
      state.backgroundURL = value;
    }
  }
  console.log(state);
  
}

export default state;

