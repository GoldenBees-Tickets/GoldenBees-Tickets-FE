import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheckCircle, FiXCircle, FiArrowLeft } from "react-icons/fi";
import { useCheckOrderQuery, useClientCallbackMutation } from "../../api/orderApi";
import { toast } from "react-toastify";

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState({
    status: "loading",
    message: "Đang xử lý...",
    details: {},
  });
  const [countdown, setCountdown] = useState(3);
  const [bookingInfo, setBookingInfo] = useState(null);

  // Lấy orderId từ URL
  const params = new URLSearchParams(location.search);
  const orderId = params.get("orderId");
  const orderInfo = params.get("orderInfo") || "Thanh toán vé xem phim";
  const resultCode = params.get("resultCode");
  const message = params.get("message");
  const extraData = params.get("extraData");

  // Hook để gọi callback từ client
  const [clientCallback, { isLoading: isUpdating }] = useClientCallbackMutation();

  // Gọi API kiểm tra đơn hàng
  const {
    data: paymentData,
    isLoading,
    isError,
    refetch
  } = useCheckOrderQuery(orderId, { skip: !orderId });
  
  // Khi component mount, gọi callback để cập nhật trạng thái đơn hàng
  useEffect(() => {
    const updateOrderStatus = async () => {
      if (!orderId) return;
      
      try {
        // Chỉ gọi nếu có resultCode (từ MoMo chuyển về)
        if (resultCode) {
          console.log("Calling client callback with:", { orderId, resultCode, message, extraData });
          await clientCallback({ 
            orderId, 
            resultCode, 
            message,
            extraData
          }).unwrap();
          
          // Fetch lại dữ liệu sau khi cập nhật
          refetch();
        }
      } catch (error) {
        console.error("Error updating order status:", error);
        toast.error("Không thể cập nhật trạng thái đơn hàng");
      }
    };
    
    updateOrderStatus();
  }, [orderId, clientCallback, resultCode, message, extraData]);
  
  // Countdown effect để chuyển về trang chủ sau khi thanh toán thành công
  useEffect(() => {
    let timer;
    if (paymentStatus.status === "success" && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (paymentStatus.status === "success" && countdown === 0) {
      navigate("/");
    }
    
    return () => clearTimeout(timer);
  }, [paymentStatus.status, countdown, navigate]);

  useEffect(() => {
    if (!orderId) {
      setPaymentStatus({
        status: "error",
        message: "Không tìm thấy thông tin thanh toán!",
        details: {},
      });
      return;
    }

    if (isLoading || isUpdating) return;

    if (isError || !paymentData) {
      setPaymentStatus({
        status: "error",
        message: "Không thể kiểm tra trạng thái thanh toán!",
        details: { orderId },
      });
      return;
    }    

    // Kiểm tra kết quả thanh toán từ API
    if (paymentData.success && paymentData.data?.payment_status === "Success") {
      setBookingInfo(paymentData.data?.booking || null);
      setPaymentStatus({
        status: "success",
        message: "Thanh toán thành công!",
        details: {
          orderId,
          amount: paymentData.data?.booking?.total || 0,
          orderInfo,
        },
      });
      
      // Xóa dữ liệu đặt chỗ khi thanh toán thành công
      localStorage.removeItem('reservation');
      localStorage.removeItem('payment_info');
      localStorage.removeItem('promotion_id');
      
      // Hiển thị thông báo thành công
      toast.success("Đặt vé thành công!");
    } else {
      // Trường hợp thanh toán thất bại
      setPaymentStatus({
        status: "error",
        message: paymentData.message || "Thanh toán không thành công!",
        details: { orderId },
      });
    }
  }, [paymentData, isLoading, isError]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-100 py-12 px-4 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full text-center"
      >
        {paymentStatus.status === "loading" && (
          <div className="text-center py-8">
            <div className="animate-spin h-16 w-16 border-4 border-yellow-300 border-t-yellow-500 rounded-full mb-4 mx-auto"></div>
            <h2 className="text-xl font-semibold text-gray-700">
              {paymentStatus.message}
            </h2>
          </div>
        )}

        {paymentStatus.status === "success" && (
          <div className="text-center">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <FiCheckCircle className="h-20 w-20 text-yellow-500 mx-auto mb-6" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Cảm ơn bạn đã đặt vé!
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Vé của bạn đã được gửi về email.
            </p>
            
            <p className="text-sm text-gray-500 mt-6">
              Tự động chuyển về trang chủ sau {countdown} giây...
            </p>
          </div>
        )}

        {paymentStatus.status === "error" && (
          <div className="text-center">
            <FiXCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {paymentStatus.message}
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/")}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg mt-4 flex items-center justify-center"
            >
              <FiArrowLeft className="mr-2" /> Quay lại trang chủ
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentResult;
