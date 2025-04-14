import React from "react";
import { useMemo } from 'react';

// Component hiển thị thông tin ghế đã chọn
const SelectedSeatsInfo = ({
  selectedSeats,
  hasActiveReservation,
  activeReservationInfo,
  onContinuePayment,
}) => {
  // Hiển thị thông tin ghế đã chọn
  const renderSelectedSeatsInfo = useMemo(() => {
    
    if (selectedSeats.length === 0) {
      return <p className="text-gray-500">Chưa có ghế nào được chọn</p>;
    }
    
    return (
      <div>
        <p className="font-medium">🎟️ Ghế đã chọn:</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedSeats.map((seat) => (
            <div
              key={seat.id}
              className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium"
            >
              {seat.seat_row}
              {seat.seat_number}
            </div>
          ))}
        </div>
      </div>
    );
  }, [selectedSeats, hasActiveReservation, activeReservationInfo, onContinuePayment]);

  return (
    <div>
      {renderSelectedSeatsInfo}
    </div>
  );
};

export default SelectedSeatsInfo; 