import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import "./PanelCajero.css";

// 1. IMPORTANTE: Esta configuración debe ser idéntica a la de MostrarTurno.jsx
const CONFIGURACION_SEDES = {
  "Ricaurte 1": [1],
  "Ricaurte 2": [1],
  "7 de Agosto": [1],
  "Paloquemao": [1, 2, 3]
};

export default function PanelCajero() {
  const [nombre_cliente, setNombreCliente] = useState("");
  const [sede, setSede] = useState("");
  const [bodega, setBodega] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (sede && CONFIGURACION_SEDES[sede]) {
      const bodegas = CONFIGURACION_SEDES[sede];
      setBodega(bodegas.length === 1 ? bodegas[0].toString() : "");
    } else {
      setBodega("");
    }
    // La dependencia es constante: siempre es un arreglo de 1 elemento [sede]
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
      // const res = await fetch(`http://127.0.0.1:3306/api/turnos/ultimo?sede=${sedeUrl}&t=${Date.now()}`);
      // Mensaje de éxito con los datos que devolvió el servidor
      setMensaje(`✅ Turno ${res.data.numero} creado para ${res.data.nombre_cliente} en ${sede} - Bodega ${bodega}`);

      // Limpiar solo el nombre para agilizar la siguiente asignación
      setNombreCliente("");

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

          <form onSubmit={llamarTurno} className="space-y-4">

            {/* 1. SELECCIÓN DE SEDE */}
            <div className="mb-4">
              <label className="block mb-2">Sede:</label>
              <select
                value={sede}
                onChange={(e) => setSede(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-md bg-gray-900 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
              >
                <option value="">Seleccione Sede...</option>
                {Object.keys(CONFIGURACION_SEDES).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* 2. SELECCIÓN DE BODEGA (DINÁMICA) */}
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
                  value={bodega ? `Bodega ${bodega}` : "Seleccione Sede primero"}
                  disabled
                  className="w-full px-3 py-2 rounded-md bg-gray-800 text-gray-400 border border-gray-600"
                />
              )}
            </div>

            {/* 3. NOMBRE DEL CLIENTE */}
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





// // src/componentes/PanelCajero.jsx
// import React, { useState } from "react";
// import Navbar from "./Navbar";
// import axios from "axios";
// import "./PanelCajero.css";

// export default function PanelCajero() {
//   const [nombre_cliente, setNombreCliente] = useState("");
//   const [bodega, setBodega] = useState("");
//   const [mensaje, setMensaje] = useState("");

//   const llamarTurno = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await axios.post("https://turnos-backend-pcyf.onrender.com/api/turnos/", {
//         nombre_cliente: nombre_cliente,
//         bodega: bodega,
//       });

//       setMensaje(`Turno ${res.data.numero} llamado para ${res.data.nombre_cliente} en ${res.data.bodega}`);
//       setNombreCliente("");
//       setBodega("");
//     } catch (error) {
//       console.error("Error al llamar turno:", error);

//       if (error.response && error.response.data && error.response.data.error) {
//         setMensaje("Error: " + error.response.data.error);
//       } else {
//         setMensaje("Error al registrar turno");
//       }
//     }
//   };

//   return (
//     <div className="panel-cajero-container">
//       <Navbar />

//       <div className="panel-cajero-content">
//         <div className="panel-cajero-card">
//           <h2 className="panel-cajero-titulo">Panel del Cajero</h2>

//           <form onSubmit={llamarTurno} className="space-y-4">
            
//             <div className="mb-4">
//               <label className="block mb-2">Nombre del Cliente:</label>
//               <input
//                 type="text"
//                 value={nombre_cliente}
//                 onChange={(e) => setNombreCliente(e.target.value)}
//                 required
//                 className="w-full px-3 py-2 rounded-md bg-gray-900 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block mb-2">Bodega:</label>
//               <input
//                 type="text"
//                 value={bodega}
//                 onChange={(e) => setBodega(e.target.value)}
//                 required
//                 className="w-full px-3 py-2 rounded-md bg-gray-900 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
//               />
//             </div>

//             <button type="submit" className="panel-cajero-boton w-full">
//               Asignar Turno
//             </button>
//           </form>

//           {mensaje && (
//             <div className="panel-cajero-mensaje">{mensaje}</div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
