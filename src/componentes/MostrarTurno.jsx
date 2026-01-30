import React, { useEffect, useRef, useState, useCallback } from "react";
import Navbar from "./Navbar";
import "./MostrarTurno.css";

const CONFIGURACION_SEDES = {
  "Ricaurte 1": [1],
  "Ricaurte 2": [1],
  "7 de Agosto": [1],
  "Paloquemao": [1, 2, 3]
};

const MostrarTurno = () => {
  const [audioHabilitado, setAudioHabilitado] = useState(false);
  const [sedeActiva, setSedeActiva] = useState(null);

  // Estado inicial: Intentamos cargar lo que hay en memoria del navegador
  const [turnosPorBodega, setTurnosPorBodega] = useState({});
  const [turnoActual, setTurnoActual] = useState(null);
  const [mostrarAnimacion, setMostrarAnimacion] = useState(false);
  const [pantallaCompleta, setPantallaCompleta] = useState(false);

  const audioRef = useRef(null);
  const ultimoIdRef = useRef(null);
  const contenedorRef = useRef(null);

  // 1. Efecto para cargar datos guardados cuando seleccionas una sede
  useEffect(() => {
    if (sedeActiva) {
      const datosGuardados = localStorage.getItem(`turnos_${sedeActiva}`);
      if (datosGuardados) {
        setTurnosPorBodega(JSON.parse(datosGuardados));
      } else {
        setTurnosPorBodega({}); // Si es nueva, empezamos limpio
      }
    }
  }, [sedeActiva]);

  const fetchTurno = useCallback(async () => {
    if (!audioHabilitado || !sedeActiva) return;
    try {
      const res = await fetch(`https://turnos-backend-pcyf.onrender.com/api/turnos/ultimo?sede=${encodeURIComponent(sedeActiva)}`);
      //`http://127.0.0.1:5000/api/turnos/ultimo?sede
      if (res.ok) {
        const data = await res.json();

        if (data && data.id && data.id !== ultimoIdRef.current) {
          ultimoIdRef.current = data.id;
          if (audioRef.current) audioRef.current.play().catch(e => console.log(e));

          setTurnoActual(data);
          setMostrarAnimacion(true);

          // ACTUALIZACIÓN CON PERSISTENCIA:
          setTurnosPorBodega(prev => {
            const nuevoEstado = {
              ...prev,
              [data.bodega]: { nombre_cliente: data.nombre_cliente, numero: data.numero }
            };
            // Guardamos en LocalStorage para que no se borre al navegar
            localStorage.setItem(`turnos_${sedeActiva}`, JSON.stringify(nuevoEstado));
            return nuevoEstado;
          });

          setTimeout(() => setMostrarAnimacion(false), 5000);
        }
      }
    } catch (e) { console.error("Error:", e); }
  }, [audioHabilitado, sedeActiva]);

  useEffect(() => {
    let int;
    if (audioHabilitado && sedeActiva) {
      fetchTurno();
      int = setInterval(fetchTurno, 3000);
    }
    return () => clearInterval(int);
  }, [audioHabilitado, sedeActiva, fetchTurno]);

  // Pantalla de Inicio
  if (!audioHabilitado) {
    return (
      <div className="pantalla">
        <audio ref={audioRef} src="/campana.wav" preload="auto" />
        <div className="contenedor-inicio">
          <button className="boton-iniciar" onClick={() => { audioRef.current.load(); setAudioHabilitado(true); }}>
            INICIAR SISTEMA DE TURNOS
          </button>
        </div>
      </div>
    );
  }

  // Selección de Sedes con margen mejorado
  if (!sedeActiva) {
    return (
      <div className="pantalla">
        <Navbar />
        <div className="contenedor-principal-unificado">
          <div className="contenido-centrado-sedes">
            <h1 className="titulo-sedes">SELECCIONE SU SEDE</h1>
            <div className="grid-sedes">
              {Object.keys(CONFIGURACION_SEDES).map(s => (
                <button key={s} className="tarjeta-sede" onClick={() => setSedeActiva(s)}>{s}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Visor Final
  return (
    <div ref={contenedorRef} className="pantalla">
      <div className="vista-turnos">
        <div className="controles-superiores">
          <button className="boton-volver" onClick={() => setSedeActiva(null)}>← Volver</button>
          <h2 className="nombre-sede">{sedeActiva}</h2>
          <button className="boton-pantalla" onClick={() => {
            if (!document.fullscreenElement) contenedorRef.current.requestFullscreen();
            else document.exitFullscreen();
          }}>⛶</button>
        </div>

        <div className={`overlay ${mostrarAnimacion ? "activo" : ""}`}>
          {mostrarAnimacion && turnoActual && (
            <div className="popup animate-pop">
              <div className="popup-titulo">¡TURNO LLAMADO!</div>
              <div className="popup-numero">{turnoActual.numero}</div>
              <div className="popup-nombre">{turnoActual.nombre_cliente}</div>
              <div className="popup-bodega">BODEGA {turnoActual.bodega}</div>
            </div>
          )}
        </div>

        <div className="tabla-container">
          <div className="tabla">
            <table className="tabla-style">
              <thead><tr><th>BODEGA</th><th>CLIENTE</th></tr></thead>
              <tbody>
                {CONFIGURACION_SEDES[sedeActiva].map(num => (
                  <tr key={num} className={turnoActual?.bodega.toString() === num.toString() && mostrarAnimacion ? "fila-flash" : ""}>
                    <td className="celda-bodega">BODEGA {num}</td>
                    <td className="celda-cliente">
                      {turnosPorBodega[num]?.nombre_cliente || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="logo-visor">
            <img src="/logo.png" className="logo-img" alt="Banner" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MostrarTurno;