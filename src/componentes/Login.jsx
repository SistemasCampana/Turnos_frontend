import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
         "https://turnos-backend-pcyf.onrender.com/api/login",
        // "http://127.0.0.1:5000/api/login",
        { username, password }
      );

      // 🔹 1. GUARDAR DATOS EN LOCALSTORAGE
      localStorage.setItem("token", res.data.access_token);

      // Convertimos a minúsculas para que coincida con RutaProtegida en App.jsx
      const rolRecibido = res.data.rol.toLowerCase();
      localStorage.setItem("rol", rolRecibido);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("sede", res.data.sede);

      // 🔹 2. NOTIFICAR LOGIN EXITOSO
      if (typeof onLogin === "function") {
        onLogin();
      }

      // 🔹 3. REDIRECCIÓN SEGÚN ROL
      // Visor va a la pantalla de turnos
      if (rolRecibido === "visor") {
        navigate("/pantalla");
      }
      // Administrador va a la pantalla principal (donde puede elegir sedes o ver todo)
      else if (rolRecibido === "administrador") {
        navigate("/pantalla");
      }
      // Cajero va directo al panel de operación
      else {
        navigate("/panel");
      }

    } catch (error) {
      console.error("📡 Error:", error.response?.data || error.message);
      // Si el backend modificado arroja un 401 o 403, el mensaje será claro
      alert(error.response?.data?.msg || "Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form animate">
        <h2>Gestor de Turnos</h2>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Usuario"
          required
          autoComplete="username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
          autoComplete="current-password"
        />
        <button type="submit">Ingresar al Sistema</button>
      </form>
    </div>
  );
}