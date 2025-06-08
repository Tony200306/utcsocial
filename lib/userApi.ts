import axios from "axios";

const getContentType = (data: any) => {
  if (data instanceof FormData) {
    return "multipart/form-data";
  }
  return "application/json";
};

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (config) => {
    config.headers["Content-Type"] = getContentType(config.data);

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

export default axiosClient;
