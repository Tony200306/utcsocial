import axios from "axios";

const getContentType = (data: any) => {
  if (data instanceof FormData) {
    return "multipart/form-data";
  }
  return "application/json";
};

const axiosClient = axios.create({
  baseURL: "https://ce89-118-71-136-130.ngrok-free.app/api",
  // baseURL: "http://localhost:5000/api",

  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', // Bỏ qua ngrok warning page
  }

});

axiosClient.interceptors.request.use(
  (config) => {
    config.headers["Content-Type"] = getContentType(config.data);
    config.headers["ngrok-skip-browser-warning"] = "true";

    // **Thêm JWT từ cookies vào Authorization header**
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      const jwtCookie = cookies.find(cookie => cookie.trim().startsWith('jwt='));

      if (jwtCookie) {
        const token = jwtCookie.split('=')[1];
        config.headers.Authorization = `Bearer ${token}`;
        console.log('[AxiosClient] Added JWT from cookie to Authorization header');
      }
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);
export default axiosClient;
