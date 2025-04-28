import { useState, useEffect } from "react";
import { useScanQrCodeMutation } from "@/api/qrCodeApi";
import QrScanner from "react-qr-scanner";
import {
  IoQrCodeOutline,
  IoTicketOutline,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoRefreshOutline,
  IoScanOutline,
} from "react-icons/io5";

function ScanQrCodePage() {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(true);
  const [scanQrCode] = useScanQrCodeMutation();
  const [manualOrderId, setManualOrderId] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(true);

  useEffect(() => {
    // Check camera permission
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => setCameraPermission(true))
      .catch(() => setCameraPermission(false));
    
    // Clean up popups when component unmounts
    return () => {
      setShowSuccessPopup(false);
      setShowErrorPopup(false);
    };
  }, []);

  // Auto-hide popups after 5 seconds
  useEffect(() => {
    let timer;
    if (showSuccessPopup || showErrorPopup) {
      timer = setTimeout(() => {
        setShowSuccessPopup(false);
        setShowErrorPopup(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [showSuccessPopup, showErrorPopup]);

  const handleError = (err) => {
    console.error(err);
    setError("Lỗi camera: " + err.message);
    setCameraPermission(false);
  };

  const handleScan = async (data) => {
    if (data) {
      setScanning(false);
      processQrCode(data.text);
    }
  };

  // Format date in Vietnamese format
  const formatDate = (dateString) => {
    if (!dateString) return "Không có thông tin";

    try {
      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(dateString).toLocaleDateString("vi-VN", options);
    } catch (error) {
      console.error("Lỗi định dạng ngày:", error);
      return dateString.toString();
    }
  };

  // Format date only (without time)
  const formatShowDate = (dateStr) => {
    if (!dateStr) return "Không có thông tin";
    try {
      const options = { year: "numeric", month: "numeric", day: "numeric" };
      return new Date(dateStr).toLocaleDateString("vi-VN", options);
    } catch (error) {
      return dateStr;
    }
  };

  // Format time from HH:MM:SS to HH:MM
  const formatTime = (timeStr) => {
    if (!timeStr) return "Không có thông tin";
    if (timeStr.includes("T")) {
      // Nếu chuỗi thời gian có định dạng ISO
      try {
        const date = new Date(timeStr);
        return date.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch (error) {
        return timeStr;
      }
    }
    // Nếu chuỗi có định dạng HH:MM:SS
    return timeStr.substring(0, 5); // Lấy giờ:phút từ chuỗi giờ:phút:giây
  };

  const processQrCode = async (data) => {
    try {      
      if (!data || data.trim() === "") {
        throw new Error("Dữ liệu QR trống hoặc không hợp lệ");
      }
      
      let orderId = data.trim();
      
      // Kiểm tra xem dữ liệu có phải là số không
      if (isNaN(orderId)) {
      // Thử parse JSON
      try {
        const jsonData = JSON.parse(data);
        if (jsonData) {
            if (jsonData.orderId) orderId = jsonData.orderId;
            else if (jsonData.id) orderId = jsonData.id;
            else if (
              typeof jsonData === "number" ||
              (typeof jsonData === "string" && !isNaN(jsonData))
            ) {
              orderId = jsonData.toString();
          }
        }
      } catch (e) {
        // Không phải JSON, tiếp tục xử lý
      }
      
      // Kiểm tra URL
      try {
          const urlObj = new URL(orderId);
          const idParam =
            urlObj.searchParams.get("orderId") || urlObj.searchParams.get("id");
        if (idParam) {
            orderId = idParam;
        }
      } catch (e) {
        // Không phải URL
        }
      }

      // Gọi API với order_id
      const response = await scanQrCode(orderId);

      if (response.data) {
        // Nếu thành công
        if (response.data.success) {
          // Kiểm tra cấu trúc dữ liệu phản hồi
          const responseData = response.data.data;
          // Dữ liệu có thể nằm ở data.data, data, hoặc một cấu trúc khác
          const orderData = responseData?.data || responseData || {};
          try {
            // Kiểm tra xem có thuộc tính Showtime hay không
            const hasShowtime = orderData && orderData.Showtime;

            // Trích xuất thông tin theo cấu trúc mới hoặc cũ
            const movie = hasShowtime
              ? orderData.Showtime?.Movie || {}
              : orderData.Movie || {};

            const room = hasShowtime
              ? orderData.Showtime?.Room || {}
              : orderData.Room || {};

            const cinema = room?.Cinema || {};

            const showtime = hasShowtime
              ? orderData.Showtime || {}
              : {
                  id: orderData.showtime_id,
                  show_date: orderData.show_date,
                  start_time: orderData.start_time,
                };

            const tickets = orderData.Tickets || [];

            // Lấy tên rạp từ đối tượng Cinema nếu có
            const theaterName = cinema?.name || "Không có thông tin";

            // Lấy thông tin ghế từ cấu trúc chính xác
            let seats = "";
            try {
              seats = tickets
                .map((ticket) => {
                  const seat = ticket.Seat || {};
                  return `${seat.seat_row || ""}${seat.seat_number || ""}`;
                })
                .join(", ");
            } catch (seatError) {
              console.error("Lỗi khi xử lý thông tin ghế:", seatError);
              seats = "Không có thông tin";
            }

            // Tạo dữ liệu scanResult với định dạng phù hợp cho UI
            const result = {
              orderId: orderData.id || orderId,
              status: orderData.status || "completed",
              usedAt: orderData.updatedAt || new Date().toISOString(),
              // Thông tin chi tiết về vé từ cấu trúc API chính xác
              movieName: movie.name || "Không có thông tin",
              moviePoster: movie.poster || "",
              ageRating: movie.age_rating || "Không giới hạn",
              duration: movie.duration
                ? `${movie.duration} phút`
                : "Không có thông tin",
              roomName: room.name || "Không có thông tin",
              theaterName: theaterName,
              showDate:
                formatShowDate(showtime.show_date) || "Không có thông tin",
              showTime: formatTime(showtime.start_time) || "Không có thông tin",
              seats: seats || "Không có thông tin",
              price: orderData.total
                ? parseInt(orderData.total).toLocaleString() + " VND"
                : "Không có thông tin",
              orderDate:
                formatDate(orderData.order_date) || "Không có thông tin",
              qrCode: orderData.qr_code || "",
              showtimeId: showtime.id || "",
              ticketCount: tickets.length || 0,
              refundStatus: orderData.refund_status || "none",
            };

            setScanResult(result);
        setError(null);
        setShowSuccessPopup(true);
          } catch (dataError) {
            console.error("Lỗi khi xử lý dữ liệu:", dataError);
            setError("Lỗi khi xử lý dữ liệu: " + dataError.message);
            setScanResult(null);
            setShowErrorPopup(true);
          }
        }
        // Nếu không thành công nhưng có dữ liệu trả về
        else if (response.data.error) {
          setError(response.data.message || "Không thể xác nhận vé");
          setScanResult(null);
          setShowErrorPopup(true);
        }
      }
      // Nếu có lỗi từ RTK Query
      else if (response.error) {
        const errorMessage =
          response.error.data?.message || "Không thể xác nhận vé";
        setError(errorMessage);
        setScanResult(null);
        setShowErrorPopup(true);
      }
      // Trường hợp khác
      else {
        setError("Không thể xác nhận vé, phản hồi không xác định từ server");
        setScanResult(null);
        setShowErrorPopup(true);
      }
    } catch (err) {
      console.error("Lỗi khi xử lý QR:", err);
      setError(
        "Lỗi xử lý: " +
          (err.message || err.data?.message || "Lỗi khi quét mã QR")
      );
      setScanResult(null);
      setShowErrorPopup(true);
    }
  };
  
  const handleStartAgain = () => {
    setScanResult(null);
    setError(null);
    setScanning(true);
    setShowSuccessPopup(false);
    setShowErrorPopup(false);
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualOrderId.trim()) {
      setError("Vui lòng nhập mã đơn hàng");
      setShowErrorPopup(true);
      return;
    }
    
    setScanning(false);
    await processQrCode(manualOrderId);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-5">
      {/* Page title */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-white flex items-center justify-center">
          <IoScanOutline className="text-blue-400 mr-2" />
          Quét Mã QR Vé
          </h1>
      </div>

          {!scanResult && (
            <div>
              <div className="mb-6">
            <div
              className="w-full mx-auto bg-black rounded-lg border border-blue-500/30 overflow-hidden relative"
              style={{ height: "400px" }}
            >
                  {scanning && cameraPermission ? (
                    <>
                      <QrScanner
                    delay={500}
                        onError={handleError}
                        onScan={handleScan}
                        constraints={{
                          video: {
                            facingMode: "environment",
                            width: { min: 640, ideal: 1280, max: 1920 },
                            height: { min: 480, ideal: 720, max: 1080 },
                        frameRate: { ideal: 10, max: 20 },
                      },
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                      />
                      <div className="absolute inset-0 pointer-events-none">
                    {/* Extremely simplified scanning frame - just corners */}
                    <div className="absolute top-1/2 left-1/2 w-[280px] h-[280px] transform -translate-x-1/2 -translate-y-1/2">
                      <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-blue-400"></div>
                      <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-blue-400"></div>
                      <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-blue-400"></div>
                      <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-blue-400"></div>
                        </div>
                        
                    {/* Minimal scanning indicator */}
                    <div className="absolute top-4 left-4">
                      <div className="flex items-center px-2 py-1 bg-black/70 rounded-md">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-blue-300 text-xs">ĐANG QUÉT</span>
                      </div>
                        </div>
                      </div>
                    </>
                  ) : !cameraPermission ? (
                <div className="flex flex-col items-center justify-center h-full bg-black/80">
                  <IoCloseCircle size={40} className="text-red-500 mb-4" />
                  <h3 className="text-lg text-white mb-2">
                    Không thể truy cập camera
                  </h3>
                  <p className="text-blue-200 text-center max-w-md mb-4 px-4">
                    Vui lòng cho phép truy cập camera trong cài đặt trình duyệt
                      </p>
                      <button 
                        onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Thử lại
                      </button>
                    </div>
                  ) : (
                <div className="flex flex-col items-center justify-center h-full bg-black/80">
                  <IoQrCodeOutline size={40} className="text-blue-400 mb-4" />
                  <h3 className="text-lg text-white">Đang xử lý...</h3>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 text-center">
                  {scanning && cameraPermission && (
                <div className="text-sm text-gray-300">
                  Giữ mã QR ở khoảng cách 15-20cm và đủ ánh sáng
                    </div>
                  )}
                </div>
              </div>
              
          <div className="mt-6 border-t border-gray-700 pt-6">
            <h3 className="text-base font-medium text-gray-300 mb-3 flex items-center">
              <IoTicketOutline className="mr-2 text-blue-400" />
              Nhập mã đơn hàng thủ công
                </h3>
                <form onSubmit={handleManualSubmit} className="flex">
                  <input 
                    type="text"
                value={manualOrderId}
                onChange={(e) => setManualOrderId(e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-l-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="Nhập mã đơn hàng"
                  />
                  <button
                    type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none"
                  >
                    Kiểm tra
                  </button>
                </form>
              </div>
            </div>
          )}

      {/* Simplified Success Popup - Changed to horizontal layout */}
          {showSuccessPopup && scanResult && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80"
            onClick={() => setShowSuccessPopup(false)}
          ></div>
          <div className="relative bg-gray-800 rounded-lg p-6 shadow-lg w-full max-w-4xl border border-green-500/30">
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
              <div className="bg-green-500 text-white p-2 rounded-full">
                <IoCheckmarkCircle size={36} />
                  </div>
                </div>
                
            <h3 className="text-lg font-bold text-white mt-6 mb-4 text-center">
                  Xác nhận vé thành công!
                </h3>
                
            <div className="bg-gray-700 rounded-md p-4 mb-4">
              <div className="flex flex-col md:flex-row">
                {/* Movie poster on the left */}
                {scanResult.moviePoster && (
                  <div className="mb-4 md:mb-0 md:mr-6 flex justify-center">
                    <img
                      src={scanResult.moviePoster}
                      alt={scanResult.movieName}
                      className="h-48 rounded-md border border-gray-600"
                    />
                  </div>
                )}

                {/* Info on the right */}
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div className="col-span-2 mb-2">
                    <span className="text-lg font-bold text-white">
                      {scanResult.movieName}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div>
                      <span className="text-gray-400 text-sm">Phim:</span>
                      <span className="font-medium text-white ml-2 block">
                        {scanResult.movieName}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-sm">Rạp chiếu:</span>
                      <span className="font-medium text-white ml-2 block">
                        {scanResult.theaterName}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-sm">Phòng:</span>
                      <span className="font-medium text-white ml-2 block">
                        {scanResult.roomName}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-sm">Ngày chiếu:</span>
                      <span className="font-medium text-white ml-2 block">
                        {scanResult.showDate}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div>
                      <span className="text-gray-400 text-sm">Giờ chiếu:</span>
                      <span className="font-medium text-white ml-2 block">
                        {scanResult.showTime}
                      </span>
                    </div>

                    {scanResult.duration && (
                      <div>
                        <span className="text-gray-400 text-sm">
                          Thời lượng:
                        </span>
                        <span className="font-medium text-white ml-2 block">
                          {scanResult.duration}
                        </span>
                      </div>
                    )}

                    <div>
                      <span className="text-gray-400 text-sm">Ghế:</span>
                      <span className="font-medium text-white ml-2 block">
                        {scanResult.seats}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-sm">Giá vé:</span>
                      <span className="font-medium text-white ml-2 block">
                        {scanResult.price}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-2 border-t border-gray-600 pt-3 mt-2 grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-gray-400 text-sm">
                        Mã đơn hàng:
                      </span>
                      <span className="font-medium text-white ml-2 block break-all">
                        {scanResult.orderId || "N/A"}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-sm">Trạng thái:</span>
                      <span className="font-medium text-green-400 ml-2 block">
                        {scanResult.status === "completed"
                          ? "Đã xác nhận"
                          : "Xác nhận thành công"}
                      </span>
                    </div>

                    {scanResult.usedAt && (
                      <div>
                        <span className="text-gray-400 text-sm">
                          Thời gian xác nhận:
                        </span>
                        <span className="font-medium text-white ml-2 block">
                          {formatDate(scanResult.usedAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                  </div>
                </div>
                
            <div className="flex justify-center">
                  <button
                    onClick={handleStartAgain}
                className="flex items-center justify-center bg-green-600 text-white font-medium py-2 px-4 rounded-md hover:bg-green-700"
                  >
                    <IoRefreshOutline className="mr-2" />
                    Quét vé tiếp theo
                  </button>
                </div>
              </div>
            </div>
          )}

      {/* Simplified Error Popup */}
          {showErrorPopup && error && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80"
            onClick={() => setShowErrorPopup(false)}
          ></div>
          <div className="relative bg-gray-800 rounded-lg p-6 shadow-lg max-w-md w-full border border-red-500/30">
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
              <div className="bg-red-500 text-white p-2 rounded-full">
                <IoCloseCircle size={36} />
                  </div>
                </div>
                
            <h3 className="text-lg font-bold text-white mt-6 mb-4 text-center">
                  Không thể xác nhận vé
                </h3>
                
            <div className="bg-gray-700 rounded-md p-4 mb-4">
              <div className="text-red-300 text-center">{error}</div>
                </div>
                
            <div className="flex justify-center">
                  <button
                    onClick={handleStartAgain}
                className="flex items-center justify-center bg-red-600 text-white font-medium py-2 px-4 rounded-md hover:bg-red-700"
                  >
                    <IoRefreshOutline className="mr-2" />
                    Thử lại
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {error && !showErrorPopup && !showSuccessPopup && (
        <div className="bg-red-900/50 border border-red-500/30 text-red-200 p-3 rounded-md mt-4">
              <div className="flex">
                <IoCloseCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
                  <p>{error}</p>
              </div>
            </div>
          )}

      {/* Simplified Success Display - Changed to horizontal layout */}
          {scanResult && !showSuccessPopup && (
            <div className="mt-4">
          <div className="bg-gray-700 rounded-md border border-green-500/30 p-4">
            <div className="flex flex-col md:flex-row items-start">
              <div className="mr-3 bg-green-500 rounded-full p-2 mt-1 mb-2 md:mb-0">
                <IoCheckmarkCircle className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                <h3 className="text-base font-bold text-green-300 mb-3">
                  Đơn hàng đã được xác nhận thành công!
                    </h3>

                <div className="flex flex-col md:flex-row mb-4">
                  {scanResult.moviePoster && (
                    <div className="mr-0 mb-4 md:mr-5 md:mb-0">
                      <img
                        src={scanResult.moviePoster}
                        alt={scanResult.movieName}
                        className="h-36 rounded-md border border-gray-600"
                      />
                    </div>
                  )}

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                    <h4 className="text-base font-bold text-white mb-2 col-span-full">
                      {scanResult.movieName}
                    </h4>

                    <div>
                      <span className="text-gray-400">Rạp:</span>{" "}
                      <span className="ml-1">{scanResult.theaterName}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Phòng:</span>{" "}
                      <span className="ml-1">{scanResult.roomName}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Ngày chiếu:</span>{" "}
                      <span className="ml-1">{scanResult.showDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Giờ chiếu:</span>{" "}
                      <span className="ml-1">{scanResult.showTime}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Thời lượng:</span>{" "}
                      <span className="ml-1">{scanResult.duration}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Ghế:</span>{" "}
                      <span className="ml-1 font-medium text-white">
                        {scanResult.seats}
                      </span>
                      </div>

                    <div className="col-span-full mt-3 border-t border-gray-600 pt-3 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                      <div>
                        <span className="text-gray-400">Mã đơn hàng:</span>{" "}
                        <span className="ml-1 break-all">
                          {scanResult.orderId || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Giá vé:</span>{" "}
                        <span className="ml-1">{scanResult.price}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Trạng thái:</span>{" "}
                        <span className="ml-1 text-green-400 font-medium">
                          {scanResult.status === "completed"
                            ? "Đã xác nhận"
                            : "Xác nhận thành công"}
                        </span>
                      </div>
                      {scanResult.usedAt && (
                        <div>
                          <span className="text-gray-400">
                            Thời gian xác nhận:
                          </span>{" "}
                          <span className="ml-1">
                            {formatDate(scanResult.usedAt)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                    <div className="mt-4">
                      <button
                        onClick={handleStartAgain}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                      >
                        <IoRefreshOutline className="mr-2" />
                    Quét Đơn Hàng Khác
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
      {(error || scanning === false) &&
        !scanResult &&
        !showErrorPopup &&
        !showSuccessPopup && (
          <div className="text-center mt-4">
              <button
                onClick={handleStartAgain}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                <IoRefreshOutline className="mr-2" />
                Thử Lại
              </button>
            </div>
          )}
    </div>
  );
}

export default ScanQrCodePage; 
