import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 🔹 ESTO ES LO QUE FALTA
import "./Login.css";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // 🔹 Inicializamos el navegador

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://turnos-backend-pcyf.onrender.com/api/login",
        { username, password }
      );

      // 🔹 GUARDAR TODO EN LOCALSTORAGE
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("rol", res.data.rol.toLowerCase());
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("sede", res.data.sede);

      // 🔹 NOTIFICAR AL APP.JS
      if (typeof onLogin === "function") {
        onLogin();
      }

      // 🔹 REDIRECCIÓN AUTOMÁTICA SEGÚN EL ROL
      const rol = res.data.rol.toLowerCase();
      console.log("Redirigiendo usuario con rol:", rol);

      if (rol === "visor") {
        navigate("/pantalla");
      } else {
        // Administradores y Cajeros van al panel
        navigate("/panel");
      }

    } catch (error) {
      console.error("📡 Error en Login:", error.response?.data || error.message);
      alert("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form animate">
        <h2>Iniciar Sesión</h2>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Usuario"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
        />
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}