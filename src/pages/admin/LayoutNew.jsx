// AdminLayout.jsx
import React, { useState, useEffect } from "react";
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineSetting,
  AiOutlineBarChart,
  AiOutlineMore,
} from "react-icons/ai";

// Giả lập user login
const mockUser = {
  name: "John Doe",
  role: "Administrator",
  avatarUrl: "https://i.pravatar.cc/100",
};

export default function AdminLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Tự động collapse sidebar khi kích thước màn hình nhỏ (< 640px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="min-h-screen flex bg-gray-900 text-gray-200">
      {/* Sidebar */}
      <div
        className={`
          bg-gray-800 p-4 transition-all duration-300 
          sticky top-0 overflow-y-auto hide-scrollbar h-screen
          ${isCollapsed ? "w-[60px]" : "w-[60%] sm:w-[40%] lg:w-[20%]"}
        `}
      >
        {/* Nút Toggle */}
        <button
          onClick={toggleSidebar}
          className="bg-gray-700 hover:bg-gray-600 text-sm w-full py-1 rounded mb-6"
        >
          {isCollapsed ? ">>" : "<<"}
        </button>

        {/* Thông tin User */}
        {!isCollapsed && (
          <div className="flex items-center mb-8">
            <img
              src={mockUser.avatarUrl}
              alt="User Avatar"
              className="w-12 h-12 rounded-full mr-3 border-2 border-gray-600"
            />
            <div>
              <p className="font-bold text-lg">{mockUser.name}</p>
              <p className="text-xs text-gray-400">{mockUser.role}</p>
            </div>
          </div>
        )}

        {/* Menu */}
        <nav>
          <ul className="space-y-2">
            <li className="flex items-center py-2 px-2 rounded hover:bg-gray-700 cursor-pointer">
              <AiOutlineHome className="text-xl mr-2" />
              {!isCollapsed && <span className="text-sm font-medium">Dashboard</span>}
            </li>
            <li className="flex items-center py-2 px-2 rounded hover:bg-gray-700 cursor-pointer">
              <AiOutlineUser className="text-xl mr-2" />
              {!isCollapsed && <span className="text-sm font-medium">Users</span>}
            </li>
            <li className="flex items-center py-2 px-2 rounded hover:bg-gray-700 cursor-pointer">
              <AiOutlineSetting className="text-xl mr-2" />
              {!isCollapsed && <span className="text-sm font-medium">Settings</span>}
            </li>
            <li className="flex items-center py-2 px-2 rounded hover:bg-gray-700 cursor-pointer">
              <AiOutlineBarChart className="text-xl mr-2" />
              {!isCollapsed && <span className="text-sm font-medium">Reports</span>}
            </li>
            <li className="flex items-center py-2 px-2 rounded hover:bg-gray-700 cursor-pointer">
              <AiOutlineMore className="text-xl mr-2" />
              {!isCollapsed && <span className="text-sm font-medium">More</span>}
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div
        className="flex-1 p-6 overflow-y-auto transition-all duration-300"
        style={{ marginLeft: isCollapsed ? "60px" : undefined }}
      >
        {/* Header */}
        <header className="mb-6 flex items-center justify-between border-b border-gray-700 pb-4">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button className="bg-gray-700 hover:bg-gray-600 text-sm px-4 py-2 rounded">
            Logout
          </button>
        </header>

        {/* Nội dung con */}
        <section>


            
        </section>
      </div>
    </div>
  );
}
