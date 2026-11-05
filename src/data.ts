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

type Theme = 'clear' | 'cloud' | 'rain' | 'storm' | 'fog'

const CODES: [number[], string, string, Theme][] = [
  [[0], '☀️', 'Trời quang', 'clear'],
  [[1], '🌤️', 'Ít mây', 'clear'],
  [[2], '⛅', 'Có mây', 'cloud'],
  [[3], '☁️', 'Nhiều mây', 'cloud'],
  [[45, 48], '🌫️', 'Sương mù', 'fog'],
  [[51, 53, 55, 56, 57], '🌦️', 'Mưa phùn', 'rain'],
  [[61, 63, 65, 66, 67], '🌧️', 'Mưa', 'rain'],
  [[80, 81, 82], '🌦️', 'Mưa rào', 'rain'],
  [[95, 96, 99], '⛈️', 'Dông', 'storm'],
]

export function describe(code: number) {
  const found = CODES.find(([codes]) => codes.includes(code))
  if (!found) return { icon: '🌡️', text: 'Không rõ', theme: 'cloud' }
  const [, icon, text, theme] = found
  return { icon, text, theme }
}

export const normalize = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase()
