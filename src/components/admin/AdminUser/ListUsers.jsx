import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { FiAlertCircle, FiUser, FiMail } from "react-icons/fi";

export default function ListUsers() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = (user) => {
    setSelectedUser(user);
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Xử lý logic thay đổi trạng thái ở đây
      
      setShowConfirm(false);
      // Hiển thị thông báo thành công
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái:", error);
      // Có thể hiển thị thông báo lỗi cho người dùng ở đây
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="w-full overflow-hidden bg-gradient-to-br from-gray-50 to-white p-6">
        <div className="mb-8">
          <h1 className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-3xl font-bold text-transparent">
            Quản lý Người dùng
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Quản lý thông tin và trạng thái của người dùng trong hệ thống
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-800 to-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <span className="text-sm font-medium text-white">Người dùng</span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-sm font-medium text-white">Điểm thưởng</span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-sm font-medium text-white">Trạng thái</span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-sm font-medium text-white">Ngày tham gia</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <tr className="transition-colors duration-200 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative h-12 w-12 flex-shrink-0">
                        <img
                          src="https://png.pngtree.com/png-vector/20191125/ourmid/pngtree-beautiful-admin-roles-line-vector-icon-png-image_2035379.jpg"
                          className="h-full w-full rounded-full object-cover ring-2 ring-white"
                          alt="Avatar"
                        />
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-400"></span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-1">
                          <FiUser className="h-4 w-4 text-gray-400" />
                          <p className="font-medium text-gray-900">Nguyễn Văn A</p>
                        </div>
                        <div className="mt-1 flex items-center space-x-1">
                          <FiMail className="h-4 w-4 text-gray-400" />
                          <p className="text-sm text-gray-500">email@gmail.com</p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center space-x-1 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-1 text-sm font-medium text-white shadow-sm">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 15L9 12M12 15L15 12M12 15V9M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>0 điểm</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        onChange={() => handleStatusChange({
                          id: 1,
                          name: "Nguyễn Văn A",
                          status: true
                        })}
                      />
                      <div className="peer h-7 w-14 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:shadow-sm after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-7 peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                    </label>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center space-x-1 text-sm text-gray-500">
                      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{format(new Date(), "dd MMMM, yyyy", { locale: vi })}</span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Modal Xác nhận */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm"
              onClick={() => !isLoading && setShowConfirm(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-50 w-full max-w-md overflow-hidden rounded-2xl bg-white p-8 shadow-2xl"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100">
                  <FiAlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Xác nhận thay đổi trạng thái
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Bạn có chắc chắn muốn {selectedUser?.status ? "khóa" : "mở khóa"} tài khoản của người dùng{" "}
                    <span className="font-medium text-gray-900">{selectedUser?.name}</span>?
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  disabled={isLoading}
                  className="rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => setShowConfirm(false)}
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  className="relative rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={handleConfirm}
                >
                  {isLoading ? (
                    <>
                      <span className="opacity-0">Xác nhận</span>
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      </div>
                    </>
                  ) : (
                    "Xác nhận"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
