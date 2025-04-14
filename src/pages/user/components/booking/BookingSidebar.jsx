import React, { useState, useEffect, useCallback, useMemo } from "react";
import MovieInfo from "../MovieInfo";
import SelectedSeatsInfo from "../SelectedSeatsInfo";
import { useSearchParams } from "react-router-dom";

const BookingSidebar = ({
  showtimeData,
  imageBaseUrl,
  selectedSeats,
  hasActiveReservation,
  activeReservationInfo,
  selectedFoodItems,
  calculateTotalPrice,
  discountValue,
  handleBack,
  renderContinueButton,
  setSearchParams,
  descriptionDiscount,
  listSeatTypes,
  onReservationUpdate,
  onApplyStar
}) => {
  const [remainingTime, setRemainingTime] = useState({ minutes: 0, seconds: 0 });
  const [searchParams, updateSearchParams] = useSearchParams();
  const checkCancel = searchParams.get("step") || "";
  const [reservation, setReservation] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  
  // Handler for reservation cancellation
  const handleReservationCancel = useCallback(() => {
    // Update local state
    setReservation(null);
    setRemainingTime({ minutes: 0, seconds: 0 });
    
    // Notify parent component to update its state
    if (typeof onReservationUpdate === 'function') {
      onReservationUpdate({
        type: 'CANCEL_RESERVATION',
        hasActiveReservation: false,
        activeReservationInfo: null
      });
    }
  }, [onReservationUpdate]);

  // Effect to continuously check for reservation data in localStorage
  useEffect(() => {
    const checkReservation = () => {
      const reservationData = localStorage.getItem('reservation');
      if (reservationData) {
        try {
          const parsedReservation = JSON.parse(reservationData);
          setReservation(parsedReservation);
        } catch (error) {
          console.error("Error parsing reservation data:", error);
        }
      } else {
        setReservation(null);
      }
    };

    // Check immediately on mount
    checkReservation();
    
    // Set up interval to check every second for changes in localStorage
    const checkInterval = setInterval(checkReservation, 1000);
    
    return () => clearInterval(checkInterval);
  }, []);

  // Countdown timer based on current reservation data
  useEffect(() => {
    if (!reservation || !reservation.expires_at) {
      setRemainingTime({ minutes: 0, seconds: 0 });
      return;
    }
    
    const expiresAt = new Date(reservation.expires_at);
    
    const updateRemainingTime = () => {
      const now = new Date();
      const diffMs = expiresAt - now;
      
      if (diffMs <= 0) {
        setRemainingTime({ minutes: 0, seconds: 0 });
        setIsExpired(true);
        return;
      }
      
      const minutes = Math.floor(diffMs / 60000);
      const seconds = Math.floor((diffMs % 60000) / 1000);
      setRemainingTime({ minutes, seconds });
    };
    
    // Initial update
    updateRemainingTime();
    
    // Set interval to update every second
    const timerInterval = setInterval(updateRemainingTime, 1000);
    
    return () => clearInterval(timerInterval);
  }, [reservation]);
  
  // Effect to handle expiration and clear storage
  useEffect(() => {
    if (isExpired) {      
      // Store the showtime_id and room_id before clearing
      const showtimeId = reservation?.showtime?.id;
      const roomId = reservation?.showtime?.room_id;
      
      // Clear localStorage items
      localStorage.removeItem('finalPrice');
      localStorage.removeItem('reservation');
      localStorage.removeItem('booking_cart'); // Xóa cả thông tin giỏ hàng
      
      // Clear all sessionStorage
      sessionStorage.clear();
      
      // Reset expired state
      setIsExpired(false);
      
      // Notify parent component
      if (typeof onReservationUpdate === 'function') {
        onReservationUpdate({
          type: 'CANCEL_RESERVATION',
          hasActiveReservation: false,
          activeReservationInfo: null
        });
      }
      
      // Redirect back to the booking page with the showtime_id and room_id
      if (showtimeId && roomId) {
        alert("Thời gian giữ ghế đã hết. Bạn sẽ được chuyển về trang đặt vé.");
        
        // Use setSearchParams to navigate back to the initial booking page
        window.location.href = `/booking/${showtimeId}?room_id=${roomId}`;
      } else {
        // Fallback if we can't find the showtime_id and room_id
        alert("Thời gian giữ ghế đã hết. Vui lòng đặt lại từ đầu.");
        setSearchParams({});
      }
    }
  }, [isExpired, setSearchParams, reservation, onReservationUpdate]);
  
  // Memoize giá vé và giá đồ ăn để tránh tính toán lại khi re-render
  const ticketPrice = useMemo(() => {
    if (!selectedSeats || selectedSeats.length === 0 || !listSeatTypes?.seat_types) {
      return 0;
    }
    
    return selectedSeats.reduce((total, seat) => {
      // Tìm loại ghế tương ứng
      const seatType = listSeatTypes.seat_types.find(type => type.id === seat.seat_type_id);
      // Lấy giá của loại ghế đó
      const seatPrice = seatType ? parseFloat(seatType.price) : 0;
      return total + seatPrice;
    }, 0);
  }, [selectedSeats, listSeatTypes?.seat_types]);
  
  const foodPrice = useMemo(() => {
    if (!selectedFoodItems || selectedFoodItems.length === 0) {
      return 0;
    }
    
    return selectedFoodItems.reduce((total, item) => {
      const itemPrice = parseFloat(item.price);
      const quantity = parseInt(item.quantity);
      return total + (itemPrice * quantity);
    }, 0);
  }, [selectedFoodItems]);
  
  // Memo các giá trị tổng đơn hàng để tránh tính toán lại
  const totalPrice = useMemo(() => calculateTotalPrice(), [calculateTotalPrice]);
  const discount = useMemo(() => discountValue(), [discountValue]);
  const finalPrice = useMemo(() => totalPrice - discount - onApplyStar?.discountAmount, [totalPrice, discount, onApplyStar?.discountAmount]);
  
  // Tạo đối tượng cart details với useMemo
  const cartDetails = useMemo(() => {
    return {
      totalPrice: finalPrice,
      ticketPrice: ticketPrice,
      foodPrice: foodPrice,
      originalPrice: totalPrice,
      discount: discount,
      timestamp: new Date().getTime(),
      selectedSeats: selectedSeats.length,
      selectedFoodItems: selectedFoodItems.length,
      appliedPromotionType: discount > 0 ? 'promotion_applied' : 'no_promotion'
    };
  }, [finalPrice, ticketPrice, foodPrice, totalPrice, discount, selectedSeats.length, selectedFoodItems.length]);
  
  // Lưu thông tin giỏ hàng vào localStorage khi có thay đổi (debounced)
  useEffect(() => {
    if (!finalPrice) return;
    
    // Tạo ID duy nhất cho lần lưu này để tránh nhiều lần lưu cùng lúc
    const saveTimerId = setTimeout(() => {
      try {
        localStorage.setItem('booking_cart', JSON.stringify(cartDetails));
        localStorage.setItem('finalPrice', finalPrice);
      } catch (error) {
        console.error('Lỗi khi lưu thông tin giỏ hàng:', error);
      }
    }, 300); // Debounce 300ms
    
    return () => clearTimeout(saveTimerId);
  }, [cartDetails, finalPrice]);

  return (
    <div className="w-full lg:w-[30%] md:w-[35%] px-3 md:px-0 md:ml-4 lg:ml-5 mt-6 md:mt-0">
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-5 lg:p-6 border-t-4 border-yellow-500">
        {/* Countdown Timer */}
        {(hasActiveReservation || reservation) && remainingTime.minutes >= 0 && remainingTime.seconds >= 0 && (
          <div className="mb-3 md:mb-4 bg-orange-100 p-2 md:p-3 rounded-lg text-center">
            <p className="text-xs md:text-sm text-gray-700">Thời gian giữ ghế còn lại:</p>
            <p className="text-lg md:text-xl font-bold text-orange-600">
              {String(remainingTime.minutes).padStart(2, '0')}:{String(remainingTime.seconds).padStart(2, '0')}
            </p>
            {remainingTime.minutes === 0 && remainingTime.seconds < 30 && (
              <p className="text-[10px] md:text-xs text-red-600 mt-1 font-medium">Sắp hết thời gian đặt vé!</p>
            )}
          </div>
        )}
        
        {/* Thông tin phim */}
        <MovieInfo showtimeData={showtimeData} imageBaseUrl={imageBaseUrl} />

        {/* Thông tin ghế đã chọn */}
        <div className="mt-3 md:mt-4 border-t pt-3 md:pt-4">
          <SelectedSeatsInfo
            selectedSeats={selectedSeats}
            hasActiveReservation={hasActiveReservation}
            activeReservationInfo={activeReservationInfo}
            onContinuePayment={() =>
              setSearchParams({
                room_id: activeReservationInfo?.showtime?.room?.id,
                step: "payment",
                showtime_id: activeReservationInfo?.showtime?.id,
              })
            }
            onReservationCancel={handleReservationCancel}
          />
        </div>

        {/* Hiển thị đồ ăn đã chọn */}
        {selectedFoodItems.length > 0 && (
          <div className="mt-3 md:mt-4 border-t pt-3 md:pt-4">
            <p className="font-medium text-sm md:text-base">🍿 Đồ ăn đã chọn:</p>
            <ul className="mt-2 space-y-1 md:space-y-2">
              {selectedFoodItems.map((item, index) => (
                <li key={index} className="flex justify-between text-xs md:text-sm">
                  <span className="line-clamp-1 max-w-[60%]">
                    <strong>{item.quantity}x</strong> {item.name}
                  </span>
                  <span className="font-semibold">
                    {(item.price * item.quantity).toLocaleString()} đ
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Mô tả giảm giá */}
        {descriptionDiscount && (
          <div className="mt-4 md:mt-6 text-xs md:text-sm text-gray-600 italic">
            {descriptionDiscount}
          </div>
        )}

        {/* Tổng giá tiền */}
        <div className="mt-4 md:mt-6 bg-gray-100 p-3 md:p-4 rounded-lg">
          <p className="text-base md:text-lg flex justify-between items-center">
            <span>Tạm tính:</span>
            <span className="text-red-600 font-medium">
              {totalPrice.toLocaleString()} đ
            </span>
          </p>
          {discount > 0 && (
            <p className="text-base md:text-lg flex justify-between items-center mt-1 md:mt-2">
              <span>Giảm giá:</span>
              <span className="text-green-600 font-medium">
                - {discount.toLocaleString()} đ
              </span>
            </p>
          )}
          {onApplyStar?.discountAmount > 0 && (
            <p className="text-base md:text-lg flex justify-between items-center mt-1 md:mt-2">
            <span>Giảm giá:</span>
            <span className="text-green-600 font-medium">
              - {onApplyStar?.discountAmount.toLocaleString()} đ
            </span>
          </p>
          )}
          <p className="text-base md:text-lg font-semibold flex justify-between items-center border-t pt-2 mt-2">
            <span>Tổng cộng:</span>
            <span className="text-red-600">
              {finalPrice.toLocaleString()} đ
            </span>
          </p>
        </div>

        {/* Các nút điều hướng */}
        <div
          className={`mt-5 md:mt-6 lg:mt-8 flex flex-col sm:flex-row gap-3 md:gap-4 ${
            checkCancel === "payment" || checkCancel === "food"
              ? "justify-between"
              : "justify-end"
          }`}
        >
          {(checkCancel === "payment" || checkCancel === "food") && (
            <button
              onClick={handleBack}
              className="w-full sm:w-auto sm:flex-1 md:w-1/2 px-3 py-2 md:px-4 md:py-2 text-sm md:text-base bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Quay lại
            </button>
          )}
          <div className="w-full sm:w-auto sm:flex-1 md:w-1/2">
            {renderContinueButton()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSidebar;
