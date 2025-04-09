import { useState, useEffect, useRef } from "react";

export default function Slider() {
  const slides = [
    {
      type: "video",
      poster: "https://i.imgur.com/7KSXOeF.jpg",
      title: "Bộ tứ báo thủ",
      description: "Khám phá cuộc phiêu lưu mới của Po",
      trailer: "https://www.youtube.com/embed/W3xAeYrQPZM"
    },
    {
      type: "image",
      image: "https://cdn.galaxycine.vn/media/2025/3/14/adl-2048_1741934700847.jpg",
      title: "Nhà Gia Tiên",
      description: "Hành trình cảm xúc đầy bất ngờ",
      trailer: "https://www.youtube.com/embed/4GzXQTbIwQU"
    },
    {
      type: "image",
      image: "https://cdn.galaxycine.vn/media/2025/3/25/dia-dao-1_1742874075591.jpg",
      title: "Công tử Bạc Liêu",
      description: "Bộ phim hài hước không thể bỏ lỡ",
      trailer: "https://www.youtube.com/embed/eoj4sST5sim"
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const trailerRef = useRef(null);
  const autoPlayInterval = 5000; // 5 seconds

  // Toggle trailer visibility
  const toggleTrailer = () => {
    setShowTrailer(prev => !prev);
    
    // If closing the trailer, reset iframe
    if (showTrailer && trailerRef.current) {
      try {
        const iframe = trailerRef.current;
        iframe.src = iframe.src;
      } catch (error) {
        console.error("Error handling trailer:", error);
      }
    }
  };

  // Tự động chuyển slide
  useEffect(() => {
    // Tạo một interval mới
    const interval = setInterval(() => {
      if (!isPaused && !showTrailer && !isAnimating) {
        const newIndex = (currentSlide + 1) % slides.length;
        setCurrentSlide(newIndex);
      }
    }, autoPlayInterval);
    
    // Cleanup khi component unmount hoặc dependencies thay đổi
    return () => clearInterval(interval);
  }, [currentSlide, isPaused, showTrailer, isAnimating, slides.length]);

  // Chuyển đến slide tiếp theo
  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    // Reset trailer state when changing slides
    setShowTrailer(false);
    
    const newIndex = (currentSlide + 1) % slides.length;
    setCurrentSlide(newIndex);
    
    // Giảm thời gian animation để đảm bảo slide chuyển nhanh hơn
    setTimeout(() => setIsAnimating(false), 800);
  };

  // Chuyển đến slide trước
  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    // Reset trailer state when changing slides
    setShowTrailer(false);
    
    const newIndex = (currentSlide - 1 + slides.length) % slides.length;
    setCurrentSlide(newIndex);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  // Chuyển đến một slide cụ thể
  const goToSlide = (index) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    
    // Reset trailer state when changing slides
    setShowTrailer(false);
    
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  // Render all slides at once but control visibility with opacity/z-index
  const renderSlides = () => {
    return slides.map((slide, index) => (
      <div 
        key={index} 
        className="w-full h-full flex-shrink-0"
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          opacity: index === currentSlide ? 1 : 0,
          zIndex: index === currentSlide ? 1 : 0,
          visibility: Math.abs(index - currentSlide) <= 1 ? 'visible' : 'hidden',
          transition: 'opacity 600ms ease',
        }}
      >
        <div className="relative w-full h-full overflow-hidden bg-black">
          <div className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            {/* Thay thế iframe bằng hình ảnh để tránh WebGL errors */}
            <img 
              src={slide.type === "video" ? slide.poster : slide.image}
              alt={slide.title}
              className="w-full h-full object-cover absolute inset-0"
              loading={index === currentSlide ? "eager" : "lazy"}
            />
          </div>
          
          {/* Content overlay with simplified animation */}
          <div 
            className="absolute inset-0 flex flex-col justify-end z-10 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"
          >
            <div className="container mx-auto px-6 pb-12 md:pb-16">
              <div 
                className={`max-w-4xl transition-opacity duration-500 ${
                  index === currentSlide 
                    ? 'opacity-100' 
                    : 'opacity-0'
                }`}
              >
                <h2 className="text-2xl md:text-4xl font-bold text-yellow-300 mb-3 tracking-wide">
                  {slide.title}
                </h2>
                <p className="text-sm md:text-base text-white mb-4 max-w-2xl">
                  {slide.description}
                </p>
                <div className="flex gap-3">
                  <button className="bg-yellow-600 hover:bg-yellow-700 text-white py-1.5 px-6 rounded text-xs md:text-sm font-medium pointer-events-auto">
                    Mua Vé
                  </button>
                  <button 
                    onClick={toggleTrailer}
                    className="bg-black/50 hover:bg-black/70 border border-yellow-500/40 text-white py-1.5 px-6 rounded text-xs md:text-sm font-medium pointer-events-auto"
                  >
                    {showTrailer ? 'Đóng Trailer' : 'Xem Trailer'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="w-full relative">
      {/* Cinematic fullscreen slider */}
      <div className="relative w-full h-[550px] md:h-[650px] lg:h-[85vh] max-h-[900px]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => !showTrailer && setIsPaused(false)}
      >
        {/* Slides */}
        <div className="absolute inset-0 overflow-hidden">
          {renderSlides()}
        </div>

        {/* Movie poster with trailer */}
        <div 
          className={`absolute right-6 top-6 z-30 w-64 md:w-72 lg:w-80 ${
            showTrailer 
              ? 'opacity-100' 
              : 'opacity-0 pointer-events-none'
          } transition-opacity duration-300`}
        >
          <div className="bg-black/80 rounded-lg overflow-hidden shadow-lg border border-yellow-500/30">
            {/* Trailer video */}
            <div className="aspect-video w-full bg-black relative">
              {showTrailer && (
                <iframe 
                  ref={trailerRef}
                  src={`${slides[currentSlide].trailer}?wmode=opaque&rel=0&modestbranding=1&autohide=1&showinfo=0`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              )}
              
              {/* Close button */}
              <button 
                onClick={toggleTrailer} 
                className="absolute top-2 right-2 bg-black/50 rounded-full p-1 border border-yellow-500/30"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Movie info */}
            <div className="p-3">
              <h3 className="text-yellow-300 font-medium text-sm">{slides[currentSlide].title} - Trailer</h3>
            </div>
          </div>
        </div>

        {/* Navigation buttons with simplified design */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-yellow-300 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center z-20 border border-yellow-500/30"
          disabled={isAnimating}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-yellow-300 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center z-20 border border-yellow-500/30"
          disabled={isAnimating}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Slide indicators with simplified design */}
        <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`${
                currentSlide === index 
                  ? "w-6 bg-yellow-600 rounded-md" 
                  : "w-1.5 bg-white/50 rounded-full"
              } h-1.5`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Decorative overlay gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20 pointer-events-none z-[1]"></div>
      </div>
    </div>
  );
}
