// frontend/src/pages/Register.tsx
import React, { useState } from 'react';
import { registerPatient } from '../services/api';
import type { PatientCreate } from '../services/api';

export default function Register() {
    const [formData, setFormData] = useState<PatientCreate>({
        full_name: '',
        age: 0,
        gender: 'Other',
        presenting_complaint: '',
    });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setMessage('');
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'age' ? parseInt(value, 10) || 0 : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        try {
            const result = await registerPatient(formData);
            setMessage(`Success! Patient "${result.full_name}" registered with ID ${result.id}.`);
            setFormData({ full_name: '', age: 0, gender: 'Other', presenting_complaint: '' });
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
                    {/* Form inputs go here (same JSX as before) */}
                    <div>
                        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"/>
                    </div>
                    <div>
                        <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                        <input id="age" name="age" type="number" value={formData.age} onChange={handleChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"/>
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
                       <textarea id="presenting_complaint" name="presenting_complaint" value={formData.presenting_complaint} onChange={handleChange} required rows={4} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"/>
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