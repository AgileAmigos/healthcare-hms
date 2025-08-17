import { useState, useEffect, type FormEvent } from 'react';
import apiClient from '../services/apiClient';
import { BedDouble, X, Check, Loader2 } from 'lucide-react';

// --- Type Definitions ---
interface Patient {
  patient_id: number;
  full_name: string;
}

interface Bed {
  bed_id: number;
  bed_number: string;
  is_occupied: boolean;
  patient_id: number | null;
  patient?: Patient | null;
}

const BedManagement = () => {
  const [beds, setBeds] = useState<Bed[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [bedsResponse, patientsResponse] = await Promise.all([
        apiClient.get('/beds/'),
        apiClient.get('/patients/'),
      ]);
      setBeds(bedsResponse.data);
      setPatients(patientsResponse.data);
    } catch (err) {
      setError('Failed to fetch data. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (bed: Bed) => {
    setSelectedBed(bed);
    setSelectedPatientId(bed.patient_id?.toString() || '');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBed(null);
    setSelectedPatientId('');
  };

  const handleUpdateBed = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedBed) return;
    setIsUpdating(true);

    const isAssigning = selectedPatientId !== '';
    const patientId = isAssigning ? parseInt(selectedPatientId, 10) : null;

    try {
      await apiClient.put(`/beds/${selectedBed.bed_id}`, {
        is_occupied: isAssigning,
        patient_id: patientId,
      });
      await fetchData(); // Refresh data
      handleCloseModal();
    } catch (err) {
      setError('Failed to update bed. Please try again.');
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <div className="text-center p-10">Loading bed information...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-red-900">Bed Management</h1>
        <p className="text-gray-600 mt-1">View and manage hospital bed allocation.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {beds.map((bed) => (
          <div
            key={bed.bed_id}
            onClick={() => handleOpenModal(bed)}
            className={`p-4 rounded-lg shadow-sm cursor-pointer transition-all duration-200 ${
              bed.is_occupied
                ? 'bg-red-100 border-red-300'
                : 'bg-green-100 border-green-300'
            } hover:shadow-md hover:scale-105 border`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">{bed.bed_number}</span>
              <BedDouble size={20} className={bed.is_occupied ? 'text-red-600' : 'text-green-600'} />
            </div>
            <p className="text-sm mt-2">
              {bed.is_occupied ? `Occupied by: Patient #${bed.patient_id}` : 'Available'}
            </p>
          </div>
        ))}
      </div>

      {/* Bed Assignment Modal */}
      {isModalOpen && selectedBed && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-red-900">Manage Bed {selectedBed.bed_number}</h2>
              <button onClick={handleCloseModal} className="p-1 rounded-full hover:bg-gray-200">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdateBed}>
              <div className="mb-4">
                <label htmlFor="patient" className="block text-sm font-medium text-gray-700 mb-1">
                  Assign Patient
                </label>
                <select
                  id="patient"
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                >
                  <option value="">-- Vacant --</option>
                  {patients.map((p) => (
                    <option key={p.patient_id} value={p.patient_id}>
                      {p.full_name} (ID: {p.patient_id})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 flex items-center gap-2"
                >
                  {isUpdating ? <Loader2 className="animate-spin" size={16}/> : <Check size={16}/>}
                  {isUpdating ? 'Updating...' : 'Update Bed'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BedManagement;
