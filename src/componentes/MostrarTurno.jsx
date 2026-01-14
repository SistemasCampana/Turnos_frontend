import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./MostrarTurno.css";

const CONFIGURACION_SEDES = {
  "Ricaurte 1": [1],
  "Ricaurte 2": [1],
  "7 de Agosto": [1],
  "Paloquemao": [1, 2, 3]
};

const MostrarTurno = () => {
  const navigate = useNavigate();
  // 🔹 MEJORA: Si el usuario ya tiene una sede asignada (Cajero/Admin), la usamos por defecto
  const [sedeActiva, setSedeActiva] = useState(localStorage.getItem("sede") || null);
  const [turnosPorBodega, setTurnosPorBodega] = useState({});
  const [turnoActual, setTurnoActual] = useState(null);
  const [mostrarAnimacion, setMostrarAnimacion] = useState(false);
  const [audioHabilitado, setAudioHabilitado] = useState(false);
  const [pantallaCompleta, setPantallaCompleta] = useState(false);

  const audioRef = useRef(null);
  const ultimoIdRef = useRef(null);
  const contenedorRef = useRef(null);

  // 1. Cargar datos de la sede seleccionada
  useEffect(() => {
    if (sedeActiva) {
      const llaveSede = `turnos_${sedeActiva.replace(/\s+/g, '_')}`;
      const guardado = localStorage.getItem(llaveSede);

      if (guardado) {
        setTurnosPorBodega(JSON.parse(guardado));
      } else {
        const inicial = {};
        if (CONFIGURACION_SEDES[sedeActiva]) {
          CONFIGURACION_SEDES[sedeActiva].forEach(num => {
            inicial[num] = { nombre_cliente: "—" };
          });
          setTurnosPorBodega(inicial);
        }
      }
      ultimoIdRef.current = null;
    }
  }, [sedeActiva]);

  // 2. Consulta de turnos
  const fetchTurno = useCallback(async () => {
    if (!audioHabilitado || !sedeActiva) return;

    try {
      const sedeUrl = encodeURIComponent(sedeActiva);
      const res = await fetch(`https://turnos-backend-pcyf.onrender.com/api/turnos/ultimo?sede=${sedeUrl}&t=${Date.now()}`);

      if (!res.ok) return;
      const data = await res.json();

      if (data && data.id && data.id !== ultimoIdRef.current) {
        if (data.sede === sedeActiva) {
          ultimoIdRef.current = data.id;

          if (audioRef.current) {
            audioRef.current.play().catch(e => console.log("Audio play blocked:", e));
          }

          setTurnoActual(data);
          const idBodega = parseInt(data.bodega);

          setTurnosPorBodega((prev) => {
            const nuevoEstado = {
              ...prev,
              [idBodega]: { nombre_cliente: data.nombre_cliente }
            };
            const llaveSede = `turnos_${sedeActiva.replace(/\s+/g, '_')}`;
            localStorage.setItem(llaveSede, JSON.stringify(nuevoEstado));
            return nuevoEstado;
          });

          setMostrarAnimacion(true);
          setTimeout(() => setMostrarAnimacion(false), 4000);
        }
      }
    } catch (error) {
      console.error("⚠️ Error en fetchTurno:", error);
    }
  }, [audioHabilitado, sedeActiva]);

  // 3. Intervalo de actualización
  useEffect(() => {
    let intervalo;
    if (audioHabilitado && sedeActiva) {
      fetchTurno();
      intervalo = setInterval(fetchTurno, 3000);
    }
    return () => { if (intervalo) clearInterval(intervalo); };
  }, [audioHabilitado, sedeActiva, fetchTurno]);

  const habilitarAudio = () => {
    if (audioRef.current) audioRef.current.load();
    setAudioHabilitado(true);
  };

  const togglePantallaCompleta = () => {
    if (!document.fullscreenElement) {
      contenedorRef.current.requestFullscreen();
      setPantallaCompleta(true);
    } else {
      document.exitFullscreen();
      setPantallaCompleta(false);
    }
  };

  return (
    <div ref={contenedorRef} className="pantalla">
      {!pantallaCompleta && <Navbar />}
      <audio ref={audioRef} src="/campana.wav" preload="auto" />

      {!audioHabilitado ? (
        <div className="contenedor-inicio">
          <button className="boton-iniciar" onClick={habilitarAudio}>
            INICIAR SISTEMA DE TURNOS
          </button>
        </div>
      ) : (
        <>
          {!sedeActiva ? (
            <div className="contenedor-principal-unificado">
              <main className="contenido-centrado">
                <h1 className="titulo-sedes">SELECCIONE SU SEDE</h1>
                <div className="grid-sedes">
                  {Object.keys(CONFIGURACION_SEDES).map((s) => (
                    <button
                      key={s}
                      className="tarjeta-sede"
                      onClick={() => setSedeActiva(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </main>
            </div>
          ) : (
            <div className="vista-turnos">
              <div className="controles-superiores">
                {/* 🔹 Solo mostramos el botón volver si NO es un usuario con sede fija */}
                {!localStorage.getItem("sede") && (
                  <button className="boton-volver" onClick={() => setSedeActiva(null)}>← Volver</button>
                )}
                <h2 className="nombre-sede">{sedeActiva}</h2>
                <button className="boton-pantalla" onClick={togglePantallaCompleta}>⛶</button>
              </div>

              <div className={`overlay ${mostrarAnimacion ? "activo" : ""}`}>
                {mostrarAnimacion && turnoActual && (
                  <div className="popup">
                    <div className="popup-titulo">¡NUEVO TURNO!</div>
                    <div className="popup-nombre">{turnoActual.nombre_cliente}</div>
                    <div className="popup-bodega">BODEGA {turnoActual.bodega}</div>
                  </div>
                )}
              </div>

              <div className="tabla-container">
                <div className="tabla">
                  <table className="tabla-style">
                    <thead>
                      <tr><th>BODEGA</th><th>CLIENTE</th></tr>
                    </thead>
                    <tbody>
                      {CONFIGURACION_SEDES[sedeActiva]?.map((num) => (
                        <tr key={num} className={turnoActual?.bodega === num && mostrarAnimacion ? "fila-flash" : ""}>
                          <td className="celda-bodega">BODEGA {num}</td>
                          <td className="celda-cliente">
                            {turnosPorBodega[num] ? turnosPorBodega[num].nombre_cliente : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="logo">
                  <img src="/logo.png" alt="Logo" className="logo-img" />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MostrarTurno;