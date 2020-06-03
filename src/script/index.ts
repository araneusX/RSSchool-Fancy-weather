import '../css/style.scss';
import '../leaflet/leaflet.css';

import View from './view';
import {
  setStartLocation,initUserSearch, initLanguageSelect,
  initBackgroundRefresh, initClock, askUserHisLocation,
} from './generators';
import { status } from './types';
import { imagesLinks } from './getData';
import state, { setState } from './state';
import handleError from './error';
import { RequestLocationConfirm } from '../components/confirmLocation/requestLocationConfirm';

window.addEventListener('load', async () => {
  setState({type: 'SET_READY', value: false});
  const view = new View();
  
  const startStatus = await setStartLocation();
  
  let isStartLocationConfirm: boolean;
  if (startStatus === 'ok') {
    setState({type: 'SET_READY', value: true});
    await view.synchronize();
    const requestToUser = new RequestLocationConfirm();
    isStartLocationConfirm = await requestToUser.askConfirm(state.city.name, state.city.formatted);
  }

  if (startStatus === 'error' || !isStartLocationConfirm) {
    await askUserHisLocation();
  }

  setState({type: 'SET_READY', value: true});
  await view.synchronize();

  initUserSearch((status: status): void => {if (status = 'ok') view.synchronize();});
  initLanguageSelect(() => view.render());
  initBackgroundRefresh(() => view.synchronize());
  initClock(() => view.render());

});



