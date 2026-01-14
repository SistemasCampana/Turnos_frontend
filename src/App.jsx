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
        {/* Rutas Públicas */}
        <Route path="/" element={<LoginWrapper />} />
        <Route path="/login" element={<LoginWrapper />} />
        <Route path="/turno" element={<PedirTurno />} /> {/* Pantalla para que el cliente pida turno */}

        {/* Rutas de Visualización */}
        <Route path="/pantalla" element={<MostrarTurno />} />
        <Route path="/inicio" element={<MostrarTurno />} />

        {/* Rutas de Gestión (Protegidas internamente por rol en cada componente) */}
        <Route path="/panel" element={<PanelCajero />} />
        <Route path="/registro" element={<RegistroUsuarios />} />
        <Route path="/informe" element={<InformeTurnos />} />

        {/* Manejo de errores */}
        <Route path="*" element={<div style={{ padding: '2rem' }}><h1>Ruta no encontrada</h1></div>} />
      </Routes>
    </Router>
  );
}

// 🔹 LoginWrapper Corregido: Ya no fuerza el "/panel"
// Ahora deja que el componente Login maneje la redirección según el rol
function LoginWrapper() {
  return (
    <Login onLogin={() => {
      // Esta función se puede quedar vacía porque la lógica de 
      // navigate() ya la pusimos dentro del handleSubmit de Login.jsx
      console.log("Sesión iniciada correctamente");
    }} />
  );
}

export default App;