import axios from "axios";

const httpClient = axios.create({
  baseURL: "http://localhost:3000/v1/api",
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken"); 

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Nếu dữ liệu là FormData, không đặt Content-Type
    // Axios sẽ tự động đặt Content-Type: multipart/form-data và thêm boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {  
    const originalRequest = error.config;    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const response = await axios.post(
            "http://localhost:3000/v1/api/auth/refresh-token",
            { refreshToken },
            { headers: { "Content-Type": "application/json" } }
          );
          const newAccessToken = response.data.accessToken;
          
          localStorage.setItem("accessToken", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return httpClient(originalRequest); 
        } catch (refreshError) {          
          console.error("Refresh Token Error:", refreshError);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default httpClient;
