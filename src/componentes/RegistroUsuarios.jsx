import React, { useState } from 'react';
import './RegistroUsuarios.css';
import { useNavigate } from 'react-router-dom';

const RegistroUsuarios = () => {
  
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rol: 'cajero'
    });

    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje({ texto: 'Registrando...', tipo: '' });

        try {
            const response = await fetch('https://turnos-backend-pcyf.onrender.com/api/usuarios/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setMensaje({ texto: 'Usuario creado con éxito', tipo: 'exito' });
                setFormData({ username: '', password: '', rol: 'cajero' });
            } else {
                setMensaje({ texto: data.error || 'Error al registrar', tipo: 'error' });
            }
        } catch (error) {
            setMensaje({ texto: 'Error de conexión con el servidor', tipo: 'error' });
        }
    };

    return (
        <div className="registro-container">
            {/* 3. CORRECCIÓN: Usamos 'navigate' (la función) en lugar de 'Navigate' */}
            <button className="btn-volver" onClick={() => navigate("/inicio")}>
                ← Volver al Inicio
            </button>

            <div className="registro-card">
                <h2 className="registro-titulo">GESTIÓN DE USUARIOS</h2>
                <p className="registro-subtitulo">Crear nuevo perfil de acceso</p>

                <form onSubmit={handleSubmit} className="registro-form">
                    <div className="input-group">
                        <label>Nombre de Usuario</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Ej: cajero_paloquemao"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Asignar Rol</label>
                        <select name="rol" value={formData.rol} onChange={handleChange}>
                            <option value="cajero">Cajero (Panel de control)</option>
                            <option value="visor">Visor (Pantalla de turnos)</option>
                            <option value="admin">Administrador (Acceso total)</option>
                        </select>
                    </div>

                    <button type="submit" className="btn-registrar">
                        CREAR USUARIO
                    </button>
                </form>

                {mensaje.texto && (
                    <div className={`registro-mensaje ${mensaje.tipo}`}>
                        {mensaje.texto}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegistroUsuarios;