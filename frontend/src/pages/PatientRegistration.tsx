import { useState, type FormEvent } from 'react';
import apiClient from '../services/apiClient';
import { UserPlus, CheckCircle, AlertTriangle } from 'lucide-react';

const PatientRegistration = () => {
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const resetForm = () => {
    setFullName('');
    setDateOfBirth('');
    setGender('');
    setContactNumber('');
    setAddress('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const patientData = {
      full_name: fullName,
      date_of_birth: dateOfBirth,
      gender,
      contact_number: contactNumber,
      address,
    };

    try {
      await apiClient.post('/patients/', patientData);
      setSuccess('Patient registered successfully!');
      resetForm();
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(Array.isArray(err.response.data.detail) ? err.response.data.detail[0].msg : err.response.data.detail);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Registration failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-red-900">Patient Registration</h1>
        <p className="text-gray-600 mt-1">Enter the new patient's details below.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              id="full-name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label htmlFor="date-of-birth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              id="date-of-birth"
              type="date"
              required
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="contact-number" className="block text-sm font-medium text-gray-700">Contact Number</label>
            <input
              id="contact-number"
              type="tel"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
          <textarea
            id="address"
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
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

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Saving...' : <><UserPlus size={16}/> Register Patient</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientRegistration;