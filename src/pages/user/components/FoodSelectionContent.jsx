import { useEffect, useState, useCallback, useMemo } from "react";
import { useGetCombosQuery } from "@/api/comboApi";

import { formatImage } from "@/utils/formatImage";
// Component hiển thị FoodItem
function FoodItem({ item, onQuantityChange }) {
  return (
    <div className="flex flex-col p-3 border rounded-lg shadow-sm hover:shadow-md transition mb-3 bg-white">
      <div className="flex items-center justify-between">
        {/* Bên trái: Ảnh + Thông tin */}
        <div className="flex items-center space-x-3">
          {/* Ảnh */}
          <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
            <img
              src={formatImage(item.profile_picture)}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thông tin */}
          <div>
            <h3 className="text-base font-semibold text-gray-800">{item.name}</h3>
            <p className="font-semibold text-left text-orange-600 text-sm">
              {Number(item.price).toLocaleString()}đ
            </p>
          </div>
        </div>

        {/* Bên phải: Tăng/Giảm số lượng */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onQuantityChange(item.id, -1)}
            disabled={item.quantity === 0}
            className="px-2 py-1 text-base font-bold text-orange-600 disabled:text-gray-400 border border-gray-300 rounded"
            aria-label="Giảm số lượng"
          >
            -
          </button>
          <span className="w-6 text-center font-medium">{item.quantity}</span>
          <button
            onClick={() => onQuantityChange(item.id, 1)}
            className="px-2 py-1 text-base font-bold text-orange-600 border border-gray-300 rounded"
            aria-label="Tăng số lượng"
          >
            +
          </button>
        </div>
      </div>

      {/* Hiển thị danh sách các món trong combo */}
      {item.ComboItems && item.ComboItems.length > 0 && (
        <div className="mt-2 ml-16 border-t pt-1">
          <p className="text-xs font-medium text-gray-700">Bao gồm:</p>
          <div className="grid grid-cols-2 gap-x-2 gap-y-0 mt-1">
            {item.ComboItems.map((comboItem) => (
              <div key={comboItem.id} className="flex items-center text-xs text-gray-600">
                <span className="inline-flex items-center justify-center w-4 h-4 bg-orange-50 text-orange-600 rounded-full font-medium text-xs mr-1">
                  {comboItem.quantity}
                </span>
                <span>{comboItem.FoodAndDrink?.name}</span>
                {comboItem.FoodAndDrink?.price && (
                  <span className="ml-1 text-gray-500 text-xs">
                    ({Number(comboItem.FoodAndDrink.price).toLocaleString()}đ)
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Component loading skeleton
function LoadingSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center p-3 border rounded-lg">
          <div className="w-16 h-16 bg-gray-200 rounded"></div>
          <div className="flex-grow px-3">
            <div className="h-4 w-1/2 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 w-1/3 bg-gray-200 rounded"></div>
          </div>
          <div className="w-16 h-7 bg-gray-200 rounded"></div>
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
    if (foodItems?.items) {
      const initialItems = foodItems.items.map((item) => ({
        ...item,
        quantity:
          selectedFoodItems.find((selected) => selected.id === item.id)
            ?.quantity || 0,
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
            image: profile_picture,
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
