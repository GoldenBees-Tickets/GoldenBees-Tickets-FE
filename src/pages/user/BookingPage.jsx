import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiClock, FiMapPin, FiCheckCircle } from 'react-icons/fi';

const BookingPage = () => {
  const navigate = useNavigate();
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  
  // Dữ liệu mẫu cho phim
  const movie = {
    id: 1,
    title: 'Avengers: Endgame',
    poster: 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg',
    duration: 181,
    rating: 'PG-13',
    description: 'Sau các sự kiện tàn khốc của Avengers: Infinity War, vũ trụ đang trong tình trạng đổ nát. Với sự giúp đỡ của các đồng minh còn lại, các Avengers tập hợp một lần nữa để đảo ngược hành động của Thanos và khôi phục sự cân bằng cho vũ trụ.',
    theater: 'CGV Vincom Center Bà Triệu',
    price: 75000
  };

  // Dữ liệu mẫu cho các suất chiếu
  const showtimes = [
    { id: 1, time: '10:00', date: '2023-08-15', room: 'Phòng 1' },
    { id: 2, time: '13:30', date: '2023-08-15', room: 'Phòng 2' },
    { id: 3, time: '16:45', date: '2023-08-15', room: 'Phòng 1' },
    { id: 4, time: '19:30', date: '2023-08-15', room: 'Phòng 3' },
    { id: 5, time: '22:15', date: '2023-08-15', room: 'Phòng 2' }
  ];

  // Dữ liệu mẫu cho sơ đồ ghế
  const generateSeats = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 10;
    const seatMap = [];

    rows.forEach(row => {
      const rowSeats = [];
      for (let i = 1; i <= seatsPerRow; i++) {
        // Tạo một số ghế đã được đặt ngẫu nhiên
        const isBooked = Math.random() < 0.3;
        rowSeats.push({
          id: `${row}${i}`,
          row,
          number: i,
          isBooked
        });
      }
      seatMap.push(rowSeats);
    });

    return seatMap;
  };

  const seats = generateSeats();

  // Xử lý khi chọn suất chiếu
  const handleSelectShowtime = (showtime) => {
    setSelectedShowtime(showtime);
    // Reset ghế đã chọn khi thay đổi suất chiếu
    setSelectedSeats([]);
    setTotalAmount(0);
  };

  // Xử lý khi chọn ghế
  const handleSelectSeat = (seat) => {
    if (seat.isBooked) return;

    const isSeatSelected = selectedSeats.some(s => s.id === seat.id);
    
    if (isSeatSelected) {
      // Bỏ chọn ghế
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      // Chọn ghế
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  // Cập nhật tổng tiền khi chọn ghế
  useEffect(() => {
    setTotalAmount(selectedSeats.length * movie.price);
  }, [selectedSeats, movie.price]);

  // Xử lý khi nhấn nút thanh toán
  const handleProceedToPayment = () => {
    if (!selectedShowtime) {
      toast.error('Vui lòng chọn suất chiếu');
      return;
    }

    if (selectedSeats.length === 0) {
      toast.error('Vui lòng chọn ít nhất một ghế');
      return;
    }

    // Chuyển đến trang thanh toán với thông tin đặt vé
    navigate('/payment', {
      state: {
        amount: totalAmount,
        orderInfo: `Đặt vé xem phim ${movie.title}`,
        movieData: {
          title: movie.title,
          showtime: `${selectedShowtime.time}, ${formatDate(selectedShowtime.date)}`,
          theater: `${movie.theater}, ${selectedShowtime.room}`,
          seats: selectedSeats.map(seat => seat.id)
        }
      }
    });
  };

  // Hàm định dạng ngày tháng
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Đặt vé xem phim</h1>
        <p className="text-gray-600 mb-8">Chọn suất chiếu và ghế ngồi</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Thông tin phim */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <img 
                src={movie.poster} 
                alt={movie.title} 
                className="w-full h-80 object-cover object-center"
              />
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
                <div className="flex items-center text-gray-600 mb-4">
                  <FiClock className="mr-2" />
                  <span>{movie.duration} phút</span>
                  <span className="mx-2">•</span>
                  <span>{movie.rating}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <FiMapPin className="mr-2" />
                  <span>{movie.theater}</span>
                </div>
                <p className="text-gray-700 mb-4 line-clamp-4">{movie.description}</p>
                <div className="border-t pt-4">
                  <p className="text-gray-600">Giá vé:</p>
                  <p className="text-xl font-bold text-blue-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(movie.price)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Chọn suất chiếu và ghế */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Chọn suất chiếu</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {showtimes.map(showtime => (
                  <button
                    key={showtime.id}
                    onClick={() => handleSelectShowtime(showtime)}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      selectedShowtime && selectedShowtime.id === showtime.id
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    <div className="font-medium">{showtime.time}</div>
                    <div className="text-sm">{showtime.room}</div>
                  </button>
                ))}
              </div>
            </div>

            {selectedShowtime && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Chọn ghế</h2>
                
                <div className="mb-6">
                  <div className="w-full h-8 bg-gray-300 rounded-t-lg flex items-center justify-center text-gray-600 font-medium">
                    Màn hình
                  </div>
                  <div className="w-full h-4 bg-gradient-to-b from-gray-300 to-transparent"></div>
                </div>
                
                <div className="space-y-3 mb-6">
                  {seats.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center space-x-2">
                      {row.map(seat => (
                        <button
                          key={seat.id}
                          onClick={() => handleSelectSeat(seat)}
                          disabled={seat.isBooked}
                          className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-medium transition-all ${
                            seat.isBooked
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : selectedSeats.some(s => s.id === seat.id)
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border border-gray-300 hover:border-blue-400'
                          }`}
                        >
                          {seat.id}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center space-x-8 mb-6">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-white border border-gray-300 rounded-md mr-2"></div>
                    <span className="text-sm">Ghế trống</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-blue-600 rounded-md mr-2"></div>
                    <span className="text-sm">Đã chọn</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-gray-300 rounded-md mr-2"></div>
                    <span className="text-sm">Đã đặt</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tóm tắt đặt vé */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Tóm tắt đặt vé</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Phim:</span>
                  <span className="font-medium">{movie.title}</span>
                </div>
                
                {selectedShowtime && (
                  <>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Suất chiếu:</span>
                      <span className="font-medium">
                        {selectedShowtime.time}, {formatDate(selectedShowtime.date)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Phòng:</span>
                      <span className="font-medium">{selectedShowtime.room}</span>
                    </div>
                  </>
                )}
                
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Ghế đã chọn:</span>
                  <span className="font-medium">
                    {selectedSeats.length > 0 
                      ? selectedSeats.map(seat => seat.id).join(', ') 
                      : 'Chưa chọn ghế'}
                  </span>
                </div>
                
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Số lượng ghế:</span>
                  <span className="font-medium">{selectedSeats.length}</span>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold">Tổng thanh toán:</span>
                  <span className="text-xl font-bold text-blue-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
                  </span>
                </div>
                
                <button
                  onClick={handleProceedToPayment}
                  disabled={selectedSeats.length === 0}
                  className={`w-full py-3 px-4 rounded-lg flex items-center justify-center font-medium transition-all ${
                    selectedSeats.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <FiCheckCircle className="mr-2" />
                  Tiến hành thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage; 