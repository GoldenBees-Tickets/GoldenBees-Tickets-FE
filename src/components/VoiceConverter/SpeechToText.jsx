import { useState, useEffect, useRef } from 'react';

const SpeechToText = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recognizedText, setRecognizedText] = useState('');
  const [statusMessage, setStatusMessage] = useState('Nhấn nút để bắt đầu ghi âm');
  
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  // Kiểm tra hỗ trợ Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const supportsSpeechRecognition = !!SpeechRecognition;

    if (!supportsSpeechRecognition) {
      setStatusMessage('Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói. Vui lòng sử dụng Chrome, Edge hoặc Safari');
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'vi-VN'; // Thiết lập ngôn ngữ tiếng Việt

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      // Hiển thị kết quả
      if (finalTranscript) {
        setRecognizedText(prev => prev + finalTranscript);
      }
      
      if (interimTranscript) {
        setStatusMessage(`Đang nghe: ${interimTranscript}`);
      }
    };

    recognitionRef.current.onstart = () => {
      setStatusMessage('Đang nghe...');
    };

    recognitionRef.current.onend = () => {
      if (isRecording) {
        // Tự động khởi động lại nếu vẫn đang ghi âm
        recognitionRef.current.start();
      } else {
        setStatusMessage('Đã hoàn thành nhận dạng giọng nói');
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setStatusMessage(`Đã xảy ra lỗi: ${event.error}`);
      setIsRecording(false);
      clearInterval(timerRef.current);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Effect để xử lý thời gian ghi âm
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => {
      clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // Xử lý khi nhấn nút ghi âm
  const handleRecordClick = () => {
    if (!recognitionRef.current) {
      setStatusMessage('Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói');
      return;
    }

    if (!isRecording) {
      // Bắt đầu ghi âm
      setIsRecording(true);
      setRecordingTime(0);
      setRecognizedText('');
      recognitionRef.current.start();
    } else {
      // Dừng ghi âm
      setIsRecording(false);
      recognitionRef.current.stop();
    }
  };

  // Xử lý khi nhấn nút xóa
  const handleClearResult = () => {
    setRecognizedText('');
    setStatusMessage('Nhấn nút để bắt đầu ghi âm');
  };

  // Xử lý khi nhấn nút sao chép
  const handleCopyText = () => {
    if (recognizedText) {
      navigator.clipboard.writeText(recognizedText)
        .then(() => {
          setStatusMessage('Đã sao chép văn bản vào clipboard');
          setTimeout(() => {
            if (statusMessage === 'Đã sao chép văn bản vào clipboard') {
              setStatusMessage('');
            }
          }, 2000);
        })
        .catch(err => {
          console.error('Không thể sao chép: ', err);
          setStatusMessage('Không thể sao chép văn bản');
        });
    }
  };

  // Format thời gian ghi âm
  const formatTime = () => {
    const minutes = Math.floor(recordingTime / 60);
    const seconds = recordingTime % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Chuyển Giọng Nói Thành Văn Bản</h2>
      
      <div className="mb-6">
        <div className="flex flex-col items-center justify-center bg-gray-100 p-6 rounded-lg mb-4">
          <button
            onClick={handleRecordClick}
            className={`flex items-center justify-center w-16 h-16 rounded-full mb-3 transition-all ${
              isRecording 
                ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
            aria-label={isRecording ? 'Dừng ghi âm' : 'Bắt đầu ghi âm'}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="w-8 h-8"
            >
              <path 
                d={
                  isRecording
                    ? "M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"
                    : "M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                }
              />
            </svg>
          </button>
          <p className="text-lg font-medium">
            {isRecording ? 'Đang ghi âm...' : 'Nhấn để bắt đầu ghi âm'}
          </p>
          {isRecording && <p className="text-xl font-bold mt-2">{formatTime()}</p>}
          <p className="text-sm text-gray-600 mt-2">{statusMessage}</p>
        </div>
        
        <div className="flex space-x-3">
          <button
            className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 font-medium hover:bg-gray-300 flex-1"
            onClick={handleClearResult}
          >
            Xóa kết quả
          </button>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Kết quả nhận dạng</h3>
        <div className="relative">
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="6"
            value={recognizedText}
            readOnly
            placeholder="Kết quả nhận dạng giọng nói sẽ hiển thị ở đây..."
          ></textarea>
          {recognizedText && (
            <button
              className="absolute top-2 right-2 p-2 bg-gray-200 hover:bg-gray-300 rounded-md"
              onClick={handleCopyText}
              title="Sao chép văn bản"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-5 h-5"
              >
                <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 013.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0121 12.75v3.75c0 1.035-.84 1.875-1.875 1.875H15.75a1.875 1.875 0 01-1.875-1.875v-.75h-3v.75A1.875 1.875 0 018.25 18.375H4.875A1.875 1.875 0 013 16.5v-3.75a3.75 3.75 0 013.75-3.75h1.875C9.66 9 10.5 8.161 10.5 7.125V5.25a3.75 3.75 0 013.75-3.75h.75" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeechToText; 