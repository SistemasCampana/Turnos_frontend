import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const [sede, setSede] = useState("");
  const [bodega, setBodega] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [esAdmin, setEsAdmin] = useState(false);

  // 🛡️ 1. PROTECCIÓN Y CARGA DE PERMISOS
  useEffect(() => {
    const rol = localStorage.getItem("rol")?.toLowerCase();
    const sedeUsuario = localStorage.getItem("sede");

    // Si no hay token o el rol no es autorizado, al login
    if (!rol || (rol !== "cajero" && rol !== "administrador")) {
      navigate("/");
      return;
    }

    if (rol === "administrador") {
      setEsAdmin(true);
    }

    // Carga la sede asignada (El admin puede cambiarla luego)
    if (sedeUsuario) {
      setSede(sedeUsuario);
    }
  }, [navigate]);

  // ⚙️ 2. LÓGICA DE BODEGAS DINÁMICAS
  useEffect(() => {
    if (sede && CONFIGURACION_SEDES[sede]) {
      const bodegas = CONFIGURACION_SEDES[sede];
      // Si solo hay una bodega, se selecciona sola
      setBodega(bodegas.length === 1 ? bodegas[0].toString() : "");
    } else {
      setBodega("");
    }
  }, [sede]);

  const llamarTurno = async (e) => {
    e.preventDefault();
    setMensaje("");

    if (!sede || !bodega || !nombre_cliente) {
      setMensaje("❌ Por favor complete Sede, Bodega y Nombre");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
         "https://turnos-backend-pcyf.onrender.com/api/turnos/",
        // "http://127.0.0.1:5000/api/turnos/",
        { nombre_cliente, bodega, sede },
        { headers: { Authorization: `Bearer ${token}` } } // Enviamos token por seguridad
      );

      setMensaje(`✅ Turno ${res.data.numero} creado para ${res.data.nombre_cliente}`);
      setNombreCliente("");

    } catch (error) {
      console.error("Error al asignar turno:", error);
      const errorMsg = error.response?.data?.error || "Error de conexión";
      setMensaje("❌ " + errorMsg);
    }
  };

  return (
    <div className="panel-cajero-container">
      <Navbar />

      <div className="panel-cajero-content">
        <div className="panel-cajero-card">
          <h2 className="panel-cajero-titulo">Gestión de Turnos</h2>

          <div className="info-sesion" style={{ textAlign: 'center', marginBottom: '20px' }}>
            {/* 🏦 SI ES ADMIN: Puede cambiar de sede. SI ES CAJERO: Solo ve su sede */}
            {esAdmin ? (
              <div className="mb-4">
                <label className="block mb-1 text-sm text-gray-400">Supervisando Sede:</label>
                <select
                  value={sede}
                  onChange={(e) => setSede(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-gray-800 text-white border border-red-500"
                >
                  {Object.keys(CONFIGURACION_SEDES).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            ) : (
              <p style={{ color: '#ccc' }}>Sede: <strong>{sede || "No asignada"}</strong></p>
            )}
          </div>

          <form onSubmit={llamarTurno} className="space-y-4">
            {/* BODEGA */}
            <div className="mb-4">
              <label className="block mb-2">Bodega Destino:</label>
              {sede && CONFIGURACION_SEDES[sede]?.length > 1 ? (
                <select
                  value={bodega}
                  onChange={(e) => setBodega(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-md bg-gray-900 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Seleccione Bodega...</option>
                  {CONFIGURACION_SEDES[sede].map((num) => (
                    <option key={num} value={num.toString()}>Bodega {num}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={bodega ? `Bodega ${bodega}` : "Cargando..."}
                  disabled
                  className="w-full px-3 py-2 rounded-md bg-gray-800 text-gray-400 border border-gray-600"
                />
              )}
            </div>

            {/* CLIENTE */}
            <div className="mb-4">
              <label className="block mb-2">Nombre del Cliente:</label>
              <input
                type="text"
                value={nombre_cliente}
                onChange={(e) => setNombreCliente(e.target.value)}
                placeholder="Nombre completo"
                required
                className="w-full px-3 py-2 rounded-md bg-gray-900 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button type="submit" className="panel-cajero-boton w-full">
              {esAdmin ? "GENERAR TURNO (ADMIN)" : "ASIGNAR TURNO"}
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