import MovieScreen from '@/components/MovieScreen';
import SeatGrid from '../SeatGrid';
import SeatLegend from '../SeatLegend';
import OtherShowtimeNotification from '../OtherShowtimeNotification';
import { useEffect, useState, useCallback } from 'react';

const SeatSelectionStep = ({
  listSeats,
  refetchSeats,
  selectedSeats,
  listSeatTypes,
  isLoading,
  hasActiveReservation,
  activeReservationInfo,
  handleSeatClick,
  setSearchParams
}) => {
  // // State để lưu thời gian còn lại
  // const [remainingTime, setRemainingTime] = useState('');
  // const [isAlmostExpired, setIsAlmostExpired] = useState(false);
  // const [isExpiring, setIsExpiring] = useState(false);
  // const [seconds, setSeconds] = useState(0);

  // // Tính toán thời gian còn lại
  // const calculateTimeRemaining = useCallback(() => {
  //   if (!activeReservationInfo || !activeReservationInfo.expires_at) return;

  //   const expiresAt = new Date(activeReservationInfo.expires_at).getTime();
  //   const now = new Date().getTime();
  //   const diffSeconds = Math.max(0, Math.floor((expiresAt - now) / 1000));
    
  //   setSeconds(diffSeconds);
    
  //   if (diffSeconds <= 0) {
  //     setRemainingTime('00:00');
  //     return;
  //   }
    
  //   // Cập nhật trạng thái sắp hết hạn
  //   setIsAlmostExpired(diffSeconds < 180); // Dưới 3 phút
  //   setIsExpiring(diffSeconds < 60); // Dưới 1 phút
    
  //   const minutes = Math.floor(diffSeconds / 60);
  //   const seconds = diffSeconds % 60;
    
  //   setRemainingTime(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
  // }, [activeReservationInfo]);

  // // useEffect để tính toán thời gian còn lại
  // useEffect(() => {
  //   // Tính thời gian ngay khi component render
  //   calculateTimeRemaining();
    
  //   // Cập nhật mỗi giây
  //   const interval = setInterval(calculateTimeRemaining, 1000);
    
  //   return () => clearInterval(interval);
  // }, [calculateTimeRemaining, activeReservationInfo]);

  // // Render thời gian còn lại với màu sắc phù hợp
  // const renderRemainingTime = () => {
  //   let timerClass = "font-bold text-lg";
    
  //   if (isExpiring) {
  //     timerClass += " text-red-600 animate-pulse";
  //   } else if (isAlmostExpired) {
  //     timerClass += " text-orange-600";
  //   } else {
  //     timerClass += " text-yellow-800";
  //   }
    
  //   return (
  //     <div className="flex flex-col items-center">
  //       <span className={timerClass}>{remainingTime}</span>
  //       <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
  //         <div 
  //           className={`h-2.5 rounded-full ${isExpiring ? 'bg-red-600' : isAlmostExpired ? 'bg-orange-500' : 'bg-green-600'}`} 
  //           style={{ width: `${Math.min(100, (seconds / 600) * 100)}%` }}
  //         ></div>
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <>
      {/* Thông báo nếu có đơn hàng ở suất chiếu khác */}
      {hasActiveReservation && activeReservationInfo?.isOtherShowtime && (
        <OtherShowtimeNotification 
          activeReservationInfo={activeReservationInfo} 
          onContinuePayment={() => setSearchParams({ 
            room_id: activeReservationInfo?.showtime?.room?.id, 
            step: "payment", 
            showtime_id: activeReservationInfo?.showtime?.id 
          })}
        />
      )}
      
      {/* Hiển thị thông báo đơn hàng đang xử lý */}
      
      {/* Hiển thị màn hình */}
      <MovieScreen />
      
      {/* Hiển thị danh sách ghế */}
      <SeatGrid 
        listSeats={listSeats}
        selectedSeats={selectedSeats}
        listSeatTypes={listSeatTypes}
        isLoading={isLoading}
        hasActiveReservation={hasActiveReservation}
        activeReservationInfo={activeReservationInfo}
        onSeatClick={handleSeatClick}
      />

      {/* Chú thích các loại ghế */}
      <SeatLegend listSeatTypes={listSeatTypes} />
    </>
  );
};

export default SeatSelectionStep; 