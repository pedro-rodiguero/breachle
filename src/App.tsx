import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { CveDle } from './games/CveDle'
import { MalwareOr } from './games/MalwareOr'
import { PhishOrLegit } from './games/PhishOrLegit'
import { Triage } from './games/Triage'
import { Hub } from './pages/Hub'

/**
 * HashRouter so the site works on any static host (GitHub Pages included)
 * without server-side rewrite rules.
 */
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Hub />} />
          <Route path="/cvedle" element={<CveDle />} />
          <Route path="/triage" element={<Triage />} />
          <Route path="/phish" element={<PhishOrLegit />} />
          <Route path="/malware" element={<MalwareOr />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
