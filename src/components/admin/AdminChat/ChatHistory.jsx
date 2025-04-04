import { useState } from 'react';
import { FaTrash, FaEye } from 'react-icons/fa';
import { 
  useGetAllChatHistoriesQuery, 
  useGetChatHistoryByUserIdQuery,
  useDeleteChatHistoryMutation,
  useDeleteMessageMutation
} from '@/api/chatHistoryApi';

export default function ChatHistory() {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'

  // Fetch all chat histories
  const { 
    data: chatHistoriesData, 
    isLoading: isLoadingHistories, 
    error: historiesError 
  } = useGetAllChatHistoriesQuery();

  // Fetch messages for a specific user when selectedUserId changes
  const {
    data: userMessagesData,
    isLoading: isLoadingMessages,
    error: messagesError
  } = useGetChatHistoryByUserIdQuery(selectedUserId, {
    skip: !selectedUserId, // Skip this query if no userId is selected
  });

  // Mutations for deleting
  const [deleteChatHistory] = useDeleteChatHistoryMutation();
  const [deleteMessage] = useDeleteMessageMutation();

  // Processed chat histories data
  const chatHistories = processHistoriesData(chatHistoriesData);
  
  // User messages
  const userMessages = userMessagesData?.data || [];

  // Process histories data to group by userId
  function processHistoriesData(data) {
    if (!data || !data.data || !Array.isArray(data.data)) {
      return [];
    }

    const histories = data.data;
    
    // Group messages by userId
    const groupedData = {};
    histories.forEach(message => {
      if (!groupedData[message.userId]) {
        groupedData[message.userId] = [];
      }
      groupedData[message.userId].push(message);
    });
    
    // Convert to array format for rendering
    return Object.keys(groupedData).map(userId => {
      const messages = groupedData[userId];
      const lastMessage = messages[messages.length - 1];
      return {
        userId: parseInt(userId),
        messageCount: messages.length,
        lastMessage: lastMessage.text || 'Không có nội dung',
        lastTimestamp: new Date(lastMessage.timestamp || Date.now()).toLocaleString(),
      };
    });
  }

  // Show message details
  const handleViewMessages = (userId) => {
    setSelectedUserId(userId);
    setViewMode('detail');
  };

  // Handle delete chat history
  const handleDeleteChatHistory = async (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch sử chat này?')) {
      try {
        await deleteChatHistory(userId).unwrap();
        if (selectedUserId === userId) {
          setSelectedUserId(null);
          setViewMode('list');
        }
      } catch (error) {
        console.error(`Error deleting chat history for user ${userId}:`, error);
        alert('Không thể xóa lịch sử chat. Vui lòng thử lại sau.');
      }
    }
  };

  // Handle delete message
  const handleDeleteMessage = async (messageId) => {
    if (!selectedUserId) return;
    
    if (window.confirm('Bạn có chắc chắn muốn xóa tin nhắn này?')) {
      try {
        await deleteMessage({
          userId: selectedUserId,
          messageId
        }).unwrap();
      } catch (error) {
        console.error(`Error deleting message ${messageId}:`, error);
        alert('Không thể xóa tin nhắn. Vui lòng thử lại sau.');
      }
    }
  };

  // Go back to list view
  const backToList = () => {
    setViewMode('list');
    setSelectedUserId(null);
  };

  // Combined loading state
  const isLoading = isLoadingHistories || (selectedUserId && isLoadingMessages);
  
  // Combined error state
  const error = historiesError || (selectedUserId && messagesError);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý lịch sử Chat</h1>
      
      {isLoading && <div className="text-center py-4">Đang tải...</div>}
      
      {error && (
        <div className="text-center py-4 text-red-500">
          {error?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu'}
        </div>
      )}
      
      {viewMode === 'list' ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID người dùng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số tin nhắn</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tin nhắn gần đây</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {chatHistories.length > 0 ? (
                chatHistories.map((history) => (
                  <tr key={history.userId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Người dùng #{history.userId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{history.messageCount}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 truncate max-w-xs">{history.lastMessage}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{history.lastTimestamp}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewMessages(history.userId)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Xem chi tiết"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleDeleteChatHistory(history.userId)}
                          className="text-red-600 hover:text-red-900"
                          title="Xóa lịch sử"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : !isLoading && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    Không có lịch sử chat nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Lịch sử chat của Người dùng #{selectedUserId}</h2>
            <button
              onClick={backToList}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700"
            >
              Quay lại
            </button>
          </div>
          
          <div className="space-y-4 max-h-[70vh] overflow-y-auto p-4 bg-gray-50 rounded-lg">
            {userMessages.length > 0 ? (
              userMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'ai' ? 'justify-start' : 'justify-end'}`}
                >
                  <div 
                    className={`relative max-w-xl px-4 py-2 rounded-lg shadow ${
                      message.sender === 'ai' 
                        ? 'bg-gray-100 text-gray-800' 
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    <div className="text-sm">{message.text}</div>
                    <div className="text-xs mt-1 opacity-70">
                      {new Date(message.timestamp).toLocaleString()}
                    </div>
                    <button
                      onClick={() => handleDeleteMessage(message.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-700"
                      title="Xóa tin nhắn"
                    >
                      <FaTrash size={10} />
                    </button>
                  </div>
                </div>
              ))
            ) : !isLoading && (
              <div className="text-center py-4 text-gray-500">
                Không có tin nhắn nào.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 