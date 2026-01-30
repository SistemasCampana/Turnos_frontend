import React, { useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import "./InformeTurnos.css";

const API_BASE_URL = "https://turnos-backend-pcyf.onrender.com/api";
// "http://127.0.0.1:5000/api";

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
      // URL sincronizada con el backend local
      const response = await axios.get(`${API_BASE_URL}/turnos/informe/${fecha}`);
      setInforme(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="informe-main">
      <Navbar />
      <div className="informe-container">
        <header className="informe-header">
          <h1 className="informe-title">Informe de Turnos - La Campana</h1>
        </header>

        <div className="panel-consulta">
          <div className="consulta-flex">
            <label className="label-fecha">Fecha de consulta:</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="input-fecha"
            />
            <button onClick={generarInforme} disabled={cargando} className="btn-generar btn-on">
              {cargando ? "Cargando..." : "Generar Informe"}
            </button>
          </div>
        </div>

        {error && <div className="error-box">⚠️ {error}</div>}

        {informe && (
          <div className="panel-informe">
            <div className="cards-container">
              <div className="card-box card-red">
                <span className="card-title">Turnos Totales</span>
                <span className="card-value">{informe.total_turnos}</span>
              </div>
            </div>

            <h3 className="detalle-title">Listado Detallado</h3>
            <div className="tabla-wrapper">
              <table className="tabla-turnos">
                <thead>
                  <tr>
                    <th>Turno</th>
                    <th>Cliente</th>
                    <th>Bodega</th>
                    <th>Sede</th>
                    <th>Hora</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {informe.detalle_turnos.map((t) => (
                    <tr key={t.id}>
                      <td className="turno-numero">{t.numero}</td>
                      <td>{t.nombre_cliente}</td>
                      <td>{t.bodega}</td>
                      <td>{t.sede}</td>
                      <td>{new Date(t.creado_en).toLocaleTimeString()}</td>
                      <td>
                        <span className={`estado ${t.estado}`}>{t.estado.toUpperCase()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}