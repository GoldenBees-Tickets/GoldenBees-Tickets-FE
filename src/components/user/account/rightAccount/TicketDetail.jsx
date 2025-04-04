import { IoMdCloseCircleOutline } from "react-icons/io";

export default function TicketDetail({ setToggleShowTicket }) {
  return (
      <div className="border-t-8 border-orange-500 bg-white w-96 rounded-lg shadow-lg p-6 relative">
        {/* Close button */}
        <button
          onClick={() => setToggleShowTicket(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
                  <IoMdCloseCircleOutline className="w-6 h-6" />
        </button>

        {/* Movie image */}
        <div className="flex justify-center items-center w-full h-32">
          <img
            src="https://cdn.galaxycine.vn/media/2024/2/19/baghead-500_1708317004756.jpg" // Thay bằng URL ảnh phim
            alt="Movie Poster"
            className="h-full object-cover rounded-lg"
          />
        </div>

        {/* Movie details */}
        <h2 className="mt-4 text-xl font-semibold text-center text-gray-800">
          Quỷ Thay Đầu
        </h2>
        <div className="flex items-center justify-center mt-2">
        <p className="text-center text-gray-600">2D Phụ Đề</p>
        <div className="flex justify-center items-center">
          <span className="text-xs font-bold text-white bg-orange-500 ml-2 px-2 py-1 rounded-md">
            T18
          </span>
        </div>
        </div>

        {/* Divider */}
        <hr className="my-4 border-gray-300" />

        {/* Cinema and session details */}
        <div className="text-gray-700 space-y-2">
          <p className="text-center">
            <span className="font-semibold">Galaxy Da Nang</span>
          </p>
          <p className="text-center">
            Suất: <span className="font-semibold">23:00 - Thứ Sáu, 08/03/2024</span>
          </p>
        </div>

        {/* Divider */}
        <hr className="my-4 border-gray-300" />

        {/* Ticket details */}
        <div className="grid grid-cols-3 gap-4 text-center text-gray-700">
          <div>
            <p className="text-sm">Mã vé</p>
            <p className="font-semibold">12345</p>
          </div>
          <div>
            <p className="text-sm">Stars</p>
            <p className="font-semibold">4</p>
          </div>
          <div>
            <p className="text-sm">Giá</p>
            <p className="font-semibold">110.000 đ</p>
          </div>
        </div>
      </div>
  );
}
