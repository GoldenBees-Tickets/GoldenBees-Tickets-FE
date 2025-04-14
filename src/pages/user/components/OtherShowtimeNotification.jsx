import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

// Component hiển thị thông báo khi có đơn hàng ở suất chiếu khác
export default function OtherShowtimeNotification({ 
  activeReservationInfo, 
  onContinuePayment,
  onReservationCancel // New prop to handle reservation cancellation in parent
}) {
  const showCancelConfirm = () => {
    Modal.confirm({
      title: 'Xác nhận hủy đơn hàng',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn hủy đơn hàng cho phim "${activeReservationInfo?.showtime?.Movie?.name}" không?`,
      okText: 'Đồng ý hủy',
      okType: 'danger',
      cancelText: 'Không hủy',
      onOk() {
        // Clear storage
        localStorage.removeItem("reservation");
        localStorage.removeItem("finalPrice");
        sessionStorage.clear();
        
        // Notify parent component about the cancellation
        if (typeof onReservationCancel === 'function') {
          onReservationCancel();
        } else {
          // Fallback if parent doesn't provide the callback
          window.location.reload();
        }
      }
    });
  };

  return (
    <div className="bg-yellow-50 p-4 mb-4 rounded-lg border border-yellow-200">
      <p className="text-yellow-800 font-medium">
        Bạn đang có đơn hàng cần thanh toán ở suất chiếu khác
      </p>
      <p className="text-sm text-yellow-700 mt-1">
        Phim: {activeReservationInfo?.showtime?.Movie?.name} - {activeReservationInfo?.showtime?.Room?.Cinema?.name}
      </p>
      <div className="space-x-2">
      <button
        onClick={showCancelConfirm}
        className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
      >
        Hủy đơn hàng
      </button>
      <button
        onClick={onContinuePayment}
        className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
      >
        Tiếp tục thanh toán
      </button>
      </div>
    </div>
  );
} 