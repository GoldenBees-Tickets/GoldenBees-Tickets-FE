import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

export const useReservation = (showtime_id, room_id, user_id, setSearchParams) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [hasActiveReservation, setHasActiveReservation] = useState(false);
  const [activeReservationInfo, setActiveReservationInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Kiểm tra đơn hàng hiện có
  const checkExistingReservation = useCallback(() => {
    const reservationData = localStorage.getItem("reservation");
    if (!reservationData) return;
    
    try {
      const reservation = JSON.parse(reservationData);
      const expiresAt = new Date(reservation.expires_at).getTime();
      const now = new Date().getTime();
      
      if (expiresAt > now) {
        // Nếu thời gian chưa hết - kiểm tra xem đơn hàng có phải ở phim hiện tại không
        if (reservation.showtime?.id.toString() === showtime_id) {
          // Nếu đúng suất chiếu này, cho phép thay đổi ghế
          setHasActiveReservation(false);
          setActiveReservationInfo(reservation);
          setSelectedSeats(reservation.seats);
          
          // Khôi phục danh sách đồ ăn đã chọn (nếu có)
          return { reservation, isSameShowtime: true };
        } else {
          // Nếu là suất chiếu khác, hiển thị thông báo
          setHasActiveReservation(true);
          const reservationWithFlag = {
            ...reservation,
            isOtherShowtime: true
          };
          setActiveReservationInfo(reservationWithFlag);
          return { reservation: reservationWithFlag, isSameShowtime: false };
        }
      } else {
        // Nếu thời gian đã hết, xóa reservation và reset
        clearExpiredReservation();
        return null;
      }
    } catch (error) {
      console.error("Lỗi khi đọc dữ liệu đặt vé:", error);
      return null;
    }
  }, [showtime_id]);

  // Xóa đơn đặt vé đã hết hạn
  const clearExpiredReservation = useCallback(() => {
    localStorage.removeItem("reservation");
    localStorage.removeItem(`momoPaymentInfo`);
    localStorage.removeItem(`payment_info`);
    sessionStorage.removeItem(`selectedSeats_${showtime_id}`);
    setSelectedSeats([]);
    setHasActiveReservation(false);
    setActiveReservationInfo(null);
    toast.info("Phiên đặt vé đã hết hạn. Vui lòng chọn ghế lại.");
    setSearchParams({ room_id, step: "seats" });
  }, [showtime_id, room_id, setSearchParams]);

  // Khôi phục ghế đã chọn từ sessionStorage
  const restoreSavedSeats = useCallback(() => {
    const savedSeats = sessionStorage.getItem(`selectedSeats_${showtime_id}`);
    if (savedSeats && !hasActiveReservation) {
      try {
        setSelectedSeats(JSON.parse(savedSeats));
      } catch (error) {
        console.error("Lỗi khi đọc dữ liệu ghế đã lưu:", error);
      }
    }
  }, [showtime_id, hasActiveReservation]);
  
  // Lưu ghế đã chọn vào sessionStorage
  const saveSelectedSeatsToSession = useCallback(() => {
    sessionStorage.setItem(
      `selectedSeats_${showtime_id}`,
      JSON.stringify(selectedSeats)
    );
  }, [selectedSeats, showtime_id]);
  
  // Cập nhật ghế trong đơn đặt vé hiện có
  const updateExistingReservationSeats = useCallback((seat, isSelected) => {
    let newSelectedSeats;
    
    if (isSelected) {
      // Bỏ chọn ghế
      newSelectedSeats = selectedSeats.filter((s) => s.id !== seat.id);
    } else {
      // Thêm ghế mới
      newSelectedSeats = [...selectedSeats, seat];
    }
    
    setSelectedSeats(newSelectedSeats);
    
    // Cập nhật reservation trong localStorage
    if (activeReservationInfo && !activeReservationInfo.isOtherShowtime) {
      const updatedReservation = {
        ...activeReservationInfo,
        seats: newSelectedSeats
      };
      localStorage.setItem("reservation", JSON.stringify(updatedReservation));
      setActiveReservationInfo(updatedReservation);
    }
  }, [selectedSeats, activeReservationInfo]);
  
  // Cập nhật đơn đặt vé hiện có
  const updateExistingReservation = useCallback((preparedSeats) => {
    localStorage.setItem("reservation", JSON.stringify({
      ...activeReservationInfo,
      seats: preparedSeats
    }));
    
    setSearchParams({ room_id, step: "food" });
    setIsLoading(false);
  }, [activeReservationInfo, setSearchParams, room_id]);
  
  // Lưu dữ liệu đặt vé vào localStorage
  const saveReservationData = useCallback((preparedSeats, response, showtimeData) => {    
    // Tạo đối tượng reservation
    const reservationData = {
      seats: preparedSeats,
      showtime: typeof showtimeData === 'object' ? showtimeData : { id: showtimeData },
      holdTime: response.holdTime,
      expires_at: response.expires_at,
      reserved_at: new Date().toISOString(),
      foodItems: []
    };
    
    localStorage.setItem("reservation", JSON.stringify(reservationData));

    setHasActiveReservation(false);
    setActiveReservationInfo(reservationData);
    
    return reservationData;
  }, []);
  
  // Load dữ liệu khi component mount
  useEffect(() => {
    checkExistingReservation();
    restoreSavedSeats();
  }, [checkExistingReservation, restoreSavedSeats]);

  return {
    selectedSeats,
    setSelectedSeats,
    hasActiveReservation,
    setHasActiveReservation,
    activeReservationInfo,
    setActiveReservationInfo,
    isLoading,
    setIsLoading,
    checkExistingReservation,
    clearExpiredReservation,
    restoreSavedSeats,
    saveSelectedSeatsToSession,
    updateExistingReservationSeats,
    updateExistingReservation,
    saveReservationData
  };
}

export default useReservation; 