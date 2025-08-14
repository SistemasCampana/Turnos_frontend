import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const estilos = {
    nav: {
      background: "#1a1a1a",
      padding: "1rem",
      display: "flex",
      justifyContent: "center",
      gap: "1rem",
      borderBottom: "2px solid red",
    },
    navButton: {
      padding: "0.5rem 1rem",
      background: "red",
      color: "white",
      border: "none",
      borderRadius: "0.5rem",
      cursor: "pointer",
    },
  };

  return (
    <nav style={estilos.nav}>
      <button
        style={estilos.navButton}
        onClick={() => navigate("/turno")}
      >
        Solicitar Turno
      </button>
      <button
        style={estilos.navButton}
        onClick={() => navigate("/pantalla")}
      >
        Ver Pantalla
      </button>
      <button
        style={estilos.navButton}
        onClick={() => navigate("/panel")}
      >
        Panel Cajero
      </button>
    </nav>
  );
};

export default Navbar;
