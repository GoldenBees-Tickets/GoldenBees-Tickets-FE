import React, { useState, useEffect, useRef } from 'react';
import { IoMdSend } from 'react-icons/io';
import { FaUser } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { GiHoneycomb } from 'react-icons/gi';
import { MdVolumeUp, MdVolumeOff } from 'react-icons/md';
import { MdMic, MdMicOff } from 'react-icons/md';
import { MdMessage, MdRecordVoiceOver } from 'react-icons/md';
import { BiExpand, BiCollapse } from 'react-icons/bi';

import axios from 'axios';

import logoOngVang from './logoongvang.png';

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [autoSpeakResponse, setAutoSpeakResponse] = useState(false);
  const [voiceOnlyMode, setVoiceOnlyMode] = useState(false);
  const [latestBotResponse, setLatestBotResponse] = useState('');
  const [logoSize, setLogoSize] = useState('medium');
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const recognitionRef = useRef(null);
  const API_URL = 'http://localhost:3000/v1/api/chatbot/chat';
  const SPEECH_API_URL = 'http://localhost:3000/api/voice-converter/text-to-speech';
  const [userId] = useState(1); // Tạm thời hardcode userId = 1
  const HISTORY_API_URL = 'http://localhost:3000/v1/api/chatbot/history';

  // Hàm xử lý thay đổi kích thước
  const toggleLogoSize = (e) => {
    e.stopPropagation(); // Ngăn không cho sự kiện lan đến nút Mở chatbox
    // Luân phiên giữa 3 kích thước: small -> medium -> large -> small
    setLogoSize(prevSize => {
      switch(prevSize) {
        case 'small': return 'medium';
        case 'medium': return 'large';
        case 'large': return 'small';
        default: return 'medium';
      }
    });
  };

  // Nhận kích thước thực tế dựa vào state logoSize
  const getLogoSizeClass = () => {
    switch(logoSize) {
      case 'small': return 'w-[60px] h-[60px]';
      case 'medium': return 'w-[90px] h-[90px]';
      case 'large': return 'w-[120px] h-[120px]';
      default: return 'w-[90px] h-[90px]';
    }
  };

  // Nhận icon tương ứng cho nút thay đổi kích thước
  const getLogoSizeIcon = () => {
    switch(logoSize) {
      case 'small': return <BiExpand className="text-lg" />;  // Icon phóng to
      case 'medium': return <BiExpand className="text-lg" />; // Icon phóng to
      case 'large': return <BiCollapse className="text-lg" />; // Icon thu nhỏ
      default: return <BiExpand className="text-lg" />;
    }
  };

  // Khởi tạo Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
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
        
        if (finalTranscript) {
          setInputMessage(prevMessage => prevMessage + finalTranscript);
        }
        
      };
      
      recognitionRef.current.onstart = () => {
        setError('');
      };
      
      recognitionRef.current.onend = () => {
        
        // Nếu vẫn đang ở trạng thái listening, thử khởi động lại
        if (isListening) {
          try {
            recognitionRef.current.start();
          } catch (err) {
            console.error('Error restarting speech recognition:', err);
            setIsListening(false);
            setError('Không thể tiếp tục lắng nghe. Vui lòng thử lại.');
          }
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error, event);
        
        let errorMessage = '';
        switch(event.error) {
          case 'no-speech':
            errorMessage = 'Không phát hiện được giọng nói. Vui lòng thử lại.';
            break;
          case 'audio-capture':
            errorMessage = 'Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập.';
            break;
          case 'not-allowed':
            errorMessage = 'Quyền truy cập microphone bị từ chối. Vui lòng cho phép truy cập microphone.';
            break;
          case 'network':
            errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.';
            break;
          case 'aborted':
            errorMessage = 'Nhận diện giọng nói bị hủy.';
            break;
          default:
            errorMessage = `Đã xảy ra lỗi: ${event.error}`;
        }
        
        setError(errorMessage);
        setIsListening(false);
      };
    } else {
      console.error('Speech recognition not supported in this browser');
    }
    
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.error('Error stopping speech recognition:', err);
        }
      }
    };
  }, []);

  // Toggle speech recognition với kiểm tra quyền truy cập
  const toggleListening = async () => {
    if (!recognitionRef.current) {
      setError('Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói. Vui lòng sử dụng Chrome, Edge, hoặc Safari mới nhất.');
      return;
    }
    
    if (isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (err) {
        console.error('Error stopping speech recognition:', err);
        setError('Không thể dừng nhận diện giọng nói. Vui lòng tải lại trang.');
      }
    } else {
      
      // Kiểm tra quyền truy cập microphone
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Dừng stream sau khi đã lấy quyền (không cần lưu lại)
        stream.getTracks().forEach(track => track.stop());
        
        // Xóa input hiện tại khi bắt đầu nghe
        setInputMessage('');
        
        // Bắt đầu nhận diện giọng nói
        try {
          recognitionRef.current.start();
          setIsListening(true);
          setError('');
        } catch (err) {
          console.error('Error starting speech recognition:', err);
          if (err.name === 'InvalidStateError') {
            // Nếu recognition đã chạy, thử stop và start lại
            try {
              recognitionRef.current.stop();
              setTimeout(() => {
                recognitionRef.current.start();
                setIsListening(true);
              }, 100);
            } catch (stopErr) {
              console.error('Error restarting speech recognition:', stopErr);
              setError('Không thể khởi động nhận diện giọng nói. Vui lòng tải lại trang.');
            }
          } else {
            setError('Không thể bắt đầu nhận diện giọng nói. Vui lòng tải lại trang.');
          }
        }
      } catch (err) {
        console.error('Error accessing microphone:', err);
        setError('Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập và đảm bảo microphone đang hoạt động.');
      }
    }
  };

  // Toggle auto speak response
  const toggleAutoSpeak = () => {
    setAutoSpeakResponse(prev => !prev);
  };

  // Toggle voice only mode
  const toggleVoiceMode = () => {
    // Nếu đang ở chế độ chat thông thường và chuyển sang chế độ voice only
    if (!voiceOnlyMode) {
      // Tự động bật chế độ tự động đọc khi chuyển sang voice only
      setAutoSpeakResponse(true);
      // Khi chuyển sang voice only, mặc định bật listening
      if (!isListening && recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      }
    }
    
    setVoiceOnlyMode(!voiceOnlyMode);
  };

  // Load messages from API khi component mount
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const response = await axios.get(`${HISTORY_API_URL}/${userId}`);
        if (response.data.success) {
          setMessages(response.data.data);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };

    loadChatHistory();
  }, [userId]);

  // Focus input khi mở chatbox
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
    
    if (isOpen) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    }
  }, [isOpen]);

  // Dừng audio khi đóng chatbox
  useEffect(() => {
    if (!isOpen && currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
      setIsPlaying(false);
      setSpeakingMessageId(null);
    }
  }, [isOpen, currentAudio]);

  // Save messages to localStorage khi messages thay đổi
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatbox_messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Tự động cuộn đến tin nhắn mới nhất
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Hiệu ứng click outside để đóng chatbox
  useEffect(() => {
    function handleClickOutside(event) {
      if (chatBoxRef.current && !chatBoxRef.current.contains(event.target) && isOpen) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Dọn dẹp audio khi component unmount
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Chuyển text thành speech
  const textToSpeech = async (text, messageId) => {
    try {
      // Nếu đang phát audio, dừng lại
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
        setIsPlaying(false);
        
        // Nếu đang phát cùng một tin nhắn, chỉ cần dừng và thoát
        if (speakingMessageId === messageId) {
          setSpeakingMessageId(null);
          return;
        }
      }
      
      // Gọi API chuyển đổi văn bản thành giọng nói
      const response = await axios.post(SPEECH_API_URL, {
        text
      });

      if (response.data.success) {
        const audio = new Audio(response.data.audioUrl);
        
        // Thiết lập sự kiện khi audio kết thúc
        audio.onended = () => {
          setIsPlaying(false);
          setSpeakingMessageId(null);
        };
        
        // Phát audio
        setCurrentAudio(audio);
        setIsPlaying(true);
        setSpeakingMessageId(messageId);
        audio.play();
      }
    } catch (error) {
      console.error('Error converting text to speech:', error);
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const userInputText = inputMessage;
    
    // Add user message to chat (chỉ trong chế độ chat thông thường)
    const userMessage = {
      text: userInputText,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    // Lưu tin nhắn người dùng vào database
    try {
      await axios.post(HISTORY_API_URL + '/message', {
        userId,
        message: userMessage
      });
    } catch (error) {
      console.error('Error saving user message:', error);
    }

    // Chỉ hiển thị tin nhắn trong chế độ chat thông thường
    if (!voiceOnlyMode) {
    setMessages(prevMessages => [...prevMessages, userMessage]);
    }
    
    setInputMessage('');
    setIsLoading(true);
    setError('');
    
    // Trong chế độ thông thường hiển thị animation typing
    if (!voiceOnlyMode) {
    setIsTyping(true);
    }

    try {
      // Call API từ server
      const response = await axios.post(API_URL, {
        message: userInputText,
        conversation: messages
      });

      // Extract the response text
      const aiResponse = response.data.response;
      
      if (!voiceOnlyMode) {
      setIsTyping(false);
      }
      
      // Lưu phản hồi mới nhất
      setLatestBotResponse(aiResponse);

      // Delay để hiệu ứng typing tự nhiên hơn
      setTimeout(async () => {
        // Add AI message to chat with unique ID
        const messageId = Date.now().toString();
        const aiMessage = {
          id: messageId,
          text: aiResponse,
          sender: 'ai',
          timestamp: new Date().toISOString()
        };

        // Lưu tin nhắn AI vào database
        try {
          await axios.post(HISTORY_API_URL + '/message', {
            userId,
            message: aiMessage
          });
        } catch (error) {
          console.error('Error saving AI message:', error);
        }

        // Chỉ hiển thị tin nhắn trong chế độ chat thông thường
        if (!voiceOnlyMode) {
        setMessages(prevMessages => [...prevMessages, aiMessage]);
        }
        
        // Trong chế độ voice-only hoặc khi bật tự động đọc, đọc phản hồi
        if (voiceOnlyMode || autoSpeakResponse) {
          setTimeout(() => {
            textToSpeech(aiResponse, messageId);
          }, 500);
        }
      }, 500);
    } catch (error) {
      console.error('Error calling chatbot API:', error);
      
      if (!voiceOnlyMode) {
      setIsTyping(false);
      }
      
      // Set error state
      setError(error.response?.data?.message || error.message || 'Đã xảy ra lỗi khi xử lý yêu cầu');
      
      // Add error message
      const messageId = Date.now().toString();
      const errorMessage = {
        id: messageId,
        text: `Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này. ${error.response?.data?.message || error.message || 'Vui lòng thử lại sau.'}`,
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      
      // Lưu tin nhắn lỗi vào database
      try {
        await axios.post(HISTORY_API_URL + '/message', {
          userId,
          message: errorMessage
        });
      } catch (error) {
        console.error('Error saving error message:', error);
      }

      // Chỉ hiển thị tin nhắn trong chế độ chat thông thường
      if (!voiceOnlyMode) {
      setMessages(prevMessages => [...prevMessages, errorMessage]);
      }
      
      // Trong chế độ voice-only, đọc thông báo lỗi
      if (voiceOnlyMode) {
        textToSpeech(errorMessage.text, messageId);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Xóa lịch sử chat
  const clearChat = async () => {
    try {
      // Dừng audio nếu đang phát
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
        setIsPlaying(false);
        setSpeakingMessageId(null);
      }
      
      await axios.delete(`${HISTORY_API_URL}/${userId}`);
      setMessages([]);
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  };

  // Định dạng text (chuyển URL thành links và xuống dòng)
  const formatMessage = (text) => {
    // Convert URLs to links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const textWithLinks = text.replace(urlRegex, url => 
      `<a href="${url}" target="_blank" class="text-blue-600 hover:underline">${url}</a>`
    );
    
    // Convert line breaks to <br> tags
    return textWithLinks.replace(/\n/g, '<br />');
  };

  const handleOpenChat = () => {
    setIsOpen(true);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat icon - Con ong vàng */}
      {!isOpen && (
        <div className="relative">
          <button
            onClick={handleOpenChat}
            className="relative border-none rounded-full bg-transparent cursor-pointer flex items-center justify-center hover:scale-105"
            aria-label="Mở chatbox trợ lý Ong Vàng"
          >
            <img 
              src={logoOngVang}
              alt="Ong Vàng" 
              className={`${getLogoSizeClass()} object-contain filter drop-shadow-lg transition-all duration-300 transform-gpu animate-[float_3s_ease-in-out_infinite]`}
            />
          </button>
          
          {/* Nút điều chỉnh kích thước */}
          <button 
            onClick={toggleLogoSize}
            className="absolute top-0 right-0 w-8 h-8 bg-amber-400 hover:bg-amber-500 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 text-white border-2 border-white"
            title={logoSize === 'large' ? "Thu nhỏ logo" : "Phóng to logo"}
            aria-label={logoSize === 'large' ? "Thu nhỏ logo" : "Phóng to logo"}
          >
            {getLogoSizeIcon()}
          </button>
        </div>
      )}

      {/* Chat box */}
      {isOpen && (
        <div 
          ref={chatBoxRef}
          className={`w-[360px] h-[500px] bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden relative transition-all duration-300 border-2 border-amber-400 ${isAnimating ? 'animate-[scaleIn_0.3s_ease-out]' : ''}`}
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-amber-400 to-amber-500 text-white py-3 px-4 flex justify-between items-center rounded-t-2xl shadow-sm">
            <div className="flex items-center">
              <img 
                src={logoOngVang}
                alt="Ong Vàng" 
                className="w-6 h-6 mr-2"
              />
              <h3 className="font-medium">
                {voiceOnlyMode ? "Ong Vàng Trợ Lý Giọng Nói" : "Ong Vàng Movie Assistant"}
              </h3>
            </div>
            <div className="flex items-center">
              {/* Voice/Chat Mode Toggle */}
              <button
                onClick={toggleVoiceMode}
                className="text-white mr-3 transition-all"
                title={voiceOnlyMode ? "Chuyển sang chế độ chat" : "Chuyển sang chế độ trò chuyện giọng nói"}
                aria-label={voiceOnlyMode ? "Chuyển sang chế độ chat" : "Chuyển sang chế độ trò chuyện giọng nói"}
              >
                {voiceOnlyMode ? <MdMessage className="text-xl" /> : <MdRecordVoiceOver className="text-xl" />}
              </button>

              {!voiceOnlyMode && (
                <button
                  onClick={toggleAutoSpeak}
                  className={`text-white mr-3 transition-all ${autoSpeakResponse ? 'opacity-100' : 'opacity-60'}`}
                  title={autoSpeakResponse ? "Tắt tự động đọc" : "Bật tự động đọc"}
                  aria-label={autoSpeakResponse ? "Tắt tự động đọc" : "Bật tự động đọc"}
                >
                  <MdVolumeUp className="text-xl" />
                </button>
              )}
              
              <button 
                onClick={clearChat}
                className="text-white hover:text-gray-200 mr-3"
                title="Xóa lịch sử chat"
                aria-label="Xóa lịch sử chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200"
                aria-label="Đóng chatbox"
              >
                <IoClose className="text-xl" />
              </button>
            </div>
          </div>

          {/* Messages */}
          {!voiceOnlyMode ? (
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 bg-[radial-gradient(#ffeeba_2px,transparent_2px),radial-gradient(#ffeeba_2px,transparent_2px)] bg-[length:40px_40px] bg-[position:0_0,20px_20px] scroll-smooth">
            {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-5 text-center animate-[fadeIn_0.5s_ease-out]">
                  <div className="relative w-20 h-20 mb-4">
                  <img 
                    src={logoOngVang}
                    alt="Ong Vàng" 
                      className="absolute w-[60px] h-[60px] object-contain top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 animate-[bounce_2s_infinite]"
                    />
                    <GiHoneycomb className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[3] text-4xl text-amber-200/20 z-0" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Xin chào, tôi là Ong Vàng!</h3>
                  <p className="text-gray-600 mb-5">Trợ lý AI thông minh về phim ảnh. Tôi có thể giúp bạn tìm kiếm phim, đặt vé, và thông tin về các rạp chiếu phim.</p>
                  <div className="flex flex-wrap justify-center gap-2 mt-3">
                    <button onClick={() => setInputMessage("Có phim gì hay đang chiếu?")} className="bg-white border border-amber-400 text-gray-800 py-2 px-3 rounded-full text-sm cursor-pointer transition-all duration-200 hover:bg-amber-50 hover:-translate-y-0.5 hover:shadow-sm">🎬 Phim đang chiếu</button>
                    <button onClick={() => setInputMessage("Cách đặt vé xem phim?")} className="bg-white border border-amber-400 text-gray-800 py-2 px-3 rounded-full text-sm cursor-pointer transition-all duration-200 hover:bg-amber-50 hover:-translate-y-0.5 hover:shadow-sm">🎟️ Hướng dẫn đặt vé</button>
                    <button onClick={() => setInputMessage("Các rạp chiếu phim ở quận 1?")} className="bg-white border border-amber-400 text-gray-800 py-2 px-3 rounded-full text-sm cursor-pointer transition-all duration-200 hover:bg-amber-50 hover:-translate-y-0.5 hover:shadow-sm">🏢 Rạp phim gần đây</button>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div 
                  key={index} 
                    className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-2.5 rounded-2xl relative ${
                      message.sender === 'user' 
                        ? 'bg-gradient-to-br from-amber-300 to-amber-400 text-gray-800 rounded-tr-sm' 
                        : 'bg-white text-gray-800 border border-amber-200/30 rounded-tl-sm shadow-sm'
                    }`}>
                      <div className="flex items-center mb-1 text-xs">
                      {message.sender === 'user' ? (
                          <span className="flex items-center">
                            <span className="mx-1 text-black/50">{formatTimestamp(message.timestamp)}</span>
                            <FaUser className="text-[10px] text-gray-700" />
                        </span>
                      ) : (
                          <span className="flex items-center">
                          <img 
                            src={logoOngVang}
                            alt="Ong Vàng" 
                              className="w-4 h-4 object-contain mr-1" 
                            />
                            <span className="mx-1 text-black/50">{formatTimestamp(message.timestamp)}</span>
                            
                            {/* Nút chuyển đổi giọng nói */}
                            {message.text && message.text.length > 0 && (
                              <button 
                                onClick={() => textToSpeech(message.text, message.id || index)}
                                className="bg-transparent border-none cursor-pointer p-0.5 flex items-center justify-center opacity-60 transition-all hover:opacity-100 ml-2"
                                title={speakingMessageId === (message.id || index) ? "Dừng đọc" : "Nghe tin nhắn"}
                              >
                                {speakingMessageId === (message.id || index) ? (
                                  <MdVolumeUp className={`text-base text-amber-500 ${speakingMessageId === (message.id || index) ? 'animate-[pulse_1.5s_infinite]' : ''}`} />
                                ) : (
                                  <MdVolumeOff className="text-base text-amber-400" />
                                )}
                              </button>
                            )}
                        </span>
                      )}
                    </div>
                    {message.sender === 'user' ? (
                        <p className="leading-relaxed break-words">{message.text}</p>
                    ) : (
                      <div 
                          className="leading-relaxed break-words" 
                        dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }} 
                      />
                    )}
                  </div>
                </div>
              ))
            )}
            {isTyping && (
                <div className="mb-4 flex justify-start">
                  <div className="bg-white rounded-2xl rounded-tl-sm border border-amber-200/30 shadow-sm p-2 max-w-[80%]">
                    <div className="flex items-center gap-[5px] py-2">
                      <span className="h-2 w-2 float-left m-0 bg-amber-400 rounded-full opacity-40 animate-[typing_1s_infinite]"></span>
                      <span className="h-2 w-2 float-left m-0 bg-amber-400 rounded-full opacity-40 animate-[typing_1s_0.2s_infinite]"></span>
                      <span className="h-2 w-2 float-left m-0 bg-amber-400 rounded-full opacity-40 animate-[typing_1s_0.4s_infinite]"></span>
                    </div>
                  </div>
                </div>
              )}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 py-2 px-3 rounded-lg mx-auto my-2.5 text-xs text-center max-w-[90%]">{error}</div>
              )}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            /* Voice-only mode UI */
            <div className="flex-1 flex flex-col items-center justify-center bg-amber-50/50 bg-[radial-gradient(#ffeeba_2px,transparent_2px),radial-gradient(#ffeeba_2px,transparent_2px)] bg-[length:40px_40px] bg-[position:0_0,20px_20px]">
              <div className="flex flex-col items-center justify-center max-w-[80%] text-center">
                <div className="relative w-24 h-24 mb-6">
                      <img 
                        src={logoOngVang}
                        alt="Ong Vàng" 
                    className={`absolute w-[80px] h-[80px] object-contain top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 ${isListening ? 'animate-[pulse_1.5s_infinite]' : 'animate-[bounce_2s_infinite]'}`}
                  />
                  <div className={`absolute w-24 h-24 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-200/20 z-0 ${isListening ? 'animate-[ping_1s_infinite]' : ''}`}></div>
                </div>
                
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {isListening ? "Đang lắng nghe..." : isLoading ? "Đang xử lý..." : "Nhấn vào nút micro để nói"}
                </h3>
                
                {/* Hiển thị văn bản đầu vào của người dùng */}
                {inputMessage && (
                  <div className="mb-3 p-3 bg-white/80 rounded-lg shadow-sm border border-amber-200/40 text-sm max-w-[90%]">
                    <p className="text-gray-700">{inputMessage}</p>
                  </div>
                )}
                
                {/* Chỉ hiển thị trạng thái phát âm thanh, không hiển thị nội dung */}
                {isPlaying && (
                  <div className="mb-6 p-2 bg-amber-400/20 rounded-lg border border-amber-400/30 inline-flex items-center">
                    <MdVolumeUp className="text-amber-500 text-xl animate-[pulse_1.5s_infinite]" />
                    <span className="ml-2 text-amber-700 text-sm">Đang phát âm thanh...</span>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleListening}
                    className={`w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 ${
                      isListening 
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-lg shadow-red-200' 
                        : 'bg-amber-400 hover:bg-amber-500 shadow-lg shadow-amber-200'
                    }`}
                    aria-label={isListening ? "Dừng nhận giọng nói" : "Bắt đầu nhận giọng nói"}
                  >
                    {isListening ? (
                      <MdMic className="text-3xl text-white" />
                    ) : (
                      <MdMicOff className="text-3xl text-white" />
                    )}
                  </button>
                  
                  {/* Nút gửi - chỉ hiển thị khi có nội dung và không đang lắng nghe */}
                  {inputMessage && !isListening && (
                    <button
                      onClick={handleSendMessage}
                      disabled={isLoading}
                      className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 bg-gradient-to-br from-amber-400 to-amber-500 text-white hover:scale-105 hover:from-amber-500 hover:to-amber-600 shadow-md shadow-amber-200/50 ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                      aria-label="Gửi tin nhắn"
                    >
                      <IoMdSend className="text-2xl" />
                    </button>
                  )}
                </div>
                
                <p className="mt-4 text-sm text-gray-600">
                  {isLoading ? "Đang xử lý câu trả lời..." : isListening ? "Đang lắng nghe giọng nói của bạn..." : inputMessage ? "Nhấn nút gửi để gửi tin nhắn" : "Trợ lý ảo đang chờ đợi bạn"}
                </p>
              </div>
              </div>
            )}

          {/* Input */}
          <div className="p-3 border-t border-amber-200/20 bg-white">
            {!voiceOnlyMode ? (
              <div className="flex relative">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                  placeholder={isListening ? "Đang nghe..." : "Hỏi Ong Vàng điều bạn cần..."}
                  className={`flex-1 border-2 ${isListening ? 'border-red-400 bg-red-50/30' : 'border-amber-400'} rounded-xl py-2.5 px-3 resize-none text-sm bg-white transition-all focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200/20`}
                rows="2"
                aria-label="Nhập tin nhắn"
                  disabled={isListening}
                />
                
                {/* Mic Button for Voice Input */}
                <button
                  onClick={toggleListening}
                  className={`min-w-[42px] w-[42px] h-[42px] ml-2 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 self-end ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                  }`}
                  aria-label={isListening ? "Dừng nhận giọng nói" : "Bắt đầu nhận giọng nói"}
                  title={isListening ? "Dừng nhận giọng nói" : "Bắt đầu nhận giọng nói"}
                >
                  {isListening ? <MdMic className="text-lg text-white" /> : <MdMicOff className="text-lg" />}
                </button>
                
              <button
                onClick={handleSendMessage}
                disabled={isLoading || inputMessage.trim() === ''}
                  className={`w-[42px] min-w-[42px] h-[42px] ml-2 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 self-end ${
                    isLoading || inputMessage.trim() === '' 
                      ? 'opacity-60 cursor-not-allowed bg-gray-300'
                      : 'bg-gradient-to-br from-amber-400 to-amber-500 text-white hover:scale-105 hover:from-amber-500 hover:to-amber-600'
                  }`}
                aria-label="Gửi tin nhắn"
              >
                  <IoMdSend className="text-lg" />
              </button>
            </div>
            ) : (
              <div className="text-center">
                <span className="text-gray-600 text-sm">Nhấn nút micro ở trên để bắt đầu nói chuyện</span>
              </div>
            )}
            <div className="mt-1.5 text-[11px] text-gray-500 text-center flex justify-between items-center">
              {!voiceOnlyMode ? (
                <>
                  <span className="flex-1">Nhấn Enter để gửi, Shift+Enter để xuống dòng</span>
                  <span className={`flex items-center ${autoSpeakResponse ? 'text-amber-500' : 'text-gray-400'}`}>
                    <MdVolumeUp className="mr-1" /> Tự động đọc {autoSpeakResponse ? "đã bật" : "đã tắt"}
                  </span>
                </>
              ) : (
                <span className="flex-1 flex items-center justify-center text-amber-500">
                  <MdRecordVoiceOver className="mr-1" /> Chế độ chỉ trò chuyện bằng giọng nói
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox; 