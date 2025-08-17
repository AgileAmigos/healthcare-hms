import { useState, type FormEvent } from 'react';
import apiClient from '../services/apiClient';
import { CalendarPlus, CheckCircle, AlertTriangle } from 'lucide-react';

const AppointmentRequest = () => {
  const [patientId, setPatientId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [reason, setReason] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const resetForm = () => {
    setPatientId('');
    setAppointmentDate('');
    setReason('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (!patientId || !appointmentDate) {
        setError("Patient ID and Appointment Date are required.");
        setIsLoading(false);
        return;
    }

    const appointmentData = {
      patient_id: parseInt(patientId, 10),
      appointment_date: new Date(appointmentDate).toISOString(),
      reason,
    };

    try {
      await apiClient.post('/appointments/', appointmentData);
      setSuccess('Your appointment request has been submitted successfully! We will contact you shortly to confirm.');
      resetForm();
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.detail) {
         setError(Array.isArray(err.response.data.detail) ? err.response.data.detail[0].msg : err.response.data.detail);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Appointment request failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Request an Appointment</h1>
        <p className="text-gray-600 mt-1">Please fill out the form below to request an appointment.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="patient-id" className="block text-sm font-medium text-gray-700">Patient ID</label>
          <input
            id="patient-id"
            type="number"
            required
            placeholder="Enter your patient ID"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="appointment-date" className="block text-sm font-medium text-gray-700">Preferred Date and Time</label>
          <input
            id="appointment-date"
            type="datetime-local"
            required
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason for Appointment</label>
          <textarea
            id="reason"
            rows={4}
            placeholder="Briefly describe the reason for your visit..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Feedback Messages */}
        {success && (
          <div className="flex items-center p-4 text-sm text-green-700 bg-green-100 rounded-lg">
            <CheckCircle className="h-5 w-5 mr-3" />
            {success}
          </div>
        )}
        {error && (
          <div className="flex items-center p-4 text-sm text-red-700 bg-red-100 rounded-lg">
            <AlertTriangle className="h-5 w-5 mr-3" />
            {error}
          </div>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Submitting...' : <><CalendarPlus size={16}/> Submit Request</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentRequest;
