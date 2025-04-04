import { useState } from 'react';
import { useGenerateQrCodeMutation, useResendQrCodeEmailMutation } from '@/api/qrCodeApi';

function QrCodePage() {
  const [qrImage, setQrImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [ticketId, setTicketId] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailHint, setEmailHint] = useState('');
  
  const [generateQrCode] = useGenerateQrCodeMutation();
  const [resendQrCodeEmail] = useResendQrCodeEmailMutation();
  
  // Dữ liệu vé xem phim
  const ticketData = {
    movieName: "Avengers: Endgame",
    showTime: "2023-05-22T20:30:00",
    seat: "G12, G13",
    price: 180000,
    theater: "CGV Aeon Mall",
    room: "P05",
    ticketId: "TIX2023051975612"
  };

  // Xử lý khi thay đổi email
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Xóa gợi ý khi người dùng nhập email
    if (emailHint) setEmailHint('');
  };

  // Kiểm tra email hợp lệ
  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const generateTicketQR = async () => {
    setIsLoading(true);
    setErrorMessage('');
    setEmailSent(false);
    setEmailHint('');
    
    // Kiểm tra email nếu đã nhập
    if (email && !isValidEmail(email)) {
      setEmailHint('Email không hợp lệ! Vui lòng nhập đúng định dạng.');
      setIsLoading(false);
      return;
    }
    
    try {
      // Kiểm tra kết nối mạng trước khi gọi API
      if (!navigator.onLine) {
        throw new Error('Không có kết nối internet. Vui lòng kiểm tra kết nối mạng của bạn.');
      }
      
      console.log('Bắt đầu gửi request tạo mã QR với dữ liệu:', ticketData);
      
      // Tạo object chứa data và email (nếu có)
      const requestData = { data: ticketData };
      if (email) {
        requestData.email = email;
      }
      
      const response = await generateQrCode(requestData);
      console.log('Phản hồi đầy đủ từ API:', response);
      
      if (response.data && response.data.success) {
        setQrImage(`http://localhost:3000/public${response.data.data.qrUrl}`);
        setTicketId(response.data.data.ticketId);
        setShowModal(true);
        
        // Kiểm tra xem email có được gửi thành công không
        if (response.data.emailSent) {
          setEmailSent(true);
          
          if (email) {
            // Hiển thị thông báo thành công nếu có email
            setEmailHint('✅ Đã gửi mã QR đến email của bạn. Vui lòng kiểm tra cả thư mục Spam/Junk nếu không tìm thấy.');
          }
        } else if (response.data.emailMessage && email) {
          // Hiển thị lỗi nếu có email nhưng gửi không thành công
          setEmailHint('⚠️ ' + response.data.emailMessage);
        }
        
        // Log ID của vé đã được tạo
        console.log('Vé đã được tạo với ID:', response.data.data.ticketId);
      } else if (response.error) {
        // Xử lý lỗi từ API
        console.error('Lỗi nhận được từ API:', response.error);
        const errorData = response.error.data || {};
        const errorMsg = errorData.message || 
                         response.error.error || 
                         'Không thể kết nối đến server để tạo mã QR';
        
        // Log thêm chi tiết lỗi nếu có
        if (errorData.errorDetails) {
          console.error('Chi tiết lỗi:', errorData.errorDetails);
        }
        
        throw new Error(errorMsg);
      } else {
        throw new Error('Không thể tạo mã QR. Lỗi không xác định.');
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      
      // Set thông báo lỗi để hiển thị trong UI
      setErrorMessage(error.message || 'Không thể kết nối đến server để tạo mã QR');
      
      // Hiển thị thông báo lỗi
      alert('Không thể tạo mã QR. Vui lòng kiểm tra kết nối server và thử lại. Lỗi: ' + 
            (error.message || 'Không thể kết nối đến server'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      alert('Vui lòng nhập địa chỉ email');
      return;
    }
    
    if (!isValidEmail(email)) {
      alert('Email không hợp lệ! Vui lòng nhập đúng định dạng.');
      return;
    }
    
    if (!ticketId) {
      alert('Không có thông tin vé để gửi');
      return;
    }
    
    setEmailSending(true);
    
    try {
      const response = await resendQrCodeEmail({ ticketId, email });
      console.log('Kết quả gửi lại email:', response);
      
      if (response.data && response.data.success) {
        setEmailSent(true);
        setShowEmailForm(false);
        alert('Đã gửi mã QR đến email của bạn! Vui lòng kiểm tra cả thư mục Spam/Junk nếu không tìm thấy.');
      } else if (response.error) {
        throw new Error(response.error.data?.message || 'Không thể gửi email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Lỗi khi gửi email: ' + error.message);
    } finally {
      setEmailSending(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrImage;
    link.download = 'movie-ticket-qr.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 13h6v6H3v-6zm2 2v2h2v-2H5zm13-2h3v2h-3v-2zm0 4h3v2h-3v-2zM13 13h2v2h-2v-2zm0 4h2v2h-2v-2zm4-4h2v2h-2v-2z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Tạo Mã QR Vé Xem Phim</h1>
          <p className="text-gray-600">Nhấn nút bên dưới để tạo mã QR cho vé xem phim của bạn</p>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
          <h2 className="font-bold text-blue-800 mb-2 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            Thông tin vé xem phim
          </h2>
          <div className="text-sm text-gray-700 space-y-1">
            <p><span className="font-medium">Phim:</span> {ticketData.movieName}</p>
            <p><span className="font-medium">Suất chiếu:</span> {new Date(ticketData.showTime).toLocaleString()}</p>
            <p><span className="font-medium">Phòng:</span> {ticketData.room}</p>
            <p><span className="font-medium">Ghế:</span> {ticketData.seat}</p>
            <p><span className="font-medium">Rạp:</span> {ticketData.theater}</p>
            <p><span className="font-medium">Mã vé:</span> {ticketData.ticketId}</p>
            <p><span className="font-medium">Giá:</span> {ticketData.price.toLocaleString()} VND</p>
          </div>
        </div>

        {/* Form nhập email */}
        <div className="mb-6">
          <label htmlFor="email" className="block text-left text-sm font-medium text-gray-700 mb-1">
            Email nhận mã QR (tùy chọn)
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="example@gmail.com"
            className={`w-full px-3 py-2 border ${emailHint && emailHint.startsWith('⚠️') ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
          {emailHint && (
            <p className={`text-xs ${emailHint.startsWith('✅') ? 'text-green-600' : 'text-orange-600'} text-left mt-1`}>
              {emailHint}
            </p>
          )}
          {!emailHint && (
            <p className="text-xs text-gray-500 text-left mt-1">
              Nhập email để nhận mã QR qua email. Kiểm tra cả thư mục Spam/Junk nếu không thấy.
            </p>
          )}
        </div>

        {/* Hiển thị thông báo lỗi nếu có */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>{errorMessage}</span>
            </div>
            <div className="mt-2 text-xs">
              <p>Hãy đảm bảo:</p>
              <ul className="list-disc pl-5 mt-1">
                <li>Server đang hoạt động (http://localhost:3000)</li>
                <li>Kết nối mạng ổn định</li>
                <li>CORS được cấu hình đúng trên server</li>
              </ul>
            </div>
          </div>
        )}
        
        <button
          onClick={generateTicketQR}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:opacity-70"
        >
          {isLoading ? (
            <span className="flex justify-center items-center">
              <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang tạo...
            </span>
          ) : (
            <span className="flex justify-center items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Tạo mã QR
            </span>
          )}
        </button>
      </div>
      
      {/* Modal hiển thị mã QR */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
            <button 
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Mã QR Vé Xem Phim</h3>
              
              <div className="flex justify-center mb-4">
                <div className="border-4 border-blue-100 rounded-lg p-3 bg-white">
                  <img src={qrImage} alt="Movie Ticket QR Code" className="w-64 h-64 object-contain" />
                </div>
              </div>
              
              {emailSent && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span>Đã gửi mã QR đến email của bạn! Vui lòng kiểm tra cả thư mục Spam/Junk nếu không tìm thấy.</span>
                  </div>
                </div>
              )}
              
              {!emailSent && !showEmailForm && ticketId && (
                <button
                  onClick={() => setShowEmailForm(true)}
                  className="mb-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                  Nhận qua email
                </button>
              )}
              
              {showEmailForm && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">Gửi mã QR qua email</h4>
                  <div className="flex items-center mb-2">
                    <input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Email của bạn"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={handleResendEmail}
                      disabled={emailSending}
                      className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:opacity-70"
                    >
                      {emailSending ? 'Đang gửi...' : 'Gửi'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    Sau khi nhận email, hãy kiểm tra cả thư mục Spam/Junk nếu không tìm thấy.
                  </p>
                  <button
                    onClick={() => setShowEmailForm(false)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Hủy
                  </button>
                </div>
              )}
              
              <p className="text-sm text-gray-600 mb-6">
                Hãy xuất trình mã QR này khi đến rạp chiếu phim để quét và nhận vé.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Tải xuống
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 flex items-center justify-center bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QrCodePage; 