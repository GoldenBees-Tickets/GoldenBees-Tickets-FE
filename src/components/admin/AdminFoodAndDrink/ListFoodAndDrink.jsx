import { useState } from "react";
import { useGetFoodAndDrinksQuery, useDeleteFoodAndDrinkMutation } from "../../../api/foodAndDrinkApi";
import { toast } from "react-toastify";
import AddFoodAndDrink from "./AddFoodAndDrink";
import EditFoodAndDrink from "./EditFoodAndDrink";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
const API_BASE_URL = import.meta.env.VITE_SOCKET_URL;

const ListFoodAndDrink = () => {
  const { data: foodAndDrinks, isLoading, error } = useGetFoodAndDrinksQuery();
  const [deleteFoodAndDrink] = useDeleteFoodAndDrinkMutation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowEditForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteFoodAndDrink(id).unwrap();
      toast.success("Xóa món thành công!");
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    } catch (err) {
      console.error("Lỗi khi xóa món:", err);
      toast.error("Xóa món thất bại. Vui lòng thử lại.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600"></div>
      </div>
    );
  }

  if (error) {
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
          <h2 className="text-2xl font-bold text-gray-800">Quản Lý Đồ Ăn & Đồ Uống</h2>
          <p className="text-sm text-gray-600 mt-1">Quản lý danh sách món ăn và đồ uống của rạp</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
        >
          <FiPlus className="w-5 h-5" />
          <span>Thêm Món Mới</span>
        </button>
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
                  Tên Món
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại
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
              {!foodAndDrinks?.length ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center">
                    <p className="text-gray-500 text-base">Chưa có món ăn hoặc đồ uống nào</p>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Thêm món mới ngay
                    </button>
                  </td>
                </tr>
              ) : (
                foodAndDrinks.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={`${API_BASE_URL}/${item.profile_picture}`}
                          alt={item.name}
                          className="h-10 w-10 rounded-lg object-cover shadow-sm"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.type === "food" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {item.type === "food" ? "Đồ ăn" : "Đồ uống"}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.price.toLocaleString()}đ
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
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

      {showAddForm && <AddFoodAndDrink setAddForm={setShowAddForm} />}
      {showEditForm && <EditFoodAndDrink setEditForm={setShowEditForm} editItem={selectedItem} />}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Xác nhận xóa món
              </h3>
              <p className="text-sm text-gray-500">
                Bạn có chắc chắn muốn xóa món &ldquo;{itemToDelete?.name}&rdquo; không?
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

export default ListFoodAndDrink; 