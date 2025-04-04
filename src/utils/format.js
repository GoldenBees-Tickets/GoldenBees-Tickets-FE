/**
 * Định dạng số thành chuỗi tiền tệ VND
 * @param {number} amount - Số tiền cần định dạng
 * @param {string} [currency='đ'] - Ký hiệu tiền tệ
 * @param {boolean} [useSymbol=true] - Có hiển thị ký hiệu tiền tệ hay không
 * @returns {string} Chuỗi tiền tệ đã định dạng
 */
export const formatCurrency = (amount, currency = 'đ', useSymbol = true) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0đ';
  }

  const formattedAmount = new Intl.NumberFormat('vi-VN').format(amount);
  return useSymbol ? `${formattedAmount}${currency}` : formattedAmount;
};

/**
 * Định dạng số với phân cách hàng nghìn
 * @param {number} number - Số cần định dạng
 * @returns {string} Chuỗi số đã định dạng
 */
export const formatNumber = (number) => {
  if (number === null || number === undefined || isNaN(number)) {
    return '0';
  }
  return new Intl.NumberFormat('vi-VN').format(number);
};

/**
 * Rút gọn văn bản nếu dài hơn độ dài tối đa
 * @param {string} text - Văn bản cần rút gọn
 * @param {number} maxLength - Độ dài tối đa
 * @returns {string} Văn bản đã rút gọn
 */
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}; 