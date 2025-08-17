import { useState, useEffect, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';
import { Pill, PlusCircle, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

// --- Type Definitions ---
interface Patient {
  patient_id: number;
  full_name: string;
}

interface User {
    user_id: number;
    full_name: string;
}

interface Prescription {
  prescription_id: number;
  medication: string;
  dosage: string | null;
  instructions: string | null;
  created_at: string;
  doctor: User;
}

const PrescriptionManagement = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const { user } = useAuth(); // Get current user from auth context

  const [patient, setPatient] = useState<Patient | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for the new prescription form
  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const fetchData = async () => {
    if (!patientId) return;
    setIsLoading(true);
    setError(null);
    try {
      const [patientResponse, prescriptionsResponse] = await Promise.all([
        apiClient.get(`/patients/${patientId}`),
        apiClient.get(`/prescriptions/patient/${patientId}`),
      ]);
      setPatient(patientResponse.data);
      setPrescriptions(prescriptionsResponse.data);
    } catch (err) {
      setError('Failed to fetch patient data. The patient may not exist.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [patientId]);

  const resetForm = () => {
    setMedication('');
    setDosage('');
    setInstructions('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!medication || !patientId) {
      setFormError('Medication field is required.');
      return;
    }
    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      await apiClient.post('/prescriptions/', {
        patient_id: parseInt(patientId),
        medication,
        dosage,
        instructions,
      });
      setFormSuccess('Prescription added successfully!');
      resetForm();
      fetchData(); // Refresh list
    } catch (err) {
      setFormError('Failed to add prescription. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isDoctor = user?.role === 'doctor';

  if (isLoading) {
    return <div className="text-center p-10">Loading prescription data...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Prescription List */}
      <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-800">Prescription Management</h1>
        <p className="text-gray-600 mt-1">
          Viewing prescriptions for: <span className="font-semibold">{patient?.full_name}</span> (ID: {patient?.patient_id})
        </p>

        <div className="mt-6 space-y-4">
          {prescriptions.length > 0 ? (
            prescriptions.map((rx) => (
              <div key={rx.prescription_id} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                        <Pill className="h-6 w-6 text-blue-600 mt-1" />
                        <div>
                            <p className="font-bold text-lg text-gray-800">{rx.medication}</p>
                            <p className="text-sm text-gray-600 font-medium">{rx.dosage}</p>
                            <p className="text-sm text-gray-500 mt-1">{rx.instructions}</p>
                        </div>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                        <p>Prescribed by: {rx.doctor.full_name}</p>
                        <p>{new Date(rx.created_at).toLocaleString()}</p>
                    </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No prescriptions found for this patient.</p>
          )}
        </div>
      </div>

      {/* Add Prescription Form (Only for Doctors) */}
      {isDoctor && (
        <div className="bg-white p-8 rounded-xl shadow-md h-fit">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><PlusCircle size={24}/> Add New Prescription</h2>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="medication" className="block text-sm font-medium text-gray-700">Medication</label>
              <input id="medication" type="text" required value={medication} onChange={(e) => setMedication(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label htmlFor="dosage" className="block text-sm font-medium text-gray-700">Dosage</label>
              <input id="dosage" type="text" value={dosage} onChange={(e) => setDosage(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">Instructions</label>
              <textarea id="instructions" rows={3} value={instructions} onChange={(e) => setInstructions(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            
            {formSuccess && <div className="flex items-center text-sm text-green-700"><CheckCircle size={16} className="mr-2"/>{formSuccess}</div>}
            {formError && <div className="flex items-center text-sm text-red-700"><AlertTriangle size={16} className="mr-2"/>{formError}</div>}
            
            <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {isSubmitting ? <><Loader2 className="animate-spin" size={16}/> Adding...</> : <><PlusCircle size={16}/> Add Prescription</>}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PrescriptionManagement;
