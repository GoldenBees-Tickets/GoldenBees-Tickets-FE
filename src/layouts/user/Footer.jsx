export default function Footer() {
  return (
    <footer className="relative bg-black">
      {/* Diagonal divider */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-amber-500/10 to-yellow-600/5"></div>
        <div className="absolute -inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
        <div className="h-28 w-full absolute top-0">
          <svg className="absolute top-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon fill="#111111" points="0,100 100,0 100,100" />
          </svg>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 pt-32 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left column - info and logo */}
          <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center space-y-6 md:space-y-0 md:space-x-10">
              <div className="flex items-center">
                <div className="w-12 h-12 flex items-center justify-center rounded bg-amber-500 p-2">
                  <img
                    src="/src/public/LogoHeader.png"
                    alt="Golden Bees Cinema"
                    className="h-8 w-8 object-contain"
                  />
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold tracking-tight text-white">Golden Bees</h2>
                  <p className="text-xs text-gray-500 mt-1">Trải nghiệm điện ảnh</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-sm flex items-center justify-center border border-gray-800 hover:bg-amber-500/10 hover:border-amber-500/50 transition-all duration-300">
                  <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002ZM7 8.48H3V21h4V8.48Zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68Z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-sm flex items-center justify-center border border-gray-800 hover:bg-amber-500/10 hover:border-amber-500/50 transition-all duration-300">
                  <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-sm flex items-center justify-center border border-gray-800 hover:bg-amber-500/10 hover:border-amber-500/50 transition-all duration-300">
                  <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="space-y-3 max-w-md">
              <div className="flex items-center mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-800"></div>
                <span className="px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">Về Chúng Tôi</span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-800"></div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Chúng tôi mang đến cho bạn trải nghiệm xem phim với chất lượng cao nhất, giao diện hiện đại và kho phim đa dạng từ khắp nơi trên thế giới.
              </p>
              <div className="pt-4">
                <a 
                  href="/gioithieu" 
                  className="inline-flex items-center text-xs font-medium text-amber-500 hover:text-amber-400 transition-colors duration-300"
                >
                  <span>Tìm hiểu thêm</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-800"></div>
                <span className="px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">Đăng Ký</span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-800"></div>
              </div>
              <form className="flex max-w-md">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="flex-1 px-4 py-2 bg-black border border-gray-800 text-sm text-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
                <button 
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black font-medium text-xs uppercase tracking-wider transition-colors duration-300"
                >
                  Đăng Ký
                </button>
              </form>
            </div>
          </div>

          {/* Right column - links grid */}
          <div className="mt-10 lg:mt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-8">
              <div className="space-y-8">
                <h3 className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
                  Khám Phá
                </h3>
                <ul className="space-y-4">
                  <li>
                    <a href="/phimtructuyen" className="text-sm text-gray-400 hover:text-white transition-colors">
                      Phim Trực Tuyến
                    </a>
                  </li>
                  <li>
                    <a href="/danhmucphim" className="text-sm text-gray-400 hover:text-white transition-colors">
                      Danh Mục Phim
                    </a>
                  </li>
                  <li>
                    <a href="/thu-vien" className="text-sm text-gray-400 hover:text-white transition-colors">
                      Thư Viện Phim
                    </a>
                  </li>
                  <li>
                    <a href="/gia" className="text-sm text-gray-400 hover:text-white transition-colors">
                      Gói Dịch Vụ
                    </a>
                  </li>
                </ul>
              </div>

              <div className="space-y-8">
                <h3 className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
                  Hỗ Trợ
                </h3>
                <ul className="space-y-4">
                  <li>
                    <a href="/huongdan" className="text-sm text-gray-400 hover:text-white transition-colors">
                      Hướng Dẫn
                    </a>
                  </li>
                  <li>
                    <a href="/gop-y" className="text-sm text-gray-400 hover:text-white transition-colors">
                      Góp Ý
                    </a>
                  </li>
                  <li>
                    <a href="/hỗtrợkháchhàng" className="text-sm text-gray-400 hover:text-white transition-colors">
                      Hỗ Trợ Khách Hàng
                    </a>
                  </li>
                  <li>
                    <a href="/dieu-khoan" className="text-sm text-gray-400 hover:text-white transition-colors">
                      Điều Khoản
                    </a>
                  </li>
                </ul>
              </div>

              <div className="space-y-8">
                <h3 className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
                  Thông Tin
                </h3>
                <ul className="space-y-4">
                  <li>
                    <a href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">
                      Blog & Tin Tức
                    </a>
                  </li>
                  <li>
                    <a href="/gioithieu" className="text-sm text-gray-400 hover:text-white transition-colors">
                      Giới Thiệu
                    </a>
                  </li>
                  <li>
                    <a href="/lienhe" className="text-sm text-gray-400 hover:text-white transition-colors">
                      Liên Hệ
                    </a>
                  </li>
                  <li>
                    <a href="/tuyendung" className="text-sm text-gray-400 hover:text-white transition-colors">
                      Tuyển Dụng
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer bottom / Copyright */}
        <div className="mt-20 pt-8 border-t border-gray-900">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-gray-600">
              © {new Date().getFullYear()} <span className="text-gray-500">Golden Bees</span>. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/chinh-sach" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
                Chính sách
              </a>
              <a href="/bao-mat" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
                Bảo mật
              </a>
              <a href="/dieu-khoan" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
                Điều khoản
              </a>
            </div>
          </div>
        </div>

        {/* Decorative element - bottom right */}
        <div className="absolute bottom-0 right-0 w-64 h-64 lg:w-96 lg:h-96 pointer-events-none">
          <div className="absolute right-0 bottom-0 w-64 h-64 lg:w-96 lg:h-96 border border-amber-900/20 rounded-full"></div>
          <div className="absolute right-4 bottom-4 w-48 h-48 lg:w-72 lg:h-72 border border-amber-800/20 rounded-full"></div>
          <div className="absolute right-8 bottom-8 w-32 h-32 lg:w-48 lg:h-48 border border-amber-700/20 rounded-full"></div>
          <div className="absolute right-16 bottom-16 w-16 h-16 lg:w-24 lg:h-24 bg-amber-500/5 rounded-full"></div>
        </div>
      </div>
    </footer>
  );
}
