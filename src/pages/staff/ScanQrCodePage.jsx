import { useState, useEffect } from 'react';
import { useScanQrCodeMutation } from '@/api/qrCodeApi';
import QrScanner from 'react-qr-scanner';
import { IoQrCodeOutline, IoTicketOutline, IoCheckmarkCircle, IoCloseCircle, IoRefreshOutline, IoScanOutline } from 'react-icons/io5';

function ScanQrCodePage() {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(true);
  const [scanQrCode] = useScanQrCodeMutation();
  const [manualTicketId, setManualTicketId] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(true);

  useEffect(() => {
    // Check camera permission
    navigator.mediaDevices.getUserMedia({ video: true })
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
    setError('Lỗi camera: ' + err.message);
    setCameraPermission(false);
  };

  const handleScan = async (data) => {
    if (data) {
      setScanning(false);
      processQrCode(data.text);
    }
  };

  const processQrCode = async (data) => {
    try {      
      if (!data || data.trim() === '') {
        throw new Error('Dữ liệu QR trống hoặc không hợp lệ');
      }
      
      let ticketId = data.trim();
      
      // Thử parse JSON
      try {
        const jsonData = JSON.parse(data);
        if (jsonData) {
          if (jsonData.ticketId) ticketId = jsonData.ticketId;
          else if (jsonData.id) ticketId = jsonData.id;
          else if (jsonData.ticket?.id) ticketId = jsonData.ticket.id;
          else if (typeof jsonData === 'number' || (typeof jsonData === 'string' && !isNaN(jsonData))) {
            ticketId = jsonData.toString();
          }
        }
      } catch (e) {
        // Không phải JSON, tiếp tục xử lý
      }
      
      // Kiểm tra định dạng TIX + số
      const tixMatch = ticketId.match(/TIX\d+/i);
      if (tixMatch) {
        ticketId = tixMatch[0];
      }
      
      // Kiểm tra URL
      try {
        const urlObj = new URL(ticketId);
        const idParam = urlObj.searchParams.get('id') || urlObj.searchParams.get('ticketId');
        if (idParam) {
          ticketId = idParam;
        }
      } catch (e) {
        // Không phải URL
      }
            
      const response = await scanQrCode(ticketId);
      
      if (response.data && response.data.success) {
        setScanResult(response.data.data.ticket);
        setError(null);
        setShowSuccessPopup(true);
      } else if (response.error) {
        const errorMessage = response.error.data?.message || 'Không thể xác nhận vé';
        setError(errorMessage);
        setScanResult(null);
        setShowErrorPopup(true);
      } else {
        setError('Không thể xác nhận vé, phản hồi không xác định từ server');
        setScanResult(null);
        setShowErrorPopup(true);
      }
    } catch (err) {
      setError('Lỗi xử lý: ' + (err.message || err.data?.message || 'Lỗi khi quét mã QR'));
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
    if (!manualTicketId.trim()) {
      setError('Vui lòng nhập ID vé');
      setShowErrorPopup(true);
      return;
    }
    
    setScanning(false);
    await processQrCode(manualTicketId);
  };

  // Format date in Vietnamese format
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'numeric', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  return (
    <div className="min-h-screen bg-blue-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/10 rounded-xl shadow-lg p-6 border border-white/20">
          <h1 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center">
            <IoScanOutline className="mr-3 text-blue-300" />
            <span>Quét Mã QR Vé</span>
          </h1>

          {!scanResult && (
            <div>
              <div className="mb-6">
                <div className="w-full mx-auto bg-black/40 rounded-xl border border-blue-500/30 overflow-hidden relative" style={{ height: '550px' }}>
                  {scanning && cameraPermission ? (
                    <>
                      <QrScanner
                        delay={300}
                        onError={handleError}
                        onScan={handleScan}
                        constraints={{
                          video: {
                            facingMode: "environment",
                            width: { min: 640, ideal: 1280, max: 1920 },
                            height: { min: 480, ideal: 720, max: 1080 },
                            frameRate: { ideal: 15, max: 30 },
                          }
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div className="absolute inset-0 pointer-events-none">
                        {/* Central scanning area - ENLARGED */}
                        <div className="absolute top-1/2 left-1/2 w-[320px] h-[320px] transform -translate-x-1/2 -translate-y-1/2">
                          {/* Corners */}
                          <div className="absolute top-0 left-0 w-16 h-16 border-t-3 border-l-3 border-blue-400"></div>
                          <div className="absolute top-0 right-0 w-16 h-16 border-t-3 border-r-3 border-blue-400"></div>
                          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-3 border-l-3 border-blue-400"></div>
                          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-3 border-r-3 border-blue-400"></div>
                          
                          {/* Static scan line */}
                          <div className="absolute top-1/2 left-0 w-full h-1 bg-blue-500 transform -translate-y-1/2"></div>
                          
                          {/* Scanning overlay */}
                          <div className="absolute inset-0 border border-blue-400/30 rounded-md"></div>
                        </div>
                        
                        {/* Simple HUD elements */}
                        <div className="absolute top-4 left-4 flex items-center">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                          <span className="text-blue-300 text-xs font-mono">SCANNING</span>
                        </div>
                      </div>
                    </>
                  ) : !cameraPermission ? (
                    <div className="flex flex-col items-center justify-center h-full bg-black/60">
                      <IoCloseCircle size={50} className="text-red-500 mb-4" />
                      <h3 className="text-xl text-white mb-2">Không thể truy cập camera</h3>
                      <p className="text-blue-200 text-center max-w-md mb-4">
                        Vui lòng cho phép truy cập camera trong cài đặt trình duyệt của bạn
                      </p>
                      <button 
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                      >
                        Thử lại
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full bg-black/60">
                      <IoQrCodeOutline size={60} className="text-blue-400 mb-6" />
                      <h3 className="text-xl text-white mb-4">Đang xử lý...</h3>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 text-center">
                  {scanning && cameraPermission && (
                    <div className="flex justify-center">
                      <div className="text-center mt-2 text-sm text-blue-200 bg-blue-900/50 p-2 rounded-lg inline-block">
                        <span className="font-medium">Giữ mã QR ở khoảng cách 15-20cm và đủ ánh sáng</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 border-t border-white/10 pt-6">
                <h3 className="text-lg font-medium text-blue-100 mb-3 flex items-center">
                  <IoTicketOutline className="mr-2 text-blue-300" />
                  Hoặc nhập ID vé thủ công
                </h3>
                <form onSubmit={handleManualSubmit} className="flex">
                  <input 
                    type="text"
                    value={manualTicketId}
                    onChange={(e) => setManualTicketId(e.target.value)}
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-l-lg text-white placeholder-blue-200/70"
                    placeholder="Nhập ID vé"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none"
                  >
                    Kiểm tra
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Success popup */}
          {showSuccessPopup && scanResult && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/60" onClick={() => setShowSuccessPopup(false)}></div>
              <div className="relative bg-gray-900 rounded-xl p-6 shadow-xl max-w-md w-full border border-green-500/30">
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                  <div className="bg-green-500 text-white p-3 rounded-full shadow-md">
                    <IoCheckmarkCircle size={40} />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mt-6 mb-4 text-center">
                  Xác nhận vé thành công!
                </h3>
                
                <div className="bg-white/10 rounded-lg p-4 mb-4">
                  <div className="space-y-3 text-blue-100">
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="font-medium text-gray-300">Phim:</span>
                      <span className="font-bold text-white">{scanResult.movieName}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="font-medium text-gray-300">Suất chiếu:</span>
                      <span className="font-bold text-white">{formatDate(scanResult.showTime)}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="font-medium text-gray-300">Ghế:</span>
                      <span className="font-bold text-white">{scanResult.seat}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="font-medium text-gray-300">Trạng thái:</span>
                      <span className="font-bold text-green-400">
                        {scanResult.status === 'used' ? 'Đã sử dụng' : 'Xác nhận thành công'}
                      </span>
                    </div>
                    {scanResult.usedAt && (
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-300">Thời gian xác nhận:</span>
                        <span className="font-bold text-white">{formatDate(scanResult.usedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleStartAgain}
                    className="flex items-center justify-center w-full bg-green-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-700 transition-all"
                  >
                    <IoRefreshOutline className="mr-2" />
                    Quét vé tiếp theo
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error popup */}
          {showErrorPopup && error && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/60" onClick={() => setShowErrorPopup(false)}></div>
              <div className="relative bg-gray-900 rounded-xl p-6 shadow-xl max-w-md w-full border border-red-500/30">
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                  <div className="bg-red-500 text-white p-3 rounded-full shadow-md">
                    <IoCloseCircle size={40} />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mt-6 mb-4 text-center">
                  Không thể xác nhận vé
                </h3>
                
                <div className="bg-white/10 rounded-lg p-4 mb-4">
                  <div className="text-red-200 text-center">{error}</div>
                </div>
                
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleStartAgain}
                    className="flex items-center justify-center w-full bg-red-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-700 transition-all"
                  >
                    <IoRefreshOutline className="mr-2" />
                    Thử lại
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {error && !showErrorPopup && !showSuccessPopup && (
            <div className="bg-red-900/50 border border-red-500/30 text-red-200 p-4 rounded-lg mt-4">
              <div className="flex">
                <IoCloseCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
                <div>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          )}

          {scanResult && !showSuccessPopup && (
            <div className="mt-4">
              <div className="bg-green-900/50 rounded-lg border border-green-500/30 p-5">
                <div className="flex items-start">
                  <div className="mr-4 bg-green-500 rounded-full p-2 mt-1">
                    <IoCheckmarkCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-green-300 mb-2">
                      Vé đã được xác nhận thành công!
                    </h3>
                    <div className="space-y-2 text-blue-100">
                      <div className="grid grid-cols-3 gap-2">
                        <span className="font-medium text-gray-300">Phim:</span>
                        <span className="col-span-2 font-semibold text-white">{scanResult.movieName}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="font-medium text-gray-300">Suất chiếu:</span>
                        <span className="col-span-2 font-semibold text-white">{formatDate(scanResult.showTime)}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="font-medium text-gray-300">Ghế:</span>
                        <span className="col-span-2 font-semibold text-white">{scanResult.seat}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="font-medium text-gray-300">Trạng thái:</span>
                        <span className="col-span-2 font-semibold text-green-400">
                          {scanResult.status === 'used' ? 'Đã sử dụng' : 'Xác nhận thành công'}
                        </span>
                      </div>
                      {scanResult.usedAt && (
                        <div className="grid grid-cols-3 gap-2">
                          <span className="font-medium text-gray-300">Thời gian:</span>
                          <span className="col-span-2 font-semibold text-white">{formatDate(scanResult.usedAt)}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={handleStartAgain}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                      >
                        <IoRefreshOutline className="mr-2" />
                        Quét Vé Khác
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {(error || scanning === false) && !scanResult && !showErrorPopup && !showSuccessPopup && (
            <div className="text-center mt-6">
              <button
                onClick={handleStartAgain}
                className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                <IoRefreshOutline className="mr-2" />
                Thử Lại
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ScanQrCodePage; 