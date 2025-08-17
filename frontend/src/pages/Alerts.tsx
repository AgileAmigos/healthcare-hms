// frontend/src/pages/Alerts.tsx
import React, { useState, useEffect } from 'react';
import { getHighPriorityAlerts } from '../services/api';
import type { Patient } from '../services/api';


export default function Alerts() {
    const [alerts, setAlerts] = useState<Patient[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const data = await getHighPriorityAlerts();
                setAlerts(data);
                setError('');
            } catch (err) {
                setError((err as Error).message);
            }
        };

        fetchAlerts(); // Initial fetch
        const intervalId = setInterval(fetchAlerts, 15000); // Poll every 15 seconds

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    return (
        <div className="p-4 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-red-600">High-Priority Alerts 🚨</h1>
            {error && <p className="text-red-500">{error}</p>}
            {alerts.length === 0 ? (
                <p className="text-gray-500">No high-priority patients at the moment.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {alerts.map(patient => (
                        <div key={patient.id} className="p-4 bg-white rounded-lg shadow-lg border-l-8 border-red-600">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold">{patient.full_name}</h2>
                                <span className="px-3 py-1 text-sm font-semibold text-white bg-red-600 rounded-full">
                                    {patient.triage_level}
                                </span>
                            </div>
                            <p className="text-gray-600">Age: {patient.age}</p>
                            <p className="mt-2 text-gray-800"><strong>Complaint:</strong> {patient.presenting_complaint}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}