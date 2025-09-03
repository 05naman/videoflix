import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../constants";

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Interceptor to add Authorization header
API.interceptors.request.use(
  async (config) => {
    // Cookies are automatically sent with withCredentials: true
    // No need to manually add Authorization header
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle token refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error?.response?.data?.error === "jwt expired" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        await refreshAccessToken();
        // Cookies are automatically updated by the backend
        // Just retry the original request
        return API(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Login function
export const login = async (formData) => {
  try {
    const { data } = await API.post("/users/login", formData);
    // Cookies are automatically set by the backend
    toast.success(data?.message);
    return data?.data?.user;
  } catch (error) {
    toast.error(error?.response?.data?.error);
    throw error?.response?.data?.error;
  }
};

// Logout function
export const logout = async () => {
  try {
    const { data } = await API.post("/users/logout");
    // Cookies are automatically cleared by the backend
    toast.success(data?.message);
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.error);
    throw error?.response?.data?.error;
  }
};

// Get current user function
export const getCurrentUser = async () => {
  try {
    const { data } = await API.get("/users/current-user");
    return data?.data?.user;
  } catch (error) {
    throw error?.response?.data?.error;
  }
};

// Register user function
export const registerUser = async (data) => {
  const formData = new FormData();
  if (!data.get("avatar")) {
    toast.error("Avatar is required");
    return;
  }
  formData.append("avatar", data.get("avatar"));
  if (data.get("coverImage")) {
    formData.append("coverImage", data.get("coverImage"));
  }
  formData.append("username", data.get("username"));
  formData.append("email", data.get("email"));
  formData.append("password", data.get("password"));
  formData.append("fullName", data.get("fullName"));
  try {
    const { data: responseData } = await API.post("/users/register", formData);
    toast.success(responseData?.message);
    return responseData?.data;
  } catch (error) {
    toast.error(error?.response?.data?.error);
    throw error?.response?.data?.error;
  }
};

// Change password function
export const changePassword = async (newPassData) => {
  try {
    const { data } = await API.post("/users/change-password", newPassData);
    toast.success(data?.message);
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.error);
    throw error?.response?.data?.error;
  }
};

// Refresh access token function
export const refreshAccessToken = async () => {
  try {
    const { data } = await API.post("/users/refresh-token");
    return data?.data;
  } catch (error) {
    throw error?.response?.data?.error;
  }
};