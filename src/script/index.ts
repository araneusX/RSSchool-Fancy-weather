import '../css/style.scss';
import '../leaflet/leaflet.css';
// import '../mapbox/mapbox-gl.css';

import View from './view';
import state from './state'

document.addEventListener('DOMContentLoaded', async () => {
  const view = new View();
  await view.init(state)
});