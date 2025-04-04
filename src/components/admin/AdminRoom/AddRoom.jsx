import { useEffect, useMemo, useState } from "react";
import { useGetBranchesQuery } from "@/api/branchApi";
import { useGetCinemaByBranchIdQuery } from "@/api/cinemaApi";
import { useCreateRoomMutation } from "@/api/roomApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ImportantItem from "@/components/icon/ImportantItem";
import { useGetListSeatTypesQuery } from "@/api/seatTypeApi";
import { useRef } from "react";
import MovieScreen from "../../MovieScreen";

export default function AddRoom() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const { data: listBranches } = useGetBranchesQuery();
  const { data: listSeatTypes } = useGetListSeatTypesQuery();
  const [createRoom] = useCreateRoomMutation();

  const branch_id = watch("branch_id");
  const rows_count = watch("rows_count", 0);
  const columns_count = watch("columns_count", 0);
  const name = watch("name");
  const cinema_id = watch("cinema_id");

  const prevRows = useRef(rows_count);
  const prevCols = useRef(columns_count);

  const { data: listCinemas } = useGetCinemaByBranchIdQuery(branch_id, {
    skip: !branch_id,
  });
  const [seats, setSeats] = useState([]);
  const [isRender, setIsRender] = useState(false);

  const cinemas = useMemo(() => listCinemas?.cinemas || [], [listCinemas]);
  const seat_types = useMemo(
    () => listSeatTypes?.seat_types || [],
    [listSeatTypes]
  );

  const [typeChange, setTypeChange] = useState(null);
  const [typeIdChange, setTypeIdChange] = useState(null);

  useEffect(() => {
    if (
      (rows_count !== prevRows.current || columns_count !== prevCols.current) &&
      isRender
    ) {
      setIsRender(false);
    }
  }, [rows_count, columns_count]);

  const generateSeats = (rows, cols) => {
    const seatNames = [];
    let index = 1;
    for (let i = 0; i < rows; i++) {
      const rowLetter = String.fromCharCode(65 + i);
      for (let j = 1; j <= cols; j++) {
        seatNames.push({
          id: index++,
          seat_row: rowLetter,
          seat_number: j,
          is_enabled: true,
          type_id: 1,
        });
      }
    }
    return seatNames;
  };

  const handleRenderRoom = () => {
    if (rows_count > 0 && columns_count > 0) {
      prevRows.current = rows_count;
      prevCols.current = columns_count;
      setSeats(generateSeats(rows_count, columns_count));
      setIsRender(true);
    }
  };
  const updateSeat = (seat_row, id) => {
    setSeats((prevSeats) => {
      const updatedSeats = prevSeats.map((seat) => {
        if (seat.id === id) {
          switch (typeChange) {
            case "disable":
              return { ...seat, is_enabled: !seat.is_enabled };

            case "changeType":
              if (seat.is_enabled && typeIdChange !== null) {
                return { ...seat, type_id: typeIdChange };
              }
              break;

            default:
              return seat;
          }
        }
        return seat;
      });

      return updatedSeats.map((seat) => {
        if (seat.seat_row === seat_row) {
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

  const renderSeatsLayout = () => (
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
                  className={`w-8 h-8 rounded flex items-center justify-center text-xs cursor-pointer 
                  ${
                    seat.is_enabled
                      ? "bg-gray-300 text-black"
                      : "bg-gray-500 text-white"
                  }`}
                  style={{
                    backgroundColor: seat.is_enabled
                      ? seat_types?.find((type) => type.id === seat.type_id)
                          ?.color
                      : "gray",
                  }}
                  onClick={() => {
                    if (!seat.is_enabled) return;
                    updateSeat(seat.seat_row, seat.id);
                  }}
                >
                  {seat.seat_row + seat.seat_number}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between">
        <div className="mt-4 flex gap-4">
          {seat_types.map((type) => (
            <div key={type.id} className="flex items-center gap-2">
              <div
                className="w-6 h-6 border rounded-md"
                style={{ backgroundColor: type.color }}
              ></div>
              <input
                type="radio"
                name="seat_type"
                value={type.id}
                onChange={() => {
                  setTypeChange("changeType");
                  setTypeIdChange(type.id);
                }}
              />
              <span>{type.type}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 border rounded-md"
              style={{ backgroundColor: "gray" }}
            ></div>
            <input
              type="radio"
              name="seat_type"
              value="Disabled"
              onChange={() => setTypeChange("disable")}
            />{" "}
            Disabled
          </div>
        </div>
      </div>
    </div>
  );

  const onSubmit = async (data) => {
    try {
      const dataSubmit = {
        cinema_id: data.cinema_id,
        name: data.name,
        rows_count: data.rows_count,
        columns_count: data.columns_count,
        seats,
      };
      const response = await createRoom(dataSubmit);      
      toast.success(response?.data.message);
      navigate("/admin/rooms");
    } catch (error) {
      console.error("Error submitting room data", error);
      toast.error("Lỗi khi tạo phòng");
    }
  };

  const isFormValid =
    name &&
    branch_id &&
    cinema_id &&
    rows_count > 0 &&
    columns_count > 0 &&
    !errors.rows_count &&
    !errors.columns_count;

  return (
    <div className="bg-white">
      <h1 className="text-2xl font-bold mb-4">Thêm phòng</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label
              htmlFor="branch_id"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Chi nhánh <ImportantItem />
            </label>
            <select
              id="branch_id"
              {...register("branch_id", {
                required: "Vui lòng chọn chi nhánh",
              })}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              defaultValue=""
            >
              <option value="" disabled>
                -- Chọn chi nhánh --
              </option>
              {listBranches?.branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
            {errors.branch_id && (
              <span className="text-red-500 text-sm">
                {errors.branch_id.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label
              id="cinema_id"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Chọn rạp <ImportantItem />
            </label>
            <select
              id="cinema_id"
              {...register("cinema_id", { required: "Vui lòng chọn rạp" })}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              defaultValue=""
              disabled={!cinemas?.length}
            >
              <option value="" disabled>
                -- Chọn rạp --
              </option>
              {cinemas?.map((cinema) => (
                <option key={cinema.id} value={cinema.id}>
                  {cinema.name}
                </option>
              ))}
            </select>
            {errors.cinema_id && (
              <span className="text-red-500 text-sm">
                {errors.cinema_id.message}
              </span>
            )}
          </div>
        </div>

        <input
          {...register("name", { required: "Vui lòng nhập tên phòng" })}
          placeholder="Nhập tên phòng"
          className="w-full p-2 border rounded my-2"
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name.message}</span>
        )}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <input
              {...register("rows_count", {
                required: "Vui lòng nhập số hàng",
                min: { value: 1, message: "Số hàng phải lớn hơn 0" },
                max: { value: 20, message: "Số hàng tối đa là 20" },
              })}
              type="number"
              placeholder="Số hàng"
              className="w-full p-2 border rounded my-2"
            />
            {errors.rows_count && (
              <span className="text-red-500 text-sm">
                {errors.rows_count.message}
              </span>
            )}
          </div>
          <div>
            <input
              {...register("columns_count", {
                required: "Vui lòng nhập số cột",
                min: { value: 1, message: "Số cột phải lớn hơn 0" },
                max: { value: 20, message: "Số cột tối đa là 20" },
              })}
              type="number"
              placeholder="Số cột"
              className="w-full p-2 border rounded my-2"
            />
            {errors.columns_count && (
              <span className="text-red-500 text-sm">
                {errors.columns_count.message}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleRenderRoom}
          disabled={!isFormValid}
          className="bg-blue-600 text-white p-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Tạo bố cục
        </button>
        {isRender && isFormValid && (
          <button
            type="submit"
            className="bg-green-600 text-white p-2 rounded ml-2"
          >
            Tạo phòng
          </button>
        )}
      </form>
      <div className="mt-8 p-4 bg-gray-100 rounded-lg shadow-md">
        {isRender && renderSeatsLayout()}
      </div>
    </div>
  );
}
