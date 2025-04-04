import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetDirectorsQuery,
  useDeleteDirectorMutation,
} from "../../../api/directorApi";

export default function ListDirectors() {
  const { data, isLoading, error } = useGetDirectorsQuery();
  const [deleteDirector] = useDeleteDirectorMutation();
  const [showConfirm, setShowConfirm] = useState(false);
  const [directorToDelete, setDirectorToDelete] = useState(null);

  const handleDelete = (directorId) => {
    setDirectorToDelete(directorId);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteDirector(directorToDelete).unwrap();
      toast.success("Xóa đạo diễn thành công!");
      setShowConfirm(false);
      setDirectorToDelete(null);
    } catch (error) {
      toast.error("Không thể xóa đạo diễn!");
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setDirectorToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Đã có lỗi xảy ra khi tải dữ liệu: {error.message}
      </div>
    );
  }

  const directors = data?.directors || [];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Danh sách đạo diễn</h2>
          <p className="mt-1 text-sm text-gray-500">Quản lý thông tin các đạo diễn</p>
        </div>
        <Link to="/admin/directors/add">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Thêm đạo diễn
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {directors.map((director) => (
          <div key={director.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
              <img
                src={`http://localhost:3000/${director.image}`}
                alt={director.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/placeholder-director.png';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-medium text-lg">{director.name}</h3>
                <p className="text-gray-200 text-sm">{director.nationality}</p>
              </div>
            </div>
            
            <div className="p-4">
              <div className="text-sm text-gray-600 mb-4">
                <p className="line-clamp-2">{director.description || 'Chưa có mô tả'}</p>
              </div>
              
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
                  onClick={() => handleDelete(director.id)}
                  className="flex-1 px-3 py-1.5 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100 transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}

        {directors.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 bg-white rounded-xl">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p className="text-gray-500 mb-2">Chưa có đạo diễn nào trong danh sách</p>
            <Link to="/admin/directors/add">
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Thêm đạo diễn mới
              </button>
            </Link>
          </div>
        )}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm mx-4 w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Xác nhận xóa đạo diễn</h3>
            <p className="text-gray-500 mb-6">Bạn có chắc chắn muốn xóa đạo diễn này? Hành động này không thể hoàn tác.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 