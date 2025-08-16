import { useEffect, useState } from "react";
import { fetchIPDPatients } from "../../lib/api";

type BedRecord = {
    id: number;            // admission id
    patient_id: string;    // UUID as string
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
                // treat each admission as an occupied bed
                const mapped = data.map((a: any) => ({
                    id: a.id,
                    patient_id: a.patient_id,
                    room_number: a.room_number,
                    status: a.status,
                })) as BedRecord[];
                setBeds(mapped);
            })
            .catch(() => setError("Failed to load bed data"))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Bed Management</h2>

            {loading && <div>Loading...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {!loading && !error && beds.length === 0 && <div>No occupied beds.</div>}

            <div className="space-y-2">
                {beds.map((b) => (
                    <div key={b.id} className="border rounded p-4 shadow bg-white grid grid-cols-1 md:grid-cols-4 gap-2">
                        <div><b>Admission ID:</b> {b.id}</div>
                        <div><b>Room:</b> {b.room_number ?? "-"}</div>
                        <div><b>Patient ID:</b> {b.patient_id}</div>
                        <div><b>Status:</b> {b.status}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
