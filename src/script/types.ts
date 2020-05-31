export type status = 'ok' | 'error';
export interface UserLocation {
  status: status, lon: number, lat: number, lang: string, city?: string,
};

