import axiosPublic from "./axiosPublic";
import httpClient from "./httpClient";

const axiosBaseQuery =
  (
    { baseUrl, useHttpClient = false, navigate } = { baseUrl: "", useHttpClient: false }
  ) =>
  async ({ url, method, data, isFormData = false }) => {
    try {
      const client = useHttpClient ? httpClient : axiosPublic;

      let headers = {};
      if (isFormData) {
        headers["Content-Type"] = "multipart/form-data";
      } else {
        headers["Content-Type"] = "application/json";
      }

      const result = await client({
        url: baseUrl + url,
        method,
        data,
        headers,
      });

      return { data: result.data };
    } catch (error) {
      console.error("Error response:", error.response);
      
      if (error.response?.status == 403) {
        window.location.href = "/permission-denied-page";
      }

      if(error.response?.status == 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        navigate("/login");
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
