import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";

// Use your API directly — production ready
const API_BASE_URL = "https://api.dolexcdo.online/api";

// Make Axios send cookies (required for Laravel Sanctum)
axios.defaults.withCredentials = true;

// Set default base URL for Axios
axios.defaults.baseURL = API_BASE_URL;

// Optional: Intercept responses to handle errors globally
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Something went wrong");
    }
    return Promise.reject(error);
  }
);

// ✅ Configure Axios instance with the computed API base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Include credentials (cookies) in requests
});

// Function to handle login logic

export const loginUser = async (username, password) => {
  try {
    const response = await api.post("/login", { username, password });

    if (response.status === 200 && response.data.token) {
      return {
        success: true,
        message: "Login successful!",
        token: response.data.token,
        user: response.data.user,
      };
    } else {
      return { success: false, message: "Login failed! No token received." };
    }
  } catch (error) {
    console.error("Login error:", error.response || error);

    const errorMessage =
      error.response?.data?.message || // in case message is returned
      error.response?.data?.error || // handles { "error": "Invalid credentials" }
      "Login failed. Please try again.";

    toast.error(errorMessage, {
      style: {
        backgroundColor: "#ff4d4f", // bright red
        color: "white",
      },
      icon: "❌",

      autoClose: 5000,
    });
    return { success: false, message: errorMessage };
  }
};
