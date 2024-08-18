import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../constants";

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Toggle like for video
export const toggleVideoLike = async (videoId) => {
  try {
    const { data } = await API.post(`/like/toggle/v/${videoId}`);
    return data?.data || {};
  } catch (error) {
    const errorMessage = error?.response?.data?.error || "An unexpected error occurred.";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

// Toggle like for comment
export const toggleCommentLike = async (commentId) => {
  try {
    const { data } = await API.post(`/like/toggle/c/${commentId}`);
    return data?.data || {};
  } catch (error) {
    const errorMessage = error?.response?.data?.error || "An unexpected error occurred.";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

// Toggle like for tweet
export const toggleTweetLike = async (tweetId) => {
  try {
    const { data } = await API.post(`/like/toggle/t/${tweetId}`);
    return data?.data || {};
  } catch (error) {
    const errorMessage = error?.response?.data?.error || "An unexpected error occurred.";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

// Get liked videos
export const getLikedVideos = async () => {
  try {
    const { data } = await API.get("/like/videos");    
    return data?.data || [];
  } catch (error) {
    const errorMessage = error?.response?.data?.error || "An unexpected error occurred.";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};
