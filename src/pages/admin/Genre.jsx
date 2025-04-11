import { useState } from "react";
import { Button, Modal } from "antd";
import { FiPlus } from "react-icons/fi";
import AddGenre from "../../components/admin/AdminGenre/AddGenre";
import ListGenre from "../../components/admin/AdminGenre/ListGenre";

export default function Genre() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Danh sách Thể Loại Phim</h2>
        <Button
          type="primary"
          icon={<FiPlus />}
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center"
        >
          Thêm Thể Loại
        </Button>
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
