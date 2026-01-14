import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './componentes/Login';
import PedirTurno from './componentes/PedirTurno';
import MostrarTurno from './componentes/MostrarTurno';
import PanelCajero from './componentes/PanelCajero';
import InformeTurnos from './componentes/InformeTurnos';
import RegistroUsuarios from './componentes/RegistroUsuarios';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas de acceso */}
        <Route path="/" element={<LoginWrapper />} />
        <Route path="/login" element={<LoginWrapper />} />

        {/* Flujo de Turnos */}
        <Route path="/turno" element={<PedirTurno />} />
        <Route path="/pantalla" element={<MostrarTurno />} />
        <Route path="/inicio" element={<MostrarTurno />} />

        {/* Paneles de Gestión */}
        <Route path="/panel" element={<PanelCajero />} />
        <Route path="/registro" element={<RegistroUsuarios />} />
        <Route path="/informe" element={<InformeTurnos />} />

        <Route path="*" element={<div style={{ padding: '2rem' }}><h1>Ruta no encontrada</h1></div>} />
      </Routes>
    </Router>
  );
}

// 🔹 CORRECCIÓN: El Wrapper ahora es neutro.
// Deja que el componente Login decida a dónde navegar según el rol.
function LoginWrapper() {
  return (
    <Login onLogin={() => {
      console.log("Login exitoso detectado en App.js");
    }} />
  );
}

export default App;