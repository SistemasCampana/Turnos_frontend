import React, { useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import "./InformeTurnos.css";

const API_BASE_URL = "https://turnos-backend-pcyf.onrender.com/api/turnos/";

export default function InformeTurnos() {
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [informe, setInforme] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const generarInforme = async () => {
    setCargando(true);
    setError(null);
    setInforme(null);

    try {
      const url = `${API_BASE_URL}/informe/${fecha}`;
      const response = await axios.get(url);
      setInforme(response.data);
    } catch (err) {
      const errorMessage = err.response
        ? `Error del servidor: ${err.response.data.error || err.response.statusText}`
        : "Fallo la conexión con el servidor. Revisa que el Backend esté corriendo.";
      setError(errorMessage);
    } finally {
      setCargando(false);
    }
  };

  const handleFechaChange = (e) => setFecha(e.target.value);

  return (
    <div className="informe-main">
      
      <div className="informe-container">
        <Navbar />
        <header className="informe-header">
          <h1 className="informe-title">
            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>
            </svg>
            Generar Informe de Turnos
          </h1>
        </header>

        <div className="panel-consulta">
          <div className="consulta-flex">

            <label htmlFor="fecha" className="label-fecha">Selecciona la Fecha:</label>

            <input
              type="date"
              id="fecha"
              value={fecha}
              onChange={handleFechaChange}
              max={new Date().toISOString().split("T")[0]}
              disabled={cargando}
              className="input-fecha"
            />

            <button onClick={generarInforme} disabled={cargando} className={`btn-generar ${cargando ? "btn-off" : "btn-on"}`}>
              {cargando ? "Cargando..." : "Generar Informe"}
            </button>

          </div>
        </div>

        {error && (
          <div className="error-box">
            <p>{error}</p>
          </div>
        )}

        {informe && (
          <div className="panel-informe">

            <h2 className="informe-subtitle">
              <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M9 11l3 3L22 4"/>
              </svg>
              Informe del Día: {informe.fecha}
            </h2>

            <div className="cards-container">

              <Card
                title="Total de Turnos Generados"
                value={informe.total_turnos}
                icon={
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                  </svg>
                }
                color="card-indigo"
              />

              <Card
                title="Turnos Llamados"
                value={informe.detalle_turnos.filter((t) => t.estado === "llamado").length}
                icon={
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.5 17.5 18 20l2 2"/>
                    <path d="M19.5 15l.5-2 2-2.5"/>
                  </svg>
                }
                color="card-green"
              />

            </div>

            <h3 className="detalle-title">
              Detalle de Turnos ({informe.detalle_turnos.length})
            </h3>

            <TurnosTable turnos={informe.detalle_turnos} />

          </div>
        )}

      </div>
    </div>
  );
}

const Card = ({ title, value, icon, color }) => (
  <div className={`card-box ${color}`}>
    <div className="card-info">
      <span className="card-title">{title}</span>
      <span className="card-value">{value}</span>
    </div>
    <div className="card-icon">{icon}</div>
  </div>
);

const TurnosTable = ({ turnos }) => (
  <div className="tabla-wrapper">
    <table className="tabla-turnos">
      <thead>
        <tr>
          <th>Turno</th>
          <th>Generado</th>
          <th>Cliente</th>
          <th>Bodega</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        {turnos.map((t) => (
          <tr key={t.id}>
            <td className="turno-numero">{t.numero}</td>
            <td>{t.hora_generacion}</td>
            <td>{t.nombre_cliente}</td>
            <td>{t.bodega}</td>
            <td>
              <span className={`estado ${t.estado}`}>{t.estado.toUpperCase()}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
