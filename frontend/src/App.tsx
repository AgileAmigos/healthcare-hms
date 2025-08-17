import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/EmergencyRegister';
import TriageDashboard from './pages/TriageDashboard'; 
import Alerts from './pages/Alerts'; 
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import OPDList from "./pages/doctor/OPDList";
import IPDList from "./pages/doctor/IPDList";
import BedManagement from "./pages/doctor/BedManagement";

function App() {
  const isAdminRoute = useLocation().pathname.startsWith("/admin");
  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow pt-20">
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/doctor/opd" element={<OPDList />} />
            <Route path="/doctor/ipd" element={<IPDList />} />
            <Route path="/doctor/bed-management" element={<BedManagement />} />
            <Route path='/register' element={<Register />} />
            <Route path='/triage' element={<TriageDashboard />} />
            <Route path='/alerts' element={<Alerts />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}
export default App;
