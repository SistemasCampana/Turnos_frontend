import React, { useState } from 'react';

const PanelCajero = () => {
  const [turno, setTurno] = useState(null);
  const [modulo, setModulo] = useState(1);

  const llamarSiguiente = async () => {
    const res = await fetch("https://turnos-backend.onrender.com/api/turnos/siguiente", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ modulo })
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
    input: {
      width: "80px",
      padding: "0.5rem",
      fontSize: "1.2rem",
      textAlign: "center",
      borderRadius: "0.5rem",
      border: "none",
      outline: "none",
      marginLeft: "0.5rem",
    },
    boton: {
      marginTop: "1.5rem",
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
        <h2 style={estilos.titulo}>Panel del Cajero</h2>

        <div>
          <label>
            Módulo:
            <input
              style={estilos.input}
              type="number"
              min="1"
              max="10"
              value={modulo}
              onChange={(e) => setModulo(Number(e.target.value))}
            />
          </label>
        </div>

        <button
          style={estilos.boton}
          onMouseOver={(e) => e.target.style.background = "#b30000"}
          onMouseOut={(e) => e.target.style.background = "red"}
          onClick={llamarSiguiente}
        >
          Llamar Siguiente Turno
        </button>

        {turno && turno.numero ? (
          <p style={estilos.turnoActual}>
            Llamando al Turno: <strong>{turno.numero}</strong> (Módulo {turno.modulo})
          </p>
        ) : turno?.mensaje ? (
          <p style={estilos.mensaje}>No hay turnos disponibles.</p>
        ) : (
          <p style={estilos.mensaje}>Esperando turno...</p>
        )}
      </div>
    </div>
  );
};

export default PanelCajero;
