import { useState, useCallback, memo } from "react";
import { useGetFoodAndDrinksQuery } from "../../../api/foodAndDrinkApi";
import { useCreateComboMutation } from "../../../api/comboApi";
import { FiX, FiUpload, FiTrash2, FiPlus, FiImage } from "react-icons/fi";
import { toast } from "react-toastify";
import React, { useRef } from "react";
import { Modal } from "antd";

// Component Item được tách riêng để tránh re-render không cần thiết
const ComboItem = ({
  item,
  index,
  foodAndDrinks,
  onItemChange,
  onRemoveItem,
}) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h5 className="text-base font-medium text-gray-700">Món {index + 1}</h5>
        <button
          type="button"
          onClick={() => onRemoveItem(index)}
          className="p-1.5 hover:bg-gray-200 rounded-full transition-colors duration-200"
        >
          <FiTrash2 className="w-5 h-5 text-red-500" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sản phẩm
          </label>
          <select
            value={item.foodOrDrinkId || ""}
            onChange={(e) =>
              onItemChange(index, {
                ...item,
                foodOrDrinkId: e.target.value,
              })
            }
            className="w-full px-4 py-2.5 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">Chọn sản phẩm</option>
            {foodAndDrinks?.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số lượng
          </label>
          <input
            type="number"
            min="1"
            value={item.quantity || 1}
            onChange={(e) =>
              onItemChange(index, {
                ...item,
                quantity: parseInt(e.target.value) || 1,
              })
            }
            className="w-full px-4 py-2.5 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

ComboItem.displayName = "ComboItem";

export default function AddCombo({ setAddForm, isVisible }) {
  const { data: List } = useGetFoodAndDrinksQuery();
  const foodAndDrinks = List?.items || [];
  
  const [add2] = useCreateComboMutation();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [profile_picture, setProfile_picture] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedItems, setSelectedItems] = useState([{ foodAndDrinkId: "", quantity: 1 }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setName(value);
    } else if (name === "price") {
      setPrice(value);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile_picture(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Dọn dẹp URL khi component unmount
  const handleClosePreview = () => {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setProfile_picture(null);
  };

  const handleItemChange = useCallback((index, field, value) => {
    setSelectedItems(prev => 
      prev.map((item, i) => i === index ? { ...item, [field]: value } : item)
    );
  }, []);

  const addItem = useCallback(() => {
    setSelectedItems(prev => [...prev, { foodAndDrinkId: "", quantity: 1 }]);
  }, []);

  const removeItem = useCallback((index) => {
    setSelectedItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const validateFields = () => {
    setError("");

    if (!name.trim()) {
      setError("Tên Combo không được bỏ trống.");
      return false;
    }
    if (!price || price <= 0) {
      setError("Giá Combo phải là một số hợp lệ và lớn hơn 0.");
      return false;
    }
    if (!profile_picture) {
      setError("Vui lòng chọn ảnh cho Combo.");
      return false;
    }
    if (selectedItems.length === 0 || selectedItems.every(item => !item.foodAndDrinkId)) {
      setError("Bạn phải chọn ít nhất một món.");
      return false;
    }
    const foodAndDrinkIds = selectedItems.map((item) => item.foodAndDrinkId).filter(Boolean);
    const hasDuplicates = new Set(foodAndDrinkIds).size !== foodAndDrinkIds.length;
    if (hasDuplicates) {
      setError("Bạn không thể chọn món trùng lặp.");
      return false;
    }
    if (selectedItems.some(item => item.quantity <= 0)) {
      setError("Số lượng món phải lớn hơn 0.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validateFields()) return;

    setIsSubmitting(true);
    const dataCombo = { name, price, profile_picture, items: selectedItems };
    
    try {
      await add2(dataCombo);
      toast.success("Thêm combo thành công!");
      setAddForm(false);
    } catch (error) {
      console.error("Error while submitting combo:", error);
      toast.error("Thêm combo thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    // Dọn dẹp resources
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setAddForm(false);
  };

  return (
    <Modal
      visible={isVisible}
      onCancel={closeModal}
      footer={null}
      width={600}
      closeIcon={false}
      title={null}
      centered
      bodyStyle={{ padding: 0, maxHeight: '80vh', overflow: 'hidden' }}
    >
      <div className="flex flex-col h-full">
        {/* Fixed Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-100 bg-white">
          <h3 className="text-lg font-semibold text-gray-800">Thêm Combo</h3>
          <button
            onClick={closeModal}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Content with padding */}
        <div className="flex-1 overflow-y-auto px-6 py-4 pr-8">
          <form onSubmit={handleSubmit}>
            {/* Form content starts here */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              {/* Name input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên Combo
                </label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tên combo"
                />
              </div>

              {/* Price input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá tiền
                </label>
                <input
                  type="number"
                  name="price"
                  value={price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập giá combo"
                />
              </div>
            </div>

            {/* Image upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình ảnh
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiImage className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FiUpload className="mr-2 -ml-1 h-5 w-5 text-gray-500" />
                    Tải ảnh lên
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
              </div>
            </div>

            {/* Description input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                name="description"
                value=""
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2.5 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập mô tả cho combo"
              ></textarea>
            </div>

            {/* Combo items */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Các món trong combo
                </label>
                <button
                  type="button"
                  onClick={addItem}
                  className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <FiPlus className="mr-1 h-4 w-4" />
                  Thêm món
                </button>
              </div>

              {selectedItems.length > 0 ? (
                <div className="space-y-4">
                  {selectedItems.map((item, index) => (
                    <ComboItem
                      key={index}
                      item={item}
                      index={index}
                      foodAndDrinks={foodAndDrinks}
                      onItemChange={handleItemChange}
                      onRemoveItem={removeItem}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  Chưa có món nào trong combo. Vui lòng thêm món.
                </p>
              )}
            </div>

            {/* Status select */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                name="status"
                value="ACTIVE"
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="ACTIVE">Hoạt động</option>
                <option value="INACTIVE">Không hoạt động</option>
              </select>
            </div>

            {/* Submit buttons */}
            <div className="flex justify-end space-x-4 mt-8">
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 border border-transparent rounded-lg text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Thêm mới
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
