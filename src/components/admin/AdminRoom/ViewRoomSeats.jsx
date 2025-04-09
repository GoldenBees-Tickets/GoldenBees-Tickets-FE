import { useState, useEffect } from 'react';
import { Modal, Spin, Empty, Typography, Grid } from 'antd';
import { useGetRoomByIdQuery } from '@/api/roomApi';
import { useGetListSeatTypesQuery } from "@/api/seatTypeApi";
import MovieScreen from "../../MovieScreen";

const { Title } = Typography;
const { useBreakpoint } = Grid;

export default function ViewRoomSeats({ roomId, visible, onClose }) {
  const screens = useBreakpoint();
  const { data: listSeats, isLoading, error } = useGetRoomByIdQuery(roomId, { 
    skip: !roomId || !visible
  });
  const { data: listSeatTypes } = useGetListSeatTypesQuery();
  
  const [seats, setSeats] = useState([]);
  
  useEffect(() => {
    if (listSeats && listSeats?.data) {
      setSeats(listSeats?.data?.Seats || []);
    }
  }, [listSeats]);
  
  const room = listSeats?.data || {};
  const columns_count = room.columns_count || 1;
  const seat_types = listSeatTypes?.seat_types || [];

  // Determine if on mobile
  const isMobile = !screens.md;

  if (!visible) return null;

  return (
    <Modal
      title="Sơ đồ ghế phòng chiếu"
      open={visible}
      onCancel={onClose}
      width={'90vw'}
      style={{ maxWidth: '800px' }}
      bodyStyle={{ 
        maxHeight: 'calc(90vh - 120px)', 
        overflowY: 'auto',
        padding: isMobile ? '12px' : '24px'
      }}
      footer={null}
      centered
    >
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-5">
          Có lỗi xảy ra khi tải dữ liệu ghế!
        </div>
      ) : !listSeats?.data || !seats || seats.length === 0 ? (
        <Empty description="Chưa có thông tin ghế cho phòng này" />
      ) : (
        <div className="seat-map py-4">
          <div className="text-center mb-6">
            <Title level={5}>{room.name}</Title>
            <MovieScreen />
          </div>
          
          <div className="seats-container overflow-x-auto">
            <div className={`grid-seats ${isMobile ? 'scaled' : ''}`}>
              <div
                className="grid gap-1 p-2 bg-gray-100 rounded-lg mx-auto"
                style={{
                  maxWidth: `${Math.min(columns_count * 40, 800)}px`,
                  gridTemplateColumns: `repeat(${columns_count}, minmax(20px, 1fr))`,
                }}
              >
                {seats.map((seat, index) => {
                  const seatType = seat_types.find(type => type.id === seat.type_id);
                  return (
                    <div key={index} className="relative">
                      <div
                        className={`w-8 h-8 border-2 rounded flex items-center justify-center text-xs
                          ${seat.is_enabled ? "border-gray-900 text-black" : "bg-gray-500 text-white"}
                        `}
                        style={{
                          borderColor: seat.is_enabled
                            ? seatType?.color || 'gray'
                            : "gray",
                        }}
                        title={`${seat.seat_row}${seat.seat_number || ""} - ${seatType?.type || 'Thường'}`}
                      >
                        {seat.seat_row + (seat.seat_number || "")}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className={`seat-legend flex ${isMobile ? 'flex-col space-y-2' : 'justify-center space-x-4'} mt-6`}>
            {seat_types.map(type => (
              <div key={type.id} className="flex items-center">
                <div 
                  className="seat-sample w-6 h-6 border-2 rounded mr-2"
                  style={{ borderColor: type.color }}
                ></div>
                <span>{type.type}</span>
              </div>
            ))}
            <div className="flex items-center">
              <div className="seat-sample w-6 h-6 bg-gray-500 text-white border-gray-500 border-2 rounded mr-2"></div>
              <span>Ghế đã tắt</span>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

// Add CSS in your global or component styles
const styles = `
.grid-seats.scaled {
  transform-origin: top center;
  transform: scale(0.8);
}

@media (max-width: 640px) {
  .grid-seats.scaled {
    transform: scale(0.65);
  }
}

@media (max-width: 480px) {
  .grid-seats.scaled {
    transform: scale(0.5);
  }
}
`;

// Add styles to document if not already present
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.type = 'text/css';
  styleEl.appendChild(document.createTextNode(styles));
  document.head.appendChild(styleEl);
} 