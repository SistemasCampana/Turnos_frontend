import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './componentes/Login';
import PedirTurno from './componentes/PedirTurno';
import MostrarTurno from './componentes/MostrarTurno';
import PanelCajero from './componentes/PanelCajero';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginWrapper />} />
        <Route path="/turno" element={<PedirTurno />} />
        <Route path="/pantalla" element={<MostrarTurno />} />
        <Route path="/panel" element={<PanelCajero />} />
        <Route path="*" element={<div style={{ padding: '2rem' }}><h1>Ruta no encontrada</h1></div>} />
      </Routes>
    </Router>
  );
}

// Este componente envuelve a Login y le pasa onLogin
function LoginWrapper() {
  const navigate = useNavigate();

  return (
    <Login onLogin={() => navigate("/panel")} />
  );
}

export default App;

