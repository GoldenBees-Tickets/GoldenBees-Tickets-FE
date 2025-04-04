import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    countdown: 0,
  },
  reducers: {
    addNotification: (state, action) => {
      const newNotification = action.payload;
      // Kiểm tra xem tin nhắn đã có trong state chưa
      const isDuplicate = state.notifications.some(notification => notification.id === newNotification.id);
      if (!isDuplicate) {
        state.notifications.push(newNotification); // Chỉ thêm nếu chưa có
      }
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(notification => notification.id !== action.payload.id);
    },
    setCountdown: (state, action) => {
      state.countdown = action.payload;
    },
    decrementCountdown: (state) => {
      if (state.countdown > 0) {
        state.countdown -= 1;
      }
    },
  },
});

export const { addNotification, removeNotification, setCountdown, decrementCountdown } = notificationSlice.actions;

export default notificationSlice.reducer;
