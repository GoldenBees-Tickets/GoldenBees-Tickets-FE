import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MomoPayment from "../../components/Payment/MomoPayment";

const PaymentPage = ({ user_id, listSeatTypes, showtimeData, selectedSeats }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy dữ liệu từ localStorage
  const dataPage = JSON.parse(localStorage.getItem("reservation") || "{}");
  const dataTotal = JSON.parse(localStorage.getItem("payment_info") || "{}");
  const promotion_id = localStorage.getItem("promotion_id") || null;
  const finalPrice = localStorage.getItem("finalPrice") || 0;
  
  // Lấy thông tin ghế và tính giá
  const seat_ids = selectedSeats?.map((seat) => {
    let basePrice = 0;
    const price_offset = listSeatTypes?.seat_types?.find((type) => type.id === seat.type_id)?.price_offset;

    basePrice = Number(showtimeData?.base_price) + Number(price_offset);
    return { id: seat.id, price: basePrice}  
  });
    
  // Chuẩn bị dữ liệu hiển thị
  const movieName = showtimeData?.showtime?.Movie?.name || 
                   showtimeData?.Movie?.name || 
                   dataPage?.showtime?.Movie?.name || 
                   "Không xác định";
  
  // Định dạng suất chiếu
  let showtimeText = "Không xác định";
  if (showtimeData?.start_time && showtimeData?.show_date) {
    showtimeText = `${showtimeData.start_time} ${showtimeData.show_date}`;
  } else if (showtimeData?.showtime?.start_time) {
    showtimeText = showtimeData.showtime.start_time;
  } else if (dataPage?.showtime?.start_time) {
    showtimeText = typeof dataPage.showtime.start_time === 'object'
      ? `${dataPage.showtime.start_time.time} - ${dataPage.showtime.start_time.date}`
      : dataPage.showtime.start_time;
  }
  
  const dataConfirm = {
    movie: movieName,
    showtime: showtimeText,
    foodItems: dataPage?.foodItems,
    total: finalPrice || 0,
  };

  // Lấy thông tin thanh toán
  const amount = dataTotal?.total_amount || 0;
  const orderInfo = `Thanh toán vé xem phim ${movieName}`;
  
  // Chuẩn bị dữ liệu gửi đến API
  const dataApi = {
    user_id,
    total: finalPrice,
    amount: finalPrice,
    seat_ids: seat_ids,
    showtime_id: dataPage?.showtime.id,
    combos: dataPage?.foodItems,
    promotion_id,
    orderInfo: orderInfo,
  };  
  // Xử lý khi thanh toán thành công
  const handlePaymentSuccess = (payUrl) => {
    // Chuyển hướng đến trang thanh toán MOMO
    window.open(payUrl, "_blank");
  };

  // Xử lý khi thanh toán thất bại
  const handlePaymentError = (error) => {
    toast.error(`Lỗi thanh toán: ${error.message}`);
  };

  // Kiểm tra nếu không có thông tin thanh toán
  if (!amount) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 text-red-600 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-2">
            Không tìm thấy thông tin thanh toán
          </h2>
          <p>Vui lòng quay lại trang đặt vé và thử lại.</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full max-w-xl mx-auto text-center bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Xác nhận đặt vé
        </h1>

        <table className="w-full border-collapse border border-gray-300 text-left">
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-semibold">
                Tên phim:
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {dataConfirm?.movie}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-semibold">
                Suất chiếu:
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {dataConfirm?.showtime}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-semibold">
                Món ăn:
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {dataConfirm?.foodItems?.length > 0
                  ? dataConfirm?.foodItems?.map((item, index) => (
                      <p key={index}>
                        {item.quantity} x {item.name}
                      </p>
                    ))
                  : "Không có món ăn"}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-semibold">
                Tổng tiền:
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {dataConfirm?.total.toLocaleString()} VNĐ
              </td>
            </tr>
          </tbody>
        </table>

        <div>
          <MomoPayment
            data={dataApi}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
