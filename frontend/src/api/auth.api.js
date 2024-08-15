import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../constants";

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    // 'Authorization': `Bearer ${YOUR_TOKEN}`,
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  responseType: 'json',
  validateStatus: function (status) {
    return status >= 200 && status < 500;
  },
});


// Interceptor to add Authorization header
API.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
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
        console.log("this refresh access token called");
        const { accessToken } = await refreshAccessToken();
        localStorage.setItem('accessToken', accessToken);
        API.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
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
    localStorage.setItem('accessToken', data.data.accessToken);
    API.defaults.headers.common["Authorization"] = `Bearer ${data.data.accessToken}`;
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
    localStorage.removeItem('accessToken');
    delete API.defaults.headers.common["Authorization"];
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
    console.log(data);
    
    return data?.data?.user;
  } catch (error) {
    throw error?.response?.data?.error;
  }
};

// Register user function
// Register user function
export const registerUser = async (formData) => {
  const data = new FormData();

  // Check for required fields
  if (formData.get("avatar")) {
    data.append("avatar", formData.get("avatar"));
  } else {
    toast.error("Avatar is required");
    return;
  }

  if (formData.get("coverImage")) {
    data.append("coverImage", formData.get("coverImage"));
  }

  data.append("username", formData.get("username"));
  data.append("email", formData.get("email"));
  data.append("password", formData.get("password"));
  data.append("fullName", formData.get("fullName"));

  try {
    const response = await API.post("/users/register", data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    toast.success(response.data?.message || 'Registration successful');
    return response.data?.data;
  } catch (error) {
    console.error('Register user error:', error);

    if (error.response?.status === 400) {
      // Handle bad request specifically
      toast.error(error.response?.data?.error || 'Invalid input');
    } else {
      toast.error(error.response?.data?.error || 'Registration failed');
    }

    throw error.response?.data?.error || 'Registration failed';
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