import { Link } from "react-router-dom";
import { formatImage } from "../../../utils/formatImage";

export default function DirectorCard({ director, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
        <img
          src={formatImage(director?.profile_picture)}
          alt={director.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "/placeholder-director.png";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-medium text-lg">{director.name}</h3>
          <p className="text-gray-200 text-sm">{director.nationality}</p>
        </div>
      </div>

      <div className="p-4">
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {director.description || "Chưa có mô tả"}
        </p>

        <div className="flex items-center justify-between gap-2">
          <Link to={`/admin/directors/${director.id}`} className="flex-1">
            <button className="w-full px-3 py-1.5 bg-blue-50 text-blue-600 text-sm rounded-lg hover:bg-blue-100 transition-colors">
              Chi tiết
            </button>
          </Link>
          <Link to={`/admin/directors/edit/${director.id}`} className="flex-1">
            <button className="w-full px-3 py-1.5 bg-yellow-50 text-yellow-600 text-sm rounded-lg hover:bg-yellow-100 transition-colors">
              Sửa
            </button>
          </Link>
          <button
            onClick={() => onDelete(director.id)}
            className="flex-1 px-3 py-1.5 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100 transition-colors"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
