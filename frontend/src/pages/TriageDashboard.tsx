// frontend/src/pages/TriageDashboard.tsx
import React, { useState, useEffect } from 'react';
import { getPatients, updateTriageLevel } from '../services/api';
import type { Patient } from '../services/api';

const TriageTagging = ({ patient, onTriageUpdate }: { patient: Patient, onTriageUpdate: (patientId: number, newLevel: string) => void }) => {
    const triageLevels = ["Resuscitation", "Emergency", "Urgent", "Semi-Urgent", "Non-Urgent"];
    const levelColors: { [key: string]: string } = {
        Resuscitation: "bg-red-600",
        Emergency: "bg-orange-500",
        Urgent: "bg-yellow-400",
        "Semi-Urgent": "bg-green-400",
        "Non-Urgent": "bg-blue-400",
    };

    const handleTriageSelect = async (level: string) => {
        try {
            await updateTriageLevel(patient.id, level);
            onTriageUpdate(patient.id, level); // Notify parent to update state
        } catch (error) {
            alert(`Error updating triage: ${(error as Error).message}`);
        }
    };

    if (patient.triage_level) {
        return (
            <div className={`p-2 text-white font-bold rounded ${levelColors[patient.triage_level] || 'bg-gray-500'}`}>
                {patient.triage_level}
            </div>
        )
    }

    return (
        <div className="flex space-x-1">
            {triageLevels.map(level => (
                <button key={level} onClick={() => handleTriageSelect(level)} className="px-2 py-1 text-xs text-white bg-gray-500 rounded hover:bg-gray-700">
                    {level.substring(0, 4)}
                </button>
            ))}
        </div>
    );
};


export default function TriageDashboard() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [error, setError] = useState('');

    const fetchPatients = async () => {
        try {
            const data = await getPatients();
            setPatients(data);
        } catch (err) {
            setError((err as Error).message);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);


    const handleTriageUpdate = (patientId: number, newLevel: string) => {
        setPatients(prevPatients =>
            prevPatients.map(p =>
                p.id === patientId ? { ...p, triage_level: newLevel } : p
            )
        );
    };

    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        <div className="p-4 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Triage Dashboard</h1>
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left">ID</th>
                            <th className="px-6 py-3 text-left">Name</th>
                            <th className="px-6 py-3 text-left">Age</th>
                            <th className="px-6 py-3 text-left">Complaint</th>
                            <th className="px-6 py-3 text-center">Triage Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {patients.map(patient => (
                            <tr key={patient.id}>
                                <td className="px-6 py-4">{patient.id}</td>
                                <td className="px-6 py-4 font-medium">{patient.full_name}</td>
                                <td className="px-6 py-4">{patient.age}</td>
                                <td className="px-6 py-4">{patient.presenting_complaint}</td>
                                <td className="px-6 py-4 text-center">
                                    <TriageTagging patient={patient} onTriageUpdate={handleTriageUpdate} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}