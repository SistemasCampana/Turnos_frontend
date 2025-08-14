import React, { useState } from "react";
import "./Login.css";
import axios from "axios";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Usuario enviado:", username);
    console.log("Contraseña enviada:", password);

    try {
      const res = await axios.post(
        "https://turnos-backend-b0jc.onrender.com/api/login",
        { username, password }
      );

      // Guardar token
      localStorage.setItem("token", res.data.access_token);

      // Llamar a la función del padre si existe
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
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}
