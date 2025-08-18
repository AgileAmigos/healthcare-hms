import { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import { Pencil } from 'lucide-react';

interface Patient {
    patient_id: number;
    full_name: string;
    date_of_birth: string;
    presenting_complaint: string | null;
    triage_level: string | null;
}

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

const TriageTagging = ({ patient, onTriageUpdate, onTriageReset }: { patient: Patient, onTriageUpdate: (patientId: number, newLevel: string) => void, onTriageReset: (patientId: number) => void }) => {
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
            await apiClient.put(`/patients/${patient.patient_id}/triage`, { triage_level: level });
            onTriageUpdate(patient.patient_id, level);
        } catch (error) {
            alert(`Error updating triage: ${(error as Error).message}`);
        }
    };

    if (patient.triage_level) {
        return (
            <div className="flex items-center justify-center gap-2">
                <div className={`w-24 text-center px-3 py-1 text-white text-xs font-bold rounded ${levelColors[patient.triage_level] || 'bg-gray-500'}`}>
                    {patient.triage_level}
                </div>
                <button onClick={() => onTriageReset(patient.patient_id)} className="p-1 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-200 transition-colors">
                    <Pencil size={14} />
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center space-x-1">
            {triageLevels.map(level => (
                <button
                    key={level}
                    onClick={() => handleTriageSelect(level)}
                    className={`h-6 w-6 rounded-sm transition-transform hover:scale-110 ${levelColors[level]}`}
                    title={level}
                >
                    <span className="sr-only">{level}</span>
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
                const { data } = await apiClient.get('/patients/');
                setPatients(data);
            } catch (err) {
                setError((err as Error).message);
            }
        };
        fetchPatients();
    }, []);

    const handleTriageUpdate = (patientId: number, newLevel: string) => {
        setPatients(prevPatients =>
            prevPatients.map(p =>
                p.patient_id === patientId ? { ...p, triage_level: newLevel } : p
            )
        );
    };

    const handleTriageReset = async (patientId: number) => {
        try {
            await apiClient.put(`/patients/${patientId}/triage`, { triage_level: null });
            setPatients(prevPatients =>
                prevPatients.map(p =>
                    p.patient_id === patientId ? { ...p, triage_level: null } : p
                )
            );
        } catch (error) {
            alert(`Error resetting triage: ${(error as Error).message}`);
        }
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
                            <tr key={patient.patient_id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.patient_id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.full_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{calculateAge(patient.date_of_birth)}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{patient.presenting_complaint}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                    <TriageTagging patient={patient} onTriageUpdate={handleTriageUpdate} onTriageReset={handleTriageReset} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
