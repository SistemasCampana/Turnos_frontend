import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 🔹 Importante para la protección
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

  // 🛡️ 1. PROTECCIÓN DE RUTA Y CARGA DE SEDE
  useEffect(() => {
    const rol = localStorage.getItem("rol")?.toLowerCase();
    const sedeUsuario = localStorage.getItem("sede");

    // Bloqueo si no es el rol correcto
    if (rol !== "cajero" && rol !== "administrador") {
      alert("No tienes permiso para acceder al Panel de Cajero");
      navigate("/");
      return;
    }

    // Carga la sede asignada al usuario automáticamente
    if (sedeUsuario) {
      setSede(sedeUsuario);
    }
  }, [navigate]);

  // ⚙️ 2. LÓGICA DE BODEGAS DINÁMICAS
  useEffect(() => {
    if (sede && CONFIGURACION_SEDES[sede]) {
      const bodegas = CONFIGURACION_SEDES[sede];
      // Si la sede solo tiene una bodega, la selecciona automáticamente
      setBodega(bodegas.length === 1 ? bodegas[0].toString() : "");
    } else {
      setBodega("");
    }
  }, [sede]);

  const llamarTurno = async (e) => {
    e.preventDefault();

    if (!sede || !bodega || !nombre_cliente) {
      setMensaje("❌ Por favor complete todos los campos (Sede, Bodega y Nombre)");
      return;
    }

    try {
      const res = await axios.post("https://turnos-backend-pcyf.onrender.com/api/turnos/", {
        nombre_cliente: nombre_cliente,
        bodega: bodega,
        sede: sede,
      });

      setMensaje(`✅ Turno ${res.data.numero} creado para ${res.data.nombre_cliente} en ${sede} - Bodega ${bodega}`);
      setNombreCliente(""); // Limpia solo el nombre para el siguiente turno

    } catch (error) {
      console.error("Error al asignar turno:", error);
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
          <p style={{ textAlign: 'center', color: '#ccc', marginBottom: '20px' }}>
            Sede: <strong>{sede || "No asignada"}</strong>
          </p>

          <form onSubmit={llamarTurno} className="space-y-4">

            {/* SELECCIÓN DE BODEGA (DINÁMICA SEGÚN LA SEDE DEL USUARIO) */}
            <div className="mb-4">
              <label className="block mb-2">Bodega:</label>
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
                  value={bodega ? `Bodega ${bodega}` : "Cargando bodega..."}
                  disabled
                  className="w-full px-3 py-2 rounded-md bg-gray-800 text-gray-400 border border-gray-600"
                />
              )}
            </div>

            {/* NOMBRE DEL CLIENTE */}
            <div className="mb-4">
              <label className="block mb-2">Nombre del Cliente:</label>
              <input
                type="text"
                value={nombre_cliente}
                onChange={(e) => setNombreCliente(e.target.value)}
                placeholder="Ej: Juan Pérez"
                required
                className="w-full px-3 py-2 rounded-md bg-gray-900 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
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