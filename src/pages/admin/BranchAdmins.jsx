import { useState } from "react";
import { Button, Modal } from "antd";
import { FiPlus } from "react-icons/fi";
import ListAdmin from "@/components/admin/AdminUser/ListAdmin";
import AddAdmin from "@/components/admin/AdminUser/AddAdmin";

export default function BranchAdmins() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Danh sách Quản trị viên
        </h2>
        <Button
          type="primary"
          icon={<FiPlus />}
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center"
        >
          Thêm Quản trị viên
        </Button>
      </div>

      <div className="mt-4">
        <ListAdmin />
      </div>

      <Modal
        title={null}
        open={isAddModalOpen}
        footer={null}
        onCancel={handleAddModalClose}
        destroyOnClose
        width={500}
        styles={{
          body: { padding: 0 }
        }}
      >
        <AddAdmin setIsFormCreate={setIsAddModalOpen} />
      </Modal>
    </div>
  );
}
