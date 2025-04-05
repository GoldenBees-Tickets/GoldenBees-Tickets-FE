import { useState } from "react";
import { useGetCombosQuery, useDeleteComboMutation } from "../../api/comboApi";
import AddCombo from "../../components/admin/AdminCombo/AddCombo";
import EditCombo from "../../components/admin/AdminCombo/EditCombo";
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiEye, FiX } from "react-icons/fi";
import { toast } from "react-toastify";

import { formatImage } from "@/utils/formatImage";


const Combo = () => {
  const { data: listCombos, isLoading, isError, refetch } = useGetCombosQuery();
  const [deleteCombo] = useDeleteComboMutation();
  const [addForm, setAddForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [viewDetails, setViewDetails] = useState(null);
  const [isShowDetail, setIsShowDetail] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleEdit = (item) => {
    setEditItem(item);
    setEditForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteCombo(id).unwrap();
      toast.success("Xóa combo thành công!");
      refetch();
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Xóa thất bại:", error);
      toast.error("Xóa combo thất bại. Vui lòng thử lại.");
    }
  };

  const filteredList = listCombos?.data?.filter((item) =>
    item.name.toLowerCase().includes(searchName.toLowerCase())
  );

  const handleViewDetails = (item) => {
    setIsShowDetail(true);
    setViewDetails(item);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg max-w-md">
          <p className="text-lg font-semibold mb-2">Đã có lỗi xảy ra</p>
          <p className="text-sm">Không thể tải dữ liệu. Vui lòng thử lại sau.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản Lý Combo</h2>
          <p className="text-sm text-gray-600 mt-1">Quản lý danh sách combo của rạp</p>
        </div>
        <button
          onClick={() => setAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
        >
          <FiPlus className="w-5 h-5" />
          <span>Thêm Combo Mới</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hình Ảnh
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên Combo
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {!filteredList?.length ? (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center">
                    <p className="text-gray-500 text-base">Chưa có combo nào</p>
                    <button
                      onClick={() => setAddForm(true)}
                      className="mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Thêm combo mới ngay
                    </button>
                  </td>
                </tr>
              ) : (
                filteredList?.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={formatImage(item.profile_picture)}
                          alt={item.name}
                          className="h-10 w-10 rounded-lg object-cover shadow-sm"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewDetails(item)}
                          className="p-1.5 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors duration-150"
                          title="Xem chi tiết"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1.5 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors duration-150"
                          title="Sửa"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setItemToDelete(item);
                            setShowDeleteConfirm(true);
                          }}
                          className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors duration-150"
                          title="Xóa"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {addForm && <AddCombo setAddForm={setAddForm} />}
      {editForm && <EditCombo setEditForm={setEditForm} combo={editItem} />}

      {isShowDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">Chi Tiết Combo</h3>
              <button
                onClick={() => setIsShowDetail(false)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <FiX className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên Combo</label>
                  <p className="text-sm text-gray-900">{viewDetails?.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá</label>
                  <p className="text-sm text-gray-900">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(viewDetails?.price)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hình Ảnh</label>
                  <img
                    src={formatImage(viewDetails?.profile_picture)}
                    alt={viewDetails?.name}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Danh Sách Món</label>
                  <div className="space-y-2">
                    {viewDetails?.ComboItems?.map((item) => (
                      <div key={item.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{item.FoodAndDrink.name}</span>
                          <span className="text-sm text-gray-600">x{item.quantity}</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Tổng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.quantity * Number(item.FoodAndDrink.price))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Xác nhận xóa combo
              </h3>
              <p className="text-sm text-gray-500">
                Bạn có chắc chắn muốn xóa combo &ldquo;{itemToDelete?.name}&rdquo; không?
                Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setItemToDelete(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-150"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDelete(itemToDelete.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-150"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Combo;
