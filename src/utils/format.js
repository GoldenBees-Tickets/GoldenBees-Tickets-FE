import dayjs from 'dayjs';

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

/**
 * Định dạng ngày tháng theo định dạng cụ thể
 * @param {string|Date} date - Ngày cần định dạng
 * @param {string} [format='DD/MM/YYYY'] - Định dạng đầu ra
 * @returns {string} Chuỗi ngày đã định dạng
 */
export const formatDate = (date, format = 'DD/MM/YYYY') => {
  if (!date) return '';
  return dayjs(date).format(format);
};

/**
 * Kiểm tra một ngày có phải là quá khứ so với hiện tại
 * @param {string|Date} date - Ngày cần kiểm tra
 * @param {string} [unit='day'] - Đơn vị so sánh (day, month, year, etc.)
 * @returns {boolean} true nếu là quá khứ, false nếu không
 */
export const isDateBefore = (date, unit = 'day') => {
  if (!date) return false;
  return dayjs(date).isBefore(dayjs(), unit);
};

/**
 * Định dạng thời gian theo định dạng giờ phút
 * @param {string} time - Thời gian cần định dạng (ISO date string)
 * @param {string} [format='HH:mm'] - Định dạng đầu ra
 * @returns {string} Chuỗi thời gian đã định dạng
 */
export const formatTime = (time, format = 'HH:mm') => {
  if (!time) return '';
  
  // Thêm ngày giả vào chuỗi time để đảm bảo dayjs nhận diện đúng
  const validTime = dayjs('2025-01-01 ' + time);
  
  if (!validTime.isValid()) return '';  // Nếu không hợp lệ, trả về chuỗi rỗng.

  return validTime.format(format);  // Trả về thời gian đã định dạng.
};

export const formatDecimal = (num) => {
  return Math.round(num * 10) / 10;
}

