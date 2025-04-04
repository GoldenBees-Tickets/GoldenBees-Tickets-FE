import { useState } from "react";
import AccountDropdown from "../AccountDropdown";
import { IoNotifications, IoSearch, IoMenu, IoSettings } from "react-icons/io5";

export default function AdminNav() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <nav className="w-full">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center space-x-6">
            <button className="text-gray-600 hover:text-[#0c4da2] lg:hidden transition-colors duration-200">
              <IoMenu size={24} />
            </button>
            <div className={`relative ${showSearch ? 'flex' : 'hidden md:flex'}`}>
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="bg-gray-100 text-gray-800 placeholder-gray-400 border border-gray-200 rounded-lg px-4 pl-10 py-2 w-72 focus:ring-2 focus:ring-[#0c4da2] focus:border-[#0c4da2] focus:outline-none transition-all duration-200"
              />
              <IoSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-6">
            {/* Search toggle for mobile */}
            <button 
              className="md:hidden text-gray-600 hover:text-[#0c4da2] transition-colors duration-200"
              onClick={() => setShowSearch(!showSearch)}
            >
              <IoSearch size={24} />
            </button>

            {/* Settings */}
            <button className="text-gray-600 hover:text-[#0c4da2] transition-colors duration-200">
              <IoSettings size={24} />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button className="relative text-gray-600 hover:text-[#0c4da2] transition-colors duration-200">
                <IoNotifications size={24} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  3
                </span>
              </button>
            </div>

            {/* Account Dropdown */}
            <div className="flex items-center">
              <AccountDropdown />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
