import { useEffect, useState, useMemo } from "react";
import { useGetRoomByIdQuery } from "../../../api/roomApi";
import { useGetListSeatTypesQuery } from "../../../api/seatTypeApi";
import ChairTicket from "../PayTickets/ChairTicket";
import MovieScreen from "../../MovieScreen";

export default function Chair() {
  const id = 1; // ID được set cứng là 1
  const { data: listSeats } = useGetRoomByIdQuery(id, { skip: !id });
  
  const { data: listSeatTypes } = useGetListSeatTypesQuery();

  const [seats, setSeats] = useState([]);

  useEffect(() => {
    if (listSeats && listSeats?.data) {
      setSeats(listSeats?.data?.Seats || []);
    }
  }, [listSeats]);

  const room = useMemo(() => listSeats?.data || [], [listSeats]);
  const columns_count = useMemo(() => room.columns_count || 1, [room]);
  const seat_types = useMemo(() => listSeatTypes?.seat_types || [], [listSeatTypes]);

  return (
    <>
      <div className="flex flex-col md:flex-row w-full p-2 bg-gray-50 rounded-lg shadow-xl">
        {/* Phần bên trái (Chọn Ghế) */}
        <div className="w-full md:w-[70%] mt-6 text-center">
          <MovieScreen />
          <div className="flex justify-center">
            <div
              className="grid gap-1 p-2 bg-gray-100 rounded-lg w-full"
              style={{
                maxWidth: `${Math.min(columns_count * 40, 1200)}px`,
                gridTemplateColumns: `repeat(${columns_count}, minmax(20px, 1fr))`,
              }}
            >
              {seats.map((seat, index) => {
                return (
                  <div key={index} className="relative">
                    <div
                      className={`w-6 h-6 md:w-8 md:h-8 border-2 rounded flex items-center justify-center text-xs md:text-sm
                        ${seat.is_enabled ? "border-gray-900 text-black" : "bg-gray-500 text-white"}`}
                      style={{
                        borderColor: seat.is_enabled
                          ? seat_types?.find((type) => type.id === seat.type_id)?.color
                          : "gray",
                      }}
                    >
                      {seat.seat_row + (seat.seat_number || "")}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Thêm phần chú thích Ghế VIP và Ghế Thường */}
          <div className="mt-4 text-xs md:text-sm text-gray-700">
            <div className="flex flex-wrap justify-center md:justify-start items-center space-x-4">
              <div className="flex items-center">
                <div
                  className="w-6 h-6 md:w-8 md:h-8 border-2 rounded bg-yellow-400 text-black flex items-center justify-center text-xs md:text-sm"
                >
                  VIP
                </div>
                <span className="ml-2">Ghế VIP</span>
              </div>
              <div className="flex items-center">
                <div
                  className="w-6 h-6 md:w-8 md:h-8 border-2 rounded bg-gray-500 text-white flex items-center justify-center text-xs md:text-sm"
                >
                  T
                </div>
                <span className="ml-2">Ghế Thường</span>
              </div>
            </div>
          </div>
        </div>

        {/* Phần bên phải (Thông tin phim) */}
        <div className="w-full md:w-[30%] ml-5 mt-6 md:mt-0 rounded-lg">
          <ChairTicket />
        </div>
      </div>
    </>
  );
}
