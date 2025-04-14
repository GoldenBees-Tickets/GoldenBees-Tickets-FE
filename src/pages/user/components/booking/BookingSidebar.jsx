import React, { useState, useEffect, useCallback } from "react";
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
  onReservationUpdate
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
      console.log("Reservation expired, clearing data...");
      
      // Store the showtime_id and room_id before clearing
      const showtimeId = reservation?.showtime?.id;
      const roomId = reservation?.showtime?.room_id;
      
      // Clear localStorage items
      localStorage.removeItem('finalPrice');
      localStorage.removeItem('reservation');
      
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
  
  const totalPrice = calculateTotalPrice();
  const discount = discountValue();
  const finalPrice = totalPrice - discount;
  if(finalPrice) {
    localStorage.setItem("finalPrice", finalPrice);
  }

  return (
    <div className="w-full md:w-[30%] ml-5 mt-6 md:mt-0">
      <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-yellow-500">
        {/* Countdown Timer */}
        {(hasActiveReservation || reservation) && remainingTime.minutes >= 0 && remainingTime.seconds >= 0 && (
          <div className="mb-4 bg-orange-100 p-3 rounded-lg text-center">
            <p className="text-sm text-gray-700">Thời gian giữ ghế còn lại:</p>
            <p className="text-xl font-bold text-orange-600">
              {String(remainingTime.minutes).padStart(2, '0')}:{String(remainingTime.seconds).padStart(2, '0')}
            </p>
            {remainingTime.minutes === 0 && remainingTime.seconds < 30 && (
              <p className="text-xs text-red-600 mt-1 font-medium">Sắp hết thời gian đặt vé!</p>
            )}
          </div>
        )}
        
        {/* Thông tin phim */}
        <MovieInfo showtimeData={showtimeData} imageBaseUrl={imageBaseUrl} />

        {/* Thông tin ghế đã chọn */}
        <div className="mt-4 border-t pt-4">
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
          <div className="mt-4 border-t pt-4">
            <p className="font-medium">🍿 Đồ ăn đã chọn:</p>
            <ul className="mt-2 space-y-2">
              {selectedFoodItems.map((item, index) => (
                <li key={index} className="flex justify-between text-sm">
                  <span>
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
          <div className="mt-6 text-sm text-gray-600 italic">
            {descriptionDiscount}
          </div>
        )}

        {/* Tổng giá tiền */}
        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <p className="text-lg flex justify-between">
            Tạm tính:{" "}
            <span className="text-red-600">
              {totalPrice.toLocaleString()} đ
            </span>
          </p>
          {discount > 0 && (
            <p className="text-lg font-medium flex justify-between">
              Giảm giá:{" "}
              <span className="text-green-600">
                - {discount.toLocaleString()} đ
              </span>
            </p>
          )}
          <p className="text-lg font-semibold flex justify-between border-t pt-2 mt-2">
            Tổng cộng:{" "}
            <span className="text-red-600">
              {finalPrice.toLocaleString()} đ
            </span>
          </p>
        </div>

        {/* Các nút điều hướng */}
        <div
          className={`mt-8 flex flex-col md:flex-row gap-4 ${
            checkCancel === "payment" || checkCancel === "food"
              ? "justify-between"
              : "justify-end"
          }`}
        >
          {(checkCancel === "payment" || checkCancel === "food") && (
            <button
              onClick={handleBack}
              className="w-full md:w-1/2 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
            >
              Quay lại
            </button>
          )}
          {renderContinueButton()}
        </div>
      </div>
    </div>
  );
};

export default BookingSidebar;
