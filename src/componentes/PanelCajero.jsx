// src/componentes/PanelCajero.jsx
import React, { useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";

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
      setMensaje("Error al registrar turno");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-lg rounded-xl">
      <Navbar />

      <h2 className="text-xl font-bold mb-4">Panel del Cajero</h2>

      <form onSubmit={llamarTurno} className="space-y-4">
        <div>
          <label className="block text-gray-700">Nombre del Cliente:</label>
          <input
            type="text"
            value={nombre_cliente}
            onChange={(e) => setNombreCliente(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-gray-700">Bodega:</label>
          <input
            type="text"
            value={bodega}
            onChange={(e) => setBodega(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Llamar Turno
        </button>
      </form>

      {mensaje && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">
          {mensaje}
        </div>
      )}
    </div>
  );
}

