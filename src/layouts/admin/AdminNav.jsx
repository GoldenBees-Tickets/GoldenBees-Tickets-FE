import { useState } from "react";
import AccountDropdown from "../AccountDropdown";
import { IoNotifications, IoSearch, IoMenu, IoSettings } from "react-icons/io5";

export default function AdminNav() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <nav className="w-full">
      <div className="px-2 sm:px-4 md:px-6 lg:px-8 py-2 md:py-4">
        <div className="flex items-center justify-between w-full">
          {/* Left side - Title for desktop */}
          <div className="hidden md:block text-lg font-semibold text-gray-700">
            Golden Bees Admin
          </div>

          {/* Middle - Search bar (responsive) */}
          <div className={`${showSearch ? 'absolute top-full left-0 right-0 p-2 bg-white shadow-md z-20' : 'relative'} flex-1 md:flex-initial md:mx-4`}>
            <div className={`relative ${showSearch ? 'flex w-full' : 'hidden md:flex'}`}>
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="bg-gray-100 text-gray-800 placeholder-gray-400 border border-gray-200 rounded-lg 
                  px-4 pl-10 py-2 w-full md:w-60 lg:w-72 focus:ring-2 focus:ring-[#0c4da2] focus:border-[#0c4da2] 
                  focus:outline-none transition-all duration-200"
              />
              <IoSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6">
            {/* Search toggle for mobile */}
            <button 
              className="md:hidden text-gray-600 hover:text-[#0c4da2] transition-colors duration-200 p-1"
              onClick={() => setShowSearch(!showSearch)}
            >
              <IoSearch size={22} />
            </button>

            {/* Settings - Hide on small mobile */}
            <button className="hidden sm:block text-gray-600 hover:text-[#0c4da2] transition-colors duration-200 p-1">
              <IoSettings size={22} />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button className="relative text-gray-600 hover:text-[#0c4da2] transition-colors duration-200 p-1">
                <IoNotifications size={22} />
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
