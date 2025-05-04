import { useState } from "react";
import AccountDropdown from "../AccountDropdown";
import { IoNotifications, IoSearch, IoMenu, IoSettings } from "react-icons/io5";
import { Link } from "react-router-dom";

export default function AdminNav() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <nav className="w-full">
      <div className="px-2 sm:px-4 md:px-6 lg:px-8 py-2 md:py-4">
        <div className="flex items-center justify-between w-full">
          {/* Left side - Title for desktop */}
          <div className="hidden md:block text-lg font-semibold text-gray-700">
           <Link to="/">Golden Bees</Link>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6">
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
