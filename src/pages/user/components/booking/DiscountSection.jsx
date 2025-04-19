import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useGetPromotionsQuery } from '@/api/promotionApi';
import { useGetStarByUserQuery } from '@/api/userApi';

const DiscountSection = ({
  user_id,
  appliedDiscount,
  setAppliedDiscount,
  discountCode,
  setDiscountCode,
  handleApplyDiscount,
  isCheckingDiscount,
  totalPrice = 0, 
  errorMessage = "", 
  selectedSeats = [],
  selectedFoodItems = [],
  onApplyStar,
  setOnApplyStar
}) => {

  const {data: StarUser} = useGetStarByUserQuery(user_id, {skip: !user_id});
  const [usedStars, setUsedStars] = useState(0);
  const [starDiscount, setStarDiscount] = useState(0);
  const [starMessage, setStarMessage] = useState("");
  const [isApplyingStar, setIsApplyingStar] = useState(false);
  
  const [validationMessage, setValidationMessage] = useState("");
  const [calculatedTotal, setCalculatedTotal] = useState(0);
  
  const {data: ListPromotions, isLoading} = useGetPromotionsQuery({
    limit: 100
  });
  
  // Tính toán tổng giá trị đơn hàng và lưu vào localStorage
  useEffect(() => {
    // Lấy thông tin giỏ hàng từ localStorage nếu có
    const loadCartFromStorage = () => {
      try {
        const storedCart = localStorage.getItem('booking_cart');
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          return parsedCart;
        }
      } catch (error) {
        console.error("Lỗi khi đọc giỏ hàng từ localStorage:", error);
      }
      return null;
    };
    
    // Tính toán tổng giá trị đơn hàng
    const calculateOrderTotal = () => {
      // Xóa dấu chấm ngàn từ totalPrice nếu là chuỗi
      let cleanTotalPrice = typeof totalPrice === 'string' 
        ? parseInt(totalPrice.replace(/\./g, '').replace(/\,/g, ''))
        : parseInt(totalPrice);
      
      if (isNaN(cleanTotalPrice)) {
        cleanTotalPrice = 0;
      }
      
      let total = cleanTotalPrice;
      
      // Nếu totalPrice = 0, thử tính tổng từ dữ liệu có sẵn hoặc localStorage
      if (total <= 0) {
        const cart = loadCartFromStorage();
        if (cart && cart.totalPrice > 0) {
          total = parseInt(cart.totalPrice);
        } else {
          // Tính theo ghế và đồ ăn nếu có
          if (selectedFoodItems && selectedFoodItems.length > 0) {
            const foodTotal = selectedFoodItems.reduce((sum, item) => {
              const itemPrice = typeof item.price === 'string' 
                ? parseInt(item.price.replace(/\./g, '').replace(/\,/g, ''))
                : parseInt(item.price);
              
              const quantity = parseInt(item.quantity);
              return sum + (itemPrice * quantity);
            }, 0);
            
            total += foodTotal;
          }
        }
      }
      
      // Force để tổng không âm
      if (total < 0) total = 0;
      
      // Lưu vào localStorage để duy trì khi chuyển trang hoặc refresh
      try {
        localStorage.setItem('booking_cart', JSON.stringify({ 
          totalPrice: total,
          timestamp: new Date().getTime()
        }));
      } catch (error) {
        console.error("Lỗi khi lưu giỏ hàng vào localStorage:", error);
      }
      
      return total;
    };
    
    const orderTotal = calculateOrderTotal();
    setCalculatedTotal(orderTotal);
  }, [totalPrice, selectedSeats, selectedFoodItems]);
  
  // Kiểm tra xem trong localStorage đã có star discount chưa
  useEffect(() => {
    try {
      const savedStarDiscount = localStorage.getItem("starDiscount");
      if (savedStarDiscount) {
        const starDiscountValue = parseInt(savedStarDiscount);
        if (!isNaN(starDiscountValue) && starDiscountValue > 0) {
          // Tính số star đã dùng (1 star = 1.000đ)
          const stars = Math.floor(starDiscountValue / 1000);
          if (stars >= 20 && stars <= (StarUser?.star || 0)) {
            setUsedStars(stars);
            setStarDiscount(starDiscountValue);
            setStarMessage(`Đã áp dụng ${stars} star để giảm ${starDiscountValue.toLocaleString('vi-VN')}₫`);
          } else {
            // Nếu số star không hợp lệ, xóa khỏi localStorage
            localStorage.removeItem("starDiscount");
          }
        }
      }
    } catch (error) {
      console.error("Lỗi khi đọc star discount từ localStorage:", error);
    }
  }, [StarUser]);
  
  // Reset used stars when component mounts or user changes
  useEffect(() => {
    // Reset chỉ khi user thay đổi và không có star discount trong localStorage
    if (!localStorage.getItem("starDiscount")) {
      setUsedStars(0);
      setStarDiscount(0);
      setStarMessage("");
    }
  }, [user_id]);
  
  const promotions = useMemo(() => {
    const now = new Date();
    return (ListPromotions?.data?.map(promotion => ({
      ...promotion,
      key: promotion.id,
      min_price: parseFloat(promotion.min_price || promotion.min_order_value || 0),
      discount_value: parseFloat(promotion.discount_value || 0),
      max_discount: parseFloat(promotion.max_discount || 0)
    }))
    // Filter out expired promotions
    .filter(promotion => 
      !promotion.end_date || new Date(promotion.end_date) > now
    )
    || []);
  }, [ListPromotions]);

  // Validate promotion code locally before sending to API
  const validatePromotionCode = (promotion) => {
    // If no promotion, can't validate
    if (!promotion) return true;
    
    // Check minimum order value
    const minValue = parseInt(promotion.min_order_value || promotion.min_price || 0);
    
    // Đảm bảo so sánh dạng số
    if (minValue > 0 && calculatedTotal < minValue) {
      const amountNeeded = minValue - calculatedTotal;
      setValidationMessage(`Đơn hàng tối thiểu ${minValue.toLocaleString('vi-VN')}₫ để áp dụng mã này, cần thêm ${amountNeeded.toLocaleString('vi-VN')}₫`);
      return false;
    }
    
    return true;
  };

  const handleSelectPromotion = (promotion) => {
    // Clear previous validation message
    setValidationMessage("");
    
    // Local validation before API call
    if (!validatePromotionCode(promotion)) {
      return;
    }
    
    setDiscountCode(promotion.code);
    handleApplyDiscount(promotion.code);
  };
  
  const handleManualApply = () => {
    // Clear previous validation message
    setValidationMessage("");
    
    // Find promotion in list if it exists
    const promotion = promotions.find(p => p.code === discountCode);
    
    // Local validation before API call
    if (promotion && !validatePromotionCode(promotion)) {
      return;
    }
    
    handleApplyDiscount();
  };

  // Hàm kiểm tra và áp dụng star
  const validateAndApplyStar = () => {
    // Reset thông báo
    setStarMessage("");
    setIsApplyingStar(true);

    // Kiểm tra xem có đủ star không
    if (!StarUser || !StarUser.star) {
      setStarMessage("Không tìm thấy thông tin điểm star của bạn");
      setIsApplyingStar(false);
      return;
    }

    // Kiểm tra số star nhập vào
    if (usedStars <= 0) {
      setStarMessage("Vui lòng nhập số star muốn sử dụng");
      setIsApplyingStar(false);
      return;
    }

    // Kiểm tra nếu số star nhập vào lớn hơn số star hiện có
    if (usedStars > StarUser.star) {
      setStarMessage(`Bạn chỉ có ${StarUser.star} star, không thể sử dụng nhiều hơn`);
      setIsApplyingStar(false);
      return;
    }

    // Kiểm tra nếu số star nhập vào ít hơn 20
    if (usedStars < 20) {
      setStarMessage("Cần ít nhất 20 star để áp dụng giảm giá");
      setIsApplyingStar(false);
      return;
    }

    // Tính số tiền được giảm (1 star = 1.000đ)
    const calculatedDiscount = usedStars * 1000;
    
    // Kiểm tra nếu số tiền giảm lớn hơn 50% giá trị đơn hàng
    if (calculatedDiscount > calculatedTotal * 0.5) {
      const maxStarsAllowed = Math.floor((calculatedTotal * 0.5) / 1000);
      setStarMessage(`Số tiền giảm không thể vượt quá 50% giá trị đơn hàng. Bạn chỉ có thể sử dụng tối đa ${maxStarsAllowed} star.`);
      setIsApplyingStar(false);
      return;
    }

    // Cập nhật số tiền giảm giá
    setStarDiscount(calculatedDiscount);
    localStorage.setItem("starDiscount", calculatedDiscount);
    
    // Cập nhật thông tin tổng giảm giá trong giỏ hàng
    try {
      const cart = localStorage.getItem('booking_cart');
      if (cart) {
        const parsedCart = JSON.parse(cart);
        parsedCart.starDiscount = calculatedDiscount;
        localStorage.setItem('booking_cart', JSON.stringify(parsedCart));
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật star discount vào giỏ hàng:", error);
    }
    setOnApplyStar({
      starsUsed: usedStars,
      discountAmount: calculatedDiscount
    })
    // Gọi callback để cập nhật giảm giá ở component cha
    if (typeof onApplyStar === 'function') {
      setOnApplyStar({
        starsUsed: usedStars,
        discountAmount: calculatedDiscount
      })
      onApplyStar({
        starsUsed: usedStars,
        discountAmount: calculatedDiscount
      });
    }

    setIsApplyingStar(false);
    setStarMessage(`Đã áp dụng ${usedStars} star để giảm ${calculatedDiscount.toLocaleString('vi-VN')}₫`);
  };

  const handleCancelStar = () => {
    setUsedStars(0);
    setStarDiscount(0);
    setStarMessage("");
    localStorage.removeItem("starDiscount");
    setOnApplyStar({
      starsUsed: 0,
      discountAmount: 0
    });
    // Cập nhật thông tin tổng giảm giá trong giỏ hàng
    try {
      const cart = localStorage.getItem('booking_cart');
      if (cart) {
        const parsedCart = JSON.parse(cart);
        delete parsedCart.starDiscount;
        localStorage.setItem('booking_cart', JSON.stringify(parsedCart));
      }
    } catch (error) {
      console.error("Lỗi khi xóa star discount khỏi giỏ hàng:", error);
    }
    
    // Thông báo cho component cha
    if (typeof onApplyStar === 'function') {
      onApplyStar({
        starsUsed: 0,
        discountAmount: 0
      });
    }
  };

  // Giới hạn số star nhập vào không vượt quá số star hiện có
  const handleStarInputChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    if (value >= 0 && (!StarUser || value <= StarUser.star)) {
      setUsedStars(value);
    }
  };
  
  // Generate concise promotion text based on promotion details
  const getPromotionSummary = (promotion) => {
    let summary = '';
    
    // Base on discount type
    if (promotion.discount_type === 'fixed_amount') {
      summary = `Giảm ${Number(promotion.discount_value).toLocaleString('vi-VN')}₫`;
    } else {
      summary = `Giảm ${promotion.discount_value}%`;
      if (promotion.max_discount) {
        summary += ` (tối đa ${Number(promotion.max_discount).toLocaleString('vi-VN')}₫)`;
      }
    }
    
    // What it applies to
    switch (promotion.applicable_to) {
      case 'ticket':
        summary += ' cho vé xem phim';
        break;
      case 'food':
        summary += ' cho đồ ăn';
        break;
      case 'total_bill':
      case 'other':
        summary += ' cho tổng hóa đơn';
        break;
    }
    
    // Add min order value if applicable (handle both field names)
    const minValue = promotion.min_order_value || promotion.min_price;
    if (minValue && Number(minValue) > 0) {
      summary += ` khi mua từ ${Number(minValue).toLocaleString('vi-VN')}₫`;
    }
    
    return summary;
  };
  
  // Get applied discount summary
  const getAppliedDiscountSummary = () => {
    if (!appliedDiscount) return '';
    
    let summary = '';
    
    // Base on discount type
    if (appliedDiscount.discount_type === 'fixed_amount') {
      summary = `Giảm ${Number(appliedDiscount.discount_value).toLocaleString('vi-VN')}₫`;
    } else {
      summary = `Giảm ${appliedDiscount.discount_value}%`;
      if (appliedDiscount.max_discount) {
        summary += ` (tối đa ${Number(appliedDiscount.max_discount).toLocaleString('vi-VN')}₫)`;
      }
    }
    
    // What it applies to
    switch (appliedDiscount.applicable_to) {
      case 'ticket':
        summary += ' cho vé xem phim';
        break;
      case 'food':
        summary += ' cho đồ ăn';
        break;
      case 'total_bill':
      case 'other':
        summary += ' cho tổng hóa đơn';
        break;
    }
    
    // Add min order value if applicable (handle both field names)
    const minValue = appliedDiscount.min_order_value || appliedDiscount.min_price;
    if (minValue && Number(minValue) > 0) {
      summary += ` khi mua từ ${Number(minValue).toLocaleString('vi-VN')}₫`;
    }
    
    return summary;
  };

  // Return information about what a promotion code applies to
  const getApplicableToText = (applicableTo) => {
    switch (applicableTo) {
      case 'ticket':
        return 'Chỉ áp dụng cho vé xem phim';
      case 'food':
        return 'Chỉ áp dụng cho đồ ăn';
      case 'total_bill':
      case 'other':
        return 'Áp dụng cho tổng hóa đơn';
      default:
        return '';
    }
  };
  
  // Get UI status for a promotion - if it's valid for the current order
  const getPromotionStatus = (promotion) => {
    // Convert to number to ensure proper comparison
    const minValue = parseInt(promotion.min_order_value || promotion.min_price || 0);
    
    // So sánh số với số
    if (minValue > 0 && calculatedTotal < minValue) {
      const amountNeeded = minValue - calculatedTotal;
      return {
        isValid: false,
        message: `Cần thêm ${amountNeeded.toLocaleString('vi-VN')}₫ để áp dụng`
      };
    }
    
    return { isValid: true, message: '' };
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h2 className="text-lg font-semibold mb-3">Mã giảm giá</h2>
      
      {/* Phần sử dụng Star */}
      {user_id && StarUser && (
        <div className="mb-4 border border-gray-200 rounded-md p-3 bg-yellow-50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-800">Sử dụng điểm Star</h3>
            <span className="text-sm text-orange-600 font-semibold">
              Star hiện có: {StarUser.star}
            </span>
          </div>
          
          {starDiscount > 0 ? (
            <div className="bg-green-50 p-2 rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700">
                    Đã sử dụng {usedStars} star để giảm {starDiscount.toLocaleString('vi-VN')}₫
                  </p>
                </div>
                <button 
                  onClick={handleCancelStar}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Hủy bỏ
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex space-x-2 mb-1 items-center">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min="0"
                    max={StarUser.star}
                    value={usedStars}
                    onChange={handleStarInputChange}
                    placeholder="Nhập số star"
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-orange-500"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">
                    Star
                  </span>
                </div>
                <button
                  onClick={validateAndApplyStar}
                  disabled={isApplyingStar || usedStars <= 0}
                  className="bg-orange-500 text-white px-3 py-1.5 text-sm rounded-md hover:bg-orange-600 transition disabled:opacity-50"
                >
                  {isApplyingStar ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-0.5 mr-1 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang áp dụng
                    </span>
                  ) : (
                    "Áp dụng"
                  )}
                </button>
              </div>
              
              {starMessage && (
                <div className={`text-xs mt-1 ${starMessage.includes('Đã áp dụng') ? 'text-green-600' : 'text-red-500'}`}>
                  {starMessage}
                </div>
              )}
              
              <div className="text-xs text-gray-500 mt-1">
                • Cần sử dụng ít nhất 20 star để giảm giá<br />
                • 1 star = 1.000₫<br />
                • Giảm tối đa 50% giá trị đơn hàng
              </div>
            </>
          )}
        </div>
      )}
      
      {appliedDiscount ? (
        <div className="mb-2">
          <div className="flex items-center justify-between py-1.5 px-3 bg-green-50 border border-green-200 rounded-md">
            <div>
              <span className="font-medium text-green-700">{appliedDiscount.code}</span>
              <p className="text-sm text-green-600 mt-0.5">{getAppliedDiscountSummary()}</p>
            </div>
            <button 
              onClick={() => setAppliedDiscount(null)} 
              className="text-gray-500 hover:text-red-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex space-x-1 mb-1">
          <input 
            type="text" 
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
              placeholder="Nhập mã khuyến mãi" 
              className="flex-1 px-3 py-1.5 text-base border border-gray-300 rounded-md focus:outline-none focus:border-orange-500"
          />
          <button 
              className="bg-orange-500 text-white px-3 py-1.5 text-base rounded-md hover:bg-orange-600 transition disabled:opacity-50"
              onClick={handleManualApply}
              disabled={isCheckingDiscount || !discountCode.trim()}
          >
            {isCheckingDiscount ? (
              <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-0.5 mr-1 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Kiểm tra
                </span>
              ) : (
                "Áp dụng"
              )}
            </button>
          </div>
          
          {/* Error message display */}
          {(errorMessage || validationMessage) && (
            <div className="text-sm text-red-500 mb-2">
              {errorMessage || validationMessage}
            </div>
          )}
          
          {/* Available Promotions Section */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">
              Khuyến mãi hiện có: 
              <span className="text-xs text-gray-400 ml-1">Tổng đơn: {calculatedTotal.toLocaleString('vi-VN')}₫</span>
            </p>
            
            {isLoading ? (
              <div className="flex justify-center py-2">
                <svg className="animate-spin h-5 w-5 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : promotions?.length > 0 ? (
              <div className="grid grid-cols-1 gap-2 max-h-[180px] overflow-y-auto pr-1">
                {promotions.map((promotion) => {
                  const status = getPromotionStatus(promotion);
                  return (
                    <div 
                      key={promotion.id} 
                      className={`border border-orange-100 rounded-md p-2 ${status.isValid ? 'bg-orange-50 hover:shadow-sm cursor-pointer' : 'bg-gray-50 cursor-not-allowed'} transition`}
                      onClick={() => status.isValid && handleSelectPromotion(promotion)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <span className={`inline-block ${status.isValid ? 'bg-orange-500' : 'bg-gray-400'} text-white px-2 py-0.5 rounded text-sm font-medium`}>
                              {promotion.code}
                            </span>
                            <span className={`text-base font-bold ml-auto ${status.isValid ? 'text-orange-600' : 'text-gray-500'}`}>
                              {promotion.discount_type === 'percentage' || promotion.discount_type === 'percent'
                                ? `-${promotion.discount_value}%` 
                                : `-${Number(promotion.discount_value).toLocaleString('vi-VN')}₫`}
              </span>
                          </div>
                          <p className="text-sm text-gray-800 font-medium mt-1 truncate">{promotion.name}</p>
                          <p className="text-sm text-gray-600 mt-0.5">{getPromotionSummary(promotion)}</p>
                          <div className="flex justify-between items-center mt-1">
                            <div className="text-sm text-gray-500">
                              {status.isValid ? (
                                promotion.start_date && promotion.end_date 
                                ? `Đến ${new Date(promotion.end_date).toLocaleDateString('vi-VN')}`
                                : 'Không giới hạn'
                              ) : (
                                <span className="text-red-500">{status.message}</span>
                              )}
                            </div>
                            <button 
                              className={`px-2 py-0.5 ${status.isValid ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-400 cursor-not-allowed'} text-white text-sm rounded`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (status.isValid) {
                                  handleSelectPromotion(promotion);
                                }
                              }}
                              disabled={!status.isValid}
                            >
                              {status.isValid ? "Chọn" : "Không hợp lệ"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-2 text-sm text-gray-500">
                Không có khuyến mãi nào hiện tại
              </div>
            )}
        </div>
        </>
      )}
      
      <div className="mt-2 text-sm text-gray-500">
        *Lưu ý: Mã giảm giá áp dụng tùy theo loại (vé, đồ ăn hoặc tổng hóa đơn)
      </div>
    </div>
  );
};

export default DiscountSection; 