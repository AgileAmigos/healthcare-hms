import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';



function App() {
  
  const isAdminRoute = useLocation().pathname.startsWith("/admin")
  return (
    <>
      {!isAdminRoute && <Navbar />}
      
      <Routes>
          <Route path='/' element={<Home/>}/>
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  )
}

export default App