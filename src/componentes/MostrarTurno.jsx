import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import "./MostrarTurno.css";

const MostrarTurno = () => {
  const [turnoActual, setTurnoActual] = useState(null);
  const [historial, setHistorial] = useState([]);
  const audioRef = useRef(null);
  const ultimoIdRef = useRef(null);
  const [mostrarAnimacion, setMostrarAnimacion] = useState(false);
  const [audioHabilitado, setAudioHabilitado] = useState(false);

  const habilitarAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
    setAudioHabilitado(true);
  };

  const fetchTurno = async () => {
    if (!audioHabilitado) return;

    try {
      const res = await fetch("https://turnos-backend-b0jc.onrender.com/api/turnos/ultimo");

      if (!res.ok) {
        const txt = await res.text();
        console.error("❌ /ultimo falló:", res.status, txt);
        return;
      }

      const data = await res.json();

      if (data && data.id && data.id !== ultimoIdRef.current) {
        ultimoIdRef.current = data.id;
        if (audioRef.current) audioRef.current.play();
        setTurnoActual(data);
        setHistorial((prev) => [data, ...prev].slice(0, 5));
        setMostrarAnimacion(true);

        setTimeout(() => setMostrarAnimacion(false), 4000);
      }

    } catch (error) {
      console.error("⚠️ Error obteniendo turno:", error);
    }
  };

  useEffect(() => {
    if (audioHabilitado) {
      fetchTurno();
      const intervalo = setInterval(fetchTurno, 3000);
      return () => clearInterval(intervalo);
    }
  }, [audioHabilitado]);

  return (
    <div className="pantalla">
      <Navbar />

      <audio ref={audioRef} src="/campana.wav" />

      {!audioHabilitado ? (
        <button className="boton-iniciar" onClick={habilitarAudio}>
          Iniciar Pantalla
        </button>
      ) : (
        <>
          {/* POPUP ANIMADO */}
          <div className={`overlay ${mostrarAnimacion ? "activo" : ""}`}>
            {mostrarAnimacion && turnoActual && (
              <div className="popup">
                <div>
                  Cliente: <strong>{turnoActual.nombre_cliente}</strong>
                </div>
                <div>
                  Bodega: <strong>{turnoActual.bodega}</strong>
                </div>
              </div>
            )}
          </div>

          {/* TABLA DE HISTORIAL */}
          <div className="tabla-container">
            <div className="tabla">
              <h2 className="tabla-titulo">TURNOS</h2>
              <table className="tabla-style">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Bodega</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.map((t, idx) => (
                    <tr key={idx}>
                      <td>{t.nombre_cliente}</td>
                      <td>{t.bodega}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="logo">
              <img src="/logo.png" alt="Logo Empresa" className="logo-img" />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MostrarTurno;