import React, { useState } from "react";
import DiscountSection from "./DiscountSection";
import MomoPayment from "../../../../components/Payment/MomoPayment";
import Payment from "../../Payment";

const PaymentStep = ({
  user_id,
  appliedDiscount,
  setAppliedDiscount,
  discountCode,
  setDiscountCode,
  handleApplyDiscount,
  isCheckingDiscount,  selectedFoodItems,
  calculateTotalPrice,
  onApplyStar,
  setOnApplyStar
}) => {
  const [showMomoPaymentUI, setShowMomoPaymentUI] = useState(false);

  // Xử lý khi người dùng nhấn thanh toán với MOMO
  const handleMomoPayment = () => {
    setShowMomoPaymentUI(true);
  };

  // Xử lý khi thanh toán MOMO thành công
  const handleMomoSuccess = (payUrl) => {
    // Chuyển hướng đến trang thanh toán MOMO
    window.location.href = payUrl;
  };

  // Xử lý khi thanh toán MOMO thất bại
  const handleMomoError = (error) => {
    setShowMomoPaymentUI(false);
    console.error("Lỗi thanh toán MOMO:", error);
  };

  // Hiển thị giao diện thanh toán MOMO
  if (showMomoPaymentUI) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Thanh toán với MOMO</h1>
        <p className="text-gray-600 mb-6">
          Vui lòng hoàn tất thanh toán qua ví điện tử MOMO
        </p>

        <div className="grid grid-cols-1 gap-8">
          {/* Phần thanh toán MOMO */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <MomoPayment
              amount={calculateTotalPrice()}
              orderInfo={`Thanh toán vé xem phim`}
              onSuccess={handleMomoSuccess}
              onError={handleMomoError}
            />
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => setShowMomoPaymentUI(false)}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Thanh toán</h1>
      <p className="text-gray-600 mb-6">
        Hoàn tất thanh toán để nhận vé xem phim
      </p>

      {/* Phần nhập mã giảm giá */}
      <DiscountSection
        user_id={user_id}
        appliedDiscount={appliedDiscount}
        setAppliedDiscount={setAppliedDiscount}
        discountCode={discountCode}
        setDiscountCode={setDiscountCode}
        handleApplyDiscount={handleApplyDiscount}
        isCheckingDiscount={isCheckingDiscount}
        onApplyStar={onApplyStar}
        setOnApplyStar={setOnApplyStar}
      />

      {/* Phương thức thanh toán */}
      <Payment />
    </div>
  );
};

export default PaymentStep;
