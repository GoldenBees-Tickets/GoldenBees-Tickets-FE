import { useMemo, useState } from "react";
import { IoChevronForwardOutline } from "react-icons/io5";
import TicketDetail from "./TicketDetail";
import { useGetOrderByUserQuery } from "../../../../api/orderApi";
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export default function TransactionHistory({ user }) {
  const [toggleShowTicket, setToggleShowTicket] = useState(false);
  const id = user?.id;

  const { data: Orders } = useGetOrderByUserQuery(id, {
    skip: !id,
  });

  const renderTickets = useMemo(
    () =>
      Orders?.data?.map((order) => (
        <div className="flex items-center bg-white shadow-md rounded-lg p-4 mb-4">
          <div className="w-16 h-22 overflow-hidden rounded-md flex-shrink-0">
            <img
              src={
                order?.Showtime?.Movie?.poster?.startsWith("http")
                  ? order?.Showtime?.Movie?.poster
                  : `${IMAGE_BASE_URL}${order?.Showtime?.Movie?.poster}`
              }
              alt={order?.Showtime?.Movie?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 ml-4">
            <h3 className="text-lg font-semibold text-gray-800">{order?.Showtime?.Movie?.name}</h3>
            <div className="flex items-center">
              <p className="text-sm text-gray-600 mr-2">Digital Phụ Đề</p>
              {order?.Showtime?.Movie?.age_rating > 0 && (
              <span className="bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
              {`T${order?.Showtime?.Movie?.name}`}
              </span>
              )}
            </div>
          </div>
          <div className="mr-6">
            <p className="text-sm text-gray-600 mt-2">{order?.Showtime?.Room?.Cinema.name}</p>
            <p className="text-sm text-gray-800 font-medium">
              20:30 - Thứ Hai, 26/02/2024
            </p>
          </div>
          <div className="ml-4">
            <button onClick={() => setToggleShowTicket(true)} className="text-orange-500 font-medium hover:underline flex items-center">
              Chi tiết <IoChevronForwardOutline className="ml-1" />
            </button>
          </div>
        </div>
      )),
    [Orders]
  );

  return (
    <div className="bg-gray-100 py-6 px-4">
      {/* Tháng 02/2024 */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Tháng 02/2024
        </h2>

        {renderTickets}
      </div>

      {toggleShowTicket && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <TicketDetail setToggleShowTicket={setToggleShowTicket} />
        </div>
      )}
    </div>
  );
}
