import { useEffect, useState } from "react";
import { fetchIPDPatients } from "../../lib/api";

type BedRecord = {
    admission_id: number;
    patient_id: string;
    patient_name: string; // Added field
    admitting_doctor_name: string; // Added field
    room_number: string | null;
    status: string;
};

export default function BedManagement() {
    const [beds, setBeds] = useState<BedRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetchIPDPatients()
            .then((data) => {
                const mapped = data.map((a: any) => ({
                    admission_id: a.admission_id,
                    patient_id: a.patient_id,
                    patient_name: a.patient_name, // Map new data
                    admitting_doctor_name: a.admitting_doctor_name, // Map new data
                    room_number: a.room_number,
                    status: a.status,
                })) as BedRecord[];
                setBeds(mapped);
            })
            .catch(() => setError("Failed to load bed data"))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="pt-20 p-6 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-bold mb-6">Bed Management</h2>

            {loading && <div className="text-center">Loading occupied beds...</div>}
            {error && <div className="text-center text-red-500">{error}</div>}
            {!loading && !error && beds.length === 0 && <div className="text-center text-gray-600">No occupied beds found.</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {beds.map((b) => (
                    <div key={b.admission_id} className="border rounded-lg p-4 shadow-md bg-white">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-bold text-gray-800">Room: {b.room_number ?? "-"}</h3>
                            <span className="text-sm font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{b.status}</span>
                        </div>
                        <div className="space-y-2 text-gray-600">
                            <p><b>Patient:</b> {b.patient_name}</p>
                            <p><b>Doctor:</b> {b.admitting_doctor_name}</p>
                            <p className="text-xs text-gray-400 pt-2">Admission ID: {b.admission_id} | Patient ID: {b.patient_id.substring(0, 8)}...</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}