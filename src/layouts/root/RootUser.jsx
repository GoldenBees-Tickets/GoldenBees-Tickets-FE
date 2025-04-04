import { useState, useEffect, useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../user/Header";
import Footer from "../user/Footer";
import io from "socket.io-client";
import { toast } from "react-toastify";

export default function RootUser() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hasActiveReservation, setHasActiveReservation] = useState(false);
  const [activeReservationInfo, setActiveReservationInfo] = useState(null);
  const [isBookingPage, setIsBookingPage] = useState(false);

  // Kiểm tra người dùng có đang ở trang booking không
  useEffect(() => {
    const checkIfBookingPage = () => {
      const currentPath = window.location.pathname;
      setIsBookingPage(currentPath.includes('/booking/'));
    };
    
    checkIfBookingPage();
    
    // Theo dõi thay đổi URL
    window.addEventListener('popstate', checkIfBookingPage);
    
    return () => {
      window.removeEventListener('popstate', checkIfBookingPage);
    };
  }, []);

  // Kiểm tra đơn hàng đang xử lý toàn cục
  useEffect(() => {
    const checkActiveReservation = () => {
      const reservationData = localStorage.getItem("reservation");
      if (reservationData) {
        try {
          const reservation = JSON.parse(reservationData);
          const expiresAt = new Date(reservation.expires_at).getTime();
          const now = new Date().getTime();
          
          if (expiresAt > now) {
            setHasActiveReservation(true);
            setActiveReservationInfo(reservation);
          } else {
            // Lưu thông tin showtime_id và room_id trước khi xóa
            const showtime_id = reservation.showtime?.id;
            const room_id = reservation.showtime?.room?.id;
            
            // Nếu đã hết hạn, xóa dữ liệu
            localStorage.removeItem("reservation");
            if (showtime_id) {
              sessionStorage.removeItem(`selectedSeats_${showtime_id}`);
              localStorage.removeItem(`momoPaymentInfo`);
              localStorage.removeItem(`payment_info`);
              
              // Nếu người dùng đang ở trang booking của showtime này, chuyển họ về với room_id
              const currentPath = window.location.pathname;
              if (currentPath === `/booking/${showtime_id}` && room_id) {
                navigate(`/booking/${showtime_id}?room_id=${room_id}`);
                
                // Thông báo cho người dùng
                toast.info("Phiên đặt vé đã hết hạn. Vui lòng chọn ghế lại.");
              }
            }
            setHasActiveReservation(false);
            setActiveReservationInfo(null);
          }
        } catch (error) {
          console.error("Error parsing reservation data:", error);
        }
      } else {
        setHasActiveReservation(false);
        setActiveReservationInfo(null);
      }
    };

    // Kiểm tra khi component mount
    checkActiveReservation();

    // Thiết lập interval để kiểm tra 10 giây một lần
    const interval = setInterval(checkActiveReservation, 10000);
    
    return () => clearInterval(interval);
  }, [navigate]);

  const handleDarkModeToggle = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const handleContinuePayment = () => {
    if (activeReservationInfo?.showtime?.id) {
      navigate(`/payment/${activeReservationInfo.showtime.id}`);
    }
  };

  // Xử lý hủy đơn hàng
  const handleCancelReservation = () => {
    if (!activeReservationInfo?.showtime?.id) return;
    
    if (confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
      // Lấy thông tin cần thiết trước khi xóa
      const showtime_id = activeReservationInfo.showtime.id;
      const room_id = activeReservationInfo.showtime?.room?.id;
      
      // Kiểm tra xem đang ở trang payment không
      const currentPath = window.location.pathname;
      const isOnPaymentPage = currentPath.includes(`/payment/${showtime_id}`);
      
      // Gửi thông báo socket về việc hủy đơn hàng
      const user_id = JSON.parse(localStorage.getItem("user") || "{}")?.id;
      if (user_id) {
        // Tạo kết nối socket tạm thời để gửi sự kiện hủy
        const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3000", {
          path: "/booking",
          query: {
            userType: "user",
            showtime_id,
            user_id,
          },
          transports: ["websocket"],
        });

        socket.on('connect', () => {
          socket.emit("sessionExpired", {
            user_id,
            showtime_id,
            seat_ids: activeReservationInfo.seats?.map(s => s.id) || []
          });
          
          // Xóa dữ liệu đặt vé
          localStorage.removeItem("reservation");
          
          // Xóa dữ liệu lưu ghế đã chọn trong sessionStorage
          sessionStorage.removeItem(`selectedSeats_${showtime_id}`);
          
          setHasActiveReservation(false);
          setActiveReservationInfo(null);
          
          // Thông báo người dùng
          alert("Đã hủy đơn hàng thành công!");
          
          // Nếu đang ở trang payment, chuyển về trang booking
          if (isOnPaymentPage && room_id) {
            navigate(`/booking/${showtime_id}?room_id=${room_id}`);
          }
          
          // Đóng kết nối
          setTimeout(() => socket.disconnect(), 1000);
        });
      } else {
        // Nếu không có user_id, chỉ xóa dữ liệu local
        localStorage.removeItem("reservation");
        
        // Xóa dữ liệu lưu ghế đã chọn trong sessionStorage
        if (showtime_id) {
          sessionStorage.removeItem(`selectedSeats_${showtime_id}`);
        }
        
        setHasActiveReservation(false);
        setActiveReservationInfo(null);
        
        // Thông báo người dùng
        alert("Đã hủy đơn hàng thành công!");
        
        // Nếu đang ở trang payment, chuyển về trang booking
        if (isOnPaymentPage && room_id) {
          navigate(`/booking/${showtime_id}?room_id=${room_id}`);
        }
      }
    }
  };

  // Format thời gian còn lại
  const formatRemainingTime = useMemo(() => {
    if (!activeReservationInfo) return '';
    
    const expiresAt = new Date(activeReservationInfo.expires_at).getTime();
    const now = new Date().getTime();
    const diffSeconds = Math.max(0, Math.floor((expiresAt - now) / 1000));
    
    const minutes = Math.floor(diffSeconds / 60);
    const seconds = diffSeconds % 60;
    
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, [activeReservationInfo]);

  useEffect(() => {
    const body = document.body;

    if (isDarkMode) {
      body.classList.add("bg-black", "text-white");
      body.classList.remove("bg-white", "text-black");

      const links = document.querySelectorAll("a");
      const headers = document.querySelectorAll("h1, h2, h3, h4, h5, h6");

      links.forEach((link) => {
        link.classList.add("text-white", "hover:text-blue-400");
        link.classList.remove("text-black", "hover:text-blue-600");
      });

      headers.forEach((header) => {
        header.classList.add("text-white");
        header.classList.remove("text-black");
      });
    } else {
      body.classList.add("bg-white", "text-black");
      body.classList.remove("bg-black", "text-white");

      const links = document.querySelectorAll("a");
      const headers = document.querySelectorAll("h1, h2, h3, h4, h5, h6");

      links.forEach((link) => {
        link.classList.add("text-black", "hover:text-blue-600");
        link.classList.remove("text-white", "hover:text-blue-400");
      });

      headers.forEach((header) => {
        header.classList.add("text-black");
        header.classList.remove("text-white");
      });
    }
  }, [isDarkMode]);

  return (
    <>
      <Header onDarkModeToggle={handleDarkModeToggle} isDarkMode={isDarkMode} />
      
      {/* Thông báo đơn hàng đang xử lý - chỉ hiển thị khi không ở trang booking */}
      {hasActiveReservation && !isBookingPage && (
        <div className="sticky top-0 z-50 bg-yellow-500 text-white px-4 py-2 flex justify-between items-center shadow-md">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              <span className="font-semibold">Bạn đang có đơn hàng cần thanh toán!</span> 
              <span className="ml-2 hidden sm:inline">
                {activeReservationInfo?.showtime?.movie?.name} - {activeReservationInfo?.seats?.length} ghế - {' '}
                {activeReservationInfo?.showtime?.room?.cinema?.name}
              </span>
              <span className="ml-2 font-semibold">(Còn {formatRemainingTime})</span>
            </span>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleCancelReservation}
              className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-semibold hover:bg-red-700 transition-colors"
            >
              Hủy
            </button>
            <button 
              onClick={handleContinuePayment}
              className="bg-white text-yellow-600 px-4 py-1 rounded-full text-sm font-semibold hover:bg-yellow-50 transition-colors"
            >
              Tiếp tục thanh toán
            </button>
          </div>
        </div>
      )}
      
      <main className="min-h-screen mt-[75px]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
