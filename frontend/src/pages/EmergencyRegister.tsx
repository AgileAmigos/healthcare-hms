// frontend/src/pages/EmergencyRegister.tsx
import React, { useState } from 'react';
import { registerPatient } from '../services/api';
import type { PatientCreate } from '../services/api';

// This now matches the PatientCreate type from api.ts and the backend schema
const initialFormData: PatientCreate = {
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: 'Other',
    presenting_complaint: '',
};

export default function EmergencyRegister() {
    const [formData, setFormData] = useState<PatientCreate>(initialFormData);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setMessage('');
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.date_of_birth) {
            setMessage("Please enter a date of birth.");
            return;
        }
        setIsLoading(true);
        setMessage('');

        try {
            const result = await registerPatient(formData);
            setMessage(`Success! Patient "${result.first_name} ${result.last_name}" registered.`);
            setFormData(initialFormData); // Reset form
        } catch (error) {
            setMessage(`Error: ${(error as Error).message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800">Emergency Patient Registration</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
                        <input id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"/>
                    </div>
                    <div>
                        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"/>
                    </div>
                    <div>
                        <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <input id="date_of_birth" name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"/>
                    </div>
                    <div>
                       <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                       <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md">
                           <option>Male</option>
                           <option>Female</option>
                           <option>Other</option>
                       </select>
                   </div>
                   <div>
                       <label htmlFor="presenting_complaint" className="block text-sm font-medium text-gray-700">Presenting Complaint</label>
                       <textarea id="presenting_complaint" name="presenting_complaint" value={formData.presenting_complaint} onChange={handleChange} rows={4} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"/>
                   </div>
                   <div>
                       <button type="submit" disabled={isLoading} className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                           {isLoading ? 'Registering...' : 'Register Patient'}
                       </button>
                   </div>
                </form>
                {message && <p className="mt-4 text-center text-sm font-semibold">{message}</p>}
            </div>
        </div>
    );
}