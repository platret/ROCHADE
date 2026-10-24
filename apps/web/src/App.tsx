import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { RouteFallback } from './components/RouteFallback'
import { LandingPage } from './landing/LandingPage'

const VerwaltungPage = lazy(() => import('./verwaltung/VerwaltungPage'))

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/verwaltung" element={<VerwaltungPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
