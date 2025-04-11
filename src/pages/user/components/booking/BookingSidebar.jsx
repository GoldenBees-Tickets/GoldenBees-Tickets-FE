import React from "react";
import MovieInfo from "../MovieInfo";
import SelectedSeatsInfo from "../SelectedSeatsInfo";
import { useSearchParams } from "react-router-dom";

const BookingSidebar = ({
  showtimeData,
  imageBaseUrl,
  selectedSeats,
  hasActiveReservation,
  activeReservationInfo,
  selectedFoodItems,
  calculateTotalPrice,
  discountValue,
  handleBack,
  renderContinueButton,
  setSearchParams,
  descriptionDiscount,
  listSeatTypes
}) => {
  const totalPrice = calculateTotalPrice();
  const discount = discountValue();
  const finalPrice = totalPrice - discount;
  if(finalPrice) {
    localStorage.setItem("finalPrice", finalPrice);
  }

  const [searchParams, updateSearchParams] = useSearchParams();
  const checkCancel = searchParams.get("step") || "";

  return (
    <div className="w-full md:w-[30%] ml-5 mt-6 md:mt-0">
      <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-yellow-500">
        {/* Thông tin phim */}
        <MovieInfo showtimeData={showtimeData} imageBaseUrl={imageBaseUrl} />

        {/* Thông tin ghế đã chọn */}
        <div className="mt-4 border-t pt-4">
          <SelectedSeatsInfo
            selectedSeats={selectedSeats}
            hasActiveReservation={hasActiveReservation}
            activeReservationInfo={activeReservationInfo}
            onContinuePayment={() =>
              setSearchParams({
                room_id: activeReservationInfo?.showtime?.room?.id,
                step: "payment",
                showtime_id: activeReservationInfo?.showtime?.id,
              })
            }
          />
        </div>

        {/* Hiển thị đồ ăn đã chọn */}
        {selectedFoodItems.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <p className="font-medium">🍿 Đồ ăn đã chọn:</p>
            <ul className="mt-2 space-y-2">
              {selectedFoodItems.map((item, index) => (
                <li key={index} className="flex justify-between text-sm">
                  <span>
                    <strong>{item.quantity}x</strong> {item.name}
                  </span>
                  <span className="font-semibold">
                    {(item.price * item.quantity).toLocaleString()} đ
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Mô tả giảm giá */}
        {descriptionDiscount && (
          <div className="mt-6 text-sm text-gray-600 italic">
            {descriptionDiscount}
          </div>
        )}

        {/* Tổng giá tiền */}
        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <p className="text-lg flex justify-between">
            Tạm tính:{" "}
            <span className="text-red-600">
              {totalPrice.toLocaleString()} đ
            </span>
          </p>
          {discount > 0 && (
            <p className="text-lg font-medium flex justify-between">
              Giảm giá:{" "}
              <span className="text-green-600">
                - {discount.toLocaleString()} đ
              </span>
            </p>
          )}
          <p className="text-lg font-semibold flex justify-between border-t pt-2 mt-2">
            Tổng cộng:{" "}
            <span className="text-red-600">
              {finalPrice.toLocaleString()} đ
            </span>
          </p>
        </div>

        {/* Các nút điều hướng */}
        <div
          className={`mt-8 flex flex-col md:flex-row gap-4 ${
            checkCancel === "payment" || checkCancel === "food"
              ? "justify-between"
              : "justify-end"
          }`}
        >
          {(checkCancel === "payment" || checkCancel === "food") && (
            <button
              onClick={handleBack}
              className="w-full md:w-1/2 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
            >
              Quay lại
            </button>
          )}
          {renderContinueButton()}
        </div>
      </div>
    </div>
  );
};

export default BookingSidebar;
