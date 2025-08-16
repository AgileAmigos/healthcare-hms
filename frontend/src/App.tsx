// frontend/src/App.tsx
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/EmergencyRegister';
import TriageDashboard from './pages/TriageDashboard'; // New
import Alerts from './pages/Alerts'; // New
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  const isAdminRoute = useLocation().pathname.startsWith("/admin");
  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow pt-20"> {/* Padding to prevent content from hiding under Navbar */}
        <Routes>
            <Route path='/' element={<Home />} />
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