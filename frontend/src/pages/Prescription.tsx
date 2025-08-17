import React, { useState } from "react";
import { Plus, Minus, HeartPulse } from "lucide-react";

// The main component for the prescription form.
export default function App() {
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [prescriptionNotes, setDiagnosis] = useState("");
  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", frequency: "As prescribed", duration: "Until finished" }
  ]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null); // State for handling errors

  // --- MOCK DATA ---
  const MOCK_DOCTOR_ID = "d5b2b7a0-9b7a-4b0c-8e0a-6a2b3c4d5e6f";
  const MOCK_RECORD_ID = 101;
  
  // --- CORRECT BACKEND API URL ---
  const API_URL = "http://127.0.0.1:8000/prescriptions";


  const addMedicine = () => {
    setMedicines([
      ...medicines, 
      { name: "", dosage: "", frequency: "As prescribed", duration: "Until finished" }
    ]);
  };

  const removeMedicine = (index: number) => {
    if (medicines.length > 1) {
      const updatedMedicines = medicines.filter((_, i) => i !== index);
      setMedicines(updatedMedicines);
    }
  };

  const handleMedicineChange = (index: number, field: string, value: string) => {
    const updatedMedicines = medicines.map((med, i) => {
      if (i === index) {
        return { ...med, [field]: value };
      }
      return med;
    });
    setMedicines(updatedMedicines);
  };

  /**
   * --- UPDATED handleSubmit FUNCTION ---
   * This function now sends the data to the backend using a fetch request.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error state on new submission

    const prescriptionPayload = {
      record_id: MOCK_RECORD_ID,
      doctor_id: MOCK_DOCTOR_ID,
      notes: prescriptionNotes,
      medications: medicines.map(med => ({
        medication_name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration,
      })),
      patient_info: {
        name: patientName,
        age: age,
        gender: gender,
      }
    };

    try {
      // The URL now correctly points to your new backend endpoint
      const response = await fetch(`${API_URL}/create_prescription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prescriptionPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Backend Response:", result);
      setSubmitted(true);

      // Reset form after a delay
      setTimeout(() => {
        setPatientName("");
        setAge("");
        setGender("");
        setDiagnosis("");
        setMedicines([{ name: "", dosage: "", frequency: "As prescribed", duration: "Until finished" }]);
        setSubmitted(false);
      }, 3000);

    } catch (err) {
      console.error("Failed to submit prescription:", err);
      setError("Failed to save prescription. Please check if the backend is running.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-red-100 flex-col items-center justify-center p-4 sm:p-6 py-12 font-sans">
      <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
          <HeartPulse className="inline-block w-8 h-8 mr-3 text-red-500" />
          Create Prescription
        </h2>

        {/* --- UI to show submission status or errors --- */}
        {submitted && (
            <div className="text-center p-4 bg-green-100 text-green-800 rounded-lg">
                <p className="font-semibold">Prescription submitted successfully! ✅</p>
            </div>
        )}
        {error && (
            <div className="text-center p-4 bg-red-100 text-red-800 rounded-lg">
                <p className="font-semibold">{error}</p>
            </div>
        )}

        {!submitted && (
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Patient Name</label>
              <input
                type="text"
                placeholder="e.g., John Doe"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-400 outline-none transition"
                required
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium mb-1">Age</label>
                  <input
                    type="number"
                    placeholder="e.g., 42"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-400 outline-none transition"
                    required
                  />
                </div>
    
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-400 outline-none transition bg-white"
                    required
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Diagnosis</label>
              <textarea
                value={prescriptionNotes}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-400 outline-none transition"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Medicines</label>
              {medicines.map((med, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Medicine Name"
                    value={med.name}
                    onChange={(e) => handleMedicineChange(index, "name", e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-400 outline-none transition"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Dosage"
                    value={med.dosage}
                    onChange={(e) => handleMedicineChange(index, "dosage", e.target.value)}
                    className="w-32 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-400 outline-none transition"
                    required
                  />
                  {index === medicines.length - 1 ? (
                     <button
                        type="button"
                        onClick={addMedicine}
                        className="p-2 text-green-500 rounded-full hover:bg-green-100 transition"
                        aria-label="Add medicine"
                      >
                        <Plus className="w-8 h-8" />
                      </button>
                  ) : (
                     <button
                        type="button"
                        onClick={() => removeMedicine(index)}
                        className="p-2 text-red-500 rounded-full hover:bg-red-100 transition"
                        aria-label="Remove medicine"
                      >
                       <Minus className="w-8 h-8" />
                      </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl shadow-lg hover:bg-green-700 transition transform hover:-translate-y-1"
            >
              Save Prescription
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
