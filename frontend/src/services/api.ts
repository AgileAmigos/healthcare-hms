// frontend/src/services/api.ts
const API_BASE_URL = "http://localhost:8000/api";

// A type for our Patient data for better type-safety
export interface Patient {
    id: number;
    full_name: string;
    age: number;
    gender: string;
    presenting_complaint: string;
    triage_level: string | null;
}

// A type for the data needed to create a patient
export type PatientCreate = Omit<Patient, 'id' | 'triage_level'>;


/**
 * Fetches all patients from the backend.
 */
export const getPatients = async (): Promise<Patient[]> => {
    const response = await fetch(`${API_BASE_URL}/patients`);
    if (!response.ok) {
        throw new Error('Failed to fetch patients');
    }
    return response.json();
};

/**
 * Registers a new patient.
 * @param patientData The data for the new patient.
 */
export const registerPatient = async (patientData: PatientCreate): Promise<Patient> => {
    const response = await fetch(`${API_BASE_URL}/patients/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData),
    });
    if (!response.ok) {
        throw new Error('Failed to register patient');
    }
    return response.json();
};

/**
 * Updates the triage level for a specific patient.
 * @param patientId The ID of the patient to update.
 * @param triageLevel The new triage level.
 */
export const updateTriageLevel = async (patientId: number, triageLevel: string): Promise<Patient> => {
    const response = await fetch(`${API_BASE_URL}/patients/${patientId}/triage`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ triage_level: triageLevel }),
    });
    if (!response.ok) {
        throw new Error('Failed to update triage level');
    }
    return response.json();
};


/**
 * Fetches patients with high-priority alerts.
 */
export const getHighPriorityAlerts = async (): Promise<Patient[]> => {
    const response = await fetch(`${API_BASE_URL}/alerts/high-priority`);
    if (!response.ok) {
        throw new Error('Failed to fetch alerts');
    }
    return response.json();
};