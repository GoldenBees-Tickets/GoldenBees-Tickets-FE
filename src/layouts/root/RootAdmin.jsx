import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminNav1 from "../admin/AdminNav1";
import AdminNav from "../admin/AdminNav";

export default function RootAdmin() {
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div
        className={`bg-[#0c4da2] transition-all duration-300 
          sticky top-0 overflow-y-auto hide-scrollbar h-screen shadow-xl
          ${isCollapsed ? "w-[70px]" : "w-[280px]"}`}
      >
        <div className="p-4">
          <button
            onClick={toggleSidebar}
            className="bg-white/10 hover:bg-white/20 text-white rounded-lg w-full py-2 mb-6 flex items-center justify-center transition-all duration-300"
          >
            <span className={`transform ${isCollapsed ? "rotate-180" : ""}`}>
              {isCollapsed ? "→" : "←"}
            </span>
          </button>

          <AdminNav1 isCollapsed={isCollapsed} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 transition-all duration-300">
        {/* Header */}
        <div className="bg-white shadow-md sticky top-0 z-10 border-b border-gray-200">
          <AdminNav />
        </div>

        {/* Content Area */}
        <div className="p-4 mx-auto max-w-7xl">
          <div className="space-y-6">
            {/* Content Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-0">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}