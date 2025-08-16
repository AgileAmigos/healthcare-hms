// frontend/src/components/Navbar.tsx
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full bg-[#FF9494] text-white font-bold shadow-md z-10">
            <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
                <Link to="/" className="text-2xl">Multicare HMS</Link>
                <div className="flex items-center space-x-6 text-lg">
                    <Link to="/register" className="hover:text-gray-200">Emergency</Link>
                    <Link to="/triage" className="hover:text-gray-200">Triage Dashboard</Link>
                    <Link to="/alerts" className="hover:text-gray-200">Alerts</Link>
                </div>
            </div>
        </nav>
    );
}