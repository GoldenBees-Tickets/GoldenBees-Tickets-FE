import { useState } from "react";
import { Link } from "react-router-dom"; 
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
  AiOutlineMessage
} from "react-icons/ai";

const MenuItem = ({ icon: Icon, text, to, isCollapsed }) => (
  <Link 
    to={to} 
    className="flex items-center py-3 px-4 rounded-lg hover:bg-white/10 group transition-all duration-200 relative"
  >
    <span className="flex items-center justify-center w-8">
      <Icon className="text-xl text-white/80 group-hover:text-white transition-colors duration-200" />
    </span>
    {!isCollapsed && (
      <span className="ml-3 text-sm font-medium text-white/90 group-hover:text-white tracking-wide">
        {text}
      </span>
    )}
    <div className="absolute left-0 w-1 h-0 bg-white rounded-r-lg group-hover:h-full transition-all duration-200" />
  </Link>
);

MenuItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  text: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  isCollapsed: PropTypes.bool.isRequired
};

const SubMenuItem = ({ icon: Icon, text, to }) => (
  <Link 
    to={to} 
    className="flex items-center py-2.5 px-4 rounded-lg hover:bg-white/10 group transition-all duration-200 ml-8 relative"
  >
    <span className="flex items-center justify-center w-6">
      <Icon className="text-lg text-white/70 group-hover:text-white transition-colors duration-200" />
    </span>
    <span className="ml-3 text-sm font-medium text-white/70 group-hover:text-white">
      {text}
    </span>
    <div className="absolute left-0 w-1 h-0 bg-white/50 rounded-r-lg group-hover:h-full transition-all duration-200" />
  </Link>
);

SubMenuItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  text: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired
};

const MenuGroup = ({ id, icon: Icon, title, children, isCollapsed }) => {
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const toggleSubmenu = (menu) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  return (
    <div className="group">
      <div
        onClick={() => toggleSubmenu(id)}
        className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-white/10 cursor-pointer group transition-all duration-200 relative"
      >
        <div className="flex items-center">
          <span className="flex items-center justify-center w-8">
            <Icon className="text-xl text-white/80 group-hover:text-white transition-colors duration-200" />
          </span>
          {!isCollapsed && (
            <span className="ml-3 text-sm font-medium text-white/90 group-hover:text-white tracking-wide uppercase">
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
        <div className="absolute left-0 w-1 h-0 bg-white rounded-r-lg group-hover:h-full transition-all duration-200" />
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

MenuGroup.propTypes = {
  id: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  isCollapsed: PropTypes.bool.isRequired
};

export default function AdminNav1({ isCollapsed }) {  
  return (
    <nav className="py-4 text-white">
      <div className="space-y-2">
        <MenuItem icon={AiOutlineHome} text="Dashboard" to="/admin" isCollapsed={isCollapsed} />

        <MenuGroup id="users" icon={AiOutlineTeam} title="Người dùng" isCollapsed={isCollapsed}>
          <SubMenuItem icon={AiOutlineUser} text="Quản trị viên" to="branch-admins" />
          <SubMenuItem icon={AiOutlineUser} text="Khách hàng" to="users" />
        </MenuGroup>

        <MenuGroup id="movies" icon={AiOutlineVideoCamera} title="Phim" isCollapsed={isCollapsed}>
          <SubMenuItem icon={AiOutlineFolder} text="Thể loại phim" to="genre" />
          <SubMenuItem icon={AiOutlineVideoCamera} text="Phim" to="movies" />
          <SubMenuItem icon={AiOutlineStar} text="Diễn viên" to="actors" />
          <SubMenuItem icon={AiOutlineVideoCamera} text="Đạo diễn" to="directors" />
          <SubMenuItem icon={AiOutlineUser} text="Nhà sản xuất" to="/admin/producers" />
        </MenuGroup>

        <MenuGroup id="branches" icon={AiOutlineShop} title="Chi nhánh" isCollapsed={isCollapsed}>
          <SubMenuItem icon={AiOutlineShop} text="Chi nhánh" to="branches" />
          <SubMenuItem icon={AiOutlineVideoCamera} text="Rạp phim" to="cinemas" />
          <SubMenuItem icon={AiOutlineStar} text="Loại ghế" to="seat-types" />
          <SubMenuItem icon={AiOutlineVideoCamera} text="Phòng chiếu" to="rooms" />
          <SubMenuItem icon={AiOutlineBarChart} text="Suất chiếu" to="showtimes" />
        </MenuGroup>

        <MenuGroup id="food" icon={AiOutlineCoffee} title="Món ăn" isCollapsed={isCollapsed}>
          <SubMenuItem icon={AiOutlineCoffee} text="Món ăn lẻ" to="food&drink" />
          <SubMenuItem icon={AiOutlineGift} text="Combo" to="combo" />
        </MenuGroup>

        <MenuGroup id="promotions" icon={AiOutlinePercentage} title="Khuyến mãi" isCollapsed={isCollapsed}>
          <SubMenuItem icon={AiOutlinePercentage} text="Mã giảm giá" to="promotions" />
        </MenuGroup>

        <MenuItem icon={AiOutlineMessage} text="Lịch sử Chat" to="chat-history" isCollapsed={isCollapsed} />

        <MenuItem icon={AiOutlineSetting} text="Cài đặt" to="settings" isCollapsed={isCollapsed} />
      </div>
    </nav>
  );
}

AdminNav1.propTypes = {
  isCollapsed: PropTypes.bool.isRequired
};
