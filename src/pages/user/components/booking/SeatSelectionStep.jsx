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
      {activeReservationInfo && !activeReservationInfo.isOtherShowtime && (
        <div className={`rounded-md p-4 mb-6 flex justify-between items-center shadow-md 
                         ${isExpiring ? 'bg-red-50 border-2 border-red-300' : 
                         isAlmostExpired ? 'bg-orange-50 border border-orange-300' : 
                         'bg-yellow-50 border border-yellow-300'}`}>
          <div className="flex flex-col space-y-2 flex-grow">
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isExpiring ? 'text-red-600' : isAlmostExpired ? 'text-orange-600' : 'text-yellow-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-gray-800 text-base">
                Thời gian giữ ghế:
              </span>
            </div>
            <div className="flex items-center justify-between pl-8 pr-4">
              <div>
                <p className="text-gray-700">
                  <span className="font-medium">Bạn đang đặt {activeReservationInfo.seats?.length || 0} ghế</span>
                </p>
                {isExpiring && (
                  <p className="text-red-600 text-sm font-medium">Sắp hết thời gian, vui lòng thanh toán ngay!</p>
                )}
                {isAlmostExpired && !isExpiring && (
                  <p className="text-orange-600 text-sm">Thời gian sắp hết, hãy thanh toán sớm!</p>
                )}
              </div>
              <div className="ml-4 w-24">
                {renderRemainingTime()}
              </div>
            </div>
          </div>
          <button 
            onClick={() => setSearchParams({ room_id: activeReservationInfo?.showtime?.room?.id, step: "payment" })}
            className={`px-4 py-2 text-white rounded-md transition-colors ml-4 whitespace-nowrap
                       ${isExpiring ? 'bg-red-600 hover:bg-red-700' : 
                       isAlmostExpired ? 'bg-orange-600 hover:bg-orange-700' : 
                       'bg-yellow-600 hover:bg-yellow-700'}`}
          >
            Thanh toán ngay
          </button>
        </div>
      )}
      
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