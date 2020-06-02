import '../css/style.scss';
import '../leaflet/leaflet.css';

import View from './view';
import { setStartLocation, initUserSearch, initLanguageSelect, initBackgroundRefresh } from './generators';
import { status } from './types';
import { imagesLinks } from './getData';
import { setState } from './state';
import handleError from './error';

window.addEventListener('load', async () => {
  const view = new View();
  await setStartLocation();
  await imagesLinks.generate('winter', 'night');
  const backgroundUrl = imagesLinks.getLink();
  if (backgroundUrl.status = 'error') {
    setState({type: 'SET_ERROR', value: handleError('NO_BACKGROUND')});
  }
  setState({type: 'SET_BACKGROUND', value: backgroundUrl.value});
  
  view.synchronize();

  initUserSearch((status: status): void => {if (status = 'ok') view.render();});
  initLanguageSelect(() => view.render());
  initBackgroundRefresh(() => view.synchronize());
});



