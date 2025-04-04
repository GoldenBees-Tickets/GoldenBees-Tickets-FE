import { useState } from "react";
import { Button, Card } from "antd";
import { FiPlus } from "react-icons/fi";
import AddUser from "@/components/admin/AdminUser/AddUser";
import ListUser from "@/components/admin/AdminUser/ListUser";

export default function User() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
        <Button
          type="primary"
          icon={<FiPlus className="mr-1" />}
          onClick={showModal}
          className="bg-blue-500 flex items-center"
        >
          Thêm người dùng
        </Button>
      </div>

      <div className="bg-yellow-200 p-4 mb-4 rounded">
        UI ĐÃ CẬP NHẬT - Kiểm tra xem thông báo này có hiển thị không
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden">
            <AddUser closeModal={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}

      <Card className="shadow-md">
        <ListUser />
      </Card>
    </div>
  );
} 