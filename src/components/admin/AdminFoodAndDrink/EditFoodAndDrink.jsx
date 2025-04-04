import { useState } from "react";
import PropTypes from "prop-types";
import { useUpdateFoodAndDrinkMutation } from "../../../api/foodAndDrinkApi";
import { toast } from "react-toastify";
import { FiX, FiUpload } from "react-icons/fi";
const API_BASE_URL = import.meta.env.VITE_SOCKET_URL;

const EditFoodAndDrink = ({ setEditForm, editItem }) => {
  const [updateFoodAndDrink] = useUpdateFoodAndDrinkMutation();
  const [imagePreview, setImagePreview] = useState(
    editItem?.profile_picture ? `${API_BASE_URL}/${editItem.profile_picture}` : null
  );
  const [imageFile, setImageFile] = useState(null); // Thêm state để lưu file hình ảnh
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    
    // Nếu có file hình ảnh, thêm vào formData
    if (imageFile) {
      formData.append("profile_picture", imageFile); 
    }

    try {
      await updateFoodAndDrink({ id: editItem.id, data: formData }).unwrap();
      toast.success("Cập nhật món thành công!");
      setEditForm(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật món:", error);
      toast.error("Cập nhật món thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Cập nhật state với file hình ảnh mới
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Cập nhật preview hình ảnh
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Sửa Món</h3>
          <button
            onClick={() => setEditForm(false)}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <FiX className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên Món
              </label>
              <input
                type="text"
                name="name"
                required
                defaultValue={editItem?.name}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập tên món..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại
              </label>
              <select
                name="type"
                required
                defaultValue={editItem?.type}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">Chọn loại</option>
                <option value="food">Đồ ăn</option>
                <option value="drink">Đồ uống</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá (VNĐ)
              </label>
              <input
                type="number"
                name="price"
                required
                min="0"
                defaultValue={editItem?.price}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập giá..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hình Ảnh
              </label>
              <div className="mt-1 flex justify-center px-4 py-4 border-2 border-gray-200 border-dashed rounded-lg hover:border-gray-300 transition-colors duration-200">
                <div className="space-y-2 text-center">
                  {imagePreview ? (
                    <div className="relative w-32 h-32 mx-auto">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setImagePreview(null)}
                        className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full transform translate-x-1/2 -translate-y-1/2 hover:bg-red-600"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <FiUpload className="mx-auto h-10 w-10 text-gray-400" />
                      <div className="flex text-xs text-gray-600">
                        <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                          <span>Tải ảnh lên</span>
                          <input
                            type="file"
                            name="profile_picture"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1">hoặc kéo thả</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF tối đa 10MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditForm(false)}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang cập nhật...</span>
                </>
              ) : (
                "Cập nhật"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFoodAndDrink;
