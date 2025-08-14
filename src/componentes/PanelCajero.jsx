import React, { useState } from 'react';
import Navbar from "./Navbar";
import "./PanelCajero.css";

const PanelCajero = () => {
  const [turno, setTurno] = useState(null);
  const [modulo, setModulo] = useState(1);

  const llamarSiguiente = async () => {
    const res = await fetch("https://turnos-backend-b0jc.onrender.com/api/turnos/siguiente", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ modulo })
    });

    const data = await res.json();
    setTurno(data);
  };

  return (
    <div className="panel-cajero-container">
      {/* Barra de navegación */}
      <Navbar />

      {/* Contenido principal */}
      <div className="panel-cajero-content">
        <div className="panel-cajero-card">
          <h2 className="panel-cajero-titulo">Panel del Cajero</h2>

          <div>
            <label>
              Módulo:
              <input
                className="panel-cajero-input"
                type="number"
                min="1"
                max="10"
                value={modulo}
                onChange={(e) => setModulo(Number(e.target.value))}
              />
            </label>
          </div>

          <button
            className="panel-cajero-boton"
            onClick={llamarSiguiente}
          >
            Llamar Siguiente Turno
          </button>

          {turno && turno.numero ? (
            <p className="panel-cajero-turno">
              Llamando al Turno: <strong>{turno.numero}</strong> (Módulo {turno.modulo})
            </p>
          ) : turno?.mensaje ? (
            <p className="panel-cajero-mensaje">No hay turnos disponibles.</p>
          ) : (
            <p className="panel-cajero-mensaje">Esperando turno...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PanelCajero;
