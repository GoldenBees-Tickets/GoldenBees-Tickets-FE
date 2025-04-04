import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTicket, faUtensils, faCalendarAlt, faMapMarkerAlt, faClock } from "@fortawesome/free-solid-svg-icons";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);

  // Load reservation details from localStorage
  useEffect(() => {
    const reservationData = localStorage.getItem("reservation");
    if (!reservationData) {
      // If no reservation data, redirect to home
      navigate("/");
      return;
    }

    try {
      const data = JSON.parse(reservationData);
      setReservation(data);
    } catch (error) {
      console.error("Error parsing reservation data:", error);
      navigate("/");
    }
  }, [navigate]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleGoHome = () => {
    navigate("/");
  };


  return (
    <h1>Cảm ơn đã đạt vé</h1>
    // <BookingLayout 
    //   currentStep={4}
    //   onContinue={handleGoHome}
    // >
    //   <div className="p-6">
    //     <div className="text-center mb-8">
    //       <div className="flex justify-center mb-4">
    //         <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-6xl" />
    //       </div>
    //       <h1 className="text-2xl font-bold text-green-700">Thanh toán thành công!</h1>
    //       <p className="text-gray-600 mt-2">
    //         Cảm ơn bạn đã đặt vé. Thông tin vé của bạn đã được gửi qua email.
    //       </p>
    //     </div>

    //     <div className="bg-white rounded-lg shadow-md p-6 mb-6">
    //       <h2 className="text-xl font-semibold mb-4 flex items-center">
    //         <FontAwesomeIcon icon={faTicket} className="mr-2 text-orange-500" />
    //         Thông tin vé
    //       </h2>
          
    //       <div className="space-y-4">
    //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //           <div>
    //             <p className="font-medium text-gray-700">Phim:</p>
    //             <p className="text-gray-800">{reservation.showtime?.movie?.title}</p>
    //           </div>
              
    //           <div>
    //             <p className="font-medium text-gray-700">Suất chiếu:</p>
    //             <p className="text-gray-800 flex items-center">
    //               <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-orange-500 text-sm" />
    //               {formatDate(reservation.showtime?.start_time)}
    //               <FontAwesomeIcon icon={faClock} className="ml-4 mr-2 text-orange-500 text-sm" />
    //               {formatTime(reservation.showtime?.start_time)}
    //             </p>
    //           </div>
    //         </div>
            
    //         <div>
    //           <p className="font-medium text-gray-700">Rạp chiếu:</p>
    //           <p className="text-gray-800 flex items-center">
    //             <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-orange-500 text-sm" />
    //             {reservation.showtime?.theater?.name}, Phòng {reservation.showtime?.room?.name}
    //           </p>
    //         </div>
            
    //         <div>
    //           <p className="font-medium text-gray-700">Ghế đã đặt:</p>
    //           <div className="flex flex-wrap gap-2 mt-1">
    //             {reservation.seats.map(seat => (
    //               <span key={seat.id} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full">
    //                 {seat.seat_row}{seat.seat_number}
    //               </span>
    //             ))}
    //           </div>
    //         </div>
            
    //         {reservation.food_items && reservation.food_items.length > 0 && (
    //           <div>
    //             <p className="font-medium text-gray-700 flex items-center">
    //               <FontAwesomeIcon icon={faUtensils} className="mr-2 text-orange-500" />
    //               Thức ăn:
    //             </p>
    //             <ul className="mt-1 space-y-1">
    //               {reservation.food_items.map(item => (
    //                 <li key={item.id} className="text-gray-800">
    //                   {item.name} x{item.quantity}
    //                 </li>
    //               ))}
    //             </ul>
    //           </div>
    //         )}
            
    //         <div className="border-t border-gray-200 pt-4">
    //           <div className="flex justify-between items-center font-bold">
    //             <span>Tổng cộng:</span>
    //             <span className="text-orange-600 text-xl">
    //               {Number(reservation.totalPrice).toLocaleString()} đ
    //             </span>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </BookingLayout>
  );
} 