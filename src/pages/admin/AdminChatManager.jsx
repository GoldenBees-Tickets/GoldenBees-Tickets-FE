import { useState, useEffect } from "react";
import { useGetListUsersQuery } from "../../api/userApi";
import ChatComponent from "../../store/ChatComponent";

const AdminChatManager = () => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Lấy thông tin admin từ localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setUserId(parsedUser.id);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  }, []);
  
  // Lấy danh sách người dùng từ API
  const { data: usersList, isLoading, error } = useGetListUsersQuery();
  
  // Lọc danh sách người dùng theo từ khóa tìm kiếm
  const filteredUsers = usersList?.filter(user => 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Xử lý khi chọn người dùng để chat
  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">Đang tải danh sách người dùng...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <p className="text-red-500">Lỗi: {error.message || "Không thể tải danh sách người dùng"}</p>
        </div>
      </div>
    );
  }
  
  if (!userId) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <p className="text-red-500">Vui lòng đăng nhập để sử dụng tính năng chat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Danh sách người dùng */}
      <div className="w-1/4 bg-white border-r border-gray-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700">Quản lý Chat</h2>
          <p className="text-sm text-gray-500">Đăng nhập với: {user?.username || "Admin"}</p>
        </div>
        
        {/* Tìm kiếm người dùng */}
        <div className="p-3 border-b border-gray-200">
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Danh sách người dùng */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers && filteredUsers.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <li 
                  key={user.id}
                  className={`p-3 hover:bg-gray-50 cursor-pointer ${selectedUser?.id === user.id ? 'bg-blue-50' : ''}`}
                  onClick={() => handleSelectUser(user)}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      {user.username ? user.username.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{user.username || "Người dùng"}</p>
                      <p className="text-xs text-gray-500">{user.email || "Không có email"}</p>
                    </div>
                    {/* Hiển thị trạng thái online */}
                    <div className="ml-auto">
                      <span className="inline-block h-2 w-2 rounded-full bg-gray-300"></span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">
              {searchTerm ? "Không tìm thấy người dùng" : "Không có người dùng nào"}
            </div>
          )}
        </div>
      </div>
      
      {/* Khu vực chat */}
      <div className="w-3/4 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-3 bg-white border-b border-gray-200 flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                {selectedUser.username ? selectedUser.username.charAt(0).toUpperCase() : '?'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{selectedUser.username || "Người dùng"}</p>
                <p className="text-xs text-gray-500">{selectedUser.email || "Không có email"}</p>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <ChatComponent 
                userId={userId}
                userType="admin"
                receiverId={selectedUser.id}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Chọn người dùng để bắt đầu chat</h3>
              <p className="mt-1 text-sm text-gray-500">Chọn một người dùng từ danh sách bên trái để bắt đầu cuộc trò chuyện.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatManager; 