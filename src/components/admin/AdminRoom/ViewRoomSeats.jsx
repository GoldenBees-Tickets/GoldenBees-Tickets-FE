import { useState, useEffect } from 'react';
import { Modal, Spin, Empty, Typography, Grid } from 'antd';
import { useGetSeatsByRoomIdQuery } from '@/api/roomApi';
import { useGetListSeatTypesQuery } from "@/api/seatTypeApi";
import MovieScreen from "../../MovieScreen";

const { Title } = Typography;
const { useBreakpoint } = Grid;

export default function ViewRoomSeats({ roomId, visible, onClose }) {
  const screens = useBreakpoint();
  const { data: listSeats, isLoading, error } = useGetSeatsByRoomIdQuery(roomId, { 
    skip: !roomId || !visible,
    refetchOnMountOrArgChange: true
  });
  const { data: listSeatTypes } = useGetListSeatTypesQuery();
  
  const [seats, setSeats] = useState([]);
  const [seatsByRow, setSeatsByRow] = useState({});
  
  useEffect(() => {
    if (listSeats && listSeats?.data) {
      const seatsArray = listSeats?.data || [];
      setSeats(seatsArray);
      
      // Nhóm ghế theo hàng
      const rowGrouped = {};
      seatsArray.forEach(seat => {
        if (!rowGrouped[seat.seat_row]) {
          rowGrouped[seat.seat_row] = [];
        }
        rowGrouped[seat.seat_row].push(seat);
      });
      
      // Sắp xếp ghế trong mỗi hàng theo số thứ tự
      Object.keys(rowGrouped).forEach(row => {
        rowGrouped[row].sort((a, b) => {
          return parseInt(a.seat_number) - parseInt(b.seat_number);
        });
      });
      
      setSeatsByRow(rowGrouped);
    }
  }, [listSeats]);
  
  const room = listSeats?.data?.[0]?.Room || {};
  const seat_types = listSeatTypes?.seat_types || [];

  // Determine if on mobile
  const isMobile = !screens.md;

  if (!visible) return null;
  
  // Sắp xếp tên hàng theo thứ tự (A, B, C,...)
  const rowNames = Object.keys(seatsByRow).sort();

  return (
    <Modal
      title="Sơ đồ ghế phòng chiếu"
      open={visible}
      onCancel={onClose}
      width={'90vw'}
      style={{ maxWidth: '800px' }}
      styles={{ 
        body: { 
          maxHeight: 'calc(90vh - 120px)', 
          overflowY: 'auto',
          padding: isMobile ? '12px' : '24px'
        }
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
            <div className="flex flex-col items-center gap-4">
              {rowNames.map(rowName => (
                <div key={rowName} className="flex items-center">
                  <div className="font-bold w-8 text-center mr-3">{rowName}</div>
                  <div className="flex gap-2">
                    {seatsByRow[rowName].map((seat, seatIndex) => {
                      const seatType = seat_types.find(type => type.id === seat.type_id);
                      return (
                        <div key={`${rowName}-${seatIndex}`} className="seat-item">
                          <div
                            className={`w-8 h-8 border-2 rounded flex items-center justify-center text-xs
                              ${seat.is_enabled ? "border-gray-900 text-black" : "bg-gray-500 text-white"}
                            `}
                            style={{
                              borderColor: seat.is_enabled
                                ? seatType?.color || 'gray'
                                : "gray",
                            }}
                            title={`${seat.seat_row}${seat.seat_number} - ${seatType?.type || 'Thường'}`}
                          >
                            {seat.seat_number}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
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