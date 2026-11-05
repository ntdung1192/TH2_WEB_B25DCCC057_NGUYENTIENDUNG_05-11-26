import { useEffect, useState } from 'react'
import { CITIES, describe, normalize } from './data'
import { getWeather, Weather } from './api'

const DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

function readFavs(): string[] {
  try {
    return JSON.parse(localStorage.getItem('favs') || '[]')
  } catch {
    return []
  }
}

export default function App() {
  const [city, setCity] = useState(CITIES[0])
  const [weather, setWeather] = useState<Weather | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)
  const [unit, setUnit] = useState<'C' | 'F'>('C')
  const [query, setQuery] = useState('')
  const [favs, setFavs] = useState<string[]>(readFavs)

  useEffect(() => {
    const ctrl = new AbortController()
    setLoading(true)
    setError('')
    getWeather(city, ctrl.signal)
      .then(setWeather)
      .catch((e) => e.name !== 'AbortError' && setError(e.message || 'Không tải được dữ liệu'))
      .finally(() => !ctrl.signal.aborted && setLoading(false))
    return () => ctrl.abort()
  }, [city, reload])

  useEffect(() => {
    localStorage.setItem('favs', JSON.stringify(favs))
  }, [favs])

  const toggleFav = (id: string) =>
    setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]))

  const deg = (c: number) => Math.round(unit === 'C' ? c : c * 1.8 + 32) + '°'

  const cities = CITIES.filter((c) => normalize(c.name).includes(normalize(query.trim()))).sort(
    (a, b) => Number(favs.includes(b.id)) - Number(favs.includes(a.id)),
  )

  const now = weather && describe(weather.code)

  return (
    <div className={`app ${now && !error ? now.theme : ''}`}>
      <div className="wrap">
        <header>
          <span className="logo">Thời tiết</span>
          <div className="switch">
            {(['C', 'F'] as const).map((u) => (
              <button key={u} className={unit === u ? 'on' : ''} onClick={() => setUnit(u)}>
                °{u}
              </button>
            ))}
          </div>
        </header>

        <div className="glass sidebar">
          <input
            placeholder="Tìm thành phố"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <ul>
            {cities.map((c) => (
              <li key={c.id} className={c.id === city.id ? 'active' : ''}>
                <button onClick={() => setCity(c)}>{c.name}</button>
                <button
                  className={favs.includes(c.id) ? 'star on' : 'star'}
                  onClick={() => toggleFav(c.id)}
                  title="Yêu thích"
                >
                  {favs.includes(c.id) ? '★' : '☆'}
                </button>
              </li>
            ))}
            {cities.length === 0 && <li className="muted">Không có kết quả</li>}
          </ul>
        </div>

        <main className="glass">
          {error ? (
            <div className="center">
              <p>{error}</p>
              <button className="btn" onClick={() => setReload((n) => n + 1)}>
                Thử lại
              </button>
            </div>
          ) : !weather || !now ? (
            <div className="center">
              <span className="spinner" />
            </div>
          ) : (
            <div className={loading ? 'fade' : ''}>
              <p className="muted">{city.name}</p>
              <div className="now">
                <span className="temp">{deg(weather.temp)}</span>
                <span className="icon">{now.icon}</span>
              </div>
              <p>{now.text}</p>
              <div className="meta">
                <span>Độ ẩm {weather.humidity}%</span>
                <span>Gió {weather.wind} km/h</span>
              </div>

              <ul className="days">
                {weather.days.map((d, i) => (
                  <li key={d.date}>
                    <span className="muted">{i === 0 ? 'Nay' : DAYS[new Date(d.date + 'T00:00').getDay()]}</span>
                    <span className="icon-sm" title={describe(d.code).text}>
                      {describe(d.code).icon}
                    </span>
                    <span>{deg(d.max)}</span>
                    <span className="muted">{deg(d.min)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
