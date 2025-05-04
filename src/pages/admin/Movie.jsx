import { Button } from "antd";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import ListMovies from '@/components/admin/AdminMovie/ListMovies';
import { canPerformAdminAction } from "@/utils/auth";

export default function Movie() {
  const canEditGenres = canPerformAdminAction();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Danh sách Phim</h2>
        {canEditGenres && (
        <Link to="/admin/movies/add">
          <Button
            type="primary"
            icon={<FiPlus />}
            className="flex items-center"
          >
            Thêm Phim
          </Button>
        </Link>
        )}
      </div>
      
      <div className="mt-4">
        <ListMovies />
      </div>
    </div>
  );
}
