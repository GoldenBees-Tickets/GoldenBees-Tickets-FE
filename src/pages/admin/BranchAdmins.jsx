import { useState } from "react";
import { Button } from "antd";
import { FiPlus } from "react-icons/fi";
import ListAdmin from "@/components/admin/AdminUser/ListAdmin";
import AddAdmin from "@/components/admin/AdminUser/AddAdmin";

export default function BranchAdmins() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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

      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-[999]">
          <div className="w-full max-w-[90vw] md:max-w-xl bg-white rounded-lg overflow-hidden">
            <AddAdmin setIsFormCreate={setIsAddModalOpen} />
          </div>
        </div>
      )}
    </div>
  );
}
