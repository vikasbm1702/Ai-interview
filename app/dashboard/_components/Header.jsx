import { UserButton } from "@clerk/nextjs";
import React from "react";

function Header() {
  return (
    <header className="bg-white w-full shadow-md">
      {/* Top Notification Bar */}
      <div className="bg-blue-600 text-white text-sm text-center py-2">
        AI Mock Interview – Your Gateway to Success!
      </div>

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4">
        {/* Logo */}
        <div>
          <img src="/logo.svg" alt="AI Mock Interview Logo" className="h-10" />
        </div>

        {/* Navigation Links */}
        <ul className="hidden md:flex gap-8">
          <li>
            <a
              href="/dashboard"
              className="text-blue-600 font-semibold hover:text-blue-800 transition-colors border-b-2 border-transparent hover:border-blue-600"
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="#home"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#help"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Help
            </a>
          </li>
          <li>
            <a
              href="#how-it-works"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              How It Works
            </a>
          </li>
        </ul>

        {/* User Button */}
        <UserButton />
      </nav>
    </header>
  );
}

export default Header;
