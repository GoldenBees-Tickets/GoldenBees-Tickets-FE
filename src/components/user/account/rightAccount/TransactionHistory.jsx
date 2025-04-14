import { useMemo, useState } from "react";
import { IoChevronForwardOutline } from "react-icons/io5";
import { IoTicketOutline } from "react-icons/io5";
import { FaRegCalendarAlt, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import TicketDetail from "./TicketDetail";
import { useGetOrderByUserQuery } from "@/api/orderApi";
import { formatImage } from "@/utils/formatImage";
import { formatDate, formatTime } from "@/utils/format";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/utils/format";

export default function TransactionHistory({ user }) {
  const [toggleShowTicket, setToggleShowTicket] = useState(false);
  const id = user?.id;
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { data: Orders, isLoading } = useGetOrderByUserQuery(id, {
    skip: !id,
  });  

  const handleShowDetail = (order) => {
    setSelectedOrder(order);
    setToggleShowTicket(true);
  }
  
  const renderTickets = useMemo(
    () =>
      Orders?.data?.map((order) => (
        <div key={order.id} className="flex flex-col md:flex-row md:items-center bg-white shadow-md rounded-lg p-4 mb-4 transition-all duration-300 hover:shadow-lg border border-gray-100">
          <div className="w-full md:w-16 h-32 md:h-22 overflow-hidden rounded-md flex-shrink-0 mb-3 md:mb-0">
            <img
              src={formatImage(order?.Showtime?.Movie?.poster)}
              alt={order?.Showtime?.Movie?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 md:ml-4">
            <h3 className="text-lg font-semibold text-gray-800">{order?.Showtime?.Movie?.name}</h3>
            <div className="flex items-center mt-1">
              <p className="text-sm text-gray-600 mr-2">Digital Phụ Đề</p>
              {order?.Showtime?.Movie?.age_rating > 0 && (
              <span className="bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
              {`T${order?.Showtime?.Movie?.age_rating}`}
              </span>
              )}
            </div>
            <div className="flex flex-col space-y-1 mt-2">
              <div className="flex items-center text-sm text-gray-600">
                <FaMapMarkerAlt className="mr-2 text-orange-500" />
                {order?.Showtime?.Room?.Cinema.name}
              </div>
              <div className="flex items-center text-sm text-gray-800 font-medium">
                <FaRegCalendarAlt className="mr-2 text-orange-500" />
                {formatDate(order?.Showtime?.show_date)}
              </div>
              <div className="flex items-center text-sm text-gray-800 font-medium">
                <FaClock className="mr-2 text-orange-500" />
                {formatTime(order?.Showtime?.start_time)}
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0 md:ml-4 flex justify-between items-center w-full md:w-auto">
            <div className="text-center md:text-right">
              <div className="text-sm text-gray-600">Tổng tiền</div>
              <div className="text-lg font-bold text-orange-600">{formatCurrency(order?.total)}</div>
            </div>
            <button 
              onClick={() => handleShowDetail(order)} 
              className="ml-4 bg-orange-50 text-orange-500 px-3 py-2 rounded-lg font-medium hover:bg-orange-100 transition-colors duration-300 flex items-center"
            >
              Chi tiết <IoChevronForwardOutline className="ml-1" />
            </button>
          </div>
        </div>
      )),
    [Orders]
  );

  return (
    <div className="bg-gray-50 py-6 px-4 rounded-lg shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <IoTicketOutline className="mr-2 text-orange-500" /> Lịch sử đơn hàng
        </h2>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="w-10 h-10 border-4 border-t-orange-500 border-gray-200 rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 mt-3">Đang tải dữ liệu...</p>
          </div>
        ) : Orders?.data?.length > 0 ? (
          renderTickets
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-orange-400 mx-auto mb-4">
              <IoTicketOutline size={60} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có lịch sử giao dịch</h3>
            <p className="text-gray-600 mb-6">Bạn chưa có giao dịch đặt vé nào. Hãy đặt vé ngay để xem phim mới nhất!</p>
            <Link
              to="/movies" 
              className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors duration-300"
            >
              Đặt vé ngay
            </Link>
          </div>
        )}
      </div>

      {toggleShowTicket && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <TicketDetail order={selectedOrder} setToggleShowTicket={setToggleShowTicket} />
        </div>
      )}
    </div>
  );
}
