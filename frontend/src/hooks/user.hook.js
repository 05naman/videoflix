import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getWatchHistory,
  getUserChannelProfile,
  updateUserCoverImage,
  updateAccountDetails,
  updateChannelInfo,
  clearWatchHistory,
  updateUserAvatar,
} from "../api/user.api";

export const useWatchHistory = () => {
  return useQuery({
    queryKey: ["watchHistory"],
    queryFn: () => getWatchHistory(),
    refetchOnWindowFocus: true,
  });
};

export const useUserChannelInfo = (username) => {
  return useQuery({
    queryKey: ["channelInfo", username],
    queryFn: () => getUserChannelProfile(username),
    refetchOnWindowFocus: true,
  });
};

export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => updateUserAvatar(data),
    onSuccess: () => {
      queryClient.invalidateQueries("channelInfo");
    },
    onError: (error) => {
      console.error("Error updating avatar:", error);
      // You could show a user-friendly message here
    },
    onSettled: () => {
      // This will run regardless of whether the mutation was successful or errored
      queryClient.invalidateQueries("channelInfo");
    },
  });
};

export const useUpdateCoverImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => updateUserCoverImage(data),
    onSuccess: () => {
      queryClient.invalidateQueries("channelInfo");
    },
  });
};

export const useUpdateAccountDetails = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => updateAccountDetails(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channelInfo"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

export const useUpdateChannelInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => updateChannelInfo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["channelInfo"] });
    },
  });
};

export const useClearWatchHistory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => clearWatchHistory(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchHistory"] });
    },
  });
};