export async function loadImage(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  const base64Image = URL.createObjectURL(blob);
  return base64Image;
}

export async function detectLocation(): Promise<{lon: number, lat: number}> {
  return
}