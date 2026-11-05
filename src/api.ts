import type { City } from './data'

export interface WeatherData {
  current: { temperature: number; humidity: number; wind: number; code: number; time: string }
  daily: { date: string; code: number; max: number; min: number }[]
}

export async function fetchWeather(city: City, signal?: AbortSignal): Promise<WeatherData> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}` +
    `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
    `&timezone=Asia%2FHo_Chi_Minh&forecast_days=7`
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`Máy chủ trả về lỗi ${res.status}`)
  const j = await res.json()
  return {
    current: {
      temperature: j.current.temperature_2m,
      humidity: j.current.relative_humidity_2m,
      wind: j.current.wind_speed_10m,
      code: j.current.weather_code,
      time: j.current.time,
    },
    daily: j.daily.time.map((date: string, i: number) => ({
      date,
      code: j.daily.weather_code[i],
      max: j.daily.temperature_2m_max[i],
      min: j.daily.temperature_2m_min[i],
    })),
  }
}
