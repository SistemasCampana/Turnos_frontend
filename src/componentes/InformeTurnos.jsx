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
        <div className="p-5 max-w-4xl mx-auto space-y-6 bg-gray-900 min-h-screen">
            <h2 className="text-3xl font-extrabold text-white text-center mb-6">📊 Generar Informe de Turnos</h2>
            
            <div className="bg-gray-800 p-4 rounded-xl shadow-lg flex flex-col sm:flex-row items-center justify-center gap-4 border border-gray-700">
                <label htmlFor="fecha-informe" className="text-white font-medium whitespace-nowrap">Selecciona la Fecha:</label>
                <input
                    type="date"
                    id="fecha-informe"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="p-2.5 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
                />
                <button
                    onClick={handleGenerarInforme}
                    disabled={cargando}
                    className={` ${cargando ? 'bg-gray-500 cursor-not-allowed text-gray-400' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/50'} w-full sm:w-auto px-6 py-2.5 rounded-lg font-semibold transition duration-200 `}
                >
                    {cargando ? 'Cargando...' : 'Generar Informe'}
                </button>
            </div>

            {error && <p className="text-red-500 font-bold text-center mt-4 p-2 bg-red-900/30 rounded-lg border border-red-500">Error: {error}</p>}
            
            {informe && (
                <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-green-500/50">
                    <h3 className="text-2xl font-bold text-green-400 mb-4 text-center">✅ Informe del Día: {informe.fecha}</h3>
                    <p className="text-white text-lg font-semibold text-center mb-4 p-3 bg-gray-700 rounded-lg"> Total de Turnos Generados: <span className="text-green-400">{informe.total_turnos}</span> </p>
                    
                    <hr className="border-gray-600 my-4" />
                    
                    <h4 className="text-xl font-semibold text-white mb-3">Detalle de Turnos ({informe.detalle_turnos.length}):</h4>
                    
                    {informe.detalle_turnos.length > 0 ? (
                        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                            {informe.detalle_turnos.map((turno) => (
                                <li key={turno.id} className="bg-gray-700 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-inner">
                                    **Turno {turno.numero}** (Generado: {turno.hora_generacion || 'N/A'}) | Cliente: {turno.nombre_cliente} | Bodega: {turno.bodega} | Estado: {turno.estado}
                                </li>
                            ))}
                        </div>
                    ) : (
                        <p className="text-yellow-400 text-center p-3 bg-gray-700 rounded-lg">No se encontraron turnos para la fecha seleccionada.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default InformeTurnos;