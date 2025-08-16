import { HeartPulse } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-[#f1f1f1] shadow-lg font-bold">
      <div className="flex justify-around">
        <div className="text-2xl w-1/6 p-4 flex">
          <HeartPulse className="mx-1 text-red-400" size={35} />
          Multicare HMS
        </div>
        <div className="w-3/5"></div>
        <div className="flex flex-col justify-center">
          <ul className="flex gap-3">
            <li className="p-2 hover:bg-gray-200 hover:text-[#FF9494] rounded-lg"><Link to={'/'}>Home</Link></li>
            <li className="p-2 hover:bg-gray-200 hover:text-[#FF9494] rounded-lg"><Link to={'/register'}>Register</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
