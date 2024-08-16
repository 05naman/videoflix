import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../constants";

// Create an instance of axios with default settings
const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Helper function to handle errors
const handleError = (error) => {
  console.error("API Error:", error.response ? error.response.data : error.message); // Log detailed error
  const errorMessage = error?.response?.data?.error || "An unexpected error occurred";
  toast.error(errorMessage);
  throw new Error(errorMessage);
};

// Toggle subscription for a channel
export const toggleSubscribe = async (channelId) => {
  console.log(`Toggling subscription for channelId: ${channelId}`); // Debug log
  try {
    const response = await API.post(`/subscription/c/${channelId}`);
    console.log("Response Data:", response?.data); // Debug log
    return response?.data?.data || {}; // Return data or empty object if data is undefined
  } catch (error) {
    handleError(error);
  }
};

// Get subscribed channels for a subscriber
export const getSubscribedChannels = async (subscriberId) => {
  console.log(`Fetching subscribed channels for subscriberId: ${subscriberId}`); // Debug log
  try {
    const response = await API.get(`/subscription/u/${subscriberId}`);
    console.log("Response Data:", response?.data); // Debug log
    return response?.data?.data || []; // Return data or empty array if data is undefined
  } catch (error) {
    handleError(error);
  }
};

// Get channel subscribers
export const getChannelSubscribers = async (channelId) => {
  console.log(`Fetching channel subscribers for channelId: ${channelId}`); // Debug log
  try {
    const response = await API.get(`/subscription/c/${channelId}`);
    console.log("Response Data:", response?.data); // Debug log
    return response?.data?.data || []; // Return data or empty array if data is undefined
  } catch (error) {
    handleError(error);
  }
};
