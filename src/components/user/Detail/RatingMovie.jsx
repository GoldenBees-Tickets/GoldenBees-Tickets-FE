import { useMemo, useState, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { useGetUserQuery } from "@/api/userApi";
import { toast } from "react-toastify";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export default function RatingMovie({
  poster,
  name,
  rating = 0,
  totalRatings = 0,
  onClose,
  onSubmit,
  defaultValue = 0,
  maxStars = 5,
}) {
  const [selected, setSelected] = useState(defaultValue);
  const [hovered, setHovered] = useState(0);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const starsRefs = useRef([]);

  const accessToken = localStorage.getItem("accessToken");
  const dataStorage = useMemo(
    () => JSON.parse(localStorage.getItem("user") || "{}"),
    []
  );
  const id = dataStorage?.id;

  const { data: user, error, isLoading } = useGetUserQuery(id, {
    skip: !accessToken, // Bỏ qua query nếu không có token
  });

  const userData = useMemo(() => user?.user || user, [user]);
  
  // Xác định nửa sao hay sao đầy dựa vào vị trí click
  const handleStarClick = (index, event) => {
    if (!accessToken || !userData) {
      setShowLoginMessage(true);
      toast.error("Vui lòng đăng nhập để đánh giá!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const starElement = starsRefs.current[index];
    if (!starElement) return;

    const rect = starElement.getBoundingClientRect();
    const starWidth = rect.width;
    const clickPosition = event.clientX - rect.left;
    
    // Nếu click vào nửa đầu của sao, đánh giá là x.5
    // Nếu click vào nửa sau của sao, đánh giá là x.0
    const isHalfStar = clickPosition <= starWidth / 2;
    const value = isHalfStar ? index + 0.5 : index + 1;
    
    setSelected(value);
  };

  // Xử lý hover trên sao với half-star precision
  const handleStarHover = (index, event) => {
    const starElement = starsRefs.current[index];
    if (!starElement) return;

    const rect = starElement.getBoundingClientRect();
    const starWidth = rect.width;
    const hoverPosition = event.clientX - rect.left;
    
    const isHalfStar = hoverPosition <= starWidth / 2;
    const value = isHalfStar ? index + 0.5 : index + 1;
    
    setHovered(value);
  };

  const handleStarLeave = () => {
    setHovered(0);
  };

  const handleRatingSubmit = () => {
    if (!accessToken || !userData) {
      setShowLoginMessage(true);
      toast.error("Vui lòng đăng nhập để đánh giá!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    
    // Gửi rating kèm theo user_id
    onSubmit && onSubmit(selected || defaultValue, userData.id);
  };

  // Render các sao với khả năng hiển thị nửa sao
  const renderStars = () => {
    const stars = [];
    
    for (let i = 0; i < maxStars; i++) {
      let starValue = 0;
      
      // Xác định giá trị sao dựa vào trạng thái hover hoặc selected
      if (hovered > 0) {
        if (i + 1 <= Math.floor(hovered)) {
          starValue = 1; // Sao đầy
        } else if (i + 0.5 === hovered) {
          starValue = 0.5; // Nửa sao
        }
      } else if (selected > 0) {
        if (i + 1 <= Math.floor(selected)) {
          starValue = 1; // Sao đầy
        } else if (i + 0.5 === selected) {
          starValue = 0.5; // Nửa sao
        }
      } else if (defaultValue > 0) {
        if (i + 1 <= Math.floor(defaultValue)) {
          starValue = 1; // Sao đầy
        } else if (i + 0.5 === defaultValue) {
          starValue = 0.5; // Nửa sao
        }
      }
      
      stars.push(
        <div 
          key={i}
          ref={el => starsRefs.current[i] = el}
          className="cursor-pointer w-8 h-8"
          onClick={(e) => handleStarClick(i, e)}
          onMouseMove={(e) => handleStarHover(i, e)}
          onMouseLeave={handleStarLeave}
        >
          {starValue === 1 && <FaStar className="w-full h-full text-yellow-400" />}
          {starValue === 0.5 && <FaStarHalfAlt className="w-full h-full text-yellow-400" />}
          {starValue === 0 && <FaRegStar className="w-full h-full text-gray-300" />}
        </div>
      );
    }
    
    return stars;
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative overflow-hidden">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl z-10"
          onClick={onClose}
        >
          <IoMdClose />
        </button>
        {/* Poster */}
        <div className="w-full h-56 bg-gray-200 relative flex items-center justify-center">
          <img
            src={poster}
            alt={name}
            className="h-full object-cover w-full rounded-t-xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80" />
        </div>
        {/* Info */}
        <div className="p-6 pt-4 flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2 text-center">{name}</h2>
          <div className="flex items-center mb-2">
            <span className="text-2xl font-bold text-yellow-500 mr-2">{rating.toFixed(1)}</span>
            <span className="text-gray-500 text-sm">({totalRatings} đánh giá)</span>
          </div>
          
          {/* Login Message */}
          {showLoginMessage && !accessToken && (
            <div className="mb-3 text-center text-red-500 text-sm bg-red-50 px-3 py-2 rounded-md w-full">
              Vui lòng đăng nhập để đánh giá!
            </div>
          )}
          
          {/* Stars */}
          <div className="flex items-center mb-4 gap-1">
            {renderStars()}
          </div>
          
          {/* Display selected value */}
          <div className="mb-3 text-center">
            <span className="text-lg font-semibold text-yellow-500">
              {selected > 0 ? selected.toFixed(1) : defaultValue > 0 ? defaultValue.toFixed(1) : "0.0"}
            </span> / {maxStars.toFixed(1)}
          </div>
          
          {/* Confirm button */}
          <button
            className={`w-full ${
              !accessToken || !userData
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            } text-white font-semibold py-2 rounded-lg transition mb-2`}
            onClick={handleRatingSubmit}
            disabled={!accessToken || (!selected && !defaultValue)}
          >
            {!accessToken || !userData ? "Đăng nhập để đánh giá" : "Xác Nhận"}
          </button>
        </div>
      </div>
    </div>
  );
}
