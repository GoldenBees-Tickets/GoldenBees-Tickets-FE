import { useState, useEffect } from "react";
import logoDesktop from "../../public/logoDesktop.png";
import logoMobile from "../../public/logoMobile.png";
import imgByTicket from "../../public/imgByTicket.png";
import { Link, useLocation } from "react-router-dom";
import AccountDropdown from "../AccountDropdown";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const handleClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 ${
        scrolled ? "py-3 bg-white shadow-sm" : "py-4 bg-white"
      }`}
    >
      <div className="h-[2px] bg-gray-100/60 absolute bottom-0 left-0 right-0"></div>
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-6">
        {/* Logo for Desktop */}
        <Link to="/" className="max-sm:hidden">
          <img
            src={logoDesktop}
            alt="logo"
            className="h-10"
          />
        </Link>

        {/* Logo for Mobile */}
        <Link to="/" className="hidden max-sm:block">
          <img
            src={logoMobile}
            alt="logo"
            className="h-9"
          />
        </Link>

        {/* Menu Section */}
        <div
          id="collapseMenu"
          className={`lg:!block max-lg:before:fixed max-lg:before:bg-white max-lg:before:inset-0 max-lg:before:z-50 ${
            isMenuOpen ? "block" : "hidden"
          }`}
        >
          <button
            id="toggleClose"
            onClick={handleClick}
            className="lg:hidden fixed top-4 right-4 z-[100] rounded-full bg-white w-11 h-11 flex items-center justify-center shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Menu Items */}
          <ul className="lg:flex items-center lg:space-x-1 max-lg:space-y-2 max-lg:fixed max-lg:bg-white max-lg:w-[280px] max-lg:top-0 max-lg:right-0 max-lg:p-7 max-lg:pt-20 max-lg:h-full max-lg:shadow-lg max-lg:overflow-auto max-lg:z-[60] text-gray-500">
            <li className="mb-8 hidden max-lg:block">
              <a href="/" className="flex items-center justify-center">
                <img src={logoDesktop} alt="logo" className="h-9" />
              </a>
            </li>
            <li className="max-lg:mb-7 lg:mr-5">
              <a
                href="#"
                className="block"
              >
                <img
                  src={imgByTicket}
                  alt="Buy Ticket"
                  className="h-9"
                />
              </a>
            </li>

            <li>
              <Link
                to="/product"
                className={`block px-4 py-2.5 text-base ${
                  isActive("/product")
                    ? "text-gray-900 font-medium"
                    : "hover:text-gray-900"
                }`}
              >
                Phim
              </Link>
            </li>
            
            <li className="max-lg:border-b max-lg:py-3 px-3">
              <Link
                to="/blog"
                className={`block px-4 py-2.5 text-base ${
                  isActive("/blog")
                    ? "text-gray-900 font-medium"
                    : "hover:text-gray-900"
                }`}
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`block px-4 py-2.5 text-base ${
                  isActive("/about")
                    ? "text-gray-900 font-medium"
                    : "hover:text-gray-900"
                }`}
              >
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={`block px-4 py-2.5 text-base ${
                  isActive("/contact")
                    ? "text-gray-900 font-medium"
                    : "hover:text-gray-900"
                }`}
              >
                Liên Hệ
              </Link>
            </li>
            <li>
              <Link
                to="/filterhome"
                className={`block px-4 py-2.5 text-base ${
                  isActive("/filterhome")
                    ? "text-gray-900 font-medium"
                    : "hover:text-gray-900"
                }`}
              >
                Thể loại phim
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex items-center gap-4">
          <AccountDropdown />
          <button
            id="toggleOpen"
            onClick={handleClick}
            className="lg:hidden w-11 h-11 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
