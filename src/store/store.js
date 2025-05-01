import { configureStore } from "@reduxjs/toolkit";
import { genreApi } from "@/api/genreApi";
import { movieGenreApi } from "@/api/movieGenreApi";
import { actorApi } from "@/api/actorApi";
import { producerApi } from "@/api/producerApi";
import { movieActorApi } from "@/api/movieActorApi";
import { movieProducerApi } from "@/api/movieProducerApi";
import { directorApi } from "@/api/directorApi";
import { authApi } from "@/api/authApi";
import { branchApi } from "@/api/branchApi";
import { cinemaApi } from "@/api/cinemaApi";
import { qrCodeApi } from "@/api/qrCodeApi";
import { chatHistoryApi } from "@/api/chatHistoryApi";
import { countryApi } from "@/api/countryApi";

import notificationReducer from "@/store/notificationSlice"; 
import { movieApi } from "@/api/movieApi";
import { userApi } from "@/api/userApi";
import { roomApi } from "@/api/roomApi";
import { seatApi } from "@/api/seatApi";
import { foodAndDrinkApi } from "@/api/foodAndDrinkApi";
import { seatTypeApi } from "@/api/seatTypeApi";
import { comboApi } from "../api/comboApi";
import { promotionApi } from "../api/promotionApi";


import { showtimeApi } from "@/api/showtimeApi";
import { holidayDateApi } from "@/api/holidayDateApi";
import { priceSettingApi } from "@/api/priceSettingApi";
import { orderApi } from "@/api/orderApi";
import { voiceConverterApi } from '@/api/voiceConverterApi';
import { postApi } from '@/api/postApi';
import { reviewApi } from "@/api/reviewApi";

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [branchApi.reducerPath]: branchApi.reducer,
    [cinemaApi.reducerPath]: cinemaApi.reducer,
    [roomApi.reducerPath]: roomApi.reducer,
    [seatApi.reducerPath]: seatApi.reducer,
    [qrCodeApi.reducerPath]: qrCodeApi.reducer,
    [chatHistoryApi.reducerPath]: chatHistoryApi.reducer,
    [countryApi.reducerPath]: countryApi.reducer,
  
    [movieApi.reducerPath]: movieApi.reducer,
    [genreApi.reducerPath]: genreApi.reducer,
    [movieGenreApi.reducerPath]: movieGenreApi.reducer,
    [actorApi.reducerPath]: actorApi.reducer,
    [producerApi.reducerPath]: producerApi.reducer,
    [movieActorApi.reducerPath]: movieActorApi.reducer,
    [movieProducerApi.reducerPath]: movieProducerApi.reducer,
    [directorApi.reducerPath]: directorApi.reducer,
    [foodAndDrinkApi.reducerPath]: foodAndDrinkApi.reducer,
    [seatTypeApi.reducerPath]: seatTypeApi.reducer,
    
    [promotionApi.reducerPath]: promotionApi.reducer,
    [comboApi.reducerPath]: comboApi.reducer,
    [showtimeApi.reducerPath]: showtimeApi.reducer,
    [holidayDateApi.reducerPath]: holidayDateApi.reducer,
    [priceSettingApi.reducerPath]: priceSettingApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    notifications: notificationReducer,  
    [voiceConverterApi.reducerPath]: voiceConverterApi.reducer,
    [postApi.reducerPath]: postApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(authApi.middleware)  
      .concat(branchApi.middleware)  
      .concat(cinemaApi.middleware)  
      .concat(roomApi.middleware)
      .concat(seatApi.middleware)
      .concat(qrCodeApi.middleware)
      .concat(chatHistoryApi.middleware)
      .concat(countryApi.middleware)
      .concat(movieApi.middleware)
      .concat(genreApi.middleware)
      .concat(userApi.middleware)
      .concat(movieGenreApi.middleware)
      .concat(actorApi.middleware)
      .concat(producerApi.middleware)
      .concat(movieActorApi.middleware)
      .concat(movieProducerApi.middleware)
      .concat(directorApi.middleware)
      .concat(foodAndDrinkApi.middleware)
      .concat(seatTypeApi.middleware)
      .concat(promotionApi.middleware)
      .concat(comboApi.middleware)
      .concat(showtimeApi.middleware)
      .concat(holidayDateApi.middleware)
      .concat(priceSettingApi.middleware)
      .concat(orderApi.middleware)
      .concat(voiceConverterApi.middleware)
      .concat(postApi.middleware)
      .concat(reviewApi.middleware)
});

export default store;
