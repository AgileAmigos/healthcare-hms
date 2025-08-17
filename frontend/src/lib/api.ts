import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000", // FastAPI backend
});

// OPD
export const fetchOPDPatients = async (date: string) => {
    const res = await api.get(`/patients/opd?date_filter=${date}`);
    return res.data;
};

// IPD
export const fetchIPDPatients = async () => {
    const res = await api.get(`/patients/ipd`);
    return res.data;
};

export const dischargePatient = async (admissionId: number) => {
    const res = await api.post(`/patients/ipd/${admissionId}/discharge`);
    return res.data;
};

export const transferPatient = async (admissionId: number, deptId: number) => {
    const res = await api.post(`/patients/ipd/${admissionId}/transfer?new_department_id=${deptId}`);
    return res.data;
};