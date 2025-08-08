import React, { useState } from 'react';

const PedirTurno = () => {
  const [turno, setTurno] = useState(null);

  const pedirTurno = async () => {
    const res = await fetch("https://turnos-backend.onrender.com/api/turnos/", {
      method: 'POST'
    });
    const data = await res.json();
    setTurno(data);
  };

  const estilos = {
    container: {
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "black",
      fontFamily: "sans-serif",
    },
    card: {
      background: "linear-gradient(145deg, #1e1e1e, #2c2c2c)",
      padding: "2rem",
      borderRadius: "1rem",
      boxShadow: "0 0 20px rgba(255, 0, 0, 0.5)",
      width: "400px",
      textAlign: "center",
      color: "white",
    },
    titulo: {
      fontSize: "2rem",
      color: "red",
      marginBottom: "1.5rem",
    },
    boton: {
      marginTop: "1rem",
      padding: "1rem",
      fontSize: "1.2rem",
      background: "red",
      color: "white",
      border: "none",
      borderRadius: "0.5rem",
      cursor: "pointer",
      transition: "background 0.3s ease",
    },
    turnoActual: {
      marginTop: "2rem",
      fontSize: "1.8rem",
    },
    mensaje: {
      marginTop: "2rem",
      fontSize: "1.2rem",
      color: "gray",
    }
  };

  return (
    <div style={estilos.container}>
      <div style={estilos.card}>
        <h2 style={estilos.titulo}>Pedir Turno</h2>

        <button
          style={estilos.boton}
          onMouseOver={(e) => e.target.style.background = "#b30000"}
          onMouseOut={(e) => e.target.style.background = "red"}
          onClick={pedirTurno}
        >
          Solicitar Turno
        </button>

        {turno ? (
          <p style={estilos.turnoActual}>
            Turno: <strong>{turno.numero}</strong><br />
            Por favor espere a ser llamado en pantalla...
          </p>
        ) : (
          <p style={estilos.mensaje}>Esperando a que solicite un turno...</p>
        )}
      </div>
    </div>
  );
};

export default PedirTurno;
