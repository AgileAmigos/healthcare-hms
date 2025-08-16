import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full bg-[#FF9494] text-white font-bold shadow">
            <div className="flex justify-between items-center px-6 py-3">
                {/* Logo / Brand */}
                <div className="text-2xl">Multicare HMS</div>

                {/* Navigation Links */}
                <div className="flex gap-6">
                    <Link to="/" className="hover:underline">
                        Home
                    </Link>
                    <Link to="/doctor/opd" className="hover:underline">
                        OPD
                    </Link>
                    <Link to="/doctor/ipd" className="hover:underline">
                        IPD
                    </Link>
                    <Link to="/doctor/bed-management" className="hover:underline">
                        Beds
                    </Link>
                </div>
            </div>
        </nav>
    );
}
