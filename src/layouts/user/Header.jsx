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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
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
            className="h-10 transition-all hover:opacity-90 duration-300"
          />
        </Link>

        {/* Logo for Mobile */}
        <Link to="/" className="hidden max-sm:block">
          <img
            src={logoMobile}
            alt="logo"
            className="h-9 transition-all hover:opacity-90 duration-300"
          />
        </Link>

        {/* Menu Section */}
        <div
          id="collapseMenu"
          className={`lg:!block max-lg:before:fixed max-lg:before:bg-white/95 max-lg:before:backdrop-blur-md max-lg:before:inset-0 max-lg:before:z-50 ${
            isMenuOpen ? "block" : "hidden"
          }`}
        >
          <button
            id="toggleClose"
            onClick={handleClick}
            className="lg:hidden fixed top-4 right-4 z-[100] rounded-full bg-white/90 backdrop-blur-md w-11 h-11 flex items-center justify-center shadow-sm hover:bg-white active:scale-95 transition-all duration-300"
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
                className="hover:opacity-90 block transition-all duration-300"
              >
                <img
                  src={imgByTicket}
                  alt="Buy Ticket"
                  className="h-9 hover:opacity-80 transition-all duration-300"
                />
              </a>
            </li>

            <li>
              <Link
                to="/product"
                className={`block px-4 py-2.5 text-base transition-colors duration-200 ${
                  isActive("/product")
                    ? "text-gray-900 font-medium"
                    : "hover:text-gray-900"
                }`}
              >
                Phim
              </Link>
            </li>
            <li>
              <Link
                to="/posts"
                className="hover:text-[#007bff] text-gray-600 font-bold block text-base"
              >
                Tin tức
              </Link>
            </li>
            <li className="max-lg:border-b max-lg:py-3 px-3">
              <Link
                to="/blog"
                className={`block px-4 py-2.5 text-base transition-colors duration-200 ${
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
                className={`block px-4 py-2.5 text-base transition-colors duration-200 ${
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
                className={`block px-4 py-2.5 text-base transition-colors duration-200 ${
                  isActive("/contact")
                    ? "text-gray-900 font-medium"
                    : "hover:text-gray-900"
                }`}
              >
                Liên Hệ
              </Link>
            </li>
            <li className="max-lg:border-b max-lg:py-3 px-3 group">
              <div className="relative">
                <a
                  href="#"
                  className="hover:text-[#007bff] text-gray-600 pr-6 font-bold text-base flex items-center"
                >
                  More
                  <svg
                    className="ml-2 w-[10px] h-[10px]"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.99982 10.6667C7.91625 10.6667 7.83268 10.6453 7.75768 10.6027C7.68268 10.56 7.61625 10.5 7.55839 10.4253L4.22506 7.092C4.07506 6.942 4.00006 6.75067 4.00006 6.55067C4.00006 6.15133 4.31839 5.83333 4.71839 5.83333C4.91839 5.83333 5.10973 5.90867 5.26039 6.05867L7.99982 8.798L10.7392 6.05867C10.8892 5.90867 11.0812 5.83333 11.2812 5.83333C11.6812 5.83333 11.9998 6.15133 11.9998 6.55067C11.9998 6.75067 11.9248 6.942 11.7748 7.092L8.44149 10.4253C8.38363 10.5 8.31696 10.56 8.24196 10.6027C8.16696 10.6453 8.08339 10.6667 7.99982 10.6667Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              </div>
              <ul className="absolute shadow-lg bg-white space-y-3 lg:top-5 max-lg:top-8 -left-6 min-w-[250px] z-50 max-h-0 overflow-hidden group-hover:opacity-100 group-hover:max-h-[700px] px-6 group-hover:pb-4 group-hover:pt-6 transition-all duration-500">
                <li className="relative group">
                  <button
                    className={`flex items-center px-4 py-2.5 text-base transition-colors duration-200 text-gray-500 hover:text-gray-900 w-full`}
                  >
                    <span className="flex items-center">
                      Góc điện ảnh
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 ml-1.5 transition-transform duration-300 group-hover:rotate-180"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                  </button>
                  <ul className="lg:absolute lg:right-0 lg:mt-1 lg:min-w-[220px] bg-white/95 backdrop-blur-md border border-gray-100 rounded-md shadow-sm p-1.5 max-lg:mt-1 max-lg:ml-4 max-lg:border-l border-gray-100 hidden group-hover:block z-50">
                    <li>
                      <Link
                        to="/filterhome"
                        className="block px-5 py-2.5 text-sm text-gray-500 hover:text-gray-900 rounded-sm"
                      >
                        Thể loại phim
                      </Link>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-5 py-2.5 text-sm text-gray-500 hover:text-gray-900 rounded-sm"
                      >
                        Diễn viên
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-5 py-2.5 text-sm text-gray-500 hover:text-gray-900 rounded-sm"
                      >
                        Đạo diễn
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-5 py-2.5 text-sm text-gray-500 hover:text-gray-900 rounded-sm"
                      >
                        Bình luận phim
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div className="flex items-center gap-4">
          <AccountDropdown />
          <button
            id="toggleOpen"
            onClick={handleClick}
            className="lg:hidden w-11 h-11 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-sm hover:bg-white text-gray-600 active:scale-95 transition-all duration-300"
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
