import axios from 'axios';

// Lấy API URL từ biến môi trường hoặc sử dụng giá trị mặc định
const API_URL = import.meta.env.VITE_API_URL || '';

// Tạo instance axios với URL cơ sở
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 giây
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor để xử lý response
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Thêm token xác thực nếu cần
export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

// Helper function để gọi API
export const apiCall = async (method, url, data = null, config = {}) => {
  try {
    const response = await axiosInstance({
      method,
      url,
      data,
      ...config
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // Máy chủ trả về lỗi với status code
      console.error('Response error:', error.response.data);
      return { 
        success: false, 
        error: error.response.data.message || 'Có lỗi xảy ra'
      };
    } else if (error.request) {
      // Yêu cầu được gửi nhưng không nhận được phản hồi
      console.error('Request error:', error.request);
      return { 
        success: false, 
        error: 'Không thể kết nối đến máy chủ'
      };
    } else {
      // Lỗi xảy ra khi thiết lập request
      console.error('Setup error:', error.message);
      return { 
        success: false, 
        error: 'Lỗi khi gửi yêu cầu'
      };
    }
  }
};

// Chat history API calls
export const chatHistoryApi = {
  // Lấy tất cả lịch sử chat
  getAllChatHistories: () => apiCall('get', '/v1/api/chatbot/history'),
  
  // Lấy lịch sử chat của một người dùng
  getUserChatHistory: (userId) => apiCall('get', `/v1/api/chatbot/history/${userId}`),
  
  // Thêm tin nhắn mới
  addMessage: (userId, message) => apiCall('post', '/v1/api/chatbot/history/message', { userId, message }),
  
  // Xóa lịch sử chat của một người dùng
  deleteChatHistory: (userId) => apiCall('delete', `/v1/api/chatbot/history/${userId}`),
  
  // Xóa một tin nhắn cụ thể
  deleteMessage: (userId, messageId) => apiCall('delete', `/v1/api/chatbot/history/${userId}/message/${messageId}`),
  
  // Cập nhật nội dung tin nhắn
  updateMessage: (userId, messageId, newText) => apiCall('put', `/v1/api/chatbot/history/${userId}/message/${messageId}`, { newText })
};

export default axiosInstance; 