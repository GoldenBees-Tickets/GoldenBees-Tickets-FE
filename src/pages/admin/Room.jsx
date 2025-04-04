import { Link } from "react-router-dom";
import { Button } from "antd";
import { FiPlus } from "react-icons/fi";
import ListRooms from "@/components/admin/AdminRoom/ListRooms";

export default function Room() {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Danh sách Phòng</h2>
        <Link to="add-room">
          <Button
            type="primary"
            icon={<FiPlus />}
            className="flex items-center"
          >
            Thêm Phòng
          </Button>
        </Link>
      </div>
      
      <div className="mt-4">
        <ListRooms />
      </div>
    </div>
  );
}
