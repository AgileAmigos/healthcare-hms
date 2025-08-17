import { useEffect, useState } from "react";
import { fetchIPDPatients, dischargePatient, transferPatient } from "../../lib/api";
import Modal from "../../components/Modal"; // Assuming Modal component exists

interface IPDPatient {
    admission_id: number;
    patient_id: string; // Corrected to string for UUID
    patient_name: string;
    admitting_doctor_id: string; // Corrected to string for UUID
    admitting_doctor_name: string;
    room_number: string;
    status: string;
    admission_date: string;
}

export default function IPDList() {
    const [patients, setPatients] = useState<IPDPatient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State for transfer modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAdmissionId, setSelectedAdmissionId] = useState<number | null>(null);
    const [transferDeptId, setTransferDeptId] = useState("");

    const loadPatients = () => {
        setLoading(true);
        setError(null);
        fetchIPDPatients()
            .then((data) => setPatients(data))
            .catch(() => setError("Failed to load admitted patients."))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadPatients();
    }, []);

    const handleDischarge = async (admissionId: number) => {
        if (window.confirm("Are you sure you want to discharge this patient?")) {
            try {
                await dischargePatient(admissionId);
                alert("Patient discharged successfully!");
                loadPatients(); // Refresh the list
            } catch (err) {
                alert("Failed to discharge patient.");
            }
        }
    };

    const handleOpenTransferModal = (admissionId: number) => {
        setSelectedAdmissionId(admissionId);
        setIsModalOpen(true);
    };

    const handleTransfer = async () => {
        if (!selectedAdmissionId || !transferDeptId) {
            alert("Please enter a department ID.");
            return;
        }
        try {
            await transferPatient(selectedAdmissionId, parseInt(transferDeptId, 10));
            alert("Patient transferred successfully!");
            loadPatients(); // Refresh the list
            setIsModalOpen(false); // Close modal
            setTransferDeptId(""); // Reset input
        } catch (err) {
            alert("Failed to transfer patient.");
        }
    };

    if (loading) return <p className="pt-20 text-center">Loading...</p>;
    if (error) return <p className="pt-20 text-center text-red-500">{error}</p>;

    return (
        <>
            <div className="pt-20 p-4">
                <h2 className="text-xl font-bold mb-4">Admitted Patients (IPD)</h2>
                <table className="min-w-full bg-white border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2">Admission ID</th>
                            <th className="border p-2">Patient</th>
                            <th className="border p-2">Doctor</th>
                            <th className="border p-2">Room</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">Admission Date</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((p) => (
                            <tr key={p.admission_id}>
                                <td className="border p-2 text-center">{p.admission_id}</td>
                                <td className="border p-2">{p.patient_name}</td>
                                <td className="border p-2">{p.admitting_doctor_name}</td>
                                <td className="border p-2 text-center">{p.room_number}</td>
                                <td className="border p-2 text-center">{p.status}</td>
                                <td className="border p-2">{new Date(p.admission_date).toLocaleDateString()}</td>
                                <td className="border p-2 text-center">
                                    <div className="flex justify-center gap-2">
                                        <button onClick={() => handleDischarge(p.admission_id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">Discharge</button>
                                        <button onClick={() => handleOpenTransferModal(p.admission_id)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm">Transfer</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Transfer Patient">
                <div>
                    <label htmlFor="deptId" className="block text-sm font-medium text-gray-700 mb-2">
                        New Department ID
                    </label>
                    <input
                        type="number"
                        id="deptId"
                        value={transferDeptId}
                        onChange={(e) => setTransferDeptId(e.target.value)}
                        className="w-full border rounded p-2"
                        placeholder="e.g., 2 for Neurology"
                    />
                    <div className="mt-4 flex justify-end gap-2">
                        <button onClick={() => setIsModalOpen(false)} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
                        <button onClick={handleTransfer} className="bg-blue-500 text-white px-4 py-2 rounded">Confirm Transfer</button>
                    </div>
                </div>
            </Modal>
        </>
    );
}