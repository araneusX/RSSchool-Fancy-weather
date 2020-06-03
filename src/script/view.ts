import state, { State } from './state';
import { replaceInnerHTML, getIconPath, copyObject, formatGeo, createBackground, formatNowUTC, getFutureDay } from './utils';
import L from '../leaflet/leaflet';
import createTranslator from './int';
import preloader from '../components/preloader/preloader';

class RenderState {
  app: State;
  background: HTMLImageElement;
}

class View{
  languageNode = document.getElementById('js-language') as HTMLSelectElement;
  unitBtn = document.getElementById('js-unitBtn');
  voiceBtn = document.getElementById('js-voiceBtn');
  commandBtn = document.getElementById('js-commandBtn');
  searchInp = document.getElementById('js-searchInp') as HTMLInputElement;
  searchBtn = document.getElementById('js-searchBtn');
  placeNode = document.getElementById('js-place');
  describeNode = document.getElementById('js-describe');
  dateNode = document.getElementById('js-date');
  temperatureNode = document.getElementById('js-temperature');
  iconNowNode = document.getElementById('js-iconNow') as HTMLImageElement;
  conditionNowNode = document.getElementById('js-condition');
  feelsNode = document.getElementById('js-feels');
  windNode = document.getElementById('js-wind');
  humidityNode = document.getElementById('js-humidity');
  mapNod = document.getElementById('js-map');
  latitudeNode = document.getElementById('js-latitude');
  longitudeNode = document.getElementById('js-longitude');
  latitudeTitleNode = document.getElementById('js-latitudeTitle');
  longitudeTitleNode = document.getElementById('js-longitudeTitle');
  searchInpNode = document.getElementById('js-searchInp') as HTMLInputElement;
  searchBtnNode = document.getElementById('js-searchBtn') as HTMLButtonElement;
  startScreen = document.getElementById('js-start-screen');

  nextDays = ['Next1', 'Next2', 'Next3'].map((i) => (
    {
      nameNode: document.getElementById(`js-title${i}`),
      temperature: document.getElementById(`js-temperature${i}`),
      icon: document.getElementById(`js-icon${i}`) as HTMLImageElement,
    }
  ));

  isStartScreen = true;

  mapNode = document.getElementById('js-map');
  map: any;
  mapLayer: any;
  isMapReady: boolean;

  renderState = new RenderState;
  oldState = new RenderState;

  constructor() {
    preloader.show();
    this.renderState.app = copyObject(state);
    this.oldState.app = copyObject(state);

    this.renderState.background = document.createElement('img');
    this.oldState.background = this.renderState.background;
    

    // document.body.prepend(this.renderState.background);
    // this.renderState.background.classList.add('background', 'visible');
    // this.renderState.background.src = this.renderState.app.backgroundURL;
    
    // this.renderState.background.addEventListener('load', ()=> {
    //   this.startScreen.style.opacity = '0';
    //   setTimeout(()=> {
    //     this.startScreen.remove();
    //     preloader.hide();
    //   }, 400);
    // }, {once: true});
    // this.renderState.background.addEventListener('error', ()=> {
    //   this.startScreen.style.opacity = '0';
    //   setTimeout(()=> {
    //     this.startScreen.remove();
    //     preloader.hide();
    //   }, 400);
    // }, {once: true});

    const t = createTranslator(this.renderState.app.language);

    this.map = L.map(this.mapNode, {
      center: [this.renderState.app.lat, this.renderState.app.lon],
      zoom: 9,
      boxZoom: false,
      doubleClickZoom: false,
      dragging: false,
      keyboard: false,
      scrollWheelZoom: false
    });
    this.map.whenReady(()=> {this.isMapReady = true});

    this.mapLayer = L.tileLayer(`https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}@2x.png?lang=${this.renderState.app.language}`, {
        maxZoom: 19,
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
        + ' | <a href="https://maps.wikimedia.org">Wikimedia.org</a>',
    })
    this.mapLayer.addTo(this.map);

    this.unitBtn.dataset.unit = this.renderState.app.unit;
    this.languageNode.value = this.renderState.app.language;

    if (this.renderState.app.voice) {
      this.voiceBtn.classList.add('active');
    }

    if (this.renderState.app.command) {
      this.commandBtn.classList.add('active');
    }

    this.placeNode.append(this.renderState.app.city.name);
    this.describeNode.append(this.renderState.app.city.formatted);
    this.dateNode.append(formatNowUTC(this.renderState.app.now, state.language));
    this.latitudeNode.append(formatGeo(this.renderState.app.latStr));
    this.longitudeNode.append(formatGeo(this.renderState.app.lonStr));
    this.conditionNowNode.append(this.renderState.app.condition.text);
    this.temperatureNode.append(`${this.renderState.app.temperatureNow}`);
    this.feelsNode.append(`${this.renderState.app.feels}`);
    this.windNode.append(`${this.renderState.app.wind}`);
    this.humidityNode.append(`${this.renderState.app.humidity}`);
    this.iconNowNode.src = getIconPath(
      this.renderState.app.season,
      (new Date(this.renderState.app.now)).getUTCHours(), 
      this.renderState.app.condition.icon
    );

    this.latitudeTitleNode.innerHTML = `${t('LONGITUDE')}`;
    this.longitudeTitleNode.innerHTML = `${t('LATITUDE')}`;
    this.searchInpNode.placeholder = `${t('SEARCH PLACEHOLDER')}`
    this.searchBtnNode.value = `${t('SEARCH SUBMIT')}`
    
    this.nextDays.forEach((day, i) => {
      day.nameNode.append(
          getFutureDay(this.renderState.app.now, i + 1, this.renderState.app.language)
        );
      day.temperature.append(`${this.renderState.app.nextDays[i].temperature}`);
      day.icon.src = getIconPath(
        this.renderState.app.season,
        (new Date(this.renderState.app.now)).getUTCHours(),
        this.renderState.app.nextDays[i].icon);
    });
 }

