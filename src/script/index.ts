import '../css/style.scss';
import '../leaflet/leaflet.css';

import View from './view';
import state from './state';

import { getLocation, loadImage } from './getData';
import { getUserSearch } from '../components/addUserSearch/addUserSearch';
import { RequestLocationConfirm } from '../components/confirmLocation/requestLocationConfirm';
import { RequestLocation } from '../components/confirmLocation/reqestLocation';
import handleError from './error';

window.addEventListener('load', async () => {
  const view = new View(state);

  //    \/\/\/ add search

  const searchInp = document.getElementById('js-searchInp') as HTMLInputElement;
  const searchForm = document.getElementById('js-searchForm') as HTMLFormElement;
  const searchSubmit = () => new Promise(resolve => {
    function removeListeners(): void {
      searchForm.removeEventListener('submit', onSubmit)
      document.removeEventListener('click', onCancel);
    }

    function onSubmit(e:Event): void {
      e.preventDefault();
      removeListeners();
      resolve('submit');
    }

    function onCancel(e:Event): void {
      const target = e.target as HTMLElement;
      if (!target.closest('#js-searchForm')) {
        removeListeners()
        resolve('cancel');
      }
    }
    searchForm.addEventListener('submit', onSubmit);
    document.addEventListener('click', onCancel);
  });

  async function searchOn(): Promise<void> {
    const newPlace = await getUserSearch(searchForm, searchInp, searchSubmit);
    if (newPlace.status === 'ok') {
      state.lon = newPlace.lon;
      state.lat = newPlace.lat;
      state.city = newPlace.city;
      view.render(state);
    }
    searchInp.addEventListener('focus', async () => {await searchOn()}, { once: true });
  }

  searchInp.addEventListener('focus', async () => {await searchOn()}, { once: true });
  //    /\/\/\ add search


  state.backgroundImg = await loadImage(state.backgroundURL);

  let location = await getLocation();
  if (location.status === 'ok') {
    const requestToUser = new RequestLocationConfirm();
    const userResponse = await requestToUser.askConfirm(location);
    if (!userResponse) {
      const requestLocation = new RequestLocation();
      location = await requestLocation.getUserLocation();
    }
  }

  if (location.status === 'ok') {
    state.language = location.lang; //ш
    state.lon = location.lon;
    state.lat = location.lat;
    state.city = location.city;
  } else {
    handleError('NO_LOCATION')
  }


  view.render(state);
});


