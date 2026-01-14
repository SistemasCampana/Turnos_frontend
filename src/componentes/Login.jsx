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
        { username, password }
      );

      // 🔹 1. GUARDAR DATOS EN LOCALSTORAGE
      localStorage.setItem("token", res.data.access_token);
      // Guardamos el rol siempre en minúsculas para evitar errores de comparación
      const rolRecibido = res.data.rol.toLowerCase();
      localStorage.setItem("rol", rolRecibido);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("sede", res.data.sede);

      // 🔹 2. NOTIFICAR LOGIN EXITOSO AL APP.JS
      if (typeof onLogin === "function") {
        onLogin();
      }

      // 🔹 3. REDIRECCIÓN DIRECTA (SIN ENREDOS)
      if (rolRecibido === "visor") {
        navigate("/pantalla");
      } else {
        // Tanto Administrador como Cajero entran al Panel
        navigate("/panel");
      }

    } catch (error) {
      // Si el servidor responde 401 (como en tu imagen), mostramos el error real
      console.error("📡 Error:", error.response?.data || error.message);
      alert(error.response?.data?.msg || "Usuario o contraseña incorrectos");
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