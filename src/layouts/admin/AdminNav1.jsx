import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; 
import PropTypes from 'prop-types';
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineSetting,
  AiOutlineBarChart,
  AiOutlineDown,
  AiOutlineUp,
  AiOutlineFolder,
  AiOutlineVideoCamera,
  AiOutlineStar,
  AiOutlineShop,
  AiOutlineCoffee,
  AiOutlineGift,
  AiOutlineTeam,
  AiOutlinePercentage,
  AiOutlineMessage,
  AiOutlineShopping 
} from "react-icons/ai";

const MenuItem = ({ icon: Icon, text, to, isCollapsed, isActive, onClick }) => (
  <Link 
    to={to} 
    className={`flex items-center py-3 px-4 rounded-lg hover:bg-white/10 group transition-all duration-200 relative 
      ${isActive ? 'bg-white/15' : ''}`}
    onClick={onClick}
  >
    <span className="flex items-center justify-center w-8">
      <Icon className={`text-xl ${isActive ? 'text-white' : 'text-white/80 group-hover:text-white'} transition-colors duration-200`} />
    </span>
    {!isCollapsed && (
      <span className={`ml-3 text-sm font-medium ${isActive ? 'text-white' : 'text-white/90 group-hover:text-white'} tracking-wide`}>
        {text}
      </span>
    )}
    <div className={`absolute left-0 w-1 ${isActive ? 'h-full' : 'h-0 group-hover:h-full'} bg-white rounded-r-lg transition-all duration-200`} />
  </Link>
);

MenuItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  text: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func
};

