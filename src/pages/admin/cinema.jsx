import { useState } from "react";
import { Button, Modal } from "antd";
import { FiPlus } from "react-icons/fi";
import ListCinemas from "@/components/Admin/AdminCinemas/ListCinemas";
import AddCinema from "@/components/Admin/AdminCinemas/AddCinemas";

export default function Cinema() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Danh sách Cinema</h2>
        <Button
          type="primary"
          icon={<FiPlus />}
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center"
        >
          Thêm Cinema
        </Button>
      </div>
      
      <div className="mt-4">
        <ListCinemas />
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-[9999]">
          <div className="w-full max-w-4xl bg-white rounded-lg overflow-hidden">
            <AddCinema setAddCinema={setIsAddModalOpen} />
          </div>
        </div>
      )}
    </div>
  );
}
