import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGetUserQuery } from "../api/userApi";
import { formatImage } from "@/utils/formatImage";

export default function AccountDropdown() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const accessToken = localStorage.getItem("accessToken");
  const dataStorage = useMemo(
    () => JSON.parse(localStorage.getItem("user") || "{}"),
    []
  );
  const id = dataStorage?.id;

  const { data: user, error, isLoading } = useGetUserQuery(id, {
    skip: !accessToken, // Bỏ qua query nếu không có token
  });

  const userData = useMemo(() => user?.user || user, [user]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/login");
  }, [navigate]);
  
  if (!accessToken || error?.status === 401) {
    return (
      <button
        onClick={() => navigate("/login")}
        className="px-4 py-2 text-white bg-yellow-500 hover:bg-yellow-600 rounded-full shadow-md transition-all duration-300 font-medium"
      >
        Đăng Nhập
      </button>
    );
  }

  if (isLoading) return (
    <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
  );

  // Lấy chữ cái đầu tiên của tên người dùng
  const userInitial = userData?.username?.charAt(0).toUpperCase() || "U";

  return (
    <div
      className="relative inline-block select-none"
      ref={dropdownRef}
    >
      {/* Avatar button */}
      <button 
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center space-x-2 focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="relative flex items-center">
          {userData?.image ? (
            <img
              src={formatImage(userData?.image)}
              alt={userData?.username || "User"}
              className="w-9 h-9 rounded-full object-cover border-2 border-yellow-400"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-semibold shadow-md">
              {userInitial}
            </div>
          )}
          
          {/* Dropdown arrow */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-4 w-4 ml-1 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 w-72 mt-2 z-50 origin-top-right bg-white border border-gray-100 rounded-xl shadow-lg py-1 focus:outline-none transform transition-all duration-200 ease-out scale-100 opacity-100">
          {/* User info section */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center">
              {userData?.image ? (
                <img
                  src={formatImage(userData?.image)}
                  alt={userData?.username || "User"}
                  className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                  {userInitial}
                </div>
              )}
              
              <div className="ml-3">
                <p className="font-medium text-gray-800">{userData?.username}</p>
                <p className="text-xs text-gray-500 truncate max-w-[180px]">{userData?.email}</p>
              </div>
            </div>
          </div>
          
          {/* Menu items */}
          <div className="py-1">
            {userData?.role === "user" ? (
              <>
                <Link
                  to="/account"
                  className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Thông tin tài khoản
                </Link>
                <Link
                  to="/my-orders"
                  className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Đơn hàng của tôi
                </Link>
              </>
            ) : (
              <Link
                to="/admin"
                className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Quản lý hệ thống
              </Link>
            )}
          </div>
          
          {/* Sign out button */}
          <div className="border-t border-gray-100 mt-1">
            <button
              onClick={handleLogout}
              className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
