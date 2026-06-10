import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
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
        </Route>
      </Routes>
    </HashRouter>
  )
}
