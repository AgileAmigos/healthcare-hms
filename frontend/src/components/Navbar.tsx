import { useState, useRef, useEffect } from "react";
import { HeartPulse } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  // Close the dropdown if the user clicks outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <nav className="fixed top-0 w-full bg-[#f1f1f1] shadow-lg font-bold z-50">
      <div className="flex justify-around items-center">
        
        <div className="text-2xl w-1/6 p-4 flex items-center">
          <HeartPulse className="mx-1 text-red-400" size={35} />
          Multicare HMS
        </div>

        
        <div className="w-3/5"></div>

        
        <div className="flex flex-col justify-center">
          <ul className="flex items-center gap-3">
            
            <li className="p-2 hover:bg-gray-200 hover:text-[#FF9494] rounded-lg">
              <Link to="/">Home</Link>
            </li>

            
            <li className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                className="p-2 flex items-center hover:bg-gray-200 hover:text-[#FF9494] rounded-lg focus:outline-none"
              >
                Menu
                <svg
                  className={`w-4 h-4 ml-2 transition-transform duration-200 ${isDropdownOpen ? "transform rotate-180" : ""
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>

             
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl py-1 text-gray-800 text-base font-medium">
                 
                  <Link
                    to="/doctor/opd"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    OPD
                  </Link>
                  <Link
                    to="/doctor/ipd"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    IPD
                  </Link>
                  <Link
                    to="/doctor/bed-management"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Beds
                  </Link>

                  
                  <div className="my-1 border-t border-gray-200"></div>

                  
                  <Link
                    to="/register"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Emergency
                  </Link>
                  <Link
                    to="/triage"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Triage Dashboard
                  </Link>
                  <Link
                    to="/alerts"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Alerts
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}