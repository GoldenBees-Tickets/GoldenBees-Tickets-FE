import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosPublic from "../../api/authQuery/axiosPublic";

const TestVNPay = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState(100000);
  const [bankCode, setBankCode] = useState("");
  const [language, setLanguage] = useState("vn");

  // Danh sách phương thức thanh toán
  const paymentMethods = [
    { value: "", label: "Cổng thanh toán VNPAYQR", id: "defaultPaymentMethod" },
    { value: "VNPAYQR", label: "Thanh toán qua ứng dụng hỗ trợ VNPAYQR", id: "vnpayqrPaymentMethod" },
    { value: "VNBANK", label: "Thanh toán qua ATM-Tài khoản ngân hàng nội địa", id: "vnbankPaymentMethod" },
    { value: "INTCARD", label: "Thanh toán qua thẻ quốc tế", id: "intcardPaymentMethod" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axiosPublic.post("/test-vnpay/create-payment", {
        amount: amount,
        bankCode: bankCode,
        language: language,
        orderInfo: "Thanh toan test VNPay",
        orderType: "billpayment"
      });

      if (response.data && response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      } else {
        setError("Không thể tạo URL thanh toán");
      }
    } catch (err) {
      console.error("Error creating payment:", err);
      setError(err.response?.data?.message || "Có lỗi xảy ra khi tạo thanh toán");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 py-6 px-6">
            <h1 className="text-xl md:text-2xl font-bold text-white text-center">
              Thanh Toán Qua VNPAY
            </h1>
            <p className="text-indigo-100 text-center mt-2">
              Thanh toán an toàn và bảo mật với VNPAY
            </p>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
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
            )}

            <form onSubmit={handleSubmit}>
              {/* Số tiền */}
              <div className="mb-6">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Số tiền thanh toán
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₫</span>
                  </div>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-8 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    min="10000"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">VND</span>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500">Tối thiểu 10,000 VND</p>
              </div>

              {/* Phương thức thanh toán */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn phương thức thanh toán
                </label>
                <div className="mt-2 space-y-3">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id={method.id}
                          name="bankCode"
                          type="radio"
                          value={method.value}
                          checked={bankCode === method.value}
                          onChange={() => setBankCode(method.value)}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor={method.id} className="font-medium text-gray-700 cursor-pointer">
                          {method.label}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ngôn ngữ */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngôn ngữ
                </label>
                <div className="mt-2 space-y-3">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="vnLanguage"
                        name="language"
                        type="radio"
                        value="vn"
                        checked={language === "vn"}
                        onChange={() => setLanguage("vn")}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="vnLanguage" className="font-medium text-gray-700 cursor-pointer">
                        Tiếng Việt
                      </label>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="enLanguage"
                        name="language"
                        type="radio"
                        value="en"
                        checked={language === "en"}
                        onChange={() => setLanguage("en")}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="enLanguage" className="font-medium text-gray-700 cursor-pointer">
                        Tiếng Anh
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin thẻ test */}
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-blue-800">Thông tin thẻ test</h3>
                <div className="mt-2 text-sm text-blue-700 space-y-1">
                  <p>Ngân hàng: NCB</p>
                  <p>Số thẻ: 9704198526191432198</p>
                  <p>Tên chủ thẻ: NGUYEN VAN A</p>
                  <p>Ngày phát hành: 07/15</p>
                  <p>Mật khẩu OTP: 123456</p>
                </div>
              </div>

              {/* Submit button */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang xử lý...
                    </>
                  ) : (
                    "Thanh toán ngay"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4">
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

export default TestVNPay; 