import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import ListPromotions from "./ListPromotions";
import AddPromotion from "./AddPromotion";
import { canPerformAdminAction } from "@/utils/auth";

export default function Promotion() {
  const [addPromotion, setAddPromotion] = useState(false);
  
  // Check if user has full admin permissions
  const canEditPromotions = canPerformAdminAction();

  return (
    <div className="p-6 h-full">
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Khuyến mãi</h1>
            <p className="mt-1 text-sm text-gray-600">Quản lý các mã giảm giá và chương trình khuyến mãi</p>
          </div>
          {canEditPromotions && (
            <Link to="create"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm"
            >
              <FiPlus className="w-5 h-5 mr-1.5" />
              Thêm Khuyến mãi
            </Link>
          )}
        </div>

        <ListPromotions />

        {/* Add Promotion Modal */}
        {addPromotion && (
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
              <AddPromotion setAddPromotion={setAddPromotion} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
