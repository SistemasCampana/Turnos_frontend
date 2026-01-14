import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Para redirigir si no tiene permiso
import Navbar from "./Navbar";
import axios from "axios";
import "./PanelCajero.css";

const CONFIGURACION_SEDES = {
  "Ricaurte 1": [1],
  "Ricaurte 2": [1],
  "7 de Agosto": [1],
  "Paloquemao": [1, 2, 3]
};

export default function PanelCajero() {
  const navigate = useNavigate();
  const [nombre_cliente, setNombreCliente] = useState("");
  const [sede, setSede] = useState(localStorage.getItem("sede") || ""); // Carga la sede del usuario
  const [bodega, setBodega] = useState("");
  const [mensaje, setMensaje] = useState("");

  // 🔹 SEGURIDAD: Solo Cajeros, Admins y Emergencia pueden estar aquí
  useEffect(() => {
    const rol = localStorage.getItem("rol");
    if (!rol || (rol !== "cajero" && rol !== "administrador" && rol !== "emergencia")) {
      alert("No tienes permiso para acceder al Panel de Cajero");
      navigate("/"); // Lo mandamos al login si es un Visor o no está logueado
    }
  }, [navigate]);

  useEffect(() => {
    if (sede && CONFIGURACION_SEDES[sede]) {
      const bodegas = CONFIGURACION_SEDES[sede];
      setBodega(bodegas.length === 1 ? bodegas[0].toString() : "");
    }
  }, [sede]);

  const llamarTurno = async (e) => {
    e.preventDefault();

    if (!sede || !bodega || !nombre_cliente) {
      setMensaje("❌ Por favor complete todos los campos");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "https://turnos-backend-pcyf.onrender.com/api/turnos/",
        { nombre_cliente, bodega, sede },
        { headers: { Authorization: `Bearer ${token}` } } // Enviamos el token de seguridad
      );

      setMensaje(`✅ Turno ${res.data.numero} creado para ${res.data.nombre_cliente}`);
      setNombreCliente("");
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Error al conectar con el servidor";
      setMensaje("❌ " + errorMsg);
    }
  };

  return (
    <div className="panel-cajero-container">
      <Navbar />
      <div className="panel-cajero-content">
        <div className="panel-cajero-card">
          <h2 className="panel-cajero-titulo">Asignación de Turnos</h2>
          <p className="text-center text-gray-400 mb-4">Sede actual: <strong>{sede}</strong></p>

          <form onSubmit={llamarTurno} className="space-y-4">
            {/* Si el admin quiere cambiar de sede, puede. Si es cajero, ya viene fija */}
            <div className="mb-4">
              <label className="block mb-2">Confirmar Sede:</label>
              <select
                value={sede}
                onChange={(e) => setSede(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-md bg-gray-900 text-white border border-gray-600"
              >
                <option value="">Seleccione Sede...</option>
                {Object.keys(CONFIGURACION_SEDES).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-2">Bodega:</label>
              {CONFIGURACION_SEDES[sede]?.length > 1 ? (
                <select
                  value={bodega}
                  onChange={(e) => setBodega(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-md bg-gray-900 text-white border border-gray-600"
                >
                  <option value="">Seleccione Bodega...</option>
                  {CONFIGURACION_SEDES[sede].map((num) => (
                    <option key={num} value={num.toString()}>Bodega {num}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={bodega ? `Bodega ${bodega}` : "Seleccione Sede"}
                  disabled
                  className="w-full px-3 py-2 rounded-md bg-gray-800 text-gray-400 border border-gray-600"
                />
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2">Nombre del Cliente:</label>
              <input
                type="text"
                value={nombre_cliente}
                onChange={(e) => setNombreCliente(e.target.value)}
                placeholder="Ej: Juan Pérez"
                required
                className="w-full px-3 py-2 rounded-md bg-gray-900 text-white border border-gray-600"
              />
            </div>

            <button type="submit" className="panel-cajero-boton w-full">
              ASIGNAR TURNO
            </button>
          </form>

          {mensaje && (
            <div className={`panel-cajero-mensaje ${mensaje.includes('❌') ? 'error' : 'exito'}`}>
              {mensaje}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}