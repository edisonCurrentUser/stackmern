import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'

import Navbar from "./components/Navbar";
import PaginaPrincipal from './pages/PaginaPrincipal';
import Certificados from './pages/Certificados';
import Contratistas from './pages/Contratistas';
import Proyectos from './pages/Proyectos';
import Inspecciones from './pages/Inspecciones';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<PaginaPrincipal />} />
          <Route path="/certificados" element={<Certificados />} />
          <Route path="/contratistas" element={<Contratistas />} />
          <Route path="/proyectos" element={<Proyectos />} />
          <Route path="/inspecciones" element={<Inspecciones />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
