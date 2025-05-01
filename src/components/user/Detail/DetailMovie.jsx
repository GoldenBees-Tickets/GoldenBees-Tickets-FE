import { useParams, Link } from "react-router-dom";
import { useState, useCallback, useEffect, useMemo, memo } from "react";
import { useGetMovieByIdQuery } from "@/api/movieApi";
import { useGetReviewsByMovieIdQuery, useCreateReviewMutation } from "@/api/reviewApi";
import { formatImage } from "@/utils/formatImage";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import RatingMovie from "./RatingMovie";
import { toast } from "react-toastify";

// Tách thành component con để tránh re-render không cần thiết
const MoviePoster = memo(({ poster, name, trailer, onShowTrailer, ageRating }) => (
  <div className="lg:w-1/3">
    <div className="sticky top-20">
      <div className="relative group overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl">
        <img
          src={formatImage(poster)}
          alt={name}
          className="w-full h-auto object-cover rounded-2xl shadow-lg transform transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition duration-300"></div>
        
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-300 z-10 w-full flex justify-center">
          <button
            onClick={onShowTrailer}
            className="bg-orange-500 hover:bg-orange-600 text-white flex items-center px-6 py-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-orange-300/30 hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" fillRule="evenodd"></path>
            </svg>
            Xem Trailer
          </button>
        </div>
        
        <div className="absolute top-4 right-4 bg-yellow-500 text-gray-900 text-sm font-bold px-3 py-1.5 rounded-md shadow-lg">
          {ageRating === 0 ? "P" : `C${ageRating}`}
        </div>
        
        <h1 className="absolute top-4 left-4 text-2xl md:text-3xl font-bold text-white shadow-text">
          {name}
        </h1>
      </div>
    </div>
  </div>
));

// Component hiển thị đánh giá sao
const RatingStars = memo(({ rating, totalRatings, onShowRating }) => {
  // Tính toán số sao đã được memoize
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
    <div className="flex items-center gap-2">
      <span className="flex items-center">
        {stars.map((type, i) => (
          <span key={i}>
            {type === 'full' && <FaStar className="w-5 h-5 text-yellow-400" />}
            {type === 'half' && <FaStarHalfAlt className="w-5 h-5 text-yellow-400" />}
            {type === 'empty' && <FaRegStar className="w-5 h-5 text-gray-300" />}
          </span>
        ))}
      </span>
      <span className="text-gray-700 ml-2 mr-3">
        {rating.toFixed(1)} ({totalRatings} đánh giá)
      </span>
      <button
        type="button"
        className="flex items-center gap-1 text-yellow-500 hover:text-yellow-600 focus:outline-none"
        onClick={onShowRating}
      >
        <FaRegStar className="w-6 h-6" />
        <span className="font-medium">Đánh giá</span>
      </button>
    </div>
  );
});

