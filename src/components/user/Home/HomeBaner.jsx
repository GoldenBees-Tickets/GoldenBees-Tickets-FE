import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useMemo } from "react";
import { useGetAllMoviesByUserQuery } from "@/api/movieApi";
import { useGetReviewsByMovieIdQuery } from "@/api/reviewApi";
import { filterMoviesByStatus } from "@/utils/movieFilters";
import { formatImage } from "@/utils/formatImage";
import { Link } from "react-router-dom";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

export default function HomeBanner() {
  const contentRef = useRef(null);
  const imageRef = useRef(null);
  const contentInView = useInView(contentRef, { once: true, amount: 0.3 });
  const imageInView = useInView(imageRef, { once: true, amount: 0.3 });
  
  // Lấy danh sách phim từ API
  const { data: List, isLoading } = useGetAllMoviesByUserQuery();
  
  // Xử lý dữ liệu phim chỉ khi List thay đổi
  const { nowShowingMovies } = useMemo(() => {
    const ListMovie = List?.data || [];
    return filterMoviesByStatus(ListMovie);
  }, [List]);
  
  // Lấy phim đầu tiên đang chiếu
  const featuredMovie = useMemo(() => 
    nowShowingMovies && nowShowingMovies.length > 0 ? nowShowingMovies[0] : null
  , [nowShowingMovies]);

  // Lấy dữ liệu đánh giá cho phim đầu tiên
  const { data: reviewData } = useGetReviewsByMovieIdQuery(
    featuredMovie?.id,
    { skip: !featuredMovie?.id }
  );

  // Tính toán rating
  const { rating, totalRatings } = useMemo(() => {
    if (!reviewData) return { rating: 0, totalRatings: 0 };
    return {
      rating: reviewData.averageRating || 0,
      totalRatings: reviewData.totalRatings || 0
    };
  }, [reviewData]);

  // Tính toán số sao hiển thị
  const stars = useMemo(() => {
    const starsArray = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    // Thêm các sao đầy đủ
    for (let i = 0; i < fullStars; i++) {
      starsArray.push('full');
    }
    
    // Thêm nửa sao nếu cần
    if (hasHalfStar) {
      starsArray.push('half');
    }
    
    // Thêm các sao trống
    while (starsArray.length < 5) {
      starsArray.push('empty');
    }
    
    return starsArray;
  }, [rating]);

  return (
    <section className="relative bg-white overflow-hidden py-6">
      {/* Animated Background Elements */}
      <motion.div 
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div 
          className="absolute top-0 right-0 w-full h-64 bg-gradient-to-b from-gray-50 to-white"
          animate={{ 
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        ></motion.div>
        <motion.div 
          className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-yellow-100"
          animate={{ 
            y: [0, 15, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        ></motion.div>
        <motion.div 
          className="absolute -bottom-4 right-20 w-6 h-6 rounded-full bg-blue-100"
          animate={{ 
            y: [0, -5, 0],
            x: [0, -3, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        ></motion.div>
      </motion.div>

      {/* Container */}
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          {/* Content Section with Animation */}
          <motion.div 
            ref={contentRef}
            className="max-w-[520px] text-center lg:text-left order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={contentInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.span 
              className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider text-yellow-600 uppercase border border-yellow-200 rounded-full bg-yellow-50"
              initial={{ opacity: 0, y: -20 }}
              animate={contentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Khám phá ngay
            </motion.span>
            <motion.h1 
              className="text-3xl font-extrabold text-gray-900 md:text-4xl lg:text-5xl"
              initial={{ opacity: 0 }}
              animate={contentInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {featuredMovie ? featuredMovie.name : "Phim điện ảnh"} <motion.span 
                className="text-yellow-500"
                animate={{ 
                  textShadow: ["0px 0px 0px rgba(245, 158, 11, 0)", "0px 0px 8px rgba(245, 158, 11, 0.3)", "0px 0px 0px rgba(245, 158, 11, 0)"],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >mới nhất</motion.span>
            </motion.h1>
            <motion.p 
              className="mt-4 text-base text-gray-600 md:text-lg leading-relaxed line-clamp-3"
              initial={{ opacity: 0 }}
              animate={contentInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {featuredMovie?.description?.slice(0, 120) + "..." || "Hãy đắm mình vào trải nghiệm điện ảnh khó quên với những bộ phim bom tấn mới nhất. Đặt vé ngay!"}
            </motion.p>
            <motion.div 
              className="mt-6 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={contentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {featuredMovie && (
                <>
                <motion.div>
                  <Link to={`/detail/${featuredMovie.id}`}>
                    <motion.div
                      className="inline-block rounded-full bg-yellow-500 px-6 py-3 text-center text-base font-semibold text-white transition-all duration-300 hover:text-white hover:shadow-lg hover:shadow-yellow-200 transform hover:-translate-y-1 cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Đặt ngay
                    </motion.div>
                  </Link>
                </motion.div>
                <Link to={`/detail/${featuredMovie.id}`}>
                <motion.div
                  className="group flex items-center gap-2 rounded-full border border-gray-200 px-6 py-3 text-base font-semibold text-gray-700 transition-all duration-300 hover:border-yellow-200 hover:bg-yellow-50 cursor-pointer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.span 
                    className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 group-hover:bg-yellow-100"
                    whileHover={{ rotate: 5 }}
                    animate={{
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="h-4 w-4 text-yellow-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.752 11.168l-4.196-2.64A1 1 0 009 9.415v5.17a1 1 0 001.556.847l4.196-2.639a1 1 0 000-1.695z"
                      />
                    </svg>
                  </motion.span>
                  <span className="group-hover:text-yellow-600">Xem Lịch chiếu</span>
                </motion.div>
                </Link>
                </>
              )}
               
            </motion.div>
          </motion.div>

          {/* Image Section with Animation */}
          <motion.div 
            ref={imageRef}
            className="relative order-1 lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            animate={imageInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-yellow-100 to-blue-50 blur-md opacity-70"
              animate={{ 
                opacity: [0.5, 0.8, 0.5],
                rotate: [0, 1, 0, -1, 0],
              }}
              transition={{ 
                duration: 10, 
                repeat: Infinity,
                repeatType: "loop" 
              }}
            ></motion.div>
            <motion.div 
              className="relative mx-auto h-full max-w-[450px] overflow-hidden rounded-2xl shadow-lg border border-gray-100"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {featuredMovie ? (
                <Link to={`/detail/${featuredMovie.id}`}>
                  <motion.img
                    src={formatImage(featuredMovie.poster)}
                    alt={featuredMovie.name}
                    className="h-[320px] w-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.7 }}
                  />
                </Link>
              ) : (
                <motion.img
                  src="https://www.galaxycine.vn/media/2024/6/24/despicable-me-4-chung-ta-biet-duoc-bao-nhieu-ve-minions-3_1719218662477.jpg"
                  alt="Movie Screening"
                  className="h-[320px] w-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.7 }}
                />
              )}
              <motion.div 
                className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-white/90 to-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={imageInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex items-center gap-2">
                  <motion.span 
                    className="inline-block px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full"
                    animate={{ 
                      scale: [1, 1.08, 1],
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      repeatType: "reverse" 
                    }}
                  >
                    HOT
                  </motion.span>
                  <span className="text-gray-800 text-xs font-medium">Đang chiếu</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mt-1">
                  {featuredMovie ? featuredMovie.name : "Despicable Me 4"}
                </h3>
              </motion.div>
            </motion.div>
            
            {/* Rating stars with animation using react-icons */}
            <motion.div 
              className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-md"
              initial={{ opacity: 0, y: -20 }}
              animate={imageInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
            >
              {stars.map((type, i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, delay: i * 0.2, repeat: Infinity, repeatDelay: 3 }}
                >
                  {type === 'full' && <FaStar className="w-4 h-4 text-yellow-500" />}
                  {type === 'half' && <FaStarHalfAlt className="w-4 h-4 text-yellow-500" />}
                  {type === 'empty' && <FaRegStar className="w-4 h-4 text-gray-300" />}
                </motion.div>
              ))}
              <span className="text-xs font-medium text-gray-800 ml-1">{rating.toFixed(1)}</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
