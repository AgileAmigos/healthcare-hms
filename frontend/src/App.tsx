import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Prescription from './pages/Prescription';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
// import Register from './pages/Register';



function App() {
  
  const isAdminRoute = useLocation().pathname.startsWith("/admin")
  return (
    <>
      {!isAdminRoute && <Navbar />}
      
      <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/prescription' element={<Prescription />} />
          {/* <Route path='/register' element={<Register/>}/> */}
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  )
}

export default App