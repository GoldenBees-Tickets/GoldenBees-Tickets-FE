import { useState, useEffect } from 'react';
import { useGenerateQrCodeMutation } from '@/api/qrCodeApi';

function QrCodeGenerator() {
  const [qrData, setQrData] = useState('');
  const [generatedQr, setGeneratedQr] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const [generateQrCode] = useGenerateQrCodeMutation();

  const handleInputChange = (e) => {
    setQrData(e.target.value);
    // Reset states
    setError('');
    setSuccess(false);
    if (generatedQr) setGeneratedQr('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!qrData.trim()) {
      setError('Vui lòng nhập nội dung để tạo mã QR.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const response = await generateQrCode(qrData);
      
      if (response.data && response.data.success) {
        setGeneratedQr(`http://localhost:3000/public${response.data.data.qrUrl}`);
        setSuccess(true);
      } else {
        setError(response.error?.data?.message || 'Có lỗi xảy ra khi tạo mã QR.');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tạo mã QR.');
      console.error('Error generating QR code:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedQr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Hiệu ứng cho thông báo thành công
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
      {/* Content */}
      <div>
        <div className="flex items-center justify-center mb-6">
          <div className="bg-blue-500 p-3 rounded-full">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 13h6v6H3v-6zm2 2v2h2v-2H5zm13-2h3v2h-3v-2zm0 4h3v2h-3v-2zM13 13h2v2h-2v-2zm0 4h2v2h-2v-2zm4-4h2v2h-2v-2z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 ml-3">Tạo Mã QR</h2>
        </div>
        
        {success && (
          <div className="mb-4 text-sm text-green-600 bg-green-50 p-3 rounded-lg border-l-4 border-green-500 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Mã QR đã được tạo thành công!
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4 space-y-2">
            <label htmlFor="qrData" className="block text-sm font-medium text-gray-700">
              Nội dung mã QR
            </label>
            <div className="relative">
              <textarea
                id="qrData"
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập nội dung bạn muốn chuyển thành mã QR (VD: URL, văn bản, thông tin liên hệ...)"
                value={qrData}
                onChange={handleInputChange}
              />
              {qrData && (
                <button 
                  type="button"
                  onClick={() => setQrData('')}
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border-l-4 border-red-500 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center items-center bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang tạo...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Tạo mã QR
              </>
            )}
          </button>
        </form>

        {generatedQr && (
          <div className="mt-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                Mã QR của bạn
              </h3>
              
              <div className="flex justify-center mb-5">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <img
                    src={generatedQr}
                    alt="Generated QR Code"
                    className="w-52 h-52 object-contain"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center justify-center text-sm bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                  {copied ? "Đã sao chép!" : "Sao chép link"}
                </button>
                
                <a
                  href={generatedQr}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center text-sm bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                  Mở trong tab mới
                </a>
                
                <a
                  href={generatedQr}
                  download="qrcode.png"
                  className="flex items-center justify-center text-sm bg-green-600 text-white font-medium py-2 px-4 rounded-lg col-span-2"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Tải xuống mã QR
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QrCodeGenerator; 