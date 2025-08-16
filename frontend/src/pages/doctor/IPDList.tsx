import { useEffect, useMemo, useState } from "react";
import { fetchIPDPatients, dischargePatient, transferPatient } from "../../lib/api";

type IPDPatient = {
    id: number;
    patient_id: string;           // UUID as string
    admitting_doctor_id: string;  // UUID as string
    admission_date: string;       // ISO
    room_number: string | null;
    status: string;               // "Admitted" | "Transferred" | ...
    reason: string | null;
};

export default function IPDList() {
    const [patients, setPatients] = useState<IPDPatient[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    // simple per-row dept selection (defaults to 2)
    const [deptSelections, setDeptSelections] = useState<Record<number, number>>({});

    const load = () => {
        setLoading(true);
        setError(null);
        fetchIPDPatients()
            .then((data) => {
                setPatients(data);
                // initialize selections with default 2
                const defaults: Record<number, number> = {};
                data.forEach((d: IPDPatient) => (defaults[d.id] = defaults[d.id] ?? 2));
                setDeptSelections(defaults);
            })
            .catch(() => setError("Failed to load IPD patients"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        load();
    }, []);

    const handleDischarge = async (id: number) => {
        await dischargePatient(id);
        load();
    };

    const handleTransfer = async (id: number) => {
        const deptId = deptSelections[id] ?? 2;
        await transferPatient(id, deptId);
        load();
    };

    const admittedCount = useMemo(
        () => patients.filter((p) => p.status === "Admitted").length,
        [patients]
    );

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">IPD Patients</h2>
                <div className="text-sm text-gray-600">Admitted: {admittedCount}</div>
            </div>

            {loading && <div>Loading...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {!loading && !error && patients.length === 0 && <div>No admitted patients found.</div>}

            <div className="space-y-2">
                {patients.map((p) => (
                    <div key={p.id} className="border rounded p-4 shadow bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-x-6 gap-y-1">
                            <div><b>Patient ID:</b> {p.patient_id}</div>
                            <div><b>Room:</b> {p.room_number ?? "-"}</div>
                            <div><b>Status:</b> {p.status}</div>
                            <div><b>Reason:</b> {p.reason ?? "-"}</div>
                            <div><b>Admitted:</b> {new Date(p.admission_date).toLocaleString()}</div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleDischarge(p.id)}
                                className="bg-green-600 text-white px-3 py-1 rounded"
                                title="Discharge"
                            >
                                Discharge
                            </button>

                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min={1}
                                    value={deptSelections[p.id] ?? 2}
                                    onChange={(e) =>
                                        setDeptSelections((prev) => ({ ...prev, [p.id]: Number(e.target.value) }))
                                    }
                                    className="w-20 border rounded px-2 py-1"
                                    title="New Department ID"
                                />
                                <button
                                    onClick={() => handleTransfer(p.id)}
                                    className="bg-blue-600 text-white px-3 py-1 rounded"
                                    title="Transfer to department"
                                >
                                    Transfer
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
