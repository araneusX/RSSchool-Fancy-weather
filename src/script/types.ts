export type status = 'ok' | 'error';
export class UserLocation {
  status: status;
  lon: number;
  lat: number;
  lang: string;
  city?: {
    name: string;
    formatted: string;
  }
  DMS: {
    lon: string;
    lat: string;
  }
  timeOffsetSec: number;
};