const SubMenuItem = ({ icon: Icon, text, to, isActive, onClick }) => (
  <Link 
    to={to} 
    className={`flex items-center py-2.5 px-4 rounded-lg hover:bg-white/10 group transition-all duration-200 ml-8 relative
      ${isActive ? 'bg-white/15' : ''}`}
    onClick={onClick}
  >
    <span className="flex items-center justify-center w-6">
      <Icon className={`text-lg ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white'} transition-colors duration-200`} />
    </span>
    <span className={`ml-3 text-sm font-medium ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
      {text}
    </span>
    <div className={`absolute left-0 w-1 ${isActive ? 'h-full' : 'h-0 group-hover:h-full'} bg-white/50 rounded-r-lg transition-all duration-200`} />
  </Link>
);

SubMenuItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  text: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func
};

const MenuGroup = ({ id, icon: Icon, title, children, isCollapsed, isActive }) => {
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  useEffect(() => {
    // Auto expand menu group if it contains the active route
    if (isActive && !activeSubmenu) {
      setActiveSubmenu(id);
    }
  }, [isActive, id, activeSubmenu]);

  const toggleSubmenu = (menu) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  return (
    <div className="group">
      <div
        onClick={() => toggleSubmenu(id)}
        className={`flex items-center justify-between py-3 px-4 rounded-lg hover:bg-white/10 cursor-pointer group transition-all duration-200 relative
          ${isActive || activeSubmenu === id ? 'bg-white/15' : ''}`}
      >
        <div className="flex items-center">
          <span className="flex items-center justify-center w-8">
            <Icon className={`text-xl ${isActive ? 'text-white' : 'text-white/80 group-hover:text-white'} transition-colors duration-200`} />
          </span>
          {!isCollapsed && (
            <span className={`ml-3 text-sm font-medium ${isActive ? 'text-white' : 'text-white/90 group-hover:text-white'} tracking-wide`}>
              {title}
            </span>
          )}
        </div>
        {!isCollapsed && (
          <span className="transform transition-transform duration-300">
            {activeSubmenu === id ? (
              <AiOutlineUp className="text-lg text-white/70 group-hover:text-white" />
            ) : (
              <AiOutlineDown className="text-lg text-white/70 group-hover:text-white" />
            )}
          </span>
        )}
        <div className={`absolute left-0 w-1 ${isActive || activeSubmenu === id ? 'h-full' : 'h-0 group-hover:h-full'} bg-white rounded-r-lg transition-all duration-200`} />
      </div>
      {!isCollapsed && (
        <div className={`overflow-hidden transition-all duration-300 ${
          activeSubmenu === id ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
        }`}>
          {children}
        </div>
      )}
    </div>
  );
};

export default function AdminNav1({ isCollapsed, onNavLinkClick, userRole = "admin" }) {  
  const location = useLocation();
  const currentPath = location.pathname;

  // Kiểm tra xem đường dẫn hiện tại có thuộc về nhóm menu này không
  const isPathInGroup = (paths) => {
    return paths.some(path => currentPath.includes(path));
  };

  // Kiểm tra role để hiển thị menu phù hợp
  const isAdmin = userRole === "admin"; // Full quyền
  const isBranchAdmin = userRole === "branch_admin";

  return (
    <nav className="py-4 text-white">
      <div className="space-y-2">
        <MenuItem 
          icon={AiOutlineHome} 
          text="Dashboard" 
          to="/admin" 
          isCollapsed={isCollapsed} 
          isActive={currentPath === "/admin"}
          onClick={onNavLinkClick}
        />

        {/* Chỉ admin mới thấy menu Người dùng */}
        {isAdmin && (
          <MenuGroup 
            id="users" 
            icon={AiOutlineTeam} 
            title="Người dùng" 
            isCollapsed={isCollapsed}
            isActive={isPathInGroup(["users", "branch-admins"])}
          >
            <SubMenuItem 
              icon={AiOutlineUser} 
              text="Quản trị viên" 
              to="/admin/branch-admins" 
              isActive={currentPath.includes("branch-admins")}
              onClick={onNavLinkClick}
            />
            <SubMenuItem 
              icon={AiOutlineUser} 
              text="Khách hàng" 
              to="/admin/users" 
              isActive={currentPath.includes("users")}
              onClick={onNavLinkClick}
            />
          </MenuGroup>
        )}

        <MenuGroup 
          id="movies" 
          icon={AiOutlineVideoCamera} 
          title="Phim" 
          isCollapsed={isCollapsed}
          isActive={isPathInGroup(["movies", "genre", "actors", "directors", "producers"])}
        >
          <SubMenuItem 
            icon={AiOutlineFolder} 
            text="Thể loại phim" 
            to="/admin/genre" 
            isActive={currentPath.includes("genre")}
            onClick={onNavLinkClick}
          />
          <SubMenuItem 
            icon={AiOutlineVideoCamera} 
            text="Phim" 
            to="/admin/movies" 
            isActive={currentPath === "/admin/movies" || currentPath.includes("/admin/movies/")}
            onClick={onNavLinkClick}
          />
          <SubMenuItem 
            icon={AiOutlineStar} 
            text="Diễn viên" 
            to="/admin/actors" 
            isActive={currentPath.includes("actors")}
            onClick={onNavLinkClick}
          />
          <SubMenuItem 
            icon={AiOutlineVideoCamera} 
            text="Đạo diễn" 
            to="/admin/directors" 
            isActive={currentPath.includes("directors")}
            onClick={onNavLinkClick}
          />
          <SubMenuItem 
            icon={AiOutlineUser} 
            text="Nhà sản xuất" 
            to="/admin/producers" 
            isActive={currentPath.includes("producers")}
            onClick={onNavLinkClick}
          />
        </MenuGroup>

        <MenuGroup 
          id="branches" 
          icon={AiOutlineShop} 
          title="Chi nhánh" 
          isCollapsed={isCollapsed}
          isActive={isPathInGroup(["branches", "cinemas", "seat-types", "rooms", "showtimes"])}
        >
          {/* Chỉ admin mới thấy Chi nhánh */}
          {isAdmin && (
            <SubMenuItem 
              icon={AiOutlineShop} 
              text="Chi nhánh" 
              to="/admin/branches" 
              isActive={currentPath.includes("branches")}
              onClick={onNavLinkClick}
            />
          )}
          <SubMenuItem 
            icon={AiOutlineVideoCamera} 
            text="Rạp phim" 
            to="/admin/cinemas" 
            isActive={currentPath.includes("cinemas")}
            onClick={onNavLinkClick}
          />
          {/* Chỉ admin mới thấy Loại ghế */}
          {isAdmin && (
            <SubMenuItem 
              icon={AiOutlineStar} 
              text="Loại ghế" 
              to="/admin/seat-types" 
              isActive={currentPath.includes("seat-types")}
              onClick={onNavLinkClick}
            />
          )}
          <SubMenuItem 
            icon={AiOutlineVideoCamera} 
            text="Phòng chiếu" 
            to="/admin/rooms" 
            isActive={currentPath.includes("rooms")}
            onClick={onNavLinkClick}
          />
          <SubMenuItem 
            icon={AiOutlineBarChart} 
            text="Suất chiếu" 
            to="/admin/showtimes" 
            isActive={currentPath.includes("showtimes")}
            onClick={onNavLinkClick}
          />
        </MenuGroup>

        <MenuGroup 
          id="food" 
          icon={AiOutlineCoffee} 
          title="Món ăn" 
          isCollapsed={isCollapsed}
          isActive={isPathInGroup(["food&drink", "combo"])}
        >
          <SubMenuItem 
            icon={AiOutlineCoffee} 
            text="Món ăn lẻ" 
            to="/admin/food&drink" 
            isActive={currentPath.includes("food&drink")}
            onClick={onNavLinkClick}
          />
          <SubMenuItem 
            icon={AiOutlineGift} 
            text="Combo" 
            to="/admin/combo" 
            isActive={currentPath.includes("combo")}
            onClick={onNavLinkClick}
          />
        </MenuGroup>

        <MenuGroup 
          id="promotions" 
          icon={AiOutlinePercentage} 
          title="Khuyến mãi" 
          isCollapsed={isCollapsed}
          isActive={isPathInGroup(["promotions"])}
        >
          <SubMenuItem 
            icon={AiOutlinePercentage} 
            text="Mã giảm giá" 
            to="/admin/promotions" 
            isActive={currentPath.includes("promotions")}
            onClick={onNavLinkClick}
          />
        </MenuGroup>

        <MenuItem 
          icon={AiOutlineShopping} 
          text="Đơn hàng" 
          to="orders" 
          isCollapsed={isCollapsed} 
          isActive={currentPath.includes("orders")}
          onClick={onNavLinkClick}
        />

        <MenuItem 
          icon={AiOutlineMessage} 
          text="Quét mã QR" 
          to="/staff/scan-qr" 
          isCollapsed={isCollapsed} 
          isActive={currentPath.includes("scan-qr")}
          onClick={onNavLinkClick}
        />

        <MenuItem 
          icon={AiOutlineSetting} 
          text="Cài đặt" 
          to="/admin/settings" 
          isCollapsed={isCollapsed} 
          isActive={currentPath.includes("settings")}
          onClick={onNavLinkClick}
        />
      </div>
    </nav>
  );
}