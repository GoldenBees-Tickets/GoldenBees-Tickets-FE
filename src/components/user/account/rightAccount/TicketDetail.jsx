import { IoMdCloseCircleOutline } from "react-icons/io";
import { formatImage } from "@/utils/formatImage";
const VITE_SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
import { formatCurrency, formatDate, formatTime } from "@/utils/format";
export default function TicketDetail({ order, setToggleShowTicket }) {
  return (
    <div className="border-t-8 border-orange-500 bg-white w-96 rounded-lg shadow-lg p-5 relative max-h-[90vh] overflow-y-auto">
      {/* Close button */}
      <button
        onClick={() => setToggleShowTicket(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
      >
        <IoMdCloseCircleOutline className="w-6 h-6" />
      </button>

      {/* Movie image */}
      <div className="flex justify-center items-center w-full h-28">
        <img
          src={formatImage(order?.Showtime?.Movie?.poster)} // Thay bằng URL ảnh phim
          alt={order?.Showtime?.Movie?.name}
          className="h-full object-cover rounded-lg"
        />
      </div>

      {/* Movie details */}
      <h2 className="mt-3 text-lg font-semibold text-center text-gray-800">
        {order?.Showtime?.Movie?.name}
      </h2>
      <div className="flex items-center justify-center mt-1">
        <p className="text-center text-gray-600 text-sm">2D Phụ Đề</p>
        <div className="flex justify-center items-center">
          <span className="text-xs font-bold text-white bg-orange-500 ml-2 px-2 py-0.5 rounded-md">
            T18
          </span>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-3 border-gray-300" />

      {/* Cinema and session details */}
      <div className="text-gray-700 space-y-1">
        <p className="text-center text-sm">
          <span className="font-semibold">
            {order?.Showtime?.Room?.Cinema?.name}
          </span>
        </p>
        <p className="text-center text-sm">
          Suất:{" "}
          <span className="font-semibold">
            {formatTime(order?.Showtime?.start_time)} -{" "}
            {formatDate(order?.Showtime?.show_date)}
          </span>
        </p>
        <p className="text-center text-sm">
          <span className="font-semibold">
            {order?.Showtime?.Room?.name} - Ghế:{" "}
            {order?.Tickets?.map(
              (ticket) => `${ticket.Seat?.seat_row}${ticket.Seat?.seat_number}`
            ).join(", ")}
          </span>{" "}
        </p>
        <hr className="my-3 border-gray-300" />

        <div className="text-center">
          <p className="text-sm">Mã vé:</p>
          <div className="flex justify-center py-2">
            <img
              src={
                order?.qr_code.startsWith("http")
                  ? order?.qr_code
                  : `${VITE_SOCKET_URL}${order?.qr_code}`
              }
              alt="QR Code"
              className="w-32 h-32 object-contain"
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-3 border-gray-300" />

      {/* Ticket details */}
      <div className="grid grid-cols-2 gap-3 text-center text-gray-700">
        <div>
          <p className="text-sm">Stars</p>
          <p className="font-semibold">3</p>
        </div>
        <div>
          <p className="text-sm">Giá</p>
          <p className="font-semibold">{formatCurrency(order?.total)}</p>
        </div>
      </div>
    </div>
  );
}
