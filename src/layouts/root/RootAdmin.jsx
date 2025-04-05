import { useState, useEffect, useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AdminNav1 from "../admin/AdminNav1";
import AdminNav from "../admin/AdminNav";
import { useGetUserQuery } from "@/api/userApi";
import { authEvents } from "@/utils/authEventBus.js";

export default function RootAdmin() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    authEvents.onUnauthorized = () => {
      navigate("/login");
    };
    authEvents.onForbidden = () => {
      navigate("/permission-denied-page");
    };

    // Cleanup nếu cần (tránh lỗi khi unmount)
    return () => {
      authEvents.onUnauthorized = null;
      authEvents.onForbidden = null;
    };
  }, [navigate]);

  const accessToken = localStorage.getItem("accessToken");
    const dataStorage = useMemo(
      () => JSON.parse(localStorage.getItem("user") || "{}"),
      []
    );
    const id = dataStorage?.id;
  
    const { data: userData, error, isLoading } = useGetUserQuery(id, {
      skip: !accessToken, // Bỏ qua query nếu không có token
    });
  
    const user = useMemo(() => userData?.user || userData, [userData]);
  
  const userRole = user?.role || "admin"; // Default to admin if role not found
  
  // Đóng sidebar khi chuyển trang trên mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarVisible(false);
    }
  }, [location.pathname, isMobile]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Auto-collapse sidebar on small screens
      if (mobile) {
        setIsCollapsed(true);
        // Hide sidebar completely on initial mobile load
        if (window.innerWidth < 640) {
          setSidebarVisible(false);
        }
      } else {
        setIsCollapsed(window.innerWidth < 1024);
        setSidebarVisible(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle body class when sidebar is open on mobile
  useEffect(() => {
    if (isMobile && sidebarVisible) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
    
    // Cleanup function
    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, [isMobile, sidebarVisible]);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarVisible(!sidebarVisible);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  // Đóng sidebar khi click vào route 
  const handleNavLinkClick = () => {
    if (isMobile) {
      setSidebarVisible(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && sidebarVisible && (
        <div 
          className="fixed inset-0 bg-black/50 z-40" 
          onClick={() => setSidebarVisible(false)}
        ></div>
      )}

      {/* Sidebar Container */}
      <div
        id="admin-sidebar"
        className={`bg-[#0c4da2] transition-all duration-300 z-50 overflow-hidden
          fixed top-0 left-0 bottom-0 h-screen
          ${isMobile && sidebarVisible ? "w-[280px]" : (isCollapsed ? "w-[70px]" : "w-[280px]")}
          ${isMobile && !sidebarVisible ? "-translate-x-full" : "translate-x-0"}
        `}
      >
        {/* Scrollable content container */}
        <div className="h-full overflow-y-auto pb-20 sidebar-scroll">
          <div className="p-4 sticky top-0 bg-[#0c4da2] z-10">
            <button
              onClick={toggleSidebar}
              className="bg-white/10 hover:bg-white/20 text-white rounded-lg w-full py-2 mb-6 flex items-center justify-center transition-all duration-300"
            >
              <span className={`transform ${isCollapsed && !isMobile ? "rotate-180" : ""}`}>
                {isCollapsed && !isMobile ? "→" : "←"}
              </span>
            </button>
          </div>

          <div className="px-4">
            <AdminNav1 
              isCollapsed={isMobile ? false : isCollapsed} 
              onNavLinkClick={handleNavLinkClick}
              userRole={userRole}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div 
        className={`flex-1 transition-all duration-300 w-full 
          ${!isMobile && isCollapsed ? "md:pl-[70px]" : (!isMobile ? "md:pl-[280px]" : "")}
        `}
      >
        {/* Header */}
        <div className="bg-white shadow-md sticky top-0 z-10 border-b border-gray-200">
          <div className="flex items-center px-4 py-2">
            {/* Mobile menu toggle */}
            {isMobile && (
              <button 
                onClick={() => setSidebarVisible(!sidebarVisible)}
                className="mr-2 p-2 text-gray-600"
              >
                ☰
              </button>
            )}
            <AdminNav />
          </div>
        </div>

        {/* Content Area */}
        <div className="p-2 sm:p-4 w-full overflow-x-hidden">
          <div className="space-y-4 sm:space-y-6 max-w-full">
            {/* Content Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-0 overflow-hidden">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}