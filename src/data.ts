export interface City {
  id: string
  name: string
  lat: number
  lon: number
}

export const CITIES: City[] = [
  { id: 'hanoi', name: 'Hà Nội', lat: 21.0285, lon: 105.8542 },
  { id: 'haiphong', name: 'Hải Phòng', lat: 20.8449, lon: 106.6881 },
  { id: 'hue', name: 'Huế', lat: 16.4637, lon: 107.5909 },
  { id: 'danang', name: 'Đà Nẵng', lat: 16.0544, lon: 108.2022 },
  { id: 'nhatrang', name: 'Nha Trang', lat: 12.2388, lon: 109.1967 },
  { id: 'dalat', name: 'Đà Lạt', lat: 11.9404, lon: 108.4583 },
  { id: 'hcm', name: 'TP. Hồ Chí Minh', lat: 10.8231, lon: 106.6297 },
  { id: 'cantho', name: 'Cần Thơ', lat: 10.0452, lon: 105.7469 },
]

export type Theme = 'clear' | 'cloud' | 'rain' | 'storm' | 'fog' | 'snow'

export function describe(code: number): { icon: string; text: string; theme: Theme } {
  if (code === 0) return { icon: '☀️', text: 'Trời quang', theme: 'clear' }
  if (code === 1) return { icon: '🌤️', text: 'Ít mây', theme: 'clear' }
  if (code === 2) return { icon: '⛅', text: 'Có mây rải rác', theme: 'cloud' }
  if (code === 3) return { icon: '☁️', text: 'Nhiều mây', theme: 'cloud' }
  if (code === 45 || code === 48) return { icon: '🌫️', text: 'Sương mù', theme: 'fog' }
  if (code >= 51 && code <= 57) return { icon: '🌦️', text: 'Mưa phùn', theme: 'rain' }
  if (code >= 61 && code <= 65) return { icon: '🌧️', text: 'Mưa', theme: 'rain' }
  if (code === 66 || code === 67) return { icon: '🌧️', text: 'Mưa băng', theme: 'rain' }
  if (code >= 71 && code <= 77) return { icon: '❄️', text: 'Tuyết', theme: 'snow' }
  if (code >= 80 && code <= 82) return { icon: '🌦️', text: 'Mưa rào', theme: 'rain' }
  if (code === 85 || code === 86) return { icon: '❄️', text: 'Mưa tuyết', theme: 'snow' }
  if (code === 95) return { icon: '⛈️', text: 'Dông', theme: 'storm' }
  if (code === 96 || code === 99) return { icon: '⛈️', text: 'Dông kèm mưa đá', theme: 'storm' }
  return { icon: '❓', text: 'Không xác định', theme: 'cloud' }
}

export function removeAccents(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
}
