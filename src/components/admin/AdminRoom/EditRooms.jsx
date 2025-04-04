import { useParams } from "react-router-dom";
import { useGetRoomByIdQuery } from "@/api/roomApi";
import { useState, useMemo, useEffect } from "react";
import { useGetListSeatTypesQuery } from "@/api/seatTypeApi";
import { useUpdateSeatsMutation } from "@/api/seatApi";
import { toast } from "react-toastify";
import MovieScreen from "../../MovieScreen";

export default function EditRoom() {
  const { id } = useParams();
  const {
    data: listSeats,
  } = useGetRoomByIdQuery(id, { skip: !id });
  
  const { data: listSeatTypes } = useGetListSeatTypesQuery();
  const [updateSeatData] = useUpdateSeatsMutation();

  const [seats, setSeats] = useState([]);
  const [modifiedSeats, setModifiedSeats] = useState([]); // Danh sách ghế thay đổi
  const [typeChange, setTypeChange] = useState(null);
  const [typeIdChange, setTypeIdChange] = useState(null);
  
  useEffect(() => {
    if (listSeats && listSeats?.data) {
      setSeats(listSeats?.data?.Seats || []);
    }
  }, [listSeats]);
  const room = useMemo(() => listSeats?.data || [], [listSeats]);
  const columns_count = useMemo(() => room.columns_count || 1, [room]);

  const seat_types = useMemo(
    () => listSeatTypes?.seat_types || [],
    [listSeatTypes]
  );

  const updateSeat = (seat_row, id) => {
    setSeats((prevSeats) => {
      const updatedSeats = prevSeats.map((seat) => {
        if (!seat) return seat;
        if (seat.id === id) {
          let updatedSeat;
          switch (typeChange) {
            case "disable":
              updatedSeat = { ...seat, is_enabled: !seat.is_enabled };
              break;
            case "changeType":
              if (seat.is_enabled && typeIdChange !== null) {
                updatedSeat = { ...seat, type_id: typeIdChange };
              }
              break;
            default:
              return seat;
          }

          setModifiedSeats((prev) => {
            const existingIndex = prev.findIndex((s) => s.id === id);
            if (existingIndex !== -1) {
              const updatedList = [...prev];
              updatedList[existingIndex] = updatedSeat;
              return updatedList;
            }
            return [...prev, updatedSeat];
          });

          return updatedSeat;
        }
        return seat;
      });

      return updatedSeats.map((seat) => {
        if (!seat || !seat_row) return seat;
        if (seat.seat_row == seat_row) {
          const allSeatsInRow = updatedSeats
            .filter((s) => s.seat_row === seat_row)
            .sort((a, b) => a.id - b.id);

          let newSeatNumber = 1;
          const updatedRowSeats = allSeatsInRow.map((s) => ({
            ...s,
            seat_number: s.is_enabled ? newSeatNumber++ : s.seat_number,
          }));

          return updatedRowSeats.find((s) => s.id === seat.id) || seat;
        }
        return seat;
      });
    });
  };

  const handleSave = async () => {
    try {
      if (modifiedSeats.length === 0) {
        toast.info("Không có thay đổi để cập nhật.");
        return;
      }
      const response = await updateSeatData(modifiedSeats);

      toast.success(response.data.message || "Update successfully");
      setModifiedSeats([]);
    } catch (error) {
      toast.error(error.message);
      console.error(error.message);
    }
  };
  return (
    <>
      <div className="mt-6 text-center">
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
                    className={`w-8 h-8 border-2 rounded flex items-center justify-center text-xs
                      ${
                        seat.is_enabled
                          ? "border-gray-900 text-black"
                          : "bg-gray-500 text-white"
                      }
                      ${
                        (typeIdChange && !seat.is_enabled) ||
                        seat.type_id === typeIdChange
                          ? "cursor-not-allowed border-2 border-red-500 text-white"
                          : "cursor-pointer"
                      }`}
                    style={{
                      borderColor: seat.is_enabled
                        ? seat_types?.find((type) => type.id === seat.type_id)
                            ?.color
                        : "gray",
                    }}
                    onClick={() => {
                      if (
                        !(typeIdChange && !seat.is_enabled) &&
                        seat.type_id !== typeIdChange
                      ) {
                        updateSeat(seat.seat_row, seat.id);
                      }
                    }}
                  >
                    {seat.seat_row + (seat.seat_number || "")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between">
          <div className="mt-4 flex gap-4">
            {seat_types.map((type) => {
              const isChecked = type.id === typeIdChange;
              return (
                <label
                  key={type.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="seat_type"
                    value={type.id}
                    className="w-6 h-6 rounded-md border-2 cursor-pointer"
                    style={{
                      appearance: "none",
                      borderColor: type.color,
                      backgroundColor: isChecked ? type.color : "transparent",
                    }}
                    onChange={() => {
                      setTypeChange("changeType");
                      setTypeIdChange(type.id);
                    }}
                    checked={isChecked}
                  />
                  <span>{type.type}</span>
                </label>
              );
            })}
          </div>

          <div className="mt-4 flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="seat_type"
                value="Disabled"
                className="w-6 h-6 rounded-md border-2 cursor-pointer"
                style={{
                  appearance: "none",
                  borderColor: "gray",
                  backgroundColor:
                    typeIdChange === null ? "gray" : "transparent",
                }}
                onChange={() => {
                  setTypeChange("disable");
                  setTypeIdChange(null);
                }}
                checked={typeIdChange === null}
              />
              <span>Disabled</span>
            </label>
          </div>
        </div>

        <button
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={handleSave}
        >
          Lưu thay đổi
        </button>
      </div>
    </>
  );
}
