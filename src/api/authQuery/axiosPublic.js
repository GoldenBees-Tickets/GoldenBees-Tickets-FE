import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "http://localhost:3000/v1/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm log để kiểm tra request
axiosPublic.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

axiosPublic.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosPublic;
