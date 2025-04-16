import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosPublic from "../../api/authQuery/axiosPublic";

const TestVNPay = ({ data, onSuccess, onError }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Sử dụng dữ liệu từ props thay vì state
      const response = await axiosPublic.post("/test-vnpay/create-payment", {
        amount: data.amount || data.total,
        orderInfo: data.orderInfo || "Thanh toán vé xem phim",
        orderType: "billpayment",
        user_id: data.user_id,
        showtime_id: data.showtime_id,
        seat_ids: data.seat_ids,
        combos: data.combos || [],
        promotion_id: data.promotion_id,
        // Mặc định các tham số
        bankCode: "",
        language: "vn",
      });

      if (response.data && response.data.paymentUrl) {
        if (onSuccess) {
          onSuccess(response.data.paymentUrl);
        } else {
          window.location.href = response.data.paymentUrl;
        }
      } else {
        const errorMsg = "Không thể tạo URL thanh toán";
        console.error(errorMsg, response.data);
        setError(errorMsg);
        if (onError) {
          onError({ message: errorMsg });
        }
      }
    } catch (err) {
      console.error("Error creating payment:", err);
      const errorMsg =
        err.response?.data?.message || "Có lỗi xảy ra khi tạo thanh toán";
      setError(errorMsg);
      if (onError) {
        onError({ message: errorMsg });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center">
      {error && (
        <div className="mb-4 w-full bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-700 text-center">{error}</p>
        </div>
      )}

      <div className="w-full">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Đang xử lý...
            </>
          ) : (
            "Thanh toán ngay"
          )}
        </button>
      </div>
    </div>
  );
};

export default TestVNPay;
