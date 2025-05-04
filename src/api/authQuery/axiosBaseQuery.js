import { authEvents } from "../../utils/authEventBus";
import axiosPublic from "./axiosPublic";
import httpClient from "./httpClient";

const axiosBaseQuery =
  (
    { baseUrl, useHttpClient = false } = { baseUrl: "", useHttpClient: false }
  ) =>
  async ({ url, method, body, data, isFormData = false }) => {
    try {
      const client = useHttpClient ? httpClient : axiosPublic;
      
      // Sử dụng data nếu có, nếu không thì dùng body
      const requestData = data || body;

      // Thiết lập headers phù hợp
      let headers = {};
      if (isFormData) {
        headers["Content-Type"] = "multipart/form-data";
      } else {
        headers["Content-Type"] = "application/json";
      }

      const result = await client({
        url: baseUrl + url,
        method,
        data: requestData,
        headers,
      });
      
      return { data: result.data };
    } catch (error) {      
      console.error("Request error:", error.response || error);
      
      if (error.response?.status == 403) {
        authEvents.onForbidden();
      }
      if (error.response?.status == 401) {
        localStorage.clear();
        authEvents.onUnauthorized();
      }
      
      return {
        error: {
          status: error.response?.status,
          data: error.response?.data || error.message,
        },
      };
    }
  };

export default axiosBaseQuery;
