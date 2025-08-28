// src/componentes/PanelCajero.jsx
import React, { useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import "./PanelCajero.css";   // 👈 importa el CSS personalizado

export default function PanelCajero() {
  const [nombre_cliente, setNombreCliente] = useState("");
  const [bodega, setBodega] = useState("");
  const [mensaje, setMensaje] = useState("");

  const llamarTurno = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("https://turnos-backend-b0jc.onrender.com/api/turnos/", {
        nombre_cliente: nombre_cliente,
        bodega: bodega,
      });

      setMensaje(`Turno ${res.data.numero} llamado para ${res.data.nombre_cliente} en ${res.data.bodega}`);
      setNombreCliente("");
      setBodega("");
    } catch (error) {
      console.error("Error al llamar turno:", error);

      if (error.response && error.response.data && error.response.data.error) {
        setMensaje("Error: " + error.response.data.error);
      } else {
        setMensaje("Error al registrar turno");
      }
    }
  };

  return (
    <div className="panel-cajero-container">
      <Navbar />

      <div className="panel-cajero-content">
        <div className="panel-cajero-card">
          <h2 className="panel-cajero-titulo">Panel del Cajero</h2>

          <form onSubmit={llamarTurno} className="space-y-4">
            
            <div className="mb-4">
              <label className="block mb-2">Nombre del Cliente:</label>
              <input
                type="text"
                value={nombre_cliente}
                onChange={(e) => setNombreCliente(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-md bg-gray-900 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Bodega:</label>
              <input
                type="text"
                value={bodega}
                onChange={(e) => setBodega(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-md bg-gray-900 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button type="submit" className="panel-cajero-boton w-full">
              Llamar Turno
            </button>
          </form>

          {mensaje && (
            <div className="panel-cajero-mensaje">{mensaje}</div>
          )}
        </div>
      </div>
    </div>
  );
}
