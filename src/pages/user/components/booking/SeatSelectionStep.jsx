import MovieScreen from '@/components/MovieScreen';
import SeatGrid from '../SeatGrid';
import SeatLegend from '../SeatLegend';
import OtherShowtimeNotification from '../OtherShowtimeNotification';

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