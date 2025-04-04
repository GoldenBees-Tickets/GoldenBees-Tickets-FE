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
    return config;
  },
  (error) => Promise.reject(error)
);

httpClient.interceptors.response.use(
  (response) => response,
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
