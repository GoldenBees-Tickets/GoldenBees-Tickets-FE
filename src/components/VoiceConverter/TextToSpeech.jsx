import { useState } from 'react';
import { useTextToSpeechMutation } from '../../api/voiceConverterApi';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // Redux Toolkit Query hooks
  const [convertTextToSpeech, { isLoading }] = useTextToSpeechMutation();

  const handleConvert = async () => {
    if (!text.trim()) {
      setStatusMessage('Vui lòng nhập văn bản để chuyển đổi');
      return;
    }

    try {
      const result = await convertTextToSpeech({
        text
      }).unwrap();

      if (result.success) {
        // Sử dụng URL trực tiếp từ API
        setAudioUrl(result.audioUrl);
        setStatusMessage('Chuyển đổi thành công!');
      } else {
        setStatusMessage(`Lỗi: ${result.message || 'Không thể chuyển đổi văn bản'}`);
      }
    } catch (error) {
      console.error('Error converting text to speech:', error);
      setStatusMessage(`Lỗi: ${error.data?.message || error.message || 'Không thể kết nối đến server'}`);
    }
  };

  const handleClearText = () => {
    setText('');
    setStatusMessage('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Chuyển Văn Bản Thành Giọng Nói</h2>
      
      <div className="mb-4">
        <textarea
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập văn bản cần chuyển thành giọng nói..."
          rows="6"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
      </div>
      
      <div className="flex space-x-3 mb-6">
        <button
          className={`px-4 py-2 rounded-md text-white font-medium ${isLoading 
            ? 'bg-blue-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'}`}
          onClick={handleConvert}
          disabled={isLoading}
        >
          {isLoading ? 'Đang xử lý...' : 'Chuyển đổi'}
        </button>
        <button
          className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 font-medium hover:bg-gray-300"
          onClick={handleClearText}
        >
          Xóa văn bản
        </button>
      </div>
      
      {statusMessage && (
        <div className={`p-3 rounded-md mb-4 ${statusMessage.includes('Lỗi') 
          ? 'bg-red-100 text-red-700' 
          : 'bg-green-100 text-green-700'}`}>
          {statusMessage}
        </div>
      )}
      
      {audioUrl && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Kết quả</h3>
          <div className="bg-gray-100 p-4 rounded-md">
            <audio 
              controls 
              className="w-full" 
              autoPlay
              src={audioUrl}
            ></audio>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextToSpeech; 