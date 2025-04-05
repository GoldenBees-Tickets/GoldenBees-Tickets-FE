import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheckCircle, FiXCircle, FiArrowLeft } from "react-icons/fi";
import { useCheckOrderQuery } from "../../api/orderApi";

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState({
    status: "loading",
    message: "Đang xử lý...",
    details: {},
  });
  const [bookingInfo, setBookingInfo] = useState(null);

  // Lấy orderId từ URL
  const params = new URLSearchParams(location.search);
  const orderId = params.get("orderId");
  const orderInfo = params.get("orderInfo") || "Thanh toán vé xem phim";

  // Gọi API kiểm tra đơn hàng
  const {
    data: paymentData,
    isLoading,
    isError,
  } = useCheckOrderQuery(orderId, { skip: !orderId });

  useEffect(() => {
    if (!orderId) {
      setPaymentStatus({
        status: "error",
        message: "Không tìm thấy thông tin thanh toán!",
        details: {},
      });
      return;
    }

    if (isLoading) return;

    if (isError || !paymentData) {
      setPaymentStatus({
        status: "error",
        message: "Không thể kiểm tra trạng thái thanh toán!",
        details: { orderId },
      });
      return;
    }    

    setBookingInfo(paymentData?.booking || null);
    setPaymentStatus({
      status: "success",
      message: "Thanh toán thành công!",
      details: {
        orderId: 1,
        amount: 1,
        transId: 1,
        paymentTime: 1,
        orderInfo,
      },
    });

    // if (paymentData?.data.success) {
    //   setBookingInfo(paymentData.booking || null);
    //   setPaymentStatus({
    //     status: 'success',
    //     message: 'Thanh toán thành công!',
    //     details: {
    //       orderId: paymentData.order_id,
    //       amount: paymentData.amount,
    //       transId: paymentData.transaction_id,
    //       paymentTime: paymentData.payment_time,
    //       orderInfo,
    //     },
    //   });
    //   toast.success('Đặt vé thành công!');
    //   localStorage.removeItem('reservation');
    // } else {
    //   setPaymentStatus({
    //     status: 'error',
    //     message: 'Thanh toán không thành công!',
    //     details: { orderId: paymentData.order_id },
    //   });
    // }
  }, [paymentData, isLoading, isError]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8 max-w-lg"
      >
        {paymentStatus.status === "loading" && (
          <div className="text-center py-8">
            <div className="animate-spin h-12 w-12 border-4 border-gray-300 border-t-blue-500 rounded-full mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">
              {paymentStatus.message}
            </h2>
          </div>
        )}

        {paymentStatus.status === "success" && (
          <div className="text-center">
            <FiCheckCircle className="h-12 w-12 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {paymentStatus.message}
            </h2>
            {bookingInfo && (
              <div className="mb-4 bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">{bookingInfo.movie}</h3>
                <p className="text-gray-700">
                  Suất chiếu:{" "}
                  {new Date(bookingInfo.showtime).toLocaleString("vi-VN")}
                </p>
                <p className="text-gray-700">Rạp: {bookingInfo.cinema}</p>
                <p className="text-gray-700">
                  Số ghế: {bookingInfo.seat_count}
                </p>
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/user/tickets")}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg"
            >
              Xem vé đã đặt
            </motion.button>
          </div>
        )}

        {paymentStatus.status === "error" && (
          <div className="text-center">
            <FiXCircle className="h-12 w-12 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {paymentStatus.message}
            </h2>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/")}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg mt-4 flex items-center justify-center"
        >
          <FiArrowLeft className="mr-2" /> Quay lại trang chủ
        </motion.button>
      </motion.div>
    </div>
  );
};

export default PaymentResult;
