import React from "react";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
export default function Navbar() {
    const navigate = useNavigate();
  return (
    <nav className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* logo */}
        <Link to="/" className="text-5xl font-bold text-orange-500">Smart_Learn</Link>

        {/* nav links */}
        <ul className="flex gap-8">
          <li><a href="#" className="hover:text-orange-400">Home</a></li>
          <li><a href="#about" className="hover:text-orange-400">About</a></li>
          <li><a href="#" className="hover:text-orange-400">Service</a></li>
          <li><a href="#" className="hover:text-orange-400">Feature</a></li>
          <li><a href="#" className="hover:text-orange-400">Contact</a></li>
          <li>
            <button
              onClick={() => navigate("/login")}
              className="bg-orange-500 text-white rounded-full px-4 py-2 hover:bg-orange-600">
            
              Login
            </button>
            </li>
        </ul>
      </div>
    </nav>
  );
}
