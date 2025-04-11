import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { FiPlus } from "react-icons/fi";
import ListDirectors from "@/components/admin/AdminDirectors/ListDirector";

export default function Directors() {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Danh sách Đạo diễn</h2>
        <Link to="/admin/directors/add">
          <Button
            type="primary"
            icon={<FiPlus />}
            className="flex items-center"
          >
            Thêm Đạo diễn
          </Button>
        </Link>
      </div>
      
      <div className="mt-4">
        <ListDirectors />
      </div>
    </div>
  );
}
