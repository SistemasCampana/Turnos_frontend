import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import "./PedirTurno.css";

const PedirTurno = () => {
  const [nombre, setNombre] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre) return alert("Por favor ingresa tu nombre");

    try {
      await axios.post("https://turnos-backend-b0jc.onrender.com/clientes", { nombre });
      alert("Cliente registrado con éxito ✅");
      setNombre("");
    } catch (error) {
      console.error(error);
      alert("Error al registrar cliente");
    }
  };

  return (
    <div className="pedir-turno-container">
      <Navbar />
      <form onSubmit={handleSubmit} className="pedir-turno-form">
        <h2>Solicitar turno</h2>
        <input
          type="text"
          placeholder="Tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="pedir-turno-input"
        />
        <button type="submit" className="pedir-turno-boton">
          Registrar
        </button>
      </form>
    </div>
  );
};

export default PedirTurno;
