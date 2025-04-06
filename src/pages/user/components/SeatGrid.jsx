import { useMemo } from 'react';

// Component hiển thị danh sách ghế
export default function SeatGrid({ 
  listSeats, 
  selectedSeats, 
  listSeatTypes, 
  isLoading, 
  hasActiveReservation, 
  activeReservationInfo, 
  onSeatClick 
}) {
  
  // Hiển thị danh sách ghế
  const renderSeats = useMemo(
    () =>
      listSeats?.data?.Seats?.map((seat, index) => {
        // Ghế đã được chọn trong session hiện tại 
        const isSelected = selectedSeats.find((s) => s.id === seat.id);
        
        // Ghế bị block bởi người khác (trừ ghế mình đã chọn)
        const isBlocked = (seat.status === "Blocked" || seat.status === "Booked") && !isSelected; 
        
        // Xác định loại ghế
        const seatType = listSeatTypes?.seat_types?.find(type => type.id === seat.type_id);
        const isVIP = seatType?.type?.toLowerCase().includes('vip');
        
        return (
          <div key={index} className="relative">
            <button
              disabled={!seat.is_enabled || isBlocked || isLoading || 
                       (hasActiveReservation && activeReservationInfo?.isOtherShowtime)}
              className={`w-6 h-6 md:w-8 md:h-8 border-2 rounded flex items-center justify-center text-xs md:text-sm
                ${
                  isSelected
                    ? "bg-orange-500 text-white" // Ghế đang chọn
                    : isBlocked
                    ? "bg-gray-500 text-white cursor-not-allowed" // Ghế bị block
                    : isVIP 
                    ? "border-yellow-500 text-black hover:bg-yellow-100" // Ghế VIP
                    : "border-gray-5 text-black hover:bg-gray-100" // Ghế thường
                }
                ${isLoading ? "opacity-50 cursor-wait" : ""}
                ${(hasActiveReservation && activeReservationInfo?.isOtherShowtime) ? "opacity-30 cursor-not-allowed" : ""}
                ${!seat.is_enabled ? "opacity-0 pointer-events-none" : ""}
              `}
              style={{
                borderColor: seat.is_enabled
                  ? listSeatTypes?.seat_types?.find(
                      (type) => type.id === seat.type_id
                    )?.color
                  : "#f97316",
              }}
              onClick={() => onSeatClick(seat)}
              title={`${isVIP ? "Ghế VIP" : "Ghế thường"} ${seat.seat_row}${seat.seat_number || ""} ${!seat.is_enabled ? "- Không khả dụng" : ""}`}
            >
              {seat.seat_row + (seat.seat_number || "")}
            </button>
          </div>
        );
      }),
    [listSeats, listSeatTypes, selectedSeats, isLoading, hasActiveReservation, activeReservationInfo, onSeatClick]
  );

  return (
    <div className="flex justify-center">
      <div
        className="grid gap-1 p-2 bg-gray-100 rounded-lg w-full"
        style={{
          maxWidth: `${Math.min(
            listSeats?.data?.columns_count * 40,
            1200
          )}px`,
          gridTemplateColumns: `repeat(${listSeats?.data?.columns_count}, minmax(20px, 1fr))`,
        }}
      >
        {renderSeats}
      </div>
    </div>
  );
} 