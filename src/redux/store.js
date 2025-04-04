import { configureStore } from "@reduxjs/toolkit";
import { foodAndDrinkApi } from "../api/foodAndDrinkApi";
import { qrCodeApi } from "../api/qrCodeApi";

export const store = configureStore({
  reducer: {
    [foodAndDrinkApi.reducerPath]: foodAndDrinkApi.reducer,
    [qrCodeApi.reducerPath]: qrCodeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      foodAndDrinkApi.middleware,
      qrCodeApi.middleware
    ),
}); 