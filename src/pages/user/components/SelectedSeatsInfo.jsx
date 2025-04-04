import { useMemo } from 'react';

// Component hiển thị thông tin ghế đã chọn
export default function SelectedSeatsInfo({
  selectedSeats,
  hasActiveReservation,
  activeReservationInfo,
  onContinuePayment
}) {
  // Hiển thị thông tin ghế đã chọn
  const renderSelectedSeatsInfo = useMemo(() => {
    if (hasActiveReservation && activeReservationInfo?.isOtherShowtime) {
      return (
        <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 mb-4">
          <p className="font-medium text-yellow-800">
            Bạn đang có đơn hàng ở suất chiếu khác đang xử lý
          </p>
          <p className="text-sm text-yellow-700 mt-1">
            Phim: {activeReservationInfo.showtime?.movie?.name}
          </p>
          <button 
            onClick={onContinuePayment}
            className="mt-2 w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
          >
            Tiếp tục thanh toán
          </button>
        </div>
      );
    }
    
    if (selectedSeats.length === 0) {
      return <p className="text-gray-500">Chưa có ghế nào được chọn</p>;
    }
    
    return (
      <div>
        <p className="font-medium">Ghế đã chọn:</p>
        <div className="flex flex-wrap gap-2 mt-1">
          {selectedSeats.map((seat) => (
            <span 
              key={seat.id} 
              className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm"
            >
              {seat.seat_row}{seat.seat_number}
            </span>
          ))}
        </div>
      </div>
    );
  }, [selectedSeats, hasActiveReservation, activeReservationInfo, onContinuePayment]);

  return renderSelectedSeatsInfo;
} 