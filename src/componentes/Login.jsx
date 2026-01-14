import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://turnos-backend-pcyf.onrender.com/api/login",
        { username, password }
      );

      // 🔹 GUARDAR TODO EN LOCALSTORAGE
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("rol", res.data.rol); // 'administrador', 'cajero', 'visor'
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("sede", res.data.sede);

      if (typeof onLogin === "function") {
        onLogin();
      } else {
        console.warn("⚠️ No se pasó la función onLogin como prop.");
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