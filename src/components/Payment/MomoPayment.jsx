import { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FiAlertCircle } from 'react-icons/fi';
import { useAddOrderMutation } from '../../api/orderApi';

const MomoPayment = ({ data, onSuccess, onError }) => {
  const [addOrder] = useAddOrderMutation(); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const { user_id, total, amount, seat_ids, showtime_id, combos, promotion_id, orderInfo } = data;
      // Gọi API MOMO với unwrap() để lấy dữ liệu chuẩn
      
      const response = await addOrder({ user_id, total, amount, seat_ids, showtime_id, combos, promotion_id, orderInfo }).unwrap(); 

      if (response.payUrl) {
        localStorage.removeItem("payment_info");
        localStorage.removeItem("reservation");
        sessionStorage.clear();
        if (onSuccess) {          
          onSuccess(response.payUrl);
        } else {          
          window.open(response.payUrl, '_blank');
        }
      } else {
        throw new Error(response.message || 'Không thể tạo thanh toán');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(error?.data?.message || 'Có lỗi xảy ra khi xử lý thanh toán');
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-start"
        >
          <FiAlertCircle className="mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang xử lý...
          </div>
        ) : (
          'Thanh toán với MOMO'
        )}
      </motion.button>

      <div className="mt-4 text-center text-xs text-gray-500">
        Bằng cách nhấn &quot;Thanh toán&quot;, bạn đồng ý với các điều khoản thanh toán của MOMO
      </div>
    </div>
  );
};

MomoPayment.propTypes = {
  amount: PropTypes.number.isRequired,
  orderInfo: PropTypes.string,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
};

export default MomoPayment;
