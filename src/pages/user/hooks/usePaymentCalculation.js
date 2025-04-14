import { useMemo, useCallback } from "react";

export const usePaymentCalculation = (
  showtimeData,
  listSeatTypes,
  selectedSeats,
  selectedFoodItems,
  appliedDiscount,
  hasActiveReservation,
  activeReservationInfo,
) => {
  // Tính giá vé dựa trên loại ghế
  const calculateTicketPrice = useMemo(() => {
    if (!showtimeData?.base_price || !listSeatTypes?.seat_types) {            
      return {
        getSeatPrice: () => 0,
        calculateTotal: () => 0,
      };
    }

    const basePrice = Number(showtimeData?.base_price || 0);
    
    // Hàm tính giá cho một ghế
    const getSeatPrice = (seat) => {
      if (!seat) return basePrice;

      // Tìm loại ghế (VIP, thường, etc.)
      const seatType = listSeatTypes?.seat_types?.find(
        (type) => type.id === seat.type_id
      );

      // Nếu là ghế VIP, cộng thêm price_offset
      if (seatType && seatType.price_offset) {
        return basePrice + Number(seatType.price_offset || 0);
      }
      return basePrice;
    };

    const calculateTotal = (seats) => {
      if (!seats || seats.length === 0) return 0;

      let totalPrice = seats.reduce((total, seat) => {
        const seatPrice = Number(getSeatPrice(seat));

        return total + seatPrice;
      }, 0);

      return totalPrice;
    };

    return {
      getSeatPrice,
      calculateTotal,
    };
  }, [showtimeData?.showtime?.base_price, listSeatTypes?.seat_types]);

  //Tính giá vé trước khi giảm giá
  const calculateTotalBeforeDiscount = useCallback(() => {
    const seats = hasActiveReservation
      ? activeReservationInfo?.seats
      : selectedSeats;
    
    const ticketPrice = calculateTicketPrice.calculateTotal(seats) || 0;
    const foodPrice = selectedFoodItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    return ticketPrice + foodPrice;
  }, [
    hasActiveReservation,
    activeReservationInfo,
    selectedSeats,
    selectedFoodItems,
    calculateTicketPrice,
  ]);

  const calculateDiscount = useCallback(() => {
    const totalPriceBeforeDiscount = calculateTotalBeforeDiscount();

    if (!appliedDiscount) return 0;

    let discountValue = 0;
    const { discount_type, discount_value, applicable_to, max_discount } =
      appliedDiscount;

    // Tính tổng số tiền giảm giá
    const applyDiscount = (price) => {
      let discount =
        discount_type === "percentage"
          ? (price * discount_value) / 100
          : discount_value;
      return Math.max(0, discount);
    };

    switch (applicable_to) {
      case "total_bill":
        discountValue = applyDiscount(totalPriceBeforeDiscount);
        break;
      case "ticket":
        discountValue = applyDiscount(
          calculateTicketPrice.calculateTotal(
            hasActiveReservation ? activeReservationInfo?.seats : selectedSeats
          )
        );
        break;
      case "food":
        discountValue = applyDiscount(
          selectedFoodItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          )
        );
        break;
      default:
        discountValue = 0;
    }
    return discountValue;
  }, [
    calculateTotalBeforeDiscount,
    appliedDiscount,
    calculateTicketPrice,
    selectedFoodItems,
    hasActiveReservation,
    activeReservationInfo,
    selectedSeats,
  ]);

  const calculateTotalPrice = useCallback(() => {
    const seats = hasActiveReservation
      ? activeReservationInfo?.seats
      : selectedSeats;
    const ticketPrice = calculateTicketPrice.calculateTotal(seats) || 0;

    // Tính giá đồ ăn
    const foodPrice = selectedFoodItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const totalPriceBeforeDiscount = ticketPrice + foodPrice;
    // Xử lý giảm giá
    if (!appliedDiscount) return totalPriceBeforeDiscount;

    let discountValue = 0;
    const { discount_type, discount_value, applicable_to, max_discount } =
      appliedDiscount;

    const applyDiscount = (price) => {
      let discount =
        discount_type === "percentage"
          ? (price * discount_value) / 100
          : discount_value;

      // Nếu có giới hạn giảm giá tối đa (chỉ áp dụng cho discount_type === "percentage")
      if (discount_type === "percentage" && max_discount !== null) {
        discount = Math.min(discount, max_discount);
      }

      return Math.max(0, discount); // Đảm bảo không bị giảm giá âm
    };

    switch (applicable_to) {
      case "total_bill":
        discountValue = applyDiscount(totalPriceBeforeDiscount);
        break;
      case "ticket":
        discountValue = applyDiscount(ticketPrice);
        break;
      case "food":
        discountValue = applyDiscount(foodPrice);
        break;
      default:
        discountValue = 0;
    }
    return { totalPriceBeforeDiscount, discountValue }; // Không cho phép giá trị âm
  }, [
    hasActiveReservation,
    activeReservationInfo,
    selectedSeats,
    selectedFoodItems,
    calculateTicketPrice,
    appliedDiscount,
  ]);

  // Chuẩn bị thông tin ghế bao gồm cả giá
  const prepareSeatsWithPricing = useCallback(
    (seats) => {
      return seats.map((seat) => {
        // Tìm loại ghế để lấy thông tin giá
        const seatType = listSeatTypes?.seat_types?.find(
          (type) => type.id === seat.type_id
        );

        return {
          ...seat,
          type_price_offset: seatType?.price_offset || 0,
        };
      });
    },
    [listSeatTypes]
  );

  return {
    calculateTicketPrice,
    calculateTotalPrice,
    prepareSeatsWithPricing,
    calculateDiscount,
    calculateTotalBeforeDiscount,
  };
};

export default usePaymentCalculation;
