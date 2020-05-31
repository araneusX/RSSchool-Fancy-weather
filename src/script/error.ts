const //error types
  LOCATION_GET = 'LOCATION_GET';

export default function handleError(type: string, error: Error | string): void {
  switch (type) {
    case LOCATION_GET:
      console.error(error);
      break;
    default:
      console.error(error);
  }
}