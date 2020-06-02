import { getLocation, getCityByCoord, imagesLinks } from './getData';
import state, { setState } from './state';
import handleError from './error';
import { RequestLocationConfirm } from '../components/confirmLocation/requestLocationConfirm';
import { RequestLocation } from '../components/confirmLocation/reqestLocation';
import { getUserSearch } from '../components/addUserSearch/addUserSearch';
import { status } from './types';
import preloader from '../components/preloader/preloader';
  
export async function setStartLocation(onResultCallback?: (status: status) => any): Promise<void> {
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
    const {lon, lat, city} = location;
    setState({type: 'SET_LOCATION', value: {lon, lat, city}});
    setState({type: 'SET_LANGUAGE', value: location.lang});
  } else {
    setState({type: 'SET_ERROR', value: handleError('NO_LOCATION')});
  }
  if (onResultCallback) {
    onResultCallback(location.status)
  }
}

export function initUserSearch(onResultCallback?: (status: status) => any): void {
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
      const {lon, lat, city} = newPlace;
      setState({type: 'SET_LOCATION', value: {lon, lat, city}});
    } else {
      setState({type: 'SET_ERROR', value: handleError('NO_SEARCH')});
    }
    if (onResultCallback) {
      onResultCallback(newPlace.status)
    }
    searchInp.addEventListener('focus', async () => {await searchOn()}, { once: true });
  }

  searchInp.addEventListener('focus', async () => {await searchOn()}, { once: true });
}

export function initLanguageSelect(onResultCallback?: () => any): void {
  const selectNode = document.getElementById('js-language') as HTMLSelectElement;
  selectNode.addEventListener('change', async() => {
    preloader.show();
    const location = await getCityByCoord(state.lat, state.lon, selectNode.value);
    if (location.status = 'ok') {
      setState({type: 'SET_LOCATION', value: {lon: state.lon, lat: state.lat, city: location.city}});
    } else {
      setState({type: 'SET_ERROR', value: handleError('NO_CITY_TRANSLATE')});
    }
    preloader.hide();
    setState({type: 'SET_LANGUAGE', value: selectNode.value});
    if (onResultCallback) {
      onResultCallback();
    }
  })
}

export async function initBackgroundRefresh(onResultCallback?: () => any): Promise<void> {
  const button = document.getElementById('js-backgrBtn');
  button.addEventListener('click', () => {
    const backgroundUrl = imagesLinks.getLink();
    console.log(backgroundUrl);
    
    if (backgroundUrl.status === 'error') {
      setState({type: 'SET_ERROR', value: handleError('NO_BACKGROUND')});
    } else {
      setState({type: 'SET_BACKGROUND', value: backgroundUrl.value});
    }
    if (onResultCallback) {
      onResultCallback();
    }
  })
}