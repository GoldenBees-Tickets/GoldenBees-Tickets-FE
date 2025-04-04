import React from 'react';

const DiscountSection = ({
  appliedDiscount,
  setAppliedDiscount,
  discountCode,
  setDiscountCode,
  handleApplyDiscount,
  isCheckingDiscount
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-lg text-left font-semibold mb-4">Mã giảm giá</h2>
      
      {appliedDiscount ? (
        <div className="mb-4">
          <div className="flex items-center justify-between py-2 px-4 bg-green-50 border border-green-200 rounded-lg">
            <div>
              <span className="font-medium text-green-700">{appliedDiscount.code}</span>
              <p className="text-sm text-green-600">{appliedDiscount.description}</p>
            </div>
            <button 
              onClick={() => setAppliedDiscount(null)} 
              className="text-gray-500 hover:text-red-500"
            >
              Hủy
            </button>
          </div>
        </div>
      ) : (
        <div className="flex space-x-2">
          <input 
            type="text" 
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
            placeholder="Nhập mã khuyến mãi (nếu có)" 
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
          />
          <button 
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
            onClick={handleApplyDiscount}
            disabled={isCheckingDiscount}
          >
            {isCheckingDiscount ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang kiểm tra
              </span>
            ) : (
              "Áp dụng"
            )}
          </button>
        </div>
      )}
      
      <div className="mt-3 text-sm text-gray-600">
        *Lưu ý: Mã giảm giá chỉ áp dụng cho giá vé, không áp dụng cho đồ ăn
      </div>
    </div>
  );
};

export default DiscountSection; 