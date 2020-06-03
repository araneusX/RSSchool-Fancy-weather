import state from './state';
import { RenderState } from './types';
import {
  getIconPath, copyObject, formatGeo, createBackground,
  formatNowUTC, getFutureDay, convertKmPHoursToMPSec,
} from './utils';
import L from '../leaflet/leaflet';
import createTranslator from './int';
import preloader from '../components/preloader/preloader';

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
  temperatureUnitNode = document.getElementById('js-temperature-unit');
  iconNowNode = document.getElementById('js-iconNow') as HTMLImageElement;
  conditionNowNode = document.getElementById('js-condition');
  feelsNode = document.getElementById('js-feels');
  windNode = document.getElementById('js-wind');
  humidityNode = document.getElementById('js-humidity');
  feelTitlesNode = document.getElementById('js-feels-title');
  windTitleNode = document.getElementById('js-wind-title');
  humidityTitleNode = document.getElementById('js-humidity-title');
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

  renderState = {} as RenderState;
  oldState = {} as RenderState;

  constructor() {
    preloader.show();
    this.renderState.app = copyObject(state);
    this.oldState.app = copyObject(state);

    this.renderState.background = document.createElement('img');
    this.oldState.background = this.renderState.background;

    const t = createTranslator(this.renderState.app.language);

    this.map = L.map(this.mapNode, {
      center: [this.renderState.app.lat, this.renderState.app.lon],
      zoom: 9,
      boxZoom: false,
      doubleClickZoom: false,
      // dragging: false,
      keyboard: false,
      scrollWheelZoom: false
    });
    this.map.whenReady(()=> {this.isMapReady = true});

    this.mapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        // `https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}@2x.png?lang=${this.renderState.app.language}`
        // attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
        // + ' | <a href="https://maps.wikimedia.org">Wikimedia.org</a>',
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

    this.placeNode.innerText = this.renderState.app.city.name;
    this.describeNode.innerText = this.renderState.app.city.formatted;
    this.dateNode.innerText = formatNowUTC(this.renderState.app.now, state.language);
    this.latitudeNode.innerText = formatGeo(this.renderState.app.latStr);
    this.longitudeNode.innerText = formatGeo(this.renderState.app.lonStr);
    this.conditionNowNode.innerText = t(
      `${this.renderState.app.condition}${this.renderState.app.isDay ? 'day' : 'night'}`
    );
    this.temperatureNode.innerText = `${
      Math.round(this.renderState.app.temperatureNow[this.renderState.app.unit])
    }`;
    this.temperatureUnitNode.innerText = `°${this.renderState.app.unit.toUpperCase()}`;
    this.feelsNode.innerText = `${Math.round(this.renderState.app.feels[this.renderState.app.unit])}`;
    this.windNode.innerText = `${(convertKmPHoursToMPSec(this.renderState.app.wind)).toFixed(1)} ${t('MPS')}`;
    this.humidityNode.innerText = `${this.renderState.app.humidity}`;
    this.feelTitlesNode.innerText = `${t('FEELS')}`
    this.windTitleNode.innerText = `${t('WIND')}`
    this.humidityTitleNode.innerText = `${t('HUMIDITY')}`
    this.iconNowNode.src = getIconPath(
      this.renderState.app.isDay,
      this.renderState.app.condition
    );

    this.latitudeTitleNode.innerText = `${t('LONGITUDE')}`;
    this.longitudeTitleNode.innerText = `${t('LATITUDE')}`;
    this.searchInpNode.placeholder = `${t('SEARCH PLACEHOLDER')}`
    this.searchBtnNode.value = `${t('SEARCH SUBMIT')}`

    this.nextDays.forEach((day, i) => {
      day.nameNode.innerText = getFutureDay(
        this.renderState.app.now, i, this.renderState.app.language
      );
      day.temperature.innerText = `${
        Math.round(this.renderState.app.nextDays[i].temperature.min[this.renderState.app.unit])
      } - ${
        Math.round(this.renderState.app.nextDays[i].temperature.max[this.renderState.app.unit])
      }`;
      day.icon.src = getIconPath(
        this.renderState.app.isDay,
        this.renderState.app.nextDays[i].condition);
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
    const t = createTranslator(this.renderState.app.language);

    if (this.renderState.app.ready && this.isStartScreen) {
      this.startScreen.style.opacity = '0';
      setTimeout(()=> {
        this.startScreen.remove();
        preloader.hide();
      }, 400);
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
      this.map.flyTo({lon: this.renderState.app.lon, lat: this.renderState.app.lat});
      const weatherIcon = L.icon({
        iconUrl: getIconPath(this.renderState.app.isDay, this.renderState.app.condition),
        iconSize:     [64, 64],
        iconAnchor:   [32, 32],
      });
      L.marker([this.renderState.app.lat, this.renderState.app.lon], {icon: weatherIcon}).addTo(this.map);
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
      this.placeNode.innerText = this.renderState.app.city.name;
      this.describeNode.innerText = this.renderState.app.city.formatted;
    }

    if (this.renderState.app.lat !== this.oldState.app.lat) {
      this.latitudeNode.innerText = formatGeo(this.renderState.app.latStr);
     this.longitudeNode.innerText = formatGeo(this.renderState.app.lonStr);
    }

    if (this.renderState.app.condition !== this.oldState.app.condition) {
      this.conditionNowNode.innerText = `${this.renderState.app.condition}`;
      this.iconNowNode.src = getIconPath(
        this.renderState.app.isDay,
        this.renderState.app.condition
      );
      this.conditionNowNode.innerText = t(
        `${this.renderState.app.condition}${this.renderState.app.isDay ? 'day' : 'night'}`
      );
    }

    if (this.renderState.app.temperatureNow[this.renderState.app.unit] !== this.oldState.app.temperatureNow[this.renderState.app.unit]) {
      this.temperatureNode.innerText = `${Math.round(
        this.renderState.app.temperatureNow[this.renderState.app.unit]
        )}`;
    }

    if (this.renderState.app.feels[this.renderState.app.unit] !== this.oldState.app.feels[this.renderState.app.unit]) {
      this.feelsNode.innerText = `${Math.round(this.renderState.app.feels[this.renderState.app.unit])}`;
    }

    if (this.renderState.app.wind !== this.oldState.app.wind) {
        this.windNode.innerText = `${(convertKmPHoursToMPSec(this.renderState.app.wind)).toFixed(1)} ${t('MPS')}`;
    }

    if (this.renderState.app.humidity !== this.oldState.app.humidity) {
      this.humidityNode.innerText = `${this.renderState.app.humidity}`;
    }

    if (this.renderState.app.language !== this.oldState.app.language) {
      this.languageNode.value = this.renderState.app.language;

      this.latitudeTitleNode.innerText = `${t('LONGITUDE')}`;
      this.longitudeTitleNode.innerText = `${t('LATITUDE')}`;
      this.searchInpNode.placeholder = `${t('SEARCH PLACEHOLDER')}`;
      this.searchBtnNode.value = `${t('SEARCH SUBMIT')}`;
      this.conditionNowNode.innerText = t(
        `${this.renderState.app.condition}${this.renderState.app.isDay ? 'day' : 'night'}`
      );

      // this.mapLayer.setUrl(`https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}@2x.png?lang=${this.renderState.app.language}`);

      this.nextDays.forEach((day, i) => {
        day.nameNode.innerText = getFutureDay(
          this.renderState.app.now, i, this.renderState.app.language
        );
      });

      this.windNode.innerText = `${
        (convertKmPHoursToMPSec(this.renderState.app.wind)).toFixed(1)} ${t('MPS')
      }`;

      this.feelTitlesNode.innerText = `${t('FEELS')}`
      this.windTitleNode.innerText = `${t('WIND')}`
      this.humidityTitleNode.innerText = `${t('HUMIDITY')}`
    }


    if (this.renderState.app.now !== this.oldState.app.now) {
      this.dateNode.innerText = formatNowUTC(
        this.renderState.app.now, this.renderState.app.language);

      const oldDate = new Date(this.oldState.app.now);
      const renderDate = new Date(this.renderState.app.now);
      if (oldDate.getUTCDay() !== renderDate.getUTCDay()) {
        this.nextDays.forEach((day, i) => {
          day.nameNode.innerText = getFutureDay(
            this.renderState.app.now, i, this.renderState.app.language
          );
        });
      }
    }

    this.nextDays.forEach((day, i) => {
      if (this.renderState.app.nextDays[i].temperature.min.c !== this.oldState.app.nextDays[i].temperature.min.c
          || this.renderState.app.nextDays[i].temperature.max.c !== this.oldState.app.nextDays[i].temperature.max.c) {
        day.temperature.innerText = `${
          Math.round(this.renderState.app.nextDays[i].temperature.min[this.renderState.app.unit])
          } - ${
            Math.round(this.renderState.app.nextDays[i].temperature.max[this.renderState.app.unit])
          }`;
      };
      if (this.renderState.app.nextDays[i].condition !== this.oldState.app.nextDays[i].condition) {
        day.icon.src = getIconPath(
          this.renderState.app.isDay,
          this.renderState.app.nextDays[i].condition);
      };
    });

    if (this.renderState.app.unit !== this.oldState.app.unit) {
      this.temperatureNode.innerText = `${
        Math.round(this.renderState.app.temperatureNow[this.renderState.app.unit])
      }`;
      this.temperatureUnitNode.innerText = `°${this.renderState.app.unit.toUpperCase()}`;
      this.feelsNode.innerText = `${Math.round(this.renderState.app.feels[this.renderState.app.unit])}`;

      this.nextDays.forEach((day, i) => {
          day.temperature.innerText = `${
            Math.round(this.renderState.app.nextDays[i].temperature.min[this.renderState.app.unit])
            } - ${
              Math.round(this.renderState.app.nextDays[i].temperature.max[this.renderState.app.unit])
            }`;
      });
    }

    this.oldState.app = copyObject(this.renderState.app);
    this.oldState.background = this.renderState.background;
  }
}

export default View;