  async synchronize(): Promise<void> {
    if (state.backgroundURL !== this.renderState.app.backgroundURL) {
      preloader.show();
      this.renderState.background = await createBackground(state.backgroundURL);
      this.renderState.app.backgroundURL = state.backgroundURL;
      if (this.renderState.app.ready) {
        preloader.hide();
      }
    }
    
    this.render();
  }

  render(): void {
    this.renderState.app = copyObject(state);

    if (this.renderState.app.ready && this.isStartScreen) {
      this.startScreen.style.opacity = '0';
      setTimeout(()=> {
        this.startScreen.remove();
        preloader.hide();
      }, 400);
    }

    if (this.renderState.app.language !== this.oldState.app.language) {
      const t = createTranslator(this.renderState.app.language);
      this.languageNode.value = this.renderState.app.language;

      this.latitudeTitleNode.innerHTML = `${t('LONGITUDE')}`;
      this.longitudeTitleNode.innerHTML = `${t('LATITUDE')}`;
      this.searchInpNode.placeholder = `${t('SEARCH PLACEHOLDER')}`
      this.searchBtnNode.value = `${t('SEARCH SUBMIT')}`
  
    }

    if (this.renderState.background !== this.oldState.background) {
        this.oldState.background.classList.remove('visible');
        
        document.body.prepend(this.renderState.background);
        this.renderState.background.classList.add('visible');
        const oldBackground = this.oldState.background;
        setTimeout(()=> oldBackground.remove(), 400);
    }

    if (this.renderState.app.lon !== this.oldState.app.lon 
      || this.renderState.app.lat !==this.renderState.app.lat) {
      //this.map.setView({lon: this.renderState.app.lon, lat: this.renderState.app.lat});
      this.map.flyTo({lon: this.renderState.app.lon, lat: this.renderState.app.lat});
    }

    if (this.renderState.app.unit !== this.oldState.app.unit) {
      this.unitBtn.dataset.unit = this.renderState.app.unit;
    }

    if (this.oldState.app.voice) {
      if (!this.renderState.app.voice) {
        this.voiceBtn.classList.add('active');
      }
    } else {
      if (this.renderState.app.voice) {
        this.voiceBtn.classList.remove('active');
      }
    }

    if (this.oldState.app.command) {
      if (!this.renderState.app.command) {
        this.commandBtn.classList.add('active');
      }
    } else {
      if (this.renderState.app.command) {
        this.commandBtn.classList.remove('active');
      }
    }

    if (this.renderState.app.city.name !== this.oldState.app.city.name
      || this.renderState.app.city.formatted !== this.oldState.app.city.formatted) {
      replaceInnerHTML(this.placeNode, this.renderState.app.city.name);
      replaceInnerHTML(this.describeNode, this.renderState.app.city.formatted);
    }

    if (this.renderState.app.lat !== this.oldState.app.lat) {
      replaceInnerHTML(this.latitudeNode, formatGeo(this.renderState.app.latStr));
      replaceInnerHTML(this.longitudeNode, formatGeo(this.renderState.app.lonStr));
    }

    if (this.renderState.app.condition.icon !== this.oldState.app.condition.icon) {
      replaceInnerHTML(this.conditionNowNode, this.renderState.app.condition.text);
      this.iconNowNode.src = getIconPath(
        this.renderState.app.season,
        (new Date(this.renderState.app.now)).getUTCHours(),
        this.renderState.app.condition.icon);
    }

    if (this.renderState.app.temperatureNow !== this.oldState.app.temperatureNow) {
      replaceInnerHTML(this.temperatureNode, `${this.renderState.app.temperatureNow}`)
    }

    if (this.renderState.app.feels !== this.oldState.app.feels) {
      replaceInnerHTML(this.feelsNode, `${this.renderState.app.feels}`)
    }

    if (this.renderState.app.wind !== this.oldState.app.wind) {
      replaceInnerHTML(this.windNode, `${this.renderState.app.wind}`)
    }

    if (this.renderState.app.humidity !== this.oldState.app.humidity) {
      replaceInnerHTML(this.humidityNode, `${this.renderState.app.humidity}`)
    }

    if (this.renderState.app.language !== this.oldState.app.language) {
      this.mapLayer.setUrl(`https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}@2x.png?lang=${this.renderState.app.language}`);
    }

    if (this.renderState.app.now !== this.oldState.app.now) {
      replaceInnerHTML(
        this.dateNode, 
        formatNowUTC(this.renderState.app.now, this.renderState.app.language),
      );
    }

    this.oldState.app = copyObject(this.renderState.app);
    this.oldState.background = this.renderState.background;
  }
}

export default View;