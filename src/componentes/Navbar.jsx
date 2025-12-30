import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const reiniciarTurnos = async () => {
    if (!window.confirm("⚠️ ¿Seguro que quieres reiniciar todos los turnos?")) return;

    try {
      // Nota: Tu URL de backend es 'https://turnos-backend-pcyf.onrender.com'
      const res = await fetch("https://turnos-backend-pcyf.onrender.com/api/turnos/reiniciar", {
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
      {/* <button className="navButton" onClick={() => navigate("/turno")}>
        Solicitar Turno
      </button> */}
      <button className="navButton" onClick={() => navigate("/pantalla")}>
        👁️
      </button>
      <button className="navButton" onClick={() => navigate("/panel")}>
        ⌨︎
      </button>

      {/* 📊 NUEVO BOTÓN PARA GENERAR EL INFORME */}
      <button className="navButton" onClick={() => navigate("/informe")}>
        📊
      </button>
      
      <button className="btnReiniciar" onClick={reiniciarTurnos}>
        🔄
      </button>
    </nav>
  );
};

export default Navbar;
