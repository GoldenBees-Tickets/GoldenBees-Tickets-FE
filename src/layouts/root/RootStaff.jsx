import { Link, Outlet, useLocation } from "react-router-dom";
import { IoQrCodeOutline, IoHomeOutline, IoLogOutOutline, IoMenuOutline, IoCloseOutline } from "react-icons/io5";
import { useState, useEffect } from "react";

function RootStaff() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-blue-900 text-white">
      {/* Header for staff */}
      <header className="bg-black/20 border-b border-white/10 fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/staff" className="flex items-center space-x-3">
              <div className="bg-yellow-500 p-2 rounded-lg">
                <span className="text-xl">🐝</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  Bees Cinema
                </h1>
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></div>
                  <span className="text-xs text-green-300 font-medium">Nhân viên</span>
                </div>
              </div>
            </Link>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <NavLink to="/staff" exact>
                <IoHomeOutline className="mr-1.5" />
                Trang chủ
              </NavLink>
              <NavLink to="/staff/scan-qr">
                <IoQrCodeOutline className="mr-1.5" />
                Quét Mã QR
              </NavLink>
              <button 
                onClick={() => alert('Đăng xuất')}
                className="flex items-center text-red-300 hover:text-red-200 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-all"
              >
                <IoLogOutOutline className="mr-1.5" />
                Đăng xuất
              </button>
            </nav>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
              >
                {isMenuOpen ? <IoCloseOutline size={24} /> : <IoMenuOutline size={24} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/30 border-t border-white/5">
            <div className="container mx-auto px-4 py-3 space-y-2">
              <MobileNavLink to="/staff" exact>
                <IoHomeOutline className="mr-2" />
                Trang chủ
              </MobileNavLink>
              <MobileNavLink to="/staff/scan-qr">
                <IoQrCodeOutline className="mr-2" />
                Quét Mã QR
              </MobileNavLink>
              <button 
                onClick={() => alert('Đăng xuất')}
                className="flex items-center w-full text-red-300 hover:text-red-200 bg-red-500/5 hover:bg-red-500/10 px-4 py-2.5 rounded-lg transition-all"
              >
                <IoLogOutOutline className="mr-2" />
                Đăng xuất
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main content with padding for header */}
      <main className="container mx-auto px-4 py-6 pt-24">
        <Outlet />
      </main>
    </div>
  );
}

// Navigation link component with active state
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
          ? 'bg-white/15 text-white font-medium' 
          : 'text-blue-200 hover:bg-white/10 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
}

// Mobile navigation link
function MobileNavLink({ children, to, exact }) {
  const location = useLocation();
  const isActive = exact 
    ? location.pathname === to
    : location.pathname.startsWith(to);
  
  return (
    <Link 
      to={to}
      className={`flex items-center px-4 py-2.5 rounded-lg transition-all ${
        isActive 
          ? 'bg-white/15 text-white font-medium' 
          : 'text-blue-200 hover:bg-white/10 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
}

export default RootStaff; 