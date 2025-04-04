import { useState } from "react";
import { Button } from "antd";
import { FiPlus } from "react-icons/fi";
import AddGenre from "../../components/Admin/AdminGenre/AddGenre";
import ListGenres from "../../components/Admin/AdminGenre/ListGenre";

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
        <ListGenres />
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-[9999]">
          <div className="w-full max-w-lg bg-white rounded-lg overflow-hidden">
            <AddGenre setAddGenre={setIsAddModalOpen} />
          </div>
        </div>
      )}
    </div>
  );
}
