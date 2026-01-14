import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 🔹 Importante para las rutas
import "./Login.css";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // 🔹 Hook para redireccionar

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://turnos-backend-pcyf.onrender.com/api/login",
        { username, password }
      );

      // 🔹 1. GUARDAR DATOS EN LOCALSTORAGE
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("rol", res.data.rol);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("sede", res.data.sede);

      // 🔹 2. NOTIFICAR LOGIN EXITOSO
      if (typeof onLogin === "function") {
        onLogin();
      }

      // 🔹 3. REDIRECCIÓN SEGÚN ROL (SIN ENREDOS)
      const rol = res.data.rol.toLowerCase();

      if (rol === "visor") {
        // El visor ingresa de una vez a mostrar turnos
        navigate("/pantalla");
      } else if (rol === "administrador" || rol === "cajero") {
        // Administrador (acceso total) y Cajero (solo su panel) van al Panel
        navigate("/panel");
      }

    } catch (error) {
      if (error.response) {
        console.error("📡 Error:", error.response.data);
      }
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