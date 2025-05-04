import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { FiPlus } from "react-icons/fi";
import ListActors from "../../components/admin/AdminActor/ListActor";
import { canPerformAdminAction } from "../../utils/auth";

export default function Actors() {
  // Check if user can perform admin actions (only main admin, not branch_admin)
  const canAddActor = canPerformAdminAction();
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Danh sách Diễn viên</h2>
        {canAddActor && (
          <Link to="/admin/actors/add">
            <Button
              type="primary"
              icon={<FiPlus />}
              className="flex items-center"
            >
              Thêm Diễn viên
            </Button>
          </Link>
        )}
      </div>
      
      <div className="mt-4">
        <ListActors />
      </div>
    </div>
  );
}
