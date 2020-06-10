import '../css/style.scss';
import '../leaflet/leaflet.css';

import View from './view';
import {
  setStartData, initUserSearch, initLanguageSelect,
  initBackgroundRefresh, initClock, askUserHisLocation, setWeather, initUnitChange, initSpeakWeather, initSpeechCommand,
} from './generators';
import { status } from './types';
import state, { setState } from './state';
import { RequestLocationConfirm } from '../components/confirmLocation/requestLocationConfirm';

window.addEventListener('load', async () => {
  setState({type: 'SET_READY', value: false});
  const view = new View();

  const startLocationStatus = await setStartData();
  let isStartLocationConfirm: boolean;
  if (startLocationStatus === 'auto') {
    isStartLocationConfirm = true;
  }

  if (startLocationStatus === 'ok') {
    setState({type: 'SET_READY', value: true});
    await view.synchronize();
    const requestToUser = new RequestLocationConfirm();
    isStartLocationConfirm = await requestToUser.askConfirm(state.city.name, state.city.formatted);
  }

  if (startLocationStatus === 'error' || !isStartLocationConfirm) {
    await askUserHisLocation();
  }

  setState({type: 'SET_READY', value: true});
  await view.synchronize();

  initUserSearch((stat: status) => {if (stat === 'ok') view.synchronize();});
  initLanguageSelect(() => view.render());
  initBackgroundRefresh(() => view.synchronize());
  initClock(() => view.render());
  initUnitChange(() => view.render());
  initSpeakWeather();
  initSpeechCommand(() => view.render());
});


