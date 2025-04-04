import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FiEdit2, FiTrash2, FiPlus, FiEye } from "react-icons/fi";
import {
  useDeleteBranchMutation,
  useGetBranchesQuery,
} from "../../api/branchApi";

export default function Branch() {
  const { data: list, isLoading } = useGetBranchesQuery();
  const [deleteBranch] = useDeleteBranchMutation();
  const [showConfirm, setShowConfirm] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const branchesPerPage = 8;

  const listBranch = list?.branches || [];
  const totalPages = Math.ceil(listBranch.length / branchesPerPage);

  const indexOfLastBranch = currentPage * branchesPerPage;
  const indexOfFirstBranch = indexOfLastBranch - branchesPerPage;
  const currentBranches = listBranch.slice(indexOfFirstBranch, indexOfLastBranch);

  const handleDelete = (id) => {
    setBranchToDelete(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteBranch(branchToDelete).unwrap();
      toast.success("Xóa chi nhánh thành công!");
    } catch (err) {
      console.error("Lỗi khi xóa chi nhánh:", err);
      toast.error("Xóa chi nhánh thất bại. Vui lòng thử lại.");
    }
    setShowConfirm(false);
  };

  const handleViewDetails = (branch) => {
    setSelectedBranch(branch);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
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
    <div className="p-4 min-h-screen bg-gray-900 text-gray-200">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-white">Quản lý Chi Nhánh</h1>
            <p className="mt-1 text-sm text-gray-400">
              Quản lý thông tin các chi nhánh rạp phim trên toàn quốc
            </p>
          </div>
          <Link to="add-branch">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <FiPlus className="w-5 h-5 mr-2" />
              Thêm Chi Nhánh
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Tên chi nhánh
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Thành phố
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {currentBranches.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-sm text-gray-500">
                    Chưa có chi nhánh nào
                  </td>
                </tr>
              ) : (
                currentBranches.map((branch) => (
                  <motion.tr 
                    key={branch.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                      {branch.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{branch.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900 text-yellow-300">
                        {branch.city}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex items-center space-x-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleViewDetails(branch)}
                          className="flex items-center text-yellow-400 hover:text-yellow-300"
                        >
                          <FiEye className="w-4 h-4" />
                          <span className="ml-2">Chi tiết</span>
                        </motion.button>
                        <Link 
                          to={`../editBranch/${branch.id}`}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="flex items-center"
                          >
                            <FiEdit2 className="w-4 h-4" />
                            <span className="ml-2">Sửa</span>
                          </motion.button>
                        </Link>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(branch.id)}
                          className="flex items-center text-red-400 hover:text-red-300"
                        >
                          <FiTrash2 className="w-4 h-4" />
                          <span className="ml-2">Xóa</span>
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {currentBranches.length > 0 && (
          <div className="flex items-center justify-between py-3 px-4 border-t border-gray-700">
            <p className="text-xs text-gray-500">
              Hiển thị {indexOfFirstBranch + 1} - {Math.min(indexOfLastBranch, listBranch.length)} trong số {listBranch.length} chi nhánh
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`p-1.5 rounded-md border text-xs font-medium ${
                  currentPage === 1
                    ? 'border-gray-700 text-gray-300 cursor-not-allowed'
                    : 'border-gray-700 text-gray-200 hover:bg-gray-700'
                } transition-colors duration-200`}
              >
                Trước
              </button>
              <span className="text-xs text-gray-500">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`p-1.5 rounded-md border text-xs font-medium ${
                  currentPage === totalPages
                    ? 'border-gray-700 text-gray-300 cursor-not-allowed'
                    : 'border-gray-700 text-gray-200 hover:bg-gray-700'
                } transition-colors duration-200`}
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-black opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-700"
            >
              <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                    <FiTrash2 className="h-6 w-6 text-red-300" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-white">
                      Xác nhận xóa chi nhánh
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-300">
                        Bạn có chắc chắn muốn xóa chi nhánh này? Hành động này không thể hoàn tác.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "#E53E3E" }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleConfirmDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Xác nhận xóa
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "#4A5568" }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-700 text-base font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Hủy bỏ
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Branch Details Modal */}
      {showDetails && selectedBranch && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen p-4 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-black opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            >
              <div className="relative">
                {/* Header Banner */}
                <div className="h-40 bg-gradient-to-r from-red-800 to-yellow-800 flex items-end p-6">
                  <div className="absolute top-4 right-4">
                    <button 
                      onClick={closeDetails}
                      className="text-white hover:text-gray-200 focus:outline-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="text-white">
                    <h2 className="text-2xl font-bold">{selectedBranch.name}</h2>
                    <div className="flex items-center mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900 text-yellow-300">
                        {selectedBranch.city}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="bg-gray-800 p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-2">Thông tin chi nhánh</h3>
                      <div className="grid grid-cols-1 gap-4 border-t border-gray-700 pt-4">
                        <div className="flex justify-between py-2 border-b border-gray-700">
                          <span className="text-gray-400">ID</span>
                          <span className="text-white font-medium">{selectedBranch.id}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-700">
                          <span className="text-gray-400">Tên chi nhánh</span>
                          <span className="text-white font-medium">{selectedBranch.name}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-700">
                          <span className="text-gray-400">Thành phố</span>
                          <span className="text-white font-medium">{selectedBranch.city}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-700">
                          <span className="text-gray-400">Địa chỉ</span>
                          <span className="text-white font-medium">123 Đường ABC, {selectedBranch.city}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-700">
                          <span className="text-gray-400">Số phòng chiếu</span>
                          <span className="text-white font-medium">8</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-gray-400">Ngày hoạt động</span>
                          <span className="text-white font-medium">01/01/2020</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Footer */}
                <div className="bg-gray-900 px-6 py-4 flex justify-end space-x-3">
                  <Link 
                    to={`../editBranch/${selectedBranch.id}`}
                    className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                  >
                    <FiEdit2 className="w-4 h-4 mr-2" />
                    Sửa thông tin
                  </Link>
                  <motion.button
                    onClick={closeDetails}
                    className="inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-700 text-base font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:text-sm"
                  >
                    Đóng
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
