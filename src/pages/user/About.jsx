import { useEffect, useRef } from 'react';

export default function About() {
  // refs để scroll animation
  const headerRef = useRef(null);
  const sections = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  
  useEffect(() => {
    // Hàm xử lý animation khi scroll
    const handleScroll = () => {
      const elements = [headerRef.current, ...sections.map(ref => ref.current)];
      elements.forEach(el => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom >= 0;
        if (isVisible) {
          el.classList.add('animate-fade-in');
          el.style.opacity = '1';
        }
      });
    };

    // Đăng ký sự kiện scroll
    window.addEventListener('scroll', handleScroll);
    // Gọi hàm một lần khi component mount để xử lý các phần tử đã hiển thị
    handleScroll();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="bg-orange-50/50 font-sans">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-600 to-yellow-500 text-white">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://img.freepik.com/free-photo/cinema-elements-red-background-with-copy-space_23-2148457853.jpg" 
            alt="Cinema Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div 
          ref={headerRef} 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10 opacity-0 transition-opacity duration-1000"
        >
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="inline-block text-white">B Cinema</span>
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-white/90">
              Trải nghiệm điện ảnh đẳng cấp quốc tế tại Việt Nam
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <a 
                href="/" 
                className="inline-block px-6 py-3 bg-transparent border-2 border-white text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300"
              >
                Trang chủ
              </a>
              <a 
                href="#vision" 
                className="inline-block px-6 py-3 bg-white text-orange-600 font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                Tìm hiểu thêm
              </a>
            </div>
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 h-12 md:h-16 lg:h-20">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M0 120L48 105C96 90 192 60 288 50C384 40 480 50 576 65C672 80 768 100 864 100C960 100 1056 80 1152 65C1248 50 1344 40 1392 35L1440 30V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" fill="#FFF7ED"/>
          </svg>
        </div>
      </div>
      
      {/* Giới thiệu chung */}
      <div 
        id="intro" 
        ref={sections[0]} 
        className="py-16 md:py-24 opacity-0 transition-opacity duration-1000 px-4 sm:px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute -left-6 -top-6 w-24 h-24 bg-yellow-200 rounded-full opacity-50"></div>
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-orange-200 rounded-full opacity-50"></div>
                <img 
                  src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1000" 
                  alt="Cinema Experience" 
                  className="w-full h-auto rounded-xl shadow-xl relative z-10"
                />
              </div>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                <span className="inline-block border-b-4 border-orange-500 pb-1">Về chúng tôi</span>
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                B Cinema được thành lập vào năm 2023 với tầm nhìn mang đến trải nghiệm điện ảnh đẳng cấp quốc tế cho khán giả Việt Nam. Khởi đầu với 5 cụm rạp tại Hà Nội và TP.HCM, chúng tôi đã nhanh chóng mở rộng và trở thành một trong những chuỗi rạp chiếu phim được yêu thích nhất tại Việt Nam.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Với hệ thống phòng chiếu hiện đại, trang bị công nghệ âm thanh Dolby Atmos, màn hình 4K và hệ thống ghế ngồi cao cấp, B Cinema mang đến trải nghiệm xem phim tuyệt vời nhất. Chúng tôi tự hào là đối tác chiếu phim độc quyền của nhiều hãng phim lớn, mang đến những bộ phim mới nhất và đặc sắc nhất đến với khán giả Việt Nam.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tầm nhìn & Sứ mệnh */}
      <div 
        id="vision" 
        ref={sections[1]} 
        className="py-16 bg-gradient-to-br from-orange-100 to-yellow-50 opacity-0 transition-opacity duration-1000 px-4 sm:px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800">
              <span className="inline-block border-b-4 border-orange-500 pb-1">Tầm nhìn & Sứ mệnh</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 text-center mb-4">Tầm nhìn</h3>
              <p className="text-gray-600 text-center">
                Trở thành chuỗi rạp chiếu phim hàng đầu Việt Nam, mang đến những trải nghiệm điện ảnh đẳng cấp quốc tế và góp phần phát triển nền điện ảnh Việt Nam.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 text-center mb-4">Sứ mệnh</h3>
              <p className="text-gray-600 text-center">
                Chúng tôi cam kết mang đến cho khán giả những trải nghiệm điện ảnh chất lượng cao nhất với dịch vụ tận tâm, cơ sở vật chất hiện đại và sự lựa chọn phim đa dạng, phong phú.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Giá trị cốt lõi */}
      <div 
        id="values" 
        ref={sections[2]} 
        className="py-16 md:py-24 opacity-0 transition-opacity duration-1000 px-4 sm:px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800">
              <span className="inline-block border-b-4 border-orange-500 pb-1">Giá trị cốt lõi</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-orange-100">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Chất lượng vượt trội</h3>
              <p className="text-gray-600 text-sm">
                Chúng tôi luôn đặt chất lượng lên hàng đầu, từ công nghệ âm thanh, hình ảnh đến không gian và dịch vụ, mang đến trải nghiệm xem phim hoàn hảo.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-orange-100">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Dịch vụ tận tâm</h3>
              <p className="text-gray-600 text-sm">
                Đội ngũ nhân viên của chúng tôi được đào tạo để phục vụ khách hàng một cách chuyên nghiệp, nhiệt tình và thân thiện nhất.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-orange-100">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Đổi mới liên tục</h3>
              <p className="text-gray-600 text-sm">
                Chúng tôi không ngừng cập nhật, đổi mới để mang đến những trải nghiệm mới mẻ, thú vị và hấp dẫn hơn cho khán giả.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dịch vụ của chúng tôi */}
      <div 
        id="services" 
        ref={sections[3]} 
        className="py-16 bg-gradient-to-br from-orange-100 to-yellow-50 opacity-0 transition-opacity duration-1000 px-4 sm:px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800">
              <span className="inline-block border-b-4 border-orange-500 pb-1">Dịch vụ của chúng tôi</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex bg-white rounded-xl shadow-md overflow-hidden">
              <div className="w-1/3 bg-orange-500">
                <img 
                  src="https://images.pexels.com/photos/7991121/pexels-photo-7991121.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Phòng chiếu cao cấp" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-2/3 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Phòng chiếu cao cấp</h3>
                <p className="text-gray-600 text-sm">
                  Hệ thống phòng chiếu với thiết kế hiện đại, ghế ngồi êm ái, không gian thoải mái và công nghệ âm thanh, hình ảnh đỉnh cao.
                </p>
              </div>
            </div>
            
            <div className="flex bg-white rounded-xl shadow-md overflow-hidden">
              <div className="w-1/3 bg-orange-500">
                <img 
                  src="https://images.pexels.com/photos/5421530/pexels-photo-5421530.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Ẩm thực đa dạng" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-2/3 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Ẩm thực đa dạng</h3>
                <p className="text-gray-600 text-sm">
                  Menu thức ăn và đồ uống phong phú, từ bắp rang bơ truyền thống đến các combo đặc biệt phục vụ mọi nhu cầu của khán giả.
                </p>
              </div>
            </div>
            
            <div className="flex bg-white rounded-xl shadow-md overflow-hidden">
              <div className="w-1/3 bg-orange-500">
                <img 
                  src="https://images.pexels.com/photos/6803503/pexels-photo-6803503.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Đặt vé trực tuyến" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-2/3 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Đặt vé trực tuyến</h3>
                <p className="text-gray-600 text-sm">
                  Hệ thống đặt vé trực tuyến tiện lợi, nhanh chóng giúp bạn dễ dàng lựa chọn phim, suất chiếu và chỗ ngồi ưng ý.
                </p>
              </div>
            </div>
            
            <div className="flex bg-white rounded-xl shadow-md overflow-hidden">
              <div className="w-1/3 bg-orange-500">
                <img 
                  src="https://images.pexels.com/photos/7876708/pexels-photo-7876708.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Thành viên VIP" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-2/3 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Thành viên VIP</h3>
                <p className="text-gray-600 text-sm">
                  Chương trình thành viên với nhiều đặc quyền và ưu đãi hấp dẫn dành cho khách hàng thân thiết của B Cinema.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Con số ấn tượng */}
      <div 
        id="stats" 
        ref={sections[4]} 
        className="py-16 md:py-24 opacity-0 transition-opacity duration-1000 px-4 sm:px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800">
              <span className="inline-block border-b-4 border-orange-500 pb-1">Những con số ấn tượng</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-orange-500 mb-2">12+</div>
              <p className="text-gray-600">Cụm rạp trên toàn quốc</p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl font-bold text-orange-500 mb-2">50+</div>
              <p className="text-gray-600">Phòng chiếu hiện đại</p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl font-bold text-orange-500 mb-2">2M+</div>
              <p className="text-gray-600">Khách hàng mỗi năm</p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl font-bold text-orange-500 mb-2">100+</div>
              <p className="text-gray-600">Phim chiếu độc quyền</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-600 to-yellow-500 py-16 px-4 sm:px-6 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Trải nghiệm Điện Ảnh Đỉnh Cao</h2>
          <p className="mb-8 text-white/90">
            Hãy đến B Cinema để cảm nhận trải nghiệm xem phim hoàn toàn khác biệt với công nghệ hình ảnh và âm thanh đỉnh cao.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/ticket-purchase" 
              className="px-8 py-3 bg-white text-orange-600 font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              Đặt vé ngay
            </a>
            <a 
              href="/contact" 
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300"
            >
              Liên hệ
            </a>
          </div>
        </div>
      </div>
      
      {/* CSS cho animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease forwards;
        }
      `}</style>
    </div>
  );
}

