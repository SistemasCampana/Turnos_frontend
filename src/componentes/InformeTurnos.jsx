// src/componentes/InformeTurnos.jsx
import React, { useState } from 'react';

// Asegúrate de que esta URL base sea la correcta para tu Backend de Flask
const API_URL = 'https://turnos-backend-b0jc.onrender.com/api/turnos'; 

const InformeTurnos = () => {
    const [fecha, setFecha] = useState('');
    const [informe, setInforme] = useState(null);
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    const handleGenerarInforme = async () => {
        if (!fecha) {
            setError('Por favor, selecciona una fecha.');
            setInforme(null);
            return;
        }

        setError('');
        setCargando(true);
        setInforme(null);

        try {
            // Llama a la nueva ruta API del Backend
            const response = await fetch(`${API_URL}/informe/${fecha}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                // Si la respuesta no es OK (ej. 400 o 500)
                setError(data.error || 'Error desconocido al obtener el informe.');
                setCargando(false);
                return;
            }

            setInforme(data);
        } catch (err) {
            setError('Fallo la conexión con el servidor. Revisa que el Backend esté corriendo.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ color: 'white' }}>📊 Generar Informe de Turnos</h2>
            
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label htmlFor="fecha-informe" style={{ color: 'white' }}>Selecciona la Fecha:</label>
                <input
                    type="date"
                    id="fecha-informe"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <button
                    onClick={handleGenerarInforme}
                    disabled={cargando}
                    style={{
                        padding: '10px 15px',
                        backgroundColor: '#1E90FF', // Un azul para diferenciar del rojo
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: cargando ? 'not-allowed' : 'pointer'
                    }}
                >
                    {cargando ? 'Cargando...' : 'Generar Informe'}
                </button>
            </div>

            {error && <p style={{ color: '#FF4500', fontWeight: 'bold' }}>Error: {error}</p>}
            
            {informe && (
                <div style={{ backgroundColor: '#2e2e2e', padding: '15px', borderRadius: '8px', border: '1px solid #444' }}>
                    <h3 style={{ color: '#00FA9A' }}>✅ Informe del Día: {informe.fecha}</h3>
                    <p style={{ color: 'white', fontSize: '1.2em', fontWeight: 'bold' }}>
                        Total de Turnos Generados: {informe.total_turnos}
                    </p>
                    
                    <hr style={{ borderColor: '#444' }} />
                    
                    <h4 style={{ color: 'white' }}>Detalle de Turnos ({informe.total_turnos}):</h4>
                    
                    {informe.detalle_turnos.length > 0 ? (
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {informe.detalle_turnos.map((turno) => (
                                <li key={turno.id} style={{ 
                                    backgroundColor: '#3a3a3a', 
                                    padding: '10px', 
                                    margin: '5px 0', 
                                    borderRadius: '4px',
                                    color: 'white'
                                }}>
                                    **Turno {turno.numero}** (Generado: {turno.hora_generacion || 'N/A'}) | Cliente: {turno.nombre_cliente} | Bodega: {turno.bodega} | Estado: {turno.estado}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ color: '#ffdd57' }}>No se encontraron turnos para la fecha seleccionada.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default InformeTurnos;