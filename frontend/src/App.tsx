import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import OPDList from "./pages/doctor/OPDList";
import IPDList from "./pages/doctor/IPDList";
import BedManagement from "./pages/doctor/BedManagement";

function App() {
  const isAdminRoute = useLocation().pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctor/opd" element={<OPDList />} />
        <Route path="/doctor/ipd" element={<IPDList />} />
        <Route path="/doctor/bed-management" element={<BedManagement />} />
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;
