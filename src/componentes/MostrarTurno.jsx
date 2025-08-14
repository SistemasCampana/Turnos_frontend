import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar"; // Importamos el navbar
import "./MostrarTurno.css";  // Importamos los estilos externos

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
      const data = await res.json();

      if (data.id && data.id !== ultimoIdRef.current) {
        ultimoIdRef.current = data.id;
        if (audioRef.current) audioRef.current.play();
        setTurnoActual(data);
        setHistorial((prev) => [data, ...prev].slice(0, 5));
        setMostrarAnimacion(true);

        setTimeout(() => setMostrarAnimacion(false), 4000);
      }
    } catch (error) {
      console.error("Error obteniendo turno:", error);
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
          <div className={`overlay ${mostrarAnimacion ? "activo" : ""}`}>
            {mostrarAnimacion && turnoActual && (
              <div className="popup">
                <div>
                  Turno <strong>{turnoActual.numero}</strong>
                </div>
                <div>
                  Módulo <strong>{turnoActual.modulo}</strong>
                </div>
              </div>
            )}
          </div>

          <div className="tabla-container">
            <div className="tabla">
              <h2 className="tabla-titulo">TURNOS</h2>
              <table className="tabla-style">
                <thead>
                  <tr>
                    <th>Turno</th>
                    <th>Módulo</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.map((t, idx) => (
                    <tr key={idx}>
                      <td>{t.numero}</td>
                      <td>{t.modulo}</td>
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
