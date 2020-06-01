import { loadImage } from './getData';

export interface State{
  backgroundURL: string,
  backgroundImg?: any,
  language: string,
  unit: string,
  voice: boolean,
  command: boolean,
  search?: {
    value: string,
    suggestions: {
      name: string,
      lat: number,
      lon: number,
    }[],
  },
  city: {
    name: string,
    formatted: string,
  },
  lat: number,
  lon: number,
  condition: {
    icon: number,
    text: string,
  }
  temperatureNow: number,
  feels: number,
  wind: number,
  humidity: number,
  now: Date,
  period: 0|1,
  nextDays: {
    temperature: number,
    icon: number,
  }[]
};

const state: State = {
  backgroundURL: '../img/backgr.jpeg',
  language: 'be',
  unit: 'c',
  voice: false,
  command: true,
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

// export function dispatch(action: {type: string, value: any}) {
//   switch (action.type) {
//     case 'SET_BACKGROUND':  state.backgroundURL = value;
//   }
// }

export default state;