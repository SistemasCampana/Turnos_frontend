import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import "./PanelCajero.css";

const PanelCajero = () => {
  const [clientes, setClientes] = useState([]);
  const [clienteId, setClienteId] = useState("");
  const [bodega, setBodega] = useState("");

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/clientes");
        setClientes(res.data);
      } catch (error) {
        console.error("Error cargando clientes:", error);
      }
    };
    fetchClientes();
  }, []);

  const asignarTurno = async () => {
    if (!clienteId || !bodega) {
      alert("Selecciona un cliente y escribe una bodega");
      return;
    }
    try {
      await axios.post("https://turnos-backend-b0jc.onrender.com/turnos", {
        cliente_id: clienteId,
        bodega: bodega,
      });
      alert("Turno asignado ✅");
      setClienteId("");
      setBodega("");
    } catch (error) {
      console.error(error);
      alert("Error al asignar turno");
    }
  };

  return (
    <div className="panel-cajero-container">
      <Navbar />
      <div className="panel-cajero-card">
        <h2>Panel del Cajero</h2>

        {/* Select de clientes */}
        <label>
          Selecciona Cliente:
          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            className="panel-cajero-input"
          >
            <option value="">-- Selecciona --</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </label>

        {/* Input bodega */}
        <label>
          Bodega:
          <input
            type="text"
            value={bodega}
            onChange={(e) => setBodega(e.target.value)}
            className="panel-cajero-input"
          />
        </label>

        {/* Botón */}
        <button onClick={asignarTurno} className="panel-cajero-boton">
          Asignar Turno
        </button>
      </div>
    </div>
  );
};

export default PanelCajero;
