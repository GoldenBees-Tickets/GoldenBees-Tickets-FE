import React from 'react';

const PaymentMethods = ({ 
  selectedPaymentMethod, 
  setSelectedPaymentMethod, 
  handlePayment, 
  isProcessingPayment 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Phương thức thanh toán</h2>
      
      {/* Chọn phương thức thanh toán */}
      <div className="space-y-3">
        <div 
          className={`border rounded-lg p-4 flex items-center space-x-3 cursor-pointer ${selectedPaymentMethod === 'momo' ? 'bg-blue-50 border-blue-300' : ''}`}
          onClick={() => setSelectedPaymentMethod('momo')}
        >
          <input 
            type="radio" 
            id="momo" 
            name="payment_method" 
            value="momo" 
            checked={selectedPaymentMethod === 'momo'} 
            onChange={() => setSelectedPaymentMethod('momo')}
          />
          <label htmlFor="momo" className="flex items-center cursor-pointer w-full">
            <img src="/images/momo-icon.png" alt="MoMo" className="w-10 h-10 mr-2" />
            <span>Ví điện tử MoMo</span>
          </label>
        </div>
        
        <div 
          className={`border rounded-lg p-4 flex items-center space-x-3 cursor-pointer ${selectedPaymentMethod === 'zalopay' ? 'bg-blue-50 border-blue-300' : ''}`}
          onClick={() => setSelectedPaymentMethod('zalopay')}
        >
          <input 
            type="radio" 
            id="zalopay" 
            name="payment_method" 
            value="zalopay" 
            checked={selectedPaymentMethod === 'zalopay'} 
            onChange={() => setSelectedPaymentMethod('zalopay')}
          />
          <label htmlFor="zalopay" className="flex items-center cursor-pointer w-full">
            <img src="/images/zalopay-icon.png" alt="ZaloPay" className="w-10 h-10 mr-2" />
            <span>Ví điện tử ZaloPay</span>
          </label>
        </div>
        
        <div 
          className={`border rounded-lg p-4 flex items-center space-x-3 cursor-pointer ${selectedPaymentMethod === 'vnpay' ? 'bg-blue-50 border-blue-300' : ''}`}
          onClick={() => setSelectedPaymentMethod('vnpay')}
        >
          <input 
            type="radio" 
            id="vnpay" 
            name="payment_method" 
            value="vnpay" 
            checked={selectedPaymentMethod === 'vnpay'} 
            onChange={() => setSelectedPaymentMethod('vnpay')}
          />
          <label htmlFor="vnpay" className="flex items-center cursor-pointer w-full">
            <img src="/images/vnpay-icon.png" alt="VNPay" className="w-10 h-10 mr-2" />
            <span>Thanh toán qua VNPay</span>
          </label>
        </div>
        
        {/* Nút thanh toán */}
        <button 
          className="w-full mt-4 bg-pink-500 text-white py-3 rounded-lg font-medium hover:bg-pink-600 transition disabled:opacity-50"
          onClick={handlePayment}
          disabled={isProcessingPayment}
        >
          {isProcessingPayment ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang xử lý...
            </span>
          ) : (
            "Thanh toán ngay"
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentMethods; 