import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { FiPlus } from "react-icons/fi";
import ListActors from "../../components/admin/AdminActor/ListActor";

export default function Actors() {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Danh sách Diễn viên</h2>
        <Link to="/admin/actors/add">
          <Button
            type="primary"
            icon={<FiPlus />}
            className="flex items-center"
          >
            Thêm Diễn viên
          </Button>
        </Link>
      </div>
      
      <div className="mt-4">
        <ListActors />
      </div>
    </div>
  );
}
