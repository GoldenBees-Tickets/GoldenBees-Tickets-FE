import { useState, useEffect, useRef } from "react";

export default function Slider() {
  const slides = [
    {
      image: "https://cdn.galaxycine.vn/media/2025/3/25/dia-dao-1_1742874075591.jpg",
      title: "Địa Đạo",
      description: "Hành trình khám phá bí mật"
    },
    {
      image: "https://cdn.galaxycine.vn/media/2025/4/1/the-red-envelope-1_1743492961706.jpg",
      title: "The Red Envelope",
      description: "Bí ẩn không lời giải đáp"
    },
    {
      image: "https://cdn.galaxycine.vn/media/2025/4/9/the-amateur-1_1744190210271.jpg",
      title: "The Amateur",
      description: "Hành trình trở thành chuyên nghiệp"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  const autoPlayRef = useRef(null);
  const sliderRef = useRef(null);

  // Tự động chuyển slide
  useEffect(() => {
    // Reset và bắt đầu interval mới
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    
    autoPlayRef.current = setInterval(() => {
      if (!isPaused) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
    }, 3000);
    
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [currentSlide, isPaused, slides.length]);

  // Xử lý vuốt trên thiết bị di động
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    // Tính khoảng cách vuốt
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 30;
    
    // Nếu khoảng cách đủ lớn, thực hiện chuyển slide
    if (distance > minSwipeDistance) {
      // Vuốt từ phải sang trái -> slide tiếp theo
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      // Vuốt từ trái sang phải -> slide trước đó
      prevSlide();
    }
    
    // Reset giá trị
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Chuyển đến slide tiếp theo
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // Chuyển đến slide trước
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Chuyển đến một slide cụ thể
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="w-full relative overflow-hidden">
      {/* Slider chính với kích thước responsive theo tỷ lệ */}
      <div 
        className="relative w-full h-[200px] sm:h-[240px] md:h-[300px] lg:h-[400px] bg-black"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        ref={sliderRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Container cho các slides */}
        <div className="h-full relative overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-300 ease-in-out ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {/* Container hình ảnh với object-fit và position */}
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover"
                  loading={index === currentSlide ? "eager" : "lazy"}
                />
              </div>
              
              {/* Nội dung slide */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 bg-gradient-to-t from-black/70 to-transparent">
                <div className="max-w-5xl mx-auto">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">
                    {slide.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-white/80 max-w-md line-clamp-2 hidden sm:block">
                    {slide.description}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-black py-1 px-3 sm:px-4 rounded text-xs sm:text-sm font-medium">
                      Mua Vé
                    </button>
                    <button className="bg-transparent border border-white text-white py-1 px-3 sm:px-4 rounded text-xs sm:text-sm font-medium hover:bg-white/10">
                      Chi Tiết
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chỉ số slide */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1.5 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`${
                currentSlide === index
                  ? "w-6 bg-yellow-500"
                  : "w-2 bg-white/60"
              } h-1.5 rounded-full transition-all duration-300`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Nút điều hướng */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center z-20 hover:bg-black/50"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center z-20 hover:bg-black/50"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
