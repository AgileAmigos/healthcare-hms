import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Stethoscope, UserPlus } from 'lucide-react';

const Layout = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-red-200 flex flex-col">
      {/* Navigation Bar */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <nav className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">

            <Link to="/" className="flex items-center space-x-2">
              <Stethoscope className="h-8 w-8 text-red-600" />
              <span className="text-2xl font-bold text-gray-800">Multicare HMS</span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-700 hidden sm:block">
                    Welcome, {user?.full_name || user?.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    aria-label="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 shadow-sm hover:shadow-md transition-all"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>


      <main className="flex-grow container mx-auto p-6">
        <Outlet />
      </main>


      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto px-6 py-4 text-center text-gray-500">
          &copy; {new Date().getFullYear()} Hospital Management System. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;