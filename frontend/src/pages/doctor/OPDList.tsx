import { useEffect, useState } from "react";
import { fetchOPDPatients } from "../../lib/api";

type OPDPatient = {
    id: number;
    patient_id: string;       // UUID from backend as string
    doctor_id: string;        // UUID from backend as string
    appointment_time: string; // ISO string
    reason: string | null;
    status: string;           // e.g., "Scheduled"
};

export default function OPDList() {
    const [patients, setPatients] = useState<OPDPatient[]>([]);
    const [date, setDate] = useState<string>(() => new Date().toISOString().split("T")[0]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetchOPDPatients(date)
            .then(setPatients)
            .catch(() => setError("Failed to load OPD patients"))
            .finally(() => setLoading(false));
    }, [date]);

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">OPD Patients</h2>
                <label className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Date</span>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="border rounded px-2 py-1"
                    />
                </label>
            </div>

            {loading && <div>Loading...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {!loading && !error && patients.length === 0 && <div>No OPD appointments found.</div>}

            <div className="space-y-2">
                {patients.map((p) => (
                    <div key={p.id} className="border rounded p-4 shadow bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                            <div><b>Patient ID:</b> {p.patient_id}</div>
                            <div><b>Doctor ID:</b> {p.doctor_id}</div>
                            <div><b>Status:</b> {p.status}</div>
                            <div><b>Reason:</b> {p.reason ?? "-"}</div>
                            <div><b>Time:</b> {new Date(p.appointment_time).toLocaleString()}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
