import { useEffect, useState, useCallback, useMemo } from "react";
import { useGetCombosQuery } from "@/api/comboApi";

import { formatImage } from "@/utils/formatImage";
// Component hiển thị FoodItem
function FoodItem({ item, onQuantityChange }) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg shadow-md hover:shadow-lg transition mb-4">
      {/* Bên trái: Ảnh + Thông tin */}
      <div className="flex items-center space-x-4">
        {/* Ảnh */}
        <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
          <img
            src={formatImage(item.profile_picture)}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
  
        {/* Thông tin */}
        <div>
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <p className="font-semibold text-left text-orange-600">
            {Number(item.price).toLocaleString()}đ
          </p>
        </div>
      </div>
  
      {/* Bên phải: Tăng/Giảm số lượng */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => onQuantityChange(item.id, -1)}
          disabled={item.quantity === 0}
          className="px-3 py-1 text-lg font-bold text-orange-600 disabled:text-gray-400 border border-gray-300 rounded-md"
          aria-label="Giảm số lượng"
        >
          -
        </button>
        <span className="w-8 text-center font-semibold">{item.quantity}</span>
        <button
          onClick={() => onQuantityChange(item.id, 1)}
          className="px-3 py-1 text-lg font-bold text-orange-600 border border-gray-300 rounded-md"
          aria-label="Tăng số lượng"
        >
          +
        </button>
      </div>
    </div>
  );
}

// Component loading skeleton
function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center p-4 border rounded-lg">
          <div className="w-24 h-24 bg-gray-200 rounded"></div>
          <div className="flex-grow px-4">
            <div className="h-6 w-1/2 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
            <div className="h-5 w-1/4 bg-gray-200 rounded"></div>
          </div>
          <div className="w-20 h-8 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
}

export default function FoodSelectionContent({
  selectedFoodItems = [],
  onUpdateFoodItems,
}) {
  // Data fetching
  const { data: foodItems, isLoading, error } = useGetCombosQuery();
  const [localFoodItems, setLocalFoodItems] = useState([]);

  // Khởi tạo danh sách món ăn local từ API và các món đã chọn
  useEffect(() => {
    if (foodItems?.data) {
      const initialItems = foodItems.data.map((item) => ({
        ...item,
        quantity: selectedFoodItems.find((selected) => selected.id === item.id)?.quantity || 0,
      }));
      setLocalFoodItems(initialItems);
    }
  }, [foodItems, selectedFoodItems]);

  // Xử lý thay đổi số lượng món ăn
  const handleQuantityChange = useCallback(
    (id, change) => {
      setLocalFoodItems((prev) => {
        const updatedItems = prev.map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        );

        // Chỉ gửi món ăn có số lượng > 0 lên component cha
        const selectedItems = updatedItems
          .filter((item) => item.quantity > 0)
          .map(({ id, name, price, quantity, profile_picture }) => ({
            id,
            name,
            price,
            quantity,
            image: profile_picture
          }));
        
        onUpdateFoodItems(selectedItems);
        return updatedItems;
      });
    },
    [onUpdateFoodItems]
  );

  // Render danh sách món ăn
  const renderContent = useMemo(() => {
    if (error) {
      return (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center mb-6">
          <p className="text-red-700">
            Có lỗi khi tải danh sách đồ ăn. Vui lòng thử lại sau.
          </p>
        </div>
      );
    }

    if (isLoading) {
      return <LoadingSkeleton />;
    }

    if (!localFoodItems?.length) {
      return (
        <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 font-medium">Không có dữ liệu đồ ăn</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {localFoodItems.map((item) => (
          <FoodItem
            key={item.id}
            item={item}
            onQuantityChange={handleQuantityChange}
          />
        ))}
      </div>
    );
  }, [error, isLoading, localFoodItems, handleQuantityChange]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Chọn đồ ăn & thức uống</h1>
      <p className="text-gray-600 mb-6">
        Thêm đồ ăn và thức uống để trải nghiệm xem phim tuyệt vời hơn
      </p>
      {renderContent}
    </div>
  );
}
