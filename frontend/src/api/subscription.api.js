import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../constants";

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Helper function to handle errors
const handleError = (error) => {
  console.log(error);
  const errorMessage = error?.response?.data?.error || "An unexpected error occurred";
  toast.error(errorMessage);
  throw new Error(errorMessage);
};

export const toggleSubscribe = async (channelId) => {
  try {
    const { data } = await API.post(`/subscription/c/${channelId}`);
    return data?.data || {}; // Return an empty object if data is undefined
  } catch (error) {
    handleError(error);
  }
};

export const getSubscribedChannels = async (subscriberId) => {
  try {
    const { data } = await API.get(`/subscription/u/${subscriberId}`);
    return data?.data || []; // Return an empty array if data is undefined
  } catch (error) {
    handleError(error);
  }
};

export const getChannelSubscribers = async (channelId) => {
  try {
    const { data } = await API.get(`/subscription/c/${channelId}`);
    return data?.data || []; // Return an empty array if data is undefined
  } catch (error) {
    handleError(error);
  }
};
