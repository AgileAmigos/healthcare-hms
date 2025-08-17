import { HeartPulse } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full bg-[#f1f1f1] shadow-lg font-bold z-50">
            <div className="flex justify-around items-center">
                {/* Logo / Brand */}
                <div className="text-2xl w-1/6 p-4 flex items-center">
                    <HeartPulse className="mx-1 text-red-400" size={35} />
                    Multicare HMS
                </div>

                {/* Spacer */}
                <div className="w-3/5"></div>

                {/* Navigation Links */}
                <div className="flex flex-col justify-center">
                    <ul className="flex gap-3">
                        <li className="p-2 hover:bg-gray-200 hover:text-[#FF9494] rounded-lg">
                            <Link to="/">Home</Link>
                        </li>
                        <li className="p-2 hover:bg-gray-200 hover:text-[#FF9494] rounded-lg">
                            <Link to="/doctor/opd">OPD</Link>
                        </li>
                        <li className="p-2 hover:bg-gray-200 hover:text-[#FF9494] rounded-lg">
                            <Link to="/doctor/ipd">IPD</Link>
                        </li>
                        <li className="p-2 hover:bg-gray-200 hover:text-[#FF9494] rounded-lg">
                            <Link to="/doctor/bed-management">Beds</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}