// Component thông tin phim
const MovieInfo = memo(({ 
  movie, 
  rating, 
  totalRatings, 
  onShowRating, 
  onToggleShowMore, 
  isShowMore 
}) => {
  const directorName = movie?.Director?.name || "Unknown Director";

  return (
    <div className="flex-1">
      <div className="mb-8">
        <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-gray-100 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3 hidden lg:block">{movie?.name}</h1>
          
          <div className="flex flex-wrap gap-2 mb-5">
            {movie?.MovieGenres?.map(mg => (
              <span key={mg.Genre?.id} className="px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-700 font-medium border border-orange-200">
                {mg.Genre?.name}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4 text-gray-700">
              <div className="flex">
                <span className="w-32 text-gray-500 font-medium">Đạo diễn:</span>
                <Link to={`/director/${movie?.Director?.id}`} className="text-orange-600 hover:text-orange-700 hover:underline font-medium transition">
                  {directorName}
                </Link>
              </div>
              
              <div className="flex">
                <span className="w-32 text-gray-500 font-medium">Diễn viên:</span>
                <div className="flex flex-wrap">
                  {movie?.MovieActors?.map((actorRelation, index) => (
                    <Link 
                      key={actorRelation.Actor?.id} 
                      to={`/actor/${actorRelation.Actor?.id}`} 
                      className="text-orange-600 hover:text-orange-700 hover:underline transition"
                    >
                      {actorRelation.Actor?.name}
                      {index < movie.MovieActors.length - 1 ? ", " : ""}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <div className="flex">
                <span className="w-32 text-gray-500 font-medium">Nhà sản xuất:</span>
                <div className="flex flex-wrap">
                  {movie?.MovieProducers?.map((producerRelation, index) => (
                    <Link 
                      key={producerRelation.Producer?.id} 
                      to={`/producer/${producerRelation.Producer?.id}`} 
                      className="text-orange-600 hover:text-orange-700 hover:underline transition"
                    >
                      {producerRelation.Producer?.name}
                      {index < movie.MovieProducers.length - 1 ? ", " : ""}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="flex">
                <span className="w-32 text-gray-500 font-medium">Thời lượng:</span>
                <span className="font-medium">{movie?.duration} phút</span>
              </div>
              
              <div className="flex">
                <span className="w-32 text-gray-500 font-medium">Năm sản xuất:</span>
                <span className="font-medium">{movie?.year}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-5 flex items-center">
            <span className="w-32 text-gray-500 font-medium">Độ tuổi:</span>
            <span className="flex items-center">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-yellow-500 text-sm font-bold text-black mr-2 shadow">
                {movie?.age_rating === 0 ? "P" : `C${movie?.age_rating}`}
              </span>
              <span className="text-gray-700">
                {movie?.age_rating === 0 ? "Phim dành cho mọi lứa tuổi" : `Cấm khán giả dưới ${movie?.age_rating} tuổi`}
              </span>
            </span>
          </div>

          <div className="mt-5 flex items-center">
            <span className="w-32 text-gray-500 font-medium">Đánh giá:</span>
            <RatingStars 
              rating={rating} 
              totalRatings={totalRatings} 
              onShowRating={onShowRating} 
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-2xl shadow-lg border border-orange-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Mô Tả Phim
          </h2>
          <div className="relative">
            <p className={`text-gray-700 leading-relaxed ${!isShowMore ? 'line-clamp-3' : ''}`}>
              {movie?.description}
            </p>
            <button 
              onClick={onToggleShowMore} 
              className="mt-2 text-orange-500 hover:text-orange-600 font-medium flex items-center transition-all duration-300"
            >
              {isShowMore ? (
                <>
                  Thu gọn <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"></path>
                  </svg>
                </>
              ) : (
                <>
                  Xem thêm <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path>
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// Component chính
export default function MovieDetail() {
  const { id } = useParams();
  
  // Data fetching với RTK Query
  const { data: movie, error, isLoading } = useGetMovieByIdQuery(id);
  const { data: reviewData, refetch: refetchReviews } = useGetReviewsByMovieIdQuery(id, {
    pollingInterval: 5000,
    refetchOnMountOrArgChange: true,
  });
  const [createReview] = useCreateReviewMutation();
  
  // Trích xuất dữ liệu
  const ListMovie = useMemo(() => movie?.movie, [movie]);
  const trailerId = useMemo(() => 
    ListMovie?.trailer ? ListMovie.trailer.split('/').pop() : null
  , [ListMovie?.trailer]);
  
  // States
  const [rating, setRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShowMore, setIsShowMore] = useState(false);
  const [showRating, setShowRating] = useState(false);

  // Cập nhật dữ liệu đánh giá khi có dữ liệu từ API
  useEffect(() => {
    if (reviewData) {
      setRating(reviewData.averageRating || 0);
      setTotalRatings(reviewData.totalRatings || 0);
      
      // Kiểm tra nếu người dùng đã đăng nhập
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      if (userData?.id && reviewData.data) {
        // Tìm đánh giá của người dùng hiện tại
        const userReview = reviewData.data.find(
          (review) => review.user_id === userData.id
        );
        setUserRating(userReview?.rating || 0);
      }
    }
  }, [reviewData]);

  // Handlers với useCallback
  const handleShowTrailer = useCallback(() => setIsModalOpen(true), []);
  const handleCloseTrailer = useCallback(() => setIsModalOpen(false), []);
  const handleToggleShowMore = useCallback(() => setIsShowMore(prev => !prev), []);
  const handleShowRating = useCallback(() => setShowRating(true), []);
  const handleCloseRating = useCallback(() => setShowRating(false), []);
  
  const handleSubmitRating = useCallback(async (value, user_id) => {
    try {
      // Gửi đánh giá lên server
      const result = await createReview({ 
        movie_id: parseInt(id), 
        user_id: parseInt(user_id), 
        rating: value 
      }).unwrap();
      
      // Đóng modal sau khi đánh giá
      setShowRating(false);
      
      // Cập nhật UI ngay lập tức cho người dùng hiện tại
      if (result?.success) {
        // Buộc cập nhật dữ liệu mới từ server
        refetchReviews();
        
        toast.success(result.message || "Đánh giá phim thành công!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Lỗi khi đánh giá:", error);
      toast.error("Có lỗi xảy ra khi gửi đánh giá!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, [id, createReview, refetchReviews]);

  // Loading and error states
  if (isLoading) return (
    <div className="min-h-[300px] flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 rounded-full bg-orange-300 mb-2"></div>
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-600 flex items-center justify-center">
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      Error loading movie details.
    </div>
  );

  if (!ListMovie) return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-blue-600 flex items-center justify-center">
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      Movie not found
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto relative">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Movie Image */}
        <MoviePoster 
          poster={ListMovie.poster}
          name={ListMovie.name}
          trailer={ListMovie.trailer}
          onShowTrailer={handleShowTrailer}
          ageRating={ListMovie.age_rating}
        />

        {/* Movie Info */}
        <MovieInfo 
          movie={ListMovie}
          rating={rating}
          totalRatings={totalRatings}
          onShowRating={handleShowRating}
          onToggleShowMore={handleToggleShowMore}
          isShowMore={isShowMore}
        />
      </div>

      {/* Modal Trailer - chỉ render khi cần */}
      {isModalOpen && trailerId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-[9999] backdrop-blur-md">
          <div className="relative bg-black p-1 rounded-xl w-full max-w-4xl overflow-hidden shadow-2xl">
            <button
              onClick={handleCloseTrailer}
              className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-black/90 text-white rounded-full z-10 transition-all duration-300 hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <iframe
              width="100%"
              height="500"
              src={`https://www.youtube.com/embed/${trailerId}?autoplay=1`}
              title="Trailer phim"
              className="rounded-lg"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Modal Rating - chỉ render khi cần */}
      {showRating && (
        <RatingMovie
          poster={formatImage(ListMovie?.poster)}
          name={ListMovie?.name}
          rating={rating}
          totalRatings={totalRatings}
          onClose={handleCloseRating}
          onSubmit={handleSubmitRating}
          defaultValue={userRating}
          maxStars={5}
        />
      )}
      
      <style>{`
        .shadow-text {
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
}
