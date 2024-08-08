import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";

import {
  getChannelTweets,
  createTweet,
  updateTweet,
  deleteTweet,
  getAllTweets,
} from "../api/tweet.api";

export const useAllTweets = (authenticated) => {
  return useInfiniteQuery({
    queryKey: ["tweets"],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const response = await getAllTweets({ pageParam, authenticated });
        return response;
      } catch (error) {
        console.error("Error fetching all tweets:", error);
        return { docs: [], hasNextPage: false }; // Fallback structure
      }
    },
    getNextPageParam: (lastPage) => {
      if (lastPage?.hasNextPage) {
        return lastPage.nextPage;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};

export const useChannelTweets = (channelId) => {
  return useInfiniteQuery({
    queryKey: ["tweets", channelId],
    queryFn: async ({ pageParam = 1 }) => {
      if (!channelId) {
        return { docs: [], hasNextPage: false }; // Fallback for missing channelId
      }
      try {
        const response = await getChannelTweets({ pageParam, channelId });
        return response;
      } catch (error) {
        console.error("Error fetching channel tweets:", error);
        return { docs: [], hasNextPage: false }; // Fallback structure
      }
    },
    getNextPageParam: (lastPage) => {
      if (lastPage?.hasNextPage) {
        return lastPage.nextPage;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    enabled: !!channelId, // Only run the query if channelId is truthy
  });
};

export const useAddTweet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ tweet }) => {
      try {
        await createTweet({ content: tweet });
      } catch (error) {
        console.error("Error creating tweet:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tweets"],
      });
    },
  });
};

export const useEditTweet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ tweetId, tweet }) => {
      try {
        await updateTweet(tweetId, { content: tweet });
      } catch (error) {
        console.error("Error updating tweet:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tweets"],
      });
    },
  });
};

export const useDeleteTweet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tweetId) => {
      try {
        await deleteTweet(tweetId);
      } catch (error) {
        console.error("Error deleting tweet:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tweets"],
      });
    },
  });
};
