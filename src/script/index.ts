import '../css/style.scss';
import '../leaflet/leaflet.css';

import View from './view';
import {
  setStartLocation,initUserSearch, initLanguageSelect,
  initBackgroundRefresh, initClock, askUserHisLocation, setWeather, initUnitChange,
} from './generators';
import { status } from './types';
import state, { setState } from './state';
import { RequestLocationConfirm } from '../components/confirmLocation/requestLocationConfirm';

window.addEventListener('load', async () => {
  setState({type: 'SET_READY', value: false});
  const view = new View();

  const startLocationStatus = await setStartLocation();
  let isStartLocationConfirm: boolean;
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
});


