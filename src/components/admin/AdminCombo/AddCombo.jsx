import { useState, useCallback, memo } from "react";
import { useGetFoodAndDrinksQuery } from "../../../api/foodAndDrinkApi";
import { useCreateComboMutation } from "../../../api/comboApi";
import { FiX, FiUpload, FiTrash2, FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";

// Component Item được tách riêng để tránh re-render không cần thiết
const ComboItem = memo(({ item, index, foodAndDrinks, onItemChange, onRemoveItem }) => {
  return (
    <div className="flex gap-2 items-start p-2 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Thực phẩm/Đồ uống
        </label>
        <select
          value={item.foodAndDrinkId}
          onChange={(e) => onItemChange(index, "foodAndDrinkId", e.target.value)}
          className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="">Chọn món</option>
          {foodAndDrinks?.map((foodAndDrink) => (
            <option key={foodAndDrink.id} value={foodAndDrink.id}>
              {foodAndDrink.name}
            </option>
          ))}
        </select>
      </div>

      <div className="w-24">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Số lượng
        </label>
        <input
          type="number"
          value={item.quantity}
          onChange={(e) => onItemChange(index, "quantity", Number(e.target.value))}
          min="1"
          className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <button
        type="button"
        onClick={() => onRemoveItem(index)}
        className="mt-6 p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-150"
      >
        <FiTrash2 className="w-4 h-4" />
      </button>
    </div>
  );
});

ComboItem.displayName = "ComboItem";

export default function AddCombo({ setAddForm }) {
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
    <div className="w-full">
      <div className="flex items-center justify-between p-3 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-800">Thêm Combo</h3>
        <button
          onClick={closeModal}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <FiX className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="p-3">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên Combo
              </label>
              <input
                type="text"
                name="comboName"
                value={name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập tên combo..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá Combo
              </label>
              <input
                type="number"
                name="comboPrice"
                value={price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập giá..."
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hình Ảnh
            </label>
            <div className="mt-1 flex justify-center px-3 py-3 border-2 border-gray-200 border-dashed rounded-lg hover:border-gray-300 transition-colors duration-200">
              <div className="space-y-2 text-center">
                {imagePreview ? (
                  <div className="relative w-24 h-24 mx-auto">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleClosePreview}
                      className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full transform translate-x-1/2 -translate-y-1/2 hover:bg-red-600"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <>
                    <FiUpload className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="flex justify-center text-sm text-gray-600">
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
                    <p className="text-xs text-gray-500">PNG, JPG, GIF tối đa 10MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">Danh Sách Món</h4>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1 px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
              >
                <FiPlus className="w-4 h-4" />
                <span>Thêm món</span>
              </button>
            </div>

            <div className="space-y-2">
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
          </div>

          {error && (
            <div className="mb-3 p-2 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-150"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang thêm...</span>
                </>
              ) : (
                "Thêm"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
