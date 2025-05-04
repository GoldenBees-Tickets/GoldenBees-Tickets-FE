import { useState } from "react";
import { Button, Modal } from "antd";
import { FiPlus } from "react-icons/fi";
import AddGenre from "../../components/admin/AdminGenre/AddGenre";
import ListGenre from "../../components/admin/AdminGenre/ListGenre";
import { canPerformAdminAction } from "@/utils/auth";

export default function Genre() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Check if user has full admin permissions
  const canEditGenres = canPerformAdminAction();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Danh sách Thể Loại Phim</h2>
        {canEditGenres && (
          <Button
            type="primary"
            icon={<FiPlus />}
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center"
          >
            Thêm Thể Loại
          </Button>
        )}
      </div>
      
      <div className="mt-4">
        <ListGenre />
      </div>

      <Modal
        open={isAddModalOpen}
        footer={null}
        onCancel={() => setIsAddModalOpen(false)}
        width={500}
      >
            <AddGenre setAddGenre={setIsAddModalOpen} />
      </Modal>
    </div>
  );
}
