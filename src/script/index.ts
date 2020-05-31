import '../css/style.scss';
import '../leaflet/leaflet.css';

import View from './view';
import state from './state';

import { getLocation } from './getData';

window.addEventListener('load', async () => {

  const location = await getLocation();



  if (location.status === 'ok') {
    state.language = location.lang;
    state.lon = location.lon;
    state.lat = location.lat;
    state.place = location.city ? location.city : 'Xry';
  }

  const view = new View();
  await view.init(state)
});