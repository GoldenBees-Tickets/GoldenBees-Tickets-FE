import React from 'react';

const OrderSummary = ({ selectedSeats, selectedFoodItems, calculateTotalPrice }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Chi tiết hóa đơn</h2>
      
      {/* Thông tin ghế */}
      <div className="mb-4">
        <p className="font-medium mb-2">Ghế đã chọn:</p>
        <div className="flex flex-wrap gap-2">
          {selectedSeats.map(seat => (
            <span key={seat.id} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
              {seat.name}
            </span>
          ))}
        </div>
      </div>
      
      {/* Thông tin đồ ăn */}
      {selectedFoodItems.length > 0 && (
        <div className="mb-4">
          <p className="font-medium mb-2">Đồ ăn & thức uống:</p>
          <div className="space-y-2">
            {selectedFoodItems.map(item => (
              <div key={item.id} className="flex justify-between">
                <span>{item.name} x{item.quantity}</span>
                <span className="font-medium">{(item.price * item.quantity).toLocaleString()}đ</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Tổng tiền */}
      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between font-bold text-lg">
          <span>Tổng thanh toán:</span>
          <span className="text-red-600">{calculateTotalPrice().toLocaleString()}đ</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary; 