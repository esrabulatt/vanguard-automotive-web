import { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { ContactPage } from './pages/ContactPage'
import { useRevealOnScroll } from './hooks/useRevealOnScroll'
import { Navbar } from './components/Navbar'
import { AppointmentModal } from './components/AppointmentModal'
import { FleetPage } from './components/FleetPage'
import { MinimalFooter } from './components/MinimalFooter'
import { CarDetailModal } from './components/CarDetailModal'
import { getCars } from './services/api'
import { useCarStore } from './store/useCarStore'
import type { Car } from './types/car'

function App() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { detailCarId, closeFleet, closeDetail } = useCarStore()
  const { pathname } = useLocation()
  useRevealOnScroll(`${cars.length}-${pathname}`)

  // Sayfa değişince en üste dön, açık katalog/detay katmanlarını kapat
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    closeFleet()
    closeDetail()
  }, [pathname, closeFleet, closeDetail])

  useEffect(() => {
    getCars()
      .then(setCars)
      .catch((err: Error) => setError(err.message || 'Araçlar yüklenemedi.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen">
      <Navbar cars={cars} />
      <Routes>
        <Route path="/" element={<HomePage cars={cars} />} />
        <Route path="/iletisim" element={<ContactPage />} />
        <Route path="*" element={<HomePage cars={cars} />} />
      </Routes>

      <FleetPage cars={cars} loading={loading} error={error} />

      <CarDetailModal key={`detail-${detailCarId}`} cars={cars} />
      <AppointmentModal cars={cars} />

      <MinimalFooter />
    </div>
  )
}

export default App
