export function ipgeolocation(key: string): string {
  return `https://api.ipgeolocation.io/ipgeo?apiKey=${key}&excludes=continent_code,currency,time_zone`;
}

export function opencagedataByCoord(key: string, lat: number, lon: number, language?: string): string {
  let result = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${key}&pretty=1&no_annotations=1&limit=1`;
  if (language) {
    result += `&language=${language}`
  }
  return result;
}

export function opencagedataByName(key: string, name: string, language?: string): string {
  let result = `https://api.opencagedata.com/geocode/v1/json?q=${name}&key=${key}&pretty=1&no_annotations=1&limit=20`;
  if (language) {
    result += `&language=${language}`
  }
  return result;
}