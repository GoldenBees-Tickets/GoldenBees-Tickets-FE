import { Link, Outlet, useLocation } from "react-router-dom";
import { IoQrCodeOutline, IoHomeOutline, IoLogOutOutline } from "react-icons/io5";

function RootStaff() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Main content without header */}
      <main className="container mx-auto px-4 py-4">
        {/* Simple navigation bar */}
        <div className="flex items-center justify-between mb-6 bg-gray-800 rounded-lg p-3">
          <div className="flex items-center">
            <span className="text-xl font-bold">Bees Cinema</span>
            <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded">Nhân viên</span>
          </div>
          
          <div className="flex space-x-2">
            <NavLink to="/staff" exact>
              <IoHomeOutline className="mr-1.5" />
              <span className="hidden sm:inline">Trang chủ</span>
            </NavLink>
            <NavLink to="/staff/scan-qr">
              <IoQrCodeOutline className="mr-1.5" />
              <span className="hidden sm:inline">Quét Mã QR</span>
            </NavLink>
            <button 
              onClick={() => alert('Đăng xuất')}
              className="flex items-center text-red-300 hover:text-red-200 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-all"
            >
              <IoLogOutOutline className="mr-1.5" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </div>
        </div>
        
        {/* Content area */}
        <Outlet />
      </main>
    </div>
  );
}

// Simple navigation link component
function NavLink({ children, to, exact }) {
  const location = useLocation();
  const isActive = exact 
    ? location.pathname === to
    : location.pathname.startsWith(to);
  
  return (
    <Link 
      to={to}
      className={`flex items-center px-3 py-1.5 rounded-lg transition-all ${
        isActive 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-300 hover:bg-gray-700'
      }`}
    >
      {children}
    </Link>
  );
}

export default RootStaff; 