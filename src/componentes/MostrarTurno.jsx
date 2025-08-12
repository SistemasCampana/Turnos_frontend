import React, { useEffect, useRef, useState } from "react";

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

  const estilos = {
    pantalla: {
      height: "100vh",
      width: "100%",
      background: "black",
      color: "white",
      overflow: "hidden",
      position: "relative",
      fontFamily: "sans-serif",
    },
    boton: {
      background: "red",
      color: "white",
      border: "none",
      padding: "1rem 2rem",
      fontSize: "1.5rem",
      cursor: "pointer",
      borderRadius: "8px",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
    overlay: (show) => ({
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: show ? "rgba(0, 0, 0, 0.7)" : "transparent",
      opacity: show ? 1 : 0,
      transition: "opacity 0.5s ease",
      zIndex: show ? 5 : -1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }),
    popup: {
      background: "white",
      color: "black",
      padding: "2rem 4rem",
      borderRadius: "12px",
      textAlign: "center",
      fontSize: "3rem",
      boxShadow: "0 0 20px rgba(255,0,0,0.6)",
      animation: "fadeIn 0.5s ease",
    },
    tablaContainer: {
      position: "relative",
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      padding: "1rem",
      gap: "1.5rem",
      boxSizing: "border-box",
    },
    tabla: {
      flex: 0.4,
      marginTop: "1rem",
    },
    tablaTitulo: {
      fontSize: "3rem",
      marginBottom: "1rem",
      color: "red",
      textAlign: "center",
    },
    tablaStyle: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "2rem",
    },
    thtd: {
      padding: "0.5rem 1rem",
      borderBottom: "1px solid white",
      textAlign: "center",
    },
    logo: {
      flex: 0.6,
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      paddingRight: "1rem",
      paddingBottom: "1rem",
      backgroundColor: "black",
      borderRadius: "10px",
    },
    logoImg: {
      maxWidth: "100%",
      maxHeight: "100%",
      objectFit: "contain",
      borderRadius: "10px",
    },
  };

  return (
    <div style={estilos.pantalla}>
      <audio ref={audioRef} src="/campana.wav" />

      {!audioHabilitado ? (
        <button style={estilos.boton} onClick={habilitarAudio}>
          Iniciar Pantalla
        </button>
      ) : (
        <>
          {/* Overlay con turno */}
          <div style={estilos.overlay(mostrarAnimacion)}>
            {mostrarAnimacion && turnoActual && (
              <div style={estilos.popup}>
                <div>
                  Turno <strong>{turnoActual.numero}</strong>
                </div>
                <div>
                  Módulo <strong>{turnoActual.modulo}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Tabla siempre visible */}
          <div style={estilos.tablaContainer}>
            <div style={estilos.tabla}>
              <h2 style={estilos.tablaTitulo}>TURNOS</h2>
              <table style={estilos.tablaStyle}>
                <thead>
                  <tr>
                    <th style={estilos.thtd}>Turno</th>
                    <th style={estilos.thtd}>Módulo</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.map((t, idx) => (
                    <tr key={idx}>
                      <td style={estilos.thtd}>{t.numero}</td>
                      <td style={estilos.thtd}>{t.modulo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={estilos.logo}>
              <img src="/logo.png" alt="Logo Empresa" style={estilos.logoImg} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MostrarTurno;
