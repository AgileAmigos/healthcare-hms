import { useEffect, useState } from "react";
import { fetchOPDPatients } from "../../lib/api";

type OPDPatient = {
    appointment_id: number;
    patient_id: string;
    patient_name: string;
    doctor_id: string;
    doctor_name: string;
    appointment_time: string;
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
        <div className="pt-20 min-h-screen bg-gradient-to-br from-neutral-50 to-red-200"> {/* Add padding to offset fixed navbar */}
            {/* Control Bar */}
            <div className="bg-gray-100 p-4 shadow-md mb-6 flex justify-between items-center">
                <h2 className="text-xl font-bold">OPD Patient Appointments</h2>
                <label className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">Select Date</span>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="border rounded px-2 py-1 shadow-sm"
                    />
                </label>
            </div>

            <div className="px-6">
                {loading && <div className="text-center">Loading...</div>}
                {error && <div className="text-center text-red-500">{error}</div>}
                {!loading && !error && patients.length === 0 && (
                    <div className="text-center text-gray-500 mt-8">No OPD appointments found for this date.</div>
                )}

                {!loading && !error && patients.length > 0 && (
                    <table className="min-w-full bg-white border rounded-lg shadow">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Appt ID</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Patient</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Doctor</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Time</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {patients.map((p) => (
                                <tr key={p.appointment_id} className="border-b hover:bg-gray-50">
                                    <td className="text-left py-3 px-4">{p.appointment_id}</td>
                                    <td className="text-left py-3 px-4">{p.patient_name} ({p.patient_id.substring(0, 8)}...)</td>
                                    <td className="text-left py-3 px-4">{p.doctor_name} ({p.doctor_id.substring(0, 8)}...)</td>
                                    <td className="text-left py-3 px-4">
                                        {new Date(p.appointment_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}