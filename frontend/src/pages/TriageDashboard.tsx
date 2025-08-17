// frontend/src/pages/TriageDashboard.tsx
import { useState, useEffect } from 'react';
import { getPatients, updateTriageLevel } from '../services/api';
import type { Patient } from '../services/api';

// Helper function to calculate age from a date string
const calculateAge = (dateOfBirth: string): number => {
    const birthday = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
        age--;
    }
    return age;
};

const TriageTagging = ({ patient, onTriageUpdate }: { patient: Patient, onTriageUpdate: (patientId: string, newLevel: string) => void }) => {
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
        );
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

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const data = await getPatients();
                setPatients(data);
            } catch (err) {
                setError((err as Error).message);
            }
        };

        fetchPatients();
    }, []);


    const handleTriageUpdate = (patientId: string, newLevel: string) => {
        setPatients(prevPatients =>
            prevPatients.map(p =>
                p.id === patientId ? { ...p, triage_level: newLevel } : p
            )
        );
    };

    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="p-4 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Triage Dashboard</h1>
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Complaint</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Triage Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {patients.map(patient => (
                            <tr key={patient.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.id.substring(0, 8)}...</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{`${patient.first_name} ${patient.last_name}`}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{calculateAge(patient.date_of_birth)}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{patient.presenting_complaint}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
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