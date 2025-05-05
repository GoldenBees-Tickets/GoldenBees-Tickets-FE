import { useParams, useNavigate } from "react-router-dom";
import { useGetSeatsByRoomIdQuery } from "@/api/roomApi";
import { useState, useMemo, useEffect } from "react";
import { useGetListSeatTypesQuery } from "@/api/seatTypeApi";
import { useUpdateSeatsMutation } from "@/api/seatApi";
import { toast } from "react-toastify";
import MovieScreen from "../../MovieScreen";

export default function EditRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: listSeats,
  } = useGetSeatsByRoomIdQuery(id, { skip: !id });
  
  const { data: listSeatTypes } = useGetListSeatTypesQuery();
  const [updateSeatData] = useUpdateSeatsMutation();

  const [seats, setSeats] = useState([]);
  const [seatsByRow, setSeatsByRow] = useState({});
  const [modifiedSeats, setModifiedSeats] = useState([]); // Danh sách ghế thay đổi
  const [typeChange, setTypeChange] = useState(null);
  const [typeIdChange, setTypeIdChange] = useState(null);
  
  useEffect(() => {
    if (listSeats && listSeats?.data) {
      const seatsArray = listSeats?.data || [];
      setSeats(seatsArray);
      
      // Nhóm ghế theo hàng và cập nhật
      const rowGrouped = groupSeatsByRow(seatsArray);
      setSeatsByRow(rowGrouped);
    }
  }, [listSeats]);
  
  // Hàm nhóm ghế theo hàng mà không thay đổi dữ liệu gốc
  const groupSeatsByRow = (seatsArray) => {
    // Nhóm ghế theo hàng
    const rowGrouped = {};
    seatsArray.forEach(seat => {
      if (!rowGrouped[seat.seat_row]) {
        rowGrouped[seat.seat_row] = [];
      }
      rowGrouped[seat.seat_row].push({...seat}); // Tạo bản sao của seat
    });
    
    // Sắp xếp ghế trong mỗi hàng theo vị trí
    Object.keys(rowGrouped).forEach(row => {
      // Sắp xếp theo số ghế
      rowGrouped[row].sort((a, b) => {
        if (a.column_position !== undefined && b.column_position !== undefined) {
          return a.column_position - b.column_position;
        }
        return a.id - b.id;
      });
    });
    
    return rowGrouped;
  };
  
  const room = useMemo(() => listSeats?.data || [], [listSeats]);
  const columns_count = useMemo(() => room.columns_count || 1, [room]);

  const seat_types = useMemo(
    () => listSeatTypes?.seat_types || [],
    [listSeatTypes]
  );

  // Lấy danh sách tên hàng và sắp xếp
  const rowNames = useMemo(() => {
    return Object.keys(seatsByRow).sort();
  }, [seatsByRow]);

  const updateSeat = (seat_row, id) => {
    setSeats((prevSeats) => {
      // Tạo bản sao của danh sách ghế
      const updatedSeats = prevSeats.map((seat) => {
        if (!seat) return seat;
        if (seat.id === id) {
          let updatedSeat = {...seat}; // Tạo bản sao của ghế
          
          switch (typeChange) {
            case "disable":
              updatedSeat.is_enabled = !updatedSeat.is_enabled;
              break;
            case "changeType":
              if (updatedSeat.is_enabled && typeIdChange !== null) {
                updatedSeat.type_id = typeIdChange;
              } else {
                return {...seat};
              }
              break;
            default:
              return {...seat};
          }

          // Cập nhật danh sách ghế đã sửa
          setModifiedSeats((prev) => {
            const existingIndex = prev.findIndex((s) => s.id === id);
            if (existingIndex !== -1) {
              const updatedList = [...prev];
              updatedList[existingIndex] = {...updatedSeat};
              return updatedList;
            }
            return [...prev, {...updatedSeat}];
          });

          return updatedSeat;
        }
        return {...seat};
      });
      
      // Tính lại số thứ tự ghế cho từng hàng
      const finalSeats = recalculateSeatNumbers(updatedSeats);
      
      // Cập nhật lại seatsByRow
      const newSeatsByRow = groupSeatsByRow(finalSeats);
      setSeatsByRow(newSeatsByRow);
      
      return finalSeats;
    });
  };

  // Hàm tính toán lại số ghế
  const recalculateSeatNumbers = (seatsArray) => {
    // Tạo bản sao của mảng ghế
    const resultSeats = [...seatsArray];
    
    // Nhóm ghế theo hàng
    const rowGroups = {};
    resultSeats.forEach(seat => {
      if (!rowGroups[seat.seat_row]) {
        rowGroups[seat.seat_row] = [];
      }
      rowGroups[seat.seat_row].push(seat);
    });
    
    // Đánh số lại cho từng hàng
    Object.keys(rowGroups).forEach(row => {
      // Sắp xếp ghế theo vị trí
      const rowSeats = [...rowGroups[row]].sort((a, b) => a.id - b.id);
      
      // Đánh số lại ghế enabled
      let seatNumber = 1;
      rowSeats.forEach(seat => {
        if (seat.is_enabled) {
          // Tìm ghế trong danh sách kết quả và cập nhật
          const index = resultSeats.findIndex(s => s.id === seat.id);
          if (index !== -1) {
            resultSeats[index] = {
              ...resultSeats[index],
              seat_number: seatNumber++
            };
          }
        }
      });
    });
    
    return resultSeats;
  };

  const handleSave = async () => {
    try {
      if (modifiedSeats.length === 0) {
        toast.info("Không có thay đổi để cập nhật.");
        return;
      }
      const response = await updateSeatData(modifiedSeats);      
      toast.success(response.data.message || "Update successfully");
      navigate(`/admin/rooms`);
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
        <div className="flex justify-center mt-4">
          <div className="flex flex-col items-center gap-4">
            {rowNames.map(rowName => (
              <div key={rowName} className="flex items-center">
                <div className="font-bold w-8 text-center mr-3">{rowName}</div>
                <div className="flex gap-2">
                  {seatsByRow[rowName].map((seat, index) => {
                    const seatType = seat_types.find(type => type.id === seat.type_id);
                    return (
                      <div key={`${rowName}-${index}`} className="relative">
                        <div
                          className={`w-8 h-8 border-2 rounded flex items-center justify-center text-xs
                            ${seat.is_enabled ? "border-gray-900 text-black" : "bg-gray-500 text-white"}
                            ${(typeIdChange && !seat.is_enabled) || (typeChange === "changeType" && seat.type_id === typeIdChange)
                                ? "cursor-not-allowed"
                                : "cursor-pointer"
                            }`}
                          style={{
                            borderColor: seat.is_enabled
                              ? seatType?.color || 'gray'
                              : "gray",
                          }}
                          onClick={() => {
                            if (
                              !(typeIdChange && !seat.is_enabled) &&
                              !(typeChange === "changeType" && seat.type_id === typeIdChange)
                            ) {
                              updateSeat(seat.seat_row, seat.id);
                            }
                          }}
                        >
                          {seat.seat_number || ""}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <div className="mt-4 flex gap-4">
            {seat_types.map((type) => {
              const isChecked = typeChange === "changeType" && type.id === typeIdChange;
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
                  backgroundColor: typeChange === "disable" ? "gray" : "transparent",
                }}
                onChange={() => {
                  setTypeChange("disable");
                  setTypeIdChange(null);
                }}
                checked={typeChange === "disable"}
              />
              <span>Disabled</span>
            </label>
          </div>
        </div>

        <button
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={handleSave}
        >
          Lưu thay đổi
        </button>
      </div>
    </>
  );
}
