import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PatientRegistration from './pages/PatientRegistration';
import PatientDocuments from './pages/PatientDocuments';
import PrescriptionManagement from './pages/PrescriptionManagement';
import AppointmentRequest from './pages/AppointmentRequest';
import BedManagement from './pages/BedManagement';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';
import Alerts from './pages/Alerts';
import TriageDashboard from './pages/TriageDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/request-appointment" element={<AppointmentRequest />} />


        <Route index element={<Home />} />
        <Route path="/patient-registration" element={<PatientRegistration />} />
        <Route path="/patient-documents/:patientId" element={<PatientDocuments />} />
        <Route path="/prescriptions/:patientId" element={<PrescriptionManagement />} />
        <Route path="/bed-management" element={<BedManagement />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/triage-dashboard" element={<TriageDashboard />} />


        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
