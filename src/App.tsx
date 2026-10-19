import { Route, Routes, useLocation } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Navbar } from './components/Navbar'
import { ChallengePage } from './pages/ChallengePage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { TopicPage } from './pages/TopicPage'
import { useEffect } from 'react'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="min-h-screen bg-ink text-slate-300">
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/local-vs-global" element={<TopicPage topicId="local-global" />} />
        <Route path="/thrashing" element={<TopicPage topicId="thrashing" />} />
        <Route path="/tamano-de-pagina" element={<TopicPage topicId="page-size" />} />
        <Route path="/id-cow" element={<TopicPage topicId="id-cow" />} />
        <Route path="/kernel-challenge" element={<ChallengePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </div>
  )
}
