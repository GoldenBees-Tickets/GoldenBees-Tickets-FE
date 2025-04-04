import { useState, useEffect, useRef } from "react";

export default function Slider() {
  const slides = [
    {
      type: "video",
      video: "https://www.youtube.com/embed/zKMOgOWn8lQ",
      title: "Bộ tứ báo thủ",
      description: "Khám phá cuộc phiêu lưu mới của Po",
      poster: "https://i.imgur.com/7KSXOeF.jpg",
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
  const [videosLoaded, setVideosLoaded] = useState(false);
  const videoRefs = useRef([]);
  const trailerRef = useRef(null);
  const timerRef = useRef(null);
  const autoPlayInterval = 3000; // Changed from 15000 to 3000 (3 seconds)

  // Set up video refs
  // useEffect(() => {
  //   videoRefs.current = videoRefs.current.slice(0, slides.length);
  //   // Set videos as loaded after a small delay to ensure DOM is ready
  //   setTimeout(() => setVideosLoaded(true), 100);
  // }, [slides.length]);

  // Toggle trailer visibility
  const toggleTrailer = () => {
    setShowTrailer(prev => !prev);
    
    // If closing the trailer, pause it
    if (showTrailer && trailerRef.current) {
      try {
        trailerRef.current.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      } catch (error) {
        console.error("Error pausing trailer:", error);
      }
    }
  };

  // Handle video slide transitions without reloading
  const handleVideoTransition = (newIndex) => {
    // Only if we have videos loaded
    if (!videosLoaded) return;

    // First pause current video if it's a video type
    if (slides[currentSlide].type === "video" && videoRefs.current[currentSlide]) {
      try {
        videoRefs.current[currentSlide].contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      } catch (error) {
        console.error("Error pausing current video:", error);
      }
    }

    // Then play the new video if it's a video type
    if (slides[newIndex].type === "video" && videoRefs.current[newIndex]) {
      try {
        videoRefs.current[newIndex].contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      } catch (error) {
        console.error("Error playing new video:", error);
      }
    }
  };

  // Tự động chuyển slide
  useEffect(() => {
    // Tạo một interval mới
    const interval = setInterval(() => {
      if (!isPaused && !showTrailer && !isAnimating) {
        const newIndex = (currentSlide + 1) % slides.length;
        handleVideoTransition(newIndex);
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
    handleVideoTransition(newIndex);
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
    handleVideoTransition(newIndex);
    setCurrentSlide(newIndex);
    setTimeout(() => setIsAnimating(false), 1000); // Increased to match fade duration
  };

  // Chuyển đến một slide cụ thể
  const goToSlide = (index) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    
    // Reset trailer state when changing slides
    setShowTrailer(false);
    
    handleVideoTransition(index);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 1000); // Increased to match fade duration
  };

  // Helper function to get video ID
  const getVideoId = (url) => {
    const splitUrl = url.split('/');
    return splitUrl[splitUrl.length - 1];
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
          transition: 'opacity 1000ms ease-in-out', // Enhanced fade transition
        }}
      >
        <div className="relative w-full h-full overflow-hidden bg-black">
          <div className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            {slide.type === "video" ? (
              <iframe 
                ref={el => videoRefs.current[index] = el}
                src={`${slide.video}?enablejsapi=1&autoplay=${index === 0 ? 1 : 0}&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${getVideoId(slide.video)}&modestbranding=1&disablekb=1&iv_load_policy=3&color=white&fs=0&playsinline=1&origin=${window.location.origin}`}
                title={slide.title}
                className="w-[100%] h-[100%] scale-[1.2] object-cover pointer-events-none absolute inset-0"
                style={{ 
                  position: "absolute", 
                  top: "0", 
                  left: "0", 
                  width: "100%", 
                  height: "115%", // Extra height to ensure full coverage
                  maxWidth: "none",
                  maxHeight: "none",
                  filter: "contrast(1.1) brightness(0.9)"
                }}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="eager"
              ></iframe>
            ) : (
              <img 
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover absolute inset-0"
                style={{
                  filter: "contrast(1.1) brightness(0.9)"
                }}
                loading="eager"
              />
            )}
          </div>
          
          {/* Content overlay with enhanced animation */}
          <div 
            className="absolute inset-0 flex flex-col justify-end z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none"
          >
            <div className="container mx-auto px-6 pb-12 md:pb-16">
              <div 
                className={`max-w-4xl transition-all duration-1000 ease-in-out transform ${
                  index === currentSlide 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
              >
                <h2 className="text-2xl md:text-4xl font-bold text-yellow-300 mb-3 drop-shadow-lg tracking-wide">
                  {slide.title}
                </h2>
                <p className="text-sm md:text-base text-white mb-4 max-w-2xl drop-shadow-md">
                  {slide.description}
                </p>
                <div className="flex gap-3">
                  <button className="bg-yellow-600 hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 text-white py-1.5 px-6 rounded text-xs md:text-sm font-medium transform transition duration-300 hover:scale-105 pointer-events-auto">
                    Mua Vé
                  </button>
                  <button 
                    onClick={toggleTrailer}
                    className="bg-black/50 backdrop-blur-sm hover:bg-black/70 border border-yellow-500/40 text-white py-1.5 px-6 rounded text-xs md:text-sm font-medium transform transition duration-300 hover:scale-105 pointer-events-auto"
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

  // Make initial slide load immediately on component mount
  useEffect(() => {
    // Preload first video and start playing it
    if (slides[0].type === "video") {
      const checkAndPlayVideo = () => {
        if (videoRefs.current[0] && videoRefs.current[0].contentWindow) {
          try {
            videoRefs.current[0].contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
          } catch (error) {
            console.error("Error playing initial video:", error);
          }
        } else {
          // If iframe isn't ready yet, try again shortly
          setTimeout(checkAndPlayVideo, 200);
        }
      };
      
      // Start checking after a short delay to allow for initial render
      setTimeout(checkAndPlayVideo, 200);
    }
  }, [videosLoaded]);

  return (
    <div className="w-full relative">
      {/* Cinematic fullscreen slider */}
      <div 
        className="relative w-full h-[550px] md:h-[650px] lg:h-[85vh] max-h-[900px]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => !showTrailer && setIsPaused(false)}
      >
        {/* Slides */}
        <div className="absolute inset-0 overflow-hidden">
          {renderSlides()}
        </div>

        {/* Movie poster with trailer */}
        <div 
          className={`absolute right-6 top-6 z-30 w-64 md:w-72 lg:w-80 transition-all duration-500 transform ${
            showTrailer 
              ? 'scale-100 opacity-100' 
              : 'scale-95 opacity-0 pointer-events-none'
          }`}
        >
          <div className="bg-black/80 backdrop-blur-md rounded-lg overflow-hidden shadow-2xl border border-yellow-500/30">
            {/* Trailer video */}
            <div className="aspect-video w-full bg-black relative">
              <iframe 
                ref={trailerRef}
                src={`${slides[currentSlide].trailer}?enablejsapi=1&autoplay=${showTrailer ? 1 : 0}&mute=0&modestbranding=1&origin=${window.location.origin}`}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              
              {/* Close button */}
              <button 
                onClick={toggleTrailer} 
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 rounded-full p-1 transition-all border border-yellow-500/30"
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

        {/* Navigation buttons with improved design */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-yellow-300 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center z-20 backdrop-blur-sm border border-yellow-500/30 transition-all duration-300 hover:scale-110"
          disabled={isAnimating}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-yellow-300 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center z-20 backdrop-blur-sm border border-yellow-500/30 transition-all duration-300 hover:scale-110"
          disabled={isAnimating}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Slide indicators with improved design */}
        <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-500 ease-out ${
                currentSlide === index 
                  ? "w-6 bg-yellow-600 rounded-md" 
                  : "w-1.5 bg-white/50 hover:bg-yellow-300/80 rounded-full"
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
