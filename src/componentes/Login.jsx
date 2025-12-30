import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Usuario enviado:", username);
    console.log("Contraseña enviada:", password);

    try {
      const res = await axios.post(
        "https://turnos-backend-pcyf.onrender.com/api/login",
        { username, password }
      );

      localStorage.setItem("token", res.data.access_token);

      if (typeof onLogin === "function") {
        onLogin();
      } else {
        console.warn("⚠️ No se pasó la función onLogin como prop.");
      }
    } catch (error) {
      if (error.response) {
        console.error("📡 Respuesta del servidor:", error.response.data);
        console.error("📋 Código de estado:", error.response.status);
      } else if (error.request) {
        console.error("⏳ No hubo respuesta del servidor:", error.request);
      } else {
        console.error("⚠️ Error configurando la petición:", error.message);
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
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
        />
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}
