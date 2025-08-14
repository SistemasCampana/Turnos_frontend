import React, { useState } from 'react';
import Navbar from './Navbar';
import './PedirTurno.css';

const PedirTurno = () => {
  const [turno, setTurno] = useState(null);

  const pedirTurno = async () => {
    const res = await fetch("https://turnos-backend-b0jc.onrender.com/api/turnos/", {
      method: 'POST'
    });
    const data = await res.json();
    setTurno(data);
  };

  return (
    <div className="pedir-container">
      <Navbar />
      <div className="pedir-card">
        <h2 className="pedir-titulo">Pedir Turno</h2>

        <button
          className="pedir-boton"
          onClick={pedirTurno}
        >
          Solicitar Turno
        </button>

        {turno ? (
          <p className="pedir-turno-actual">
            Turno: <strong>{turno.numero}</strong><br />
            Por favor espere a ser llamado en pantalla...
          </p>
        ) : (
          <p className="pedir-mensaje">Esperando a que solicite un turno...</p>
        )}
      </div>
    </div>
  );
};

export default PedirTurno;
