import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Obtenemos el rol guardado en el login
  const rol = localStorage.getItem("rol")?.toLowerCase();

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
          {/* ✅ VISIBLE PARA TODOS */}
          <button
            className={`navButton ${location.pathname === "/pantalla" ? "active" : ""}`}
            onClick={() => navigate("/pantalla")}
          >
            Inicio 👁️
          </button>

          {/* ✅ VISIBLE PARA CAJERO Y ADMINISTRADOR */}
          {(rol === "cajero" || rol === "administrador") && (
            <button
              className={`navButton ${location.pathname === "/panel" ? "active" : ""}`}
              onClick={() => navigate("/panel")}
            >
              Panel ⌨︎
            </button>
          )}

          {/* ❌ SOLO PARA ADMINISTRADOR */}
          {rol === "administrador" && (
            <>
              <button
                className={`navButton ${location.pathname === "/informe" ? "active" : ""}`}
                onClick={() => navigate("/informe")}
              >
                Informes 📊
              </button>
              <button className="btnReiniciar" onClick={reiniciarTurnos}>
                Reiniciar turnos 🔄
              </button>
            </>
          )}
        </div>

        <div className="navbar-extra">
          {/* ❌ SOLO PARA ADMINISTRADOR */}
          {rol === "administrador" && (
            <button className="btnRegistroSmall" onClick={() => navigate("/registro")}>
              Registro de usuarios
            </button>
          )}

          {/* BOTÓN DE SALIR (Siempre visible para poder desloguearse) */}
          <button className="btnReiniciar" style={{ backgroundColor: '#d9534f', marginLeft: '10px' }} onClick={cerrarSesion}>
            Salir 🚪
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;