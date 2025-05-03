import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosPublic from '@/api/authQuery/axiosPublic';
import { motion } from 'framer-motion';
import { BsCheckCircleFill, BsArrowLeft, BsTicketPerforated, BsCalendar3, BsClock, BsPinMap } from 'react-icons/bs';
import { MdFastfood } from 'react-icons/md';

const VNPaySuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    
    if (!orderId) {
      navigate('/');
      return;
    }

    // Lấy thông tin chi tiết của đơn hàng từ API
    const fetchOrderDetails = async () => {
      try {
        const response = await axiosPublic.get(`/orders/${orderId}`);
        
        if (response.data && response.data.success) {
          setOrderDetails(response.data.data);
        } else {
          console.error('Không tìm thấy thông tin đơn hàng');
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin đơn hàng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [searchParams, navigate]);

  // Hẹn giờ chuyển về trang chủ
  useEffect(() => {
    if (!loading && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      navigate('/');
    }
  }, [countdown, loading, navigate]);

  // Format ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format giờ
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format tiền tệ VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-yellow-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Đang xác thực thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-green-600 py-6 px-6 text-center">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-4"
            >
              <BsCheckCircleFill className="text-white text-6xl" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white">Thanh toán thành công!</h1>
            <p className="text-green-100 mt-1">
              Cảm ơn bạn đã đặt vé. Thông tin vé của bạn đã được lưu lại.
            </p>
          </div>

          {/* Thông tin chi tiết */}
          {orderDetails && (
            <div className="p-6">
              {/* Thông tin phim và suất chiếu */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
                  <BsTicketPerforated className="mr-2 text-yellow-500" />
                  Thông tin vé
                </h2>
                
                <div className="bg-yellow-50 rounded-lg p-4 space-y-4">
                  {/* Thông tin phim */}
                  <div>
                    <p className="font-medium text-gray-700">Phim:</p>
                    <p className="text-gray-800 text-lg">{orderDetails?.movie?.title || orderDetails?.showtime?.movie?.title}</p>
                  </div>
                  
                  {/* Thông tin suất chiếu */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-gray-700 flex items-center">
                        <BsCalendar3 className="mr-2 text-yellow-500" />
                        Ngày chiếu:
                      </p>
                      <p className="text-gray-800">
                        {formatDate(orderDetails?.showtime?.start_time)}
                      </p>
                    </div>
                    
                    <div>
                      <p className="font-medium text-gray-700 flex items-center">
                        <BsClock className="mr-2 text-yellow-500" />
                        Giờ chiếu:
                      </p>
                      <p className="text-gray-800">
                        {formatTime(orderDetails?.showtime?.start_time)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Thông tin rạp */}
                  <div>
                    <p className="font-medium text-gray-700 flex items-center">
                      <BsPinMap className="mr-2 text-yellow-500" />
                      Rạp chiếu:
                    </p>
                    <p className="text-gray-800">
                      {orderDetails?.showtime?.theater?.name}, Phòng {orderDetails?.showtime?.room?.name}
                    </p>
                  </div>
                  
                  {/* Thông tin ghế */}
                  <div>
                    <p className="font-medium text-gray-700">Ghế đã đặt:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {orderDetails?.seats?.map(seat => (
                        <span key={seat.id} className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full">
                          {seat.seat_row}{seat.seat_number}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Thức ăn */}
                  {orderDetails?.food_items && orderDetails.food_items.length > 0 && (
                    <div>
                      <p className="font-medium text-gray-700 flex items-center">
                        <MdFastfood className="mr-2 text-yellow-500" />
                        Thức ăn:
                      </p>
                      <ul className="mt-1 space-y-1">
                        {orderDetails.food_items.map(item => (
                          <li key={item.id} className="text-gray-800">
                            {item.name} x{item.quantity} - {formatCurrency(item.price * item.quantity)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Thông tin thanh toán */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Chi tiết thanh toán</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Mã đơn hàng:</span>
                    <span className="font-medium">{orderDetails.id}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phương thức thanh toán:</span>
                    <span className="font-medium">VNPay</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Trạng thái:</span>
                    <span className="font-medium text-green-600">Thành công</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-700">Tổng tiền:</span>
                      <span className="font-bold text-yellow-600 text-xl">
                        {formatCurrency(orderDetails.total_amount || orderDetails.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Hành động */}
              <div className="flex justify-between">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate('/')}
                  className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
                >
                  <BsArrowLeft className="mr-2" />
                  Về trang chủ
                </motion.button>
                
                <p className="text-sm text-gray-500 self-end">
                  Tự động chuyển về trang chủ sau {countdown} giây...
                </p>
              </div>
            </div>
          )}
          
          {/* Nếu không có thông tin đơn hàng */}
          {!loading && !orderDetails && (
            <div className="p-6 text-center">
              <p className="text-gray-600 mb-4">Không thể tìm thấy thông tin đơn hàng.</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate('/')}
                className="inline-flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-white"
              >
                <BsArrowLeft className="mr-2" />
                Về trang chủ
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default VNPaySuccess; 