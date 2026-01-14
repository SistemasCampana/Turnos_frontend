import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 OBTENER ROL Y USERNAME
  const rol = localStorage.getItem("rol");
  const username = localStorage.getItem("username");

  const reiniciarTurnos = async () => {
    if (!window.confirm("⚠️ ¿Seguro que quieres reiniciar todos los turnos?")) return;
    try {
      const res = await fetch("https://turnos-backend-pcyf.onrender.com/api/turnos/reiniciar", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) alert("✅ Turnos reiniciados correctamente");
    } catch (err) {
      alert("Error de conexión");
    }
  };

  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar-wrapper">
      <div className="navbar-recuadro">
        <div className="navbar-links">

          {/* 👁️ SIEMPRE VISIBLE: Ver Pantalla */}
          <button
            className={`navButton ${location.pathname === "/pantalla" ? "active" : ""}`}
            onClick={() => navigate("/pantalla")}
          >
            Ver Pantalla 👁️
          </button>

          {/* ⌨︎ SOLO CAJEROS Y ADMIN: Panel de atención */}
          {(rol === "cajero" || rol === "administrador" || rol === "emergencia") && (
            <button
              className={`navButton ${location.pathname === "/panel" ? "active" : ""}`}
              onClick={() => navigate("/panel")}
            >
              Panel ⌨︎
            </button>
          )}

          {/* 📊 SOLO ADMIN: Informes y Reiniciar */}
          {rol === "administrador" && (
            <>
              <button
                className={`navButton ${location.pathname === "/informe" ? "active" : ""}`}
                onClick={() => navigate("/informe")}
              >
                Informes 📊
              </button>
              <button className="btnReiniciar" onClick={reiniciarTurnos}>
                Reiniciar 🔄
              </button>
            </>
          )}
        </div>

        <div className="navbar-extra">
          {/* 👤 SOLO ADMIN: Registro de Usuarios */}
          {rol === "administrador" && (
            <button className="btnRegistroSmall" onClick={() => navigate("/registro")}>
              Usuarios 👤
            </button>
          )}

          {/* 🚪 CERRAR SESIÓN: Visible para todos */}
          <div className="user-info">
            <span className="user-name">{username}</span>
            <button className="btnLogout" onClick={cerrarSesion}>Salir 🚪</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;