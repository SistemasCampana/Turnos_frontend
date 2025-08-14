import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const reiniciarTurnos = async () => {
    if (!window.confirm("⚠️ ¿Seguro que quieres reiniciar todos los turnos?")) return;

    try {
      const res = await fetch("https://turnos-backend-b0jc.onrender.com/api/turnos/reiniciar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        const txt = await res.text();
        alert("Error al reiniciar turnos: " + txt);
        return;
      }

      alert("✅ Turnos reiniciados correctamente");
    } catch (err) {
      console.error("Error reiniciando turnos:", err);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <nav className="navbar">
      <button className="navButton" onClick={() => navigate("/turno")}>
        Solicitar Turno
      </button>
      <button className="navButton" onClick={() => navigate("/pantalla")}>
        Ver Pantalla
      </button>
      <button className="navButton" onClick={() => navigate("/panel")}>
        Panel Cajero
      </button>
      <button className="btnReiniciar" onClick={reiniciarTurnos}>
        🔄 Reiniciar Turnos
      </button>
    </nav>
  );
};

export default Navbar;
