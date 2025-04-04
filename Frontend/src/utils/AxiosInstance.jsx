import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setLoading, setUser, setToken } from "@/redux/authslice";
import store from "@/redux/store.js"; // Import the Redux store

const axiosInstance = axios.create({
  baseURL: "https://hirehub-backend-o059.onrender.com/api/v1", // Update with your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});
axiosInstance.interceptors.request.use(
  (config) => {
    const { auth } = store.getState();
    const token = auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
