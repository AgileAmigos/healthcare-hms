import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import { Check, X, Calendar, Loader2 } from 'lucide-react';

interface Patient {
    patient_id: number;
    full_name: string;
}

interface Appointment {
    appointment_id: number;
    appointment_date: string;
    reason: string | null;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    patient: Patient;
}

const AppointmentManagement = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAppointments = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get('/appointments/');
            setAppointments(response.data);
        } catch (err) {
            setError('Failed to fetch appointments.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleUpdateStatus = async (appointmentId: number, newStatus: 'confirmed' | 'cancelled') => {
        try {
            await apiClient.put(`/appointments/${appointmentId}/status`, { status: newStatus });
            // Update the state locally for an immediate UI response
            setAppointments(prev =>
                prev.map(app =>
                    app.appointment_id === appointmentId ? { ...app, status: newStatus } : app
                )
            );
        } catch (err) {
            alert('Failed to update appointment status.');
            console.error(err);
        }
    };

    const getStatusColor = (status: Appointment['status']) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) {
        return <div className="text-center p-10 flex items-center justify-center gap-2"><Loader2 className="animate-spin" />Loading appointments...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-500">{error}</div>;
    }

    return (
        <div className="p-4 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Appointment Management</h1>
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {appointments.map(app => (
                            <tr key={app.appointment_id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.patient.full_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(app.appointment_date).toLocaleString()}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{app.reason}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                    <span className={`px-3 py-1 font-semibold rounded-full capitalize ${getStatusColor(app.status)}`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                    {app.status === 'pending' && (
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleUpdateStatus(app.appointment_id, 'confirmed')}
                                                className="p-2 text-green-600 bg-green-100 rounded-full hover:bg-green-200 transition-colors"
                                                title="Confirm"
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(app.appointment_id, 'cancelled')}
                                                className="p-2 text-red-600 bg-red-100 rounded-full hover:bg-red-200 transition-colors"
                                                title="Cancel"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AppointmentManagement;
