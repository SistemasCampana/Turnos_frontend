import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './componentes/Login';
import PedirTurno from './componentes/PedirTurno';
import MostrarTurno from './componentes/MostrarTurno';
import PanelCajero from './componentes/PanelCajero';
import InformeTurnos from './componentes/InformeTurnos';
import RegistroUsuarios from './componentes/RegistroUsuarios';
import './App.css';

// 🛡️ COMPONENTE PARA PROTEGER RUTAS
// Este componente decide quién entra según su rol
const RutaProtegida = ({ children, rolesPermitidos }) => {
  const rol = localStorage.getItem("rol"); // Obtenemos el rol guardado en el login
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  // El Administrador siempre tiene permiso para TODO
  if (rol === 'administrador') {
    return children;
  }

  // Para otros roles, verificamos si el rol está en la lista permitida
  if (rolesPermitidos && !rolesPermitidos.includes(rol)) {
    return (
      <div style={{ padding: '2rem', color: 'white', textAlign: 'center' }}>
        <h1>🚫 Acceso Denegado</h1>
        <p>Tu rol de {rol} no tiene permiso para ver esta sección.</p>
      </div>
    );
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/turno" element={<PedirTurno />} />
        <Route path="/pantalla" element={<MostrarTurno />} />
        <Route path="/inicio" element={<MostrarTurno />} />

        {/* 🔐 RUTAS PROTEGIDAS (Aquí es donde el Admin ya puede entrar a todo) */}

        {/* El Panel lo ven Cajeros y Admins */}
        <Route path="/panel" element={
          <RutaProtegida rolesPermitidos={['cajero', 'administrador']}>
            <PanelCajero />
          </RutaProtegida>
        } />

        {/* Solo Admins (pero el Administrador ya está validado arriba) */}
        <Route path="/registro" element={
          <RutaProtegida rolesPermitidos={['administrador']}>
            <RegistroUsuarios />
          </RutaProtegida>
        } />

        <Route path="/informe" element={
          <RutaProtegida rolesPermitidos={['administrador']}>
            <InformeTurnos />
          </RutaProtegida>
        } />

        <Route path="*" element={<div style={{ padding: '2rem', color: 'white' }}><h1>Ruta no encontrada</h1></div>} />
      </Routes>
    </Router>
  );
}

export default App;