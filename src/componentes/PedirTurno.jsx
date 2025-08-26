import React, { useState } from 'react';
import Navbar from './Navbar';
import './PedirTurno.css';

const PedirTurno = () => {
  const [turno, setTurno] = useState(null);
  const [nombreCliente, setNombreCliente] = useState('');
  const [bodega, setBodega] = useState('');

  const pedirTurno = async () => {
    if (!nombreCliente || !bodega) {
      alert("Por favor ingrese el nombre del cliente y la bodega");
      return;
    }

    const res = await fetch("https://turnos-backend-b0jc.onrender.com/api/turnos/", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nombre_cliente: nombreCliente,
        bodega: bodega
      })
    });

    const data = await res.json();
    setTurno(data);

    // limpiar inputs después de pedir turno
    setNombreCliente('');
    setBodega('');
  };

  return (
    <div className="pedir-container">
      <Navbar />
      <div className="pedir-card">
        <h2 className="pedir-titulo">Pedir Turno</h2>

        <input
          type="text"
          placeholder="Nombre del Cliente"
          value={nombreCliente}
          onChange={(e) => setNombreCliente(e.target.value)}
          className="pedir-input"
        />

        <input
          type="text"
          placeholder="Bodega"
          value={bodega}
          onChange={(e) => setBodega(e.target.value)}
          className="pedir-input"
        />

        <button
          className="pedir-boton"
          onClick={pedirTurno}
        >
          Solicitar Turno
        </button>

        {turno ? (
          <p className="pedir-turno-actual">
            Turno: <strong>{turno.numero}</strong><br />
            Cliente: <strong>{turno.nombre_cliente}</strong><br />
            Bodega: <strong>{turno.bodega}</strong><br />
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
