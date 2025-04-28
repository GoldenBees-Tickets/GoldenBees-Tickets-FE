import { useState, useEffect } from 'react';
import io from "socket.io-client";

export const useSocketConnection = (SOCKET_URL, showtime_id, user_id, clearExpiredReservation, refetchSeats) => {
  const [socket, setSocket] = useState(null);
  
  // Thiết lập kết nối socket và xử lý các sự kiện
  useEffect(() => {
    if (!SOCKET_URL || !showtime_id || !user_id) return;
    
    const newSocket = io(SOCKET_URL, {
      path: "/booking",
      query: {
        userType: "user",
        showtime_id,
        user_id,
      },
      transports: ["websocket"],
    });

    // Xử lý sự kiện kết nối
    newSocket.on("connect", () => {
      setSocket(newSocket);
    });

    // Xử lý lỗi kết nối
    newSocket.on("connect_error", (error) => {
      console.error("Lỗi kết nối socket:", error);
    });

    // Xử lý sự kiện khi phiên đặt vé hết hạn
    newSocket.on("reservationExpired", (data) => {
      if (data.user_id === user_id) {
        clearExpiredReservation();
        refetchSeats();
      }
    });

    // Xử lý sự kiện khi có ghế được giải phóng
    newSocket.on("seatUnbooked", () => {
      refetchSeats();
    });

    // Xử lý sự kiện khi có ghế được đặt
    newSocket.on("seatBooked", () => {
      refetchSeats();
    });
    
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [SOCKET_URL, showtime_id, user_id, clearExpiredReservation, refetchSeats]);
  
  return socket;
};

export default useSocketConnection; 