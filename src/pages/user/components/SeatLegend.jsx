import { useMemo } from "react";

// Component hiển thị chú thích cho các loại ghế
export default function SeatLegend({ listSeatTypes }) {
  // Hiển thị các loại ghế
  const renderSeatTypes = useMemo(
    () =>
      listSeatTypes?.seat_types?.map((type, index) => {
        return (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-6 h-6 md:w-6 md:h-6 border-2 rounded"
              style={{ borderColor: type.color }}
            ></div>
            <span>{type.type}</span>
          </div>
        );
      }),
    [listSeatTypes]
  );

  return (
    <div className="mt-4 py-4 border-t-4 border-orange-400 flex justify-around text-xs md:text-sm text-gray-700">
      <div className="w-full flex flex-wrap justify-around items-center space-x-4">
        <div className="flex space-x-2">
          <div className="flex items-center space-x-4">
            <div className="w-6 h-6 md:w-6 md:h-6 rounded bg-gray-500"></div>
            <span>Ghế đã bán</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 md:w-6 md:h-6 rounded bg-orange-500"></div>
            <span>Ghế đã được chọn</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
        {renderSeatTypes}
        </div>
      </div>
    </div>
  );
}
