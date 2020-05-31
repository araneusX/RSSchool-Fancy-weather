import { State } from './state';
import { replaceInnerHTML, getIconPath } from './utils';
import { loadImage } from './getData';
import L from '../leaflet/leaflet';

class View{
  languageNode = document.getElementById('js-language') as HTMLSelectElement;
  unitBtn = document.getElementById('js-unitBtn');
  voiceBtn = document.getElementById('js-voiceBtn');
  commandBtn = document.getElementById('js-commandBtn');
  searchInp = document.getElementById('js-searchInp') as HTMLInputElement;
  searchBtn = document.getElementById('js-searchBtn');
  placeNode = document.getElementById('js-place');
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
  nextDays = ['Next1', 'Next2', 'Next3'].map((i) => (
    {
      nameNode: document.getElementById(`js-title${i}`),
      temperature: document.getElementById(`js-temperature${i}`),
      icon: document.getElementById(`js-icon${i}`) as HTMLImageElement,
    }
  ));
  mapNode = document.getElementById('js-map');

  map: any;
  currentState: State;

  async init(initialState: State): Promise<void> {
    this.currentState = initialState;

    this.map = L.map(this.mapNode, {
      center: [this.currentState.lat, this.currentState.lon],
      zoom: 9,
      zoomControl: false,
      boxZoom: false,
      doubleClickZoom: false,
      dragging: false,
      keyboard: false,
      scrollWheelZoom: false
    });
    
    L.tileLayer(`https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}@2x.png?lang=${this.currentState.language}`, {
        maxZoom: 19,
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
        + ' | <a href="https://maps.wikimedia.org">Wikimedia.org</a>',
    }).addTo(this.map);

    this.unitBtn.dataset.unit = this.currentState.unit;
    this.languageNode.value = this.currentState.language;

    if (this.currentState.voice) {
      this.voiceBtn.classList.add('active');
    }

    if (this.currentState.command) {
      this.commandBtn.classList.add('active');
    }

    if (this.currentState.search.value.length > 0) {
      this.searchInp.value = this.currentState.search.value;
      this.searchInp.focus();
    }

    if (this.currentState.backgroundURL !== '') {
      document.body.style['background-image'] = `url(${await loadImage(this.currentState.backgroundURL)})`;
    }

    this.placeNode.append(this.currentState.place);
    this.dateNode.append(`${this.currentState.now}`.slice(0, 25));
    this.latitudeNode.append(`${this.currentState.lat}`);
    this.longitudeNode.append(`${this.currentState.lon}`);
    this.conditionNowNode.append(this.currentState.condition.text);
    this.temperatureNode.append(`${this.currentState.temperatureNow}`);
    this.feelsNode.append(`${this.currentState.feels}`);
    this.windNode.append(`${this.currentState.wind}`);
    this.humidityNode.append(`${this.currentState.humidity}`);
    this.iconNowNode.src = getIconPath(this.currentState.period, this.currentState.condition.icon);

    this.nextDays.forEach((day, i) => {
      day.nameNode.append(`${this.currentState.now}`.slice(0, 16));
      day.temperature.append(`${this.currentState.nextDays[i].temperature}`);
      day.icon.src = getIconPath(1, this.currentState.nextDays[i].icon);
    });
  }

  async render(newState: State): Promise<void> {
    if (this.currentState.backgroundURL !== newState.backgroundURL) {
      this.currentState.backgroundURL = newState.backgroundURL;
      document.body.style['background-image'] = `url(${await loadImage(this.currentState.backgroundURL)})`;
    }

    if (this.currentState.lon !== newState.lon || this.currentState.lat !==newState.lat) {
      this.currentState.lon = newState.lon;
      this.currentState.lat = newState.lat;
      this.map.setView({lon: this.currentState.lon, lat: this.currentState.lat});
    }

    if (this.currentState.unit !== newState.unit) {
      this.currentState.unit = newState.unit;
      this.unitBtn.dataset.unit = this.currentState.unit;
    }

    if (this.currentState.language !== newState.language) {
      this.currentState.language = newState.language;
      this.languageNode.value = this.currentState.language;
    }

    if (newState.voice) {
      if (!this.currentState.voice) {
        this.currentState.voice = true;
        this.voiceBtn.classList.add('active');
      }
    } else {
      if (this.currentState.voice) {
        this.currentState.voice = false;
        this.voiceBtn.classList.remove('active');
      }
    }

    if (newState.command) {
      if (!this.currentState.command) {
        this.currentState.command = true;
        this.commandBtn.classList.add('active');
      }
    } else {
      if (this.currentState.command) {
        this.currentState.command = false;
        this.commandBtn.classList.remove('active');
      }
    }

    if (this.currentState.search.value.length > 0) {
      if (this.currentState.search.value !== newState.search.value) {
        this.currentState.search.value = newState.search.value;
        this.searchInp.value = this.currentState.search.value;
      }
      this.searchInp.focus();
    }

    if (this.currentState.place !== newState.place) {
      this.currentState.place = newState.place;
      replaceInnerHTML(this.placeNode, this.currentState.place);
    }

    if (this.currentState.lat !== newState.lat) {
      this.currentState.lat = newState.lat;
      replaceInnerHTML(this.latitudeNode, `${this.currentState.lat}`)
    }

    if (this.currentState.lon !== newState.lon) {
      this.currentState.lon = newState.lon;
      replaceInnerHTML(this.longitudeNode, `${this.currentState.lon}`)
    }

    if (this.currentState.condition.icon !== newState.condition.icon) {
      this.currentState.condition = newState.condition;
      replaceInnerHTML(this.conditionNowNode, this.currentState.condition.text);
      this.iconNowNode.src = getIconPath(this.currentState.period, this.currentState.condition.icon);
    }

    if (this.currentState.temperatureNow !== newState.temperatureNow) {
      this.currentState.temperatureNow = newState.temperatureNow;
      replaceInnerHTML(this.temperatureNode, `${this.currentState.temperatureNow}`)
    }

    if (this.currentState.feels !== newState.feels) {
      this.currentState.feels = newState.feels;
      replaceInnerHTML(this.feelsNode, `${this.currentState.feels}`)
    }

    if (this.currentState.wind !== newState.wind) {
      this.currentState.wind = newState.wind;
      replaceInnerHTML(this.windNode, `${this.currentState.wind}`)
    }

    if (this.currentState.humidity !== newState.humidity) {
      this.currentState.humidity = newState.humidity;
      replaceInnerHTML(this.humidityNode, `${this.currentState.humidity}`)
    }
  }
}

export default View;