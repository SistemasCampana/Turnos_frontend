import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://turnos-backend-b0jc.onrender.com/api/turnos/';

export default function InformeTurnos() {

    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [informe, setInforme] = useState(null);
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(false);

    const generarInforme = async () => {
        setCargando(true);
        setError(null);
        setInforme(null);

        try {
            const url = `${API_BASE_URL}/informe/${fecha}`;
            const response = await axios.get(url);
            setInforme(response.data);

        } catch (err) {
            console.error('Error al generar el informe:', err);
            const errorMessage = err.response
                ? `Error del servidor: ${err.response.data.error || err.response.statusText}`
                : `Fallo la conexión con el servidor. Revisa que el Backend esté corriendo.`;
            setError(errorMessage);
        } finally {
            setCargando(false);
        }
    };

    const handleFechaChange = (e) => {
        setFecha(e.target.value);
    };

    const buttonClasses = `
        w-full sm:w-auto px-6 py-2.5 rounded-lg font-semibold transition duration-200 
        ${cargando 
            ? 'bg-gray-500 cursor-not-allowed text-gray-400' 
            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/50'
        }
    `;


    return (
        <div className="bg-gray-900 text-white w-full min-h-screen flex justify-center items-start py-10">
            <div className="w-full max-w-5xl px-6">

                <header className="mb-10 pb-4 border-b border-indigo-700 text-center">
                    <h1 className="text-4xl font-extrabold text-indigo-400 flex justify-center items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>
                        </svg>
                        Generar Informe de Turnos
                    </h1>
                </header>

                <div className="bg-gray-800 p-8 rounded-xl shadow-xl mb-10">
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
                        <label htmlFor="fecha" className="font-medium text-lg text-gray-300">
                            Selecciona la Fecha:
                        </label>

                        <input
                            type="date"
                            id="fecha"
                            value={fecha}
                            onChange={handleFechaChange}
                            className="p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white
                            focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 transition duration-150"
                            max={new Date().toISOString().split('T')[0]}
                            disabled={cargando}
                        />

                        <button onClick={generarInforme} className={buttonClasses} disabled={cargando}>
                            {cargando ? 'Cargando...' : 'Generar Informe'}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-900 bg-opacity-30 border border-red-700 p-4 rounded-lg mb-8 shadow-lg text-center">
                        <p className="text-red-400 font-semibold text-lg">{error}</p>
                    </div>
                )}

                {informe && (
                    <div className="bg-gray-800 p-8 rounded-xl shadow-xl">

                        <h2 className="text-3xl font-bold text-indigo-400 mb-6 border-b border-gray-700 pb-3 flex justify-center items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M9 11l3 3L22 4"/>
                            </svg>
                            Informe del Día: {informe.fecha}
                        </h2>

                        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* CARD 1 */}
                            <Card
                                title="Total de Turnos Generados"
                                value={informe.total_turnos}
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                    </svg>
                                }
                                color="bg-indigo-600"
                            />

                            {/* CARD 2 */}
                            <Card
                                title="Turnos Llamados (Ejemplo)"
                                value={informe.detalle_turnos.filter(t => t.estado === 'llamado').length}
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.5 17.5 18 20l2 2"/><path d="M19.5 15l.5-2 2-2.5"/><path d="M22 17c-3.37 0-6.1-2.82-5.9-6C16.5 8 18 7 19.5 7c.5 0 1 .1 1.5.3M17 19.8c-1 .8-2.5.8-3.5 0"/>
                                    </svg>
                                }
                                color="bg-green-600"
                            />

                        </div>

                        <h3 className="text-xl font-semibold mt-6 mb-4 border-b border-gray-700 pb-2 text-center">
                            Detalle de Turnos ({informe.detalle_turnos.length})
                        </h3>

                        <TurnosTable turnos={informe.detalle_turnos} />

                    </div>
                )}

            </div>
        </div>
    );
}


const Card = ({ title, value, icon, color }) => (
    <div className={`p-5 rounded-xl shadow-xl flex items-center justify-between ${color} bg-opacity-20 border border-gray-700`}>
        <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-400 uppercase">{title}</span>
            <span className="text-4xl font-extrabold text-white mt-1">{value}</span>
        </div>
        <div className={`p-3 rounded-full ${color} text-white`}>
            {icon}
        </div>
    </div>
);


const TurnosTable = ({ turnos }) => (
    <div className="overflow-x-auto rounded-xl border border-gray-700 shadow-2xl">
        <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Turno</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Generado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Bodega</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Módulo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
                {turnos.map((turno) => (
                    <tr key={turno.id} className="hover:bg-gray-700 transition duration-150">
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-indigo-400">{turno.numero}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{turno.hora_generacion}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{turno.nombre_cliente}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{turno.bodega}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{turno.modulo}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                turno.estado === 'llamado' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                                turno.estado === 'esperando' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100'
                            }`}>
                                {turno.estado.toUpperCase()}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
