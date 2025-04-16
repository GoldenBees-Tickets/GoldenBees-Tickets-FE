import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosPublic from "../../api/authQuery/axiosPublic";

const VNPayResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (searchParams.toString() === "") {
          setError("Không có dữ liệu thanh toán");
          setLoading(false);
          return;
        }

        // Lấy tất cả query params
        const params = Object.fromEntries(searchParams.entries());

        // Gọi API xác thực thanh toán
        const response = await axiosPublic.get("/test-vnpay/verify-payment", {
          params
        });
        
        setResult(response.data);
      } catch (err) {
        console.error("Error verifying payment:", err);
        setError(
          err.response?.data?.message || "Không thể xác thực kết quả thanh toán"
        );
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  // Định dạng số tiền
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(amount || 0);
  };

  // Lấy mô tả trạng thái thanh toán
  const getStatusText = (code) => {
    const statusMap = {
      "00": "Giao dịch thành công",
      "01": "Giao dịch chưa hoàn tất",
      "02": "Giao dịch bị lỗi",
      "03": "Dữ liệu giao dịch không hợp lệ",
      "04": "Khởi tạo GD không thành công do Website TMĐT không hợp lệ",
      "05": "Giao dịch không thành công do: Quý khách nhập sai mật khẩu quá số lần quy định",
      "06": "Giao dịch không thành công do Quý khách nhập sai mật khẩu",
      "07": "Giao dịch bị nghi ngờ gian lận",
      "09": "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa",
      "10": "Giao dịch không thành công do: Quý khách nhập sai mật khẩu thanh toán",
      "11": "Giao dịch không thành công do: Đã hết hạn chờ thanh toán",
      "12": "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa",
      "24": "Giao dịch không thành công do: Khách hàng hủy giao dịch",
      "51": "Giao dịch không thành công do: Tài khoản không đủ số dư",
      "65": "Giao dịch không thành công do: Tài khoản vượt hạn mức giao dịch trong ngày",
      "75": "Ngân hàng thanh toán đang bảo trì",
      "99": "Lỗi khác"
    };
    
    return statusMap[code] || "Trạng thái không xác định";
  };
  
  // Xác định màu sắc dựa trên trạng thái
  const getStatusColor = (code) => {
    if (code === "00") return "bg-green-50 text-green-800 border-green-200";
    if (code === "01") return "bg-yellow-50 text-yellow-800 border-yellow-200";
    return "bg-red-50 text-red-800 border-red-200";
  };

  // Hiển thị loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Đang xác thực thanh toán...</p>
        </div>
      </div>
    );
  }

  // Hiển thị lỗi
  if (error) {
    return (
      <div className="min-h-screen py-12 bg-gray-50">
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-red-600 py-6 px-6">
              <h1 className="text-xl font-bold text-white text-center">
                Lỗi Thanh Toán
              </h1>
            </div>
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => navigate("/test-vnpay")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Thử Lại
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Hiển thị kết quả thành công
  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className={`py-6 px-6 ${result?.vnp_ResponseCode === "00" ? "bg-green-600" : "bg-red-600"}`}>
            <h1 className="text-xl font-bold text-white text-center">
              Kết Quả Thanh Toán
            </h1>
          </div>

          {/* Status */}
          <div className="p-6">
            <div className={`p-4 mb-6 rounded-md border ${getStatusColor(result?.vnp_ResponseCode)}`}>
              <h2 className="text-lg font-medium">
                {result?.vnp_ResponseCode === "00" ? (
                  <span className="flex items-center">
                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Thanh toán thành công
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Thanh toán không thành công
                  </span>
                )}
              </h2>
              <p className="mt-1 text-sm">
                {getStatusText(result?.vnp_ResponseCode)}
              </p>
            </div>

            {/* Transaction details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Chi tiết giao dịch</h3>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Mã giao dịch</dt>
                  <dd className="mt-1 text-sm text-gray-900">{result?.vnp_TxnRef}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Số tiền</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatCurrency(result?.vnp_Amount)}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Ngân hàng</dt>
                  <dd className="mt-1 text-sm text-gray-900">{result?.vnp_BankCode || "N/A"}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Mã GD Ngân hàng</dt>
                  <dd className="mt-1 text-sm text-gray-900">{result?.vnp_BankTranNo || "N/A"}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Thời gian</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {result?.vnp_PayDate 
                      ? new Date(
                          result.vnp_PayDate.substring(0, 4),
                          result.vnp_PayDate.substring(4, 6) - 1,
                          result.vnp_PayDate.substring(6, 8),
                          result.vnp_PayDate.substring(8, 10),
                          result.vnp_PayDate.substring(10, 12),
                          result.vnp_PayDate.substring(12, 14)
                        ).toLocaleString("vi-VN")
                      : "N/A"}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Loại thẻ</dt>
                  <dd className="mt-1 text-sm text-gray-900">{result?.vnp_CardType || "N/A"}</dd>
                </div>
              </dl>
            </div>

            {/* Actions */}
            <div className="flex justify-center">
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Về Trang Chủ
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <img src="https://sandbox.vnpayment.vn/paymentv2/images/img/logos/logo-preview.png" alt="VNPay Logo" className="h-8" />
              <p className="text-xs text-gray-500">© {new Date().getFullYear()} VNPAY Demo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VNPayResult; 