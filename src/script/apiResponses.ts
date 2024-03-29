export function ipgeolocation(key: string): string {
  const result = `https://api.ipgeolocation.io/ipgeo?apiKey=${key}&excludes=continent_code,currency,time_zone`;
  return result;
}

export function opencagedataByCoord(key: string, lat: number, lon: number, language?: string): string {
  let result = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${key}&pretty=1&limit=10`;
  if (language) {
    result += `&language=${language}`
  }
  return result;
}

export function opencagedataByName(key: string, name: string, language?: string): string {
  let result = `https://api.opencagedata.com/geocode/v1/json?q=${name}&key=${key}&pretty=1&limit=20`;
  if (language) {
    result += `&language=${language}`
  }
  return result;
}

export function flickrByTags(key: string, season: string, time: string): string {
  const result = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${key}&text=${time}&tags=${season},${time}&tag_mode=all&extras=url_h&format=json&nojsoncallback=1&content_type=1&safe_search=1&sort=relevance`;
  return result;
}

export function weatherapiNow(key: string, lat: number, lon: number): string {
  const result = `https://api.weatherapi.com/v1/current.json?key=${key}q=${lat},${lon}`;
  return result;
}

export function weatherapiForecast(key: string, lat: number, lon: number, days: number): string {
  const result = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${lat},${lon}&days=${days}`;
  return result;
}


