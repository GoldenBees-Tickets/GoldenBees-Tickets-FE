import { useState } from "react";
import { useGetFoodAndDrinksQuery, useDeleteFoodAndDrinkMutation } from "../../api/foodAndDrinkApi";
import AddFoodAndDrinkForm from "../../components/admin/AdminFoodAndDrink/AddFoodAndDrink";
import EditFoodAndDrink from "../../components/admin/AdminFoodAndDrink/EditFoodAndDrink";
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";
const API_BASE_URL = import.meta.env.VITE_SOCKET_URL;

const FoodAndDrink = () => {
  const { data: listFoods, isLoading, isError, refetch } = useGetFoodAndDrinksQuery();
  const [deleteFoodAndDrink] = useDeleteFoodAndDrinkMutation();
  const [editForm, setEditForm] = useState(false);
  const [addForm, setAddForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [searchType, setSearchType] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleEdit = (item) => {
    setEditItem(item);
    setEditForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteFoodAndDrink(id).unwrap();
      toast.success("Xóa món thành công!");
      refetch();
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Xóa thất bại:", error);
      toast.error("Xóa món thất bại. Vui lòng thử lại.");
    }
  };

  const filteredList = listFoods?.data?.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchName.toLowerCase()) &&
      (searchType ? item.type === searchType : true)
    );
  });

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
          <h2 className="text-2xl font-bold text-gray-800">Quản Lý Đồ Ăn & Đồ Uống</h2>
          <p className="text-sm text-gray-600 mt-1">Quản lý danh sách món ăn và đồ uống của rạp</p>
        </div>
        <button
          onClick={() => setAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
        >
          <FiPlus className="w-5 h-5" />
          <span>Thêm Món Mới</span>
        </button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="">Tất cả loại</option>
          <option value="food">Đồ ăn</option>
          <option value="drink">Đồ uống</option>
        </select>
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
              {!filteredList?.length ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center">
                    <p className="text-gray-500 text-base">Chưa có món ăn hoặc đồ uống nào</p>
                    <button
                      onClick={() => setAddForm(true)}
                      className="mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Thêm món mới ngay
                    </button>
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => (
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
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
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

      {addForm && <AddFoodAndDrinkForm setAddForm={setAddForm} />}
      {editForm && editItem && <EditFoodAndDrink setEditForm={setEditForm} editItem={editItem} />}

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

export default FoodAndDrink;
