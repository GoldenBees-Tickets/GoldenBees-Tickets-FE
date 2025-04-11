import { useState, useCallback, useEffect, memo } from "react";
import PropTypes from "prop-types";
import { useGetFoodAndDrinksQuery } from "../../../api/foodAndDrinkApi";
import { useUpdateComboMutation, useGetComboByIdQuery } from "../../../api/comboApi";
import { FiX, FiUpload, FiTrash2, FiPlus, FiImage } from "react-icons/fi";
import { toast } from "react-toastify";
import { formatImage } from "@/utils/formatImage";

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

ComboItem.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  foodAndDrinks: PropTypes.array,
  onItemChange: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired
};

const EditCombo = ({ recordId, setEditForm, onDeleteSuccess }) => {
  // Fetch data
  const { data: combo, isLoading } = useGetComboByIdQuery(recordId);
  const { data: List } = useGetFoodAndDrinksQuery();
  const foodAndDrinks = List?.items || [];
  const [updateCombo] = useUpdateComboMutation();

  // State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [profile_picture, setProfile_picture] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [removedItems, setRemovedItems] = useState([]);
  const [originalItems, setOriginalItems] = useState([]);

  useEffect(() => {
    if (combo?.data) {
      setName(combo.data.name || "");
      setPrice(combo.data.price || "");
      setImagePreview(combo.data.imageUrl || "");
      if (combo.data.detail && combo.data.detail.length > 0) {
        const items = combo.data.detail.map(item => ({
          id: item.id,
          foodAndDrinkId: item.foodAndDrinkId,
          quantity: item.quantity
        }));
        setSelectedItems(items);
        setOriginalItems([...items]); // Store original items
      }
    }
  }, [combo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    name === "comboName" ? setName(value) : setPrice(value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile_picture(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleClosePreview = () => {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    if (combo?.data?.imageUrl) {
      setImagePreview(combo.data.imageUrl);
      setProfile_picture(null);
    } else {
      setImagePreview(null);
      setProfile_picture(null);
    }
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
    setSelectedItems(prev => {
      const updatedItems = [...prev];
      const removedItem = updatedItems[index];
      
      // If removing an existing item, add to removedItems list
      if (removedItem.id) {
        setRemovedItems(oldRemoved => [...oldRemoved, removedItem.id]);
      }
      
      // Remove the item from the list
      return updatedItems.filter((_, i) => i !== index);
    });
  }, []);

  const handleImageError = (e) => {
    e.target.src = "";
  };

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

    // New items are ones without an ID (recently added)
    const newItems = selectedItems.filter(item => !item.id);
    
    // Updated items are ones with an ID that have changed
    const updatedItems = selectedItems.filter(item => {
      if (!item.id) return false; // Skip new items
      const original = originalItems.find(o => o.id === item.id);
      if (!original) return false;
      return item.foodAndDrinkId !== original.foodAndDrinkId || 
             item.quantity !== original.quantity;
    });

    const comboData = {
      id: recordId,
      name,
      price,
      profile_picture,
      updatedItems,
      newItems,
      removedItems
    };

    try {
      await updateCombo(comboData);
      toast.success("Cập nhật combo thành công!");
      setEditForm(false);
    } catch (err) {
      console.error("Error updating combo:", err);
      toast.error("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setEditForm(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      {/* Fixed header */}
      <div className="sticky top-0 left-0 right-0 bg-white z-10 flex items-center justify-between p-5 border-b border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800">Sửa Combo</h3>
        <button
          onClick={closeModal}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <FiX className="w-6 h-6 text-gray-500" />
        </button>
      </div>

      {/* Content with padding for scrollbar */}
      <div className="p-6 pr-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên Combo
              </label>
              <input
                type="text"
                name="comboName"
                value={name}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập tên combo..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá Combo
              </label>
              <input
                type="number"
                name="comboPrice"
                value={price}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập giá..."
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình Ảnh
            </label>
            <div className="mt-1 flex justify-center px-4 py-4 border-2 border-gray-200 border-dashed rounded-lg hover:border-gray-300 transition-colors duration-200">
              <div className="space-y-3 text-center">
                {imagePreview ? (
                  <div className="relative w-36 h-36 mx-auto">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                      onError={handleImageError}
                    />
                    <button
                      type="button"
                      onClick={handleClosePreview}
                      className="absolute top-0 right-0 p-1.5 bg-red-500 text-white rounded-full transform translate-x-1/2 -translate-y-1/2 hover:bg-red-600"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <FiUpload className="mx-auto h-10 w-10 text-gray-400" />
                    <div className="flex justify-center text-base text-gray-600">
                      <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                        <span>Tải ảnh lên</span>
                        <input
                          type="file"
                          className="sr-only"
                          onChange={handleImageChange}
                          accept="image/*"
                        />
                      </label>
                      <p className="pl-1">hoặc kéo thả</p>
                    </div>
                    <p className="text-sm text-gray-500">PNG, JPG, GIF tối đa 10MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-medium text-gray-700">Danh Sách Món</h4>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
              >
                <FiPlus className="w-5 h-5" />
                <span>Thêm món</span>
              </button>
            </div>

            <div className="space-y-3">
              {selectedItems.map((item, index) => (
                <ComboItem 
                  key={item.id || index}
                  item={item}
                  index={index}
                  foodAndDrinks={foodAndDrinks}
                  onItemChange={handleItemChange}
                  onRemoveItem={removeItem}
                />
              ))}
              {selectedItems.length === 0 && (
                <div className="text-center py-5 text-gray-500">
                  Chưa có món nào được thêm vào combo
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4 mt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-base font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-150"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang lưu...</span>
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditCombo.propTypes = {
  recordId: PropTypes.string.isRequired,
  setEditForm: PropTypes.func.isRequired,
  onDeleteSuccess: PropTypes.func.isRequired
};

export default EditCombo;
