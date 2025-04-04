// Component hiển thị thông báo khi có đơn hàng ở suất chiếu khác
export default function OtherShowtimeNotification({ activeReservationInfo, onContinuePayment }) {
  return (
    <div className="bg-yellow-50 p-4 mb-4 rounded-lg border border-yellow-200">
      <p className="text-yellow-800 font-medium">
        Bạn đang có đơn hàng cần thanh toán ở suất chiếu khác
      </p>
      <p className="text-sm text-yellow-700 mt-1">
        Phim: {activeReservationInfo?.showtime?.movie?.name} - {activeReservationInfo?.showtime?.room?.cinema?.name}
      </p>
      <button
        onClick={onContinuePayment}
        className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
      >
        Tiếp tục thanh toán
      </button>
    </div>
  );
} 