//css
import './App.css'
//3rd party
import { BrowserRouter, Routes, Route } from 'react-router-dom'
//Pages
import Home from './pages/Home.tsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
