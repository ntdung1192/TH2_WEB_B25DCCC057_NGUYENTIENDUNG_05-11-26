import { useCallback, useEffect, useMemo, useState } from 'react'
import { CITIES, City, describe, removeAccents } from './data'
import { fetchWeather, WeatherData } from './api'

type Unit = 'C' | 'F'
type Status = 'idle' | 'loading' | 'error' | 'success'

const WEEKDAYS = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy']

const fmtTemp = (c: number, unit: Unit) =>
  `${Math.round(unit === 'C' ? c : (c * 9) / 5 + 32)}°${unit}`

function loadFavorites(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem('favorites') || '[]')
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

export default function App() {
  const [selected, setSelected] = useState<City | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [data, setData] = useState<WeatherData | null>(null)
  const [error, setError] = useState('')
  const [unit, setUnit] = useState<Unit>('C')
  const [query, setQuery] = useState('')
  const [favorites, setFavorites] = useState<string[]>(loadFavorites)
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    if (!selected) return
    const ctrl = new AbortController()
    setStatus('loading')
    setError('')
    fetchWeather(selected, ctrl.signal)
      .then((d) => {
        setData(d)
        setStatus('success')
      })
      .catch((e: Error) => {
        if (e.name === 'AbortError') return
        setError(e.message || 'Không thể tải dữ liệu')
        setStatus('error')
      })
    return () => ctrl.abort()
  }, [selected, retry])

  useEffect(() => {
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites))
    } catch {
      /* ignore */
    }
  }, [favorites])

  const toggleFav = (id: string) =>
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]))

  const list = useMemo(() => {
    const q = removeAccents(query.trim())
    return CITIES.filter((c) => removeAccents(c.name).includes(q)).sort(
      (a, b) => Number(favorites.includes(b.id)) - Number(favorites.includes(a.id)),
    )
  }, [query, favorites])

  const theme = status === 'success' && data ? describe(data.current.code).theme : 'default'

  return (
    <div className={`app theme-${theme}`}>
      <header>
        <h1>🌤️ Thời tiết Việt Nam</h1>
        <div className="unit-toggle" role="group" aria-label="Đơn vị nhiệt độ">
          {(['C', 'F'] as Unit[]).map((u) => (
            <button key={u} className={unit === u ? 'active' : ''} onClick={() => setUnit(u)}>
              °{u}
            </button>
          ))}
        </div>
      </header>

      <main className="layout">
        <aside className="card">
          <input
            className="search"
            type="search"
            placeholder="Tìm thành phố..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <ul className="cities">
            {list.map((c) => (
              <li key={c.id} className={selected?.id === c.id ? 'selected' : ''}>
                <button className="city-btn" onClick={() => setSelected(c)}>
                  {c.name}
                </button>
                <button
                  className="fav"
                  aria-label={favorites.includes(c.id) ? 'Bỏ yêu thích' : 'Yêu thích'}
                  onClick={() => toggleFav(c.id)}
                >
                  {favorites.includes(c.id) ? '★' : '☆'}
                </button>
              </li>
            ))}
            {list.length === 0 && <li className="empty">Không tìm thấy thành phố</li>}
          </ul>
        </aside>

        <section className="card detail">
          {status === 'idle' && <p className="state">Hãy chọn một thành phố để xem thời tiết.</p>}
          {status === 'loading' && (
            <p className="state">
              <span className="spinner" /> Đang tải dữ liệu...
            </p>
          )}
          {status === 'error' && (
            <div className="state error">
              <p>⚠️ Lỗi: {error}</p>
              <button className="retry" onClick={() => setRetry((n) => n + 1)}>
                Thử lại
              </button>
            </div>
          )}
          {status === 'success' && data && selected && (
            <>
              <h2>{selected.name}</h2>
              <div className="current">
                <div className="big-icon">{describe(data.current.code).icon}</div>
                <div>
                  <div className="temp">{fmtTemp(data.current.temperature, unit)}</div>
                  <div className="desc">{describe(data.current.code).text}</div>
                </div>
              </div>
              <div className="stats">
                <span>💧 Độ ẩm: {data.current.humidity}%</span>
                <span>💨 Gió: {data.current.wind} km/h</span>
                <span>🕒 Cập nhật: {data.current.time.replace('T', ' ')}</span>
              </div>
              <h3>Dự báo 7 ngày</h3>
              <ul className="forecast">
                {data.daily.map((d) => {
                  const dt = new Date(d.date + 'T00:00:00')
                  return (
                    <li key={d.date}>
                      <span className="dow">{WEEKDAYS[dt.getDay()]}</span>
                      <span className="date">
                        {String(dt.getDate()).padStart(2, '0')}/{String(dt.getMonth() + 1).padStart(2, '0')}
                      </span>
                      <span className="ico" title={describe(d.code).text}>
                        {describe(d.code).icon}
                      </span>
                      <span className="hi">{fmtTemp(d.max, unit)}</span>
                      <span className="lo">{fmtTemp(d.min, unit)}</span>
                    </li>
                  )
                })}
              </ul>
            </>
          )}
        </section>
      </main>
    </div>
  )
}
