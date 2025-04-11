import { useState, useEffect, useRef } from 'react';

export default function HomeSale() {
  const items = [
    { id: 1, image: './sale/sale1.jpg', content: 'Giá Vé U22 - Chỉ Từ 45k' },
    { id: 2, image: './sale/sale2.jpg', content: 'Tiêu Chí Phân Loại Phim Theo Lứa Tuổi' },
    { id: 3, image: './sale/sale3.jpg', content: 'Siêu Tri Ân - Thứ Hai Cuối Cùng Của Năm' },
    { id: 4, image: './sale/sale4.jpg', content: 'Gia Hạn Thời Gian Sử Dụng/ Đổi Điểm Star' },
    { id: 5, image: './sale/sale5.jpg', content: 'Xmas Rộn Rã - Vị Ngon Lan Tỏa' },
    { id: 6, image: './sale/sale6.jpg', content: 'Soi Kính Vạn Hoa - Bắt Trọn Deal Ma' },
    { id: 7, image: './sale/sale7.jpg', content: 'Pepsi Lon Chỉ Từ 6k Cho Fan Cinema' },
    { id: 8, image: './sale/sale8.jpg', content: 'Rạp Quen Gọi Tên: Kinh Dương Vương' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const saleRef = useRef(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (saleRef.current) {
      observer.observe(saleRef.current);
    }
    
    return () => {
      if (saleRef.current) {
        observer.unobserve(saleRef.current);
      }
    };
  }, []);

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.ceil(items.length / 4));
    }, 5000);
    return () => clearInterval(interval);
  }, [items.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.ceil(items.length / 4));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + Math.ceil(items.length / 4)) % Math.ceil(items.length / 4));
  };

  // Show 4 items per page
  const itemsPerPage = 4;
  const startIdx = currentIndex * itemsPerPage;
  const visibleItems = items.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div ref={saleRef} className={`py-8 max-w-6xl mx-auto px-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <h2 className={`text-2xl font-bold text-gray-800 mb-6 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>Tin Khuyến Mãi</h2>

      <div className="relative mx-8">
        {/* Use flex layout instead of grid for horizontal display on all screen sizes */}
        <div className="overflow-x-auto hide-scrollbar">
          <div className="flex space-x-4 md:space-x-6 min-w-min">
          {visibleItems.map((item, index) => (
            <div 
              key={item.id} 
                className={`rounded-lg overflow-hidden shadow hover:shadow-md transition-all duration-700 bg-white flex-shrink-0 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                style={{ 
                  transitionDelay: `${index * 150}ms`,
                  width: 'calc(100% / 1.2)',
                  maxWidth: '280px',
                  minWidth: '220px'
                }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.content}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <p className="font-medium text-sm text-gray-800 hover:text-red-600 transition-colors">{item.content}</p>
              </div>
            </div>
          ))}
          </div>
        </div>
        
        {/* Navigation Buttons - Positioned outside the grid container */}
        <button 
          onClick={prevSlide} 
          className={`absolute left-[-20px] top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white shadow-md hover:bg-red-600 hover:text-white transition-all duration-300 z-10 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
          style={{ transitionDelay: '600ms' }}
          aria-label="Previous"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <button 
          onClick={nextSlide} 
          className={`absolute right-[-20px] top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white shadow-md hover:bg-red-600 hover:text-white transition-all duration-300 z-10 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
          style={{ transitionDelay: '600ms' }}
          aria-label="Next"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className={`flex justify-center mt-6 space-x-1 transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {[...Array(Math.ceil(items.length / itemsPerPage))].map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'bg-red-600 w-8' : 'bg-gray-300 w-4 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* Add this CSS to hide scrollbars but maintain scroll functionality */
<style jsx>{`
  .hide-scrollbar {
    scrollbar-width: none;  /* Firefox */
    -ms-overflow-style: none;  /* IE and Edge */
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;  /* Chrome, Safari, Opera */
  }
`}</style>
