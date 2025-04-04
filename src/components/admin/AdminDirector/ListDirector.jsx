import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetDirectorsQuery,
  useDeleteDirectorMutation,
} from "../../../api/directorApi";

export default function ListDirectors() {
  const { data: directorData, isLoading } = useGetDirectorsQuery();
  const [deleteDirector] = useDeleteDirectorMutation();

  const [showConfirm, setShowConfirm] = useState(false);
  const [directorToDelete, setDirectorToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const directorsPerPage = 8;

  const directors = directorData?.directors || [];
  const totalPages = Math.ceil(directors.length / directorsPerPage);

  const indexOfLastDirector = currentPage * directorsPerPage;
  const indexOfFirstDirector = indexOfLastDirector - directorsPerPage;
  const currentDirectors = directors.slice(indexOfFirstDirector, indexOfLastDirector);

  const handleDelete = (id) => {
    setDirectorToDelete(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteDirector(directorToDelete).unwrap();
      toast.success("Xóa đạo diễn thành công!");
    } catch (err) {
      console.error("Lỗi khi xóa đạo diễn:", err);
      toast.error("Xóa đạo diễn thất bại. Vui lòng thử lại.");
    }
    setShowConfirm(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Danh Sách Đạo Diễn</h2>
              <p className="text-xs text-gray-600">Quản lý thông tin các đạo diễn</p>
            </div>
            <Link to="../addDirector">
              <button className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition-colors flex items-center gap-1.5 text-xs font-medium">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Thêm Đạo Diễn
              </button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Hình ảnh</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Tên đạo diễn</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Ngày sinh</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Giới tính</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentDirectors.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-sm text-gray-500">
                      Chưa có đạo diễn nào
                    </td>
                  </tr>
                ) : (
                  currentDirectors.map((director) => (
                    <tr key={director.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                      <td className="py-3 px-4">
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100">
                          <img
                            src={`http://localhost:3000/${director.profile_picture}`}
                            alt={director.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/placeholder-director.png';
                            }}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800 font-medium">{director.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(director.dob).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${
                          director.gender === "Male"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-pink-50 text-pink-600"
                        }`}>
                          {director.gender === "Male" ? "Nam" : "Nữ"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/admin/editDirector/${director.id}`}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                            title="Sửa"
                          >
                            <svg className="text-lg w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleDelete(director.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                            title="Xóa"
                          >
                            <svg className="text-lg w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {currentDirectors.length > 0 && (
            <div className="flex items-center justify-between py-3 px-4 border-t border-gray-200 bg-gray-50/50">
              <p className="text-xs text-gray-500">
                Hiển thị {indexOfFirstDirector + 1} - {Math.min(indexOfLastDirector, directors.length)} trong số {directors.length} đạo diễn
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`p-1.5 rounded-md border text-xs font-medium ${
                    currentPage === 1
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  } transition-colors duration-200`}
                >
                  Trước
                </button>
                <span className="text-xs text-gray-600">
                  Trang {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`p-1.5 rounded-md border text-xs font-medium ${
                    currentPage === totalPages
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  } transition-colors duration-200`}
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full mx-4 animate-modal-in">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Xác nhận xóa</h3>
            <p className="text-sm text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa đạo diễn này? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 