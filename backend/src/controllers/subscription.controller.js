import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"



const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    if(!isValidObjectId(channelId))
    {
        throw new ApiError(400,"Channel-ID is wrong")
    }

    const channel=await User.findById(channelId)

    if(!channel)
    {
        throw new ApiError(400,"No channel found with the given id")
    }

    const ChannelSubcribed=await Subscription.findOne(
        {
            subcriber:req.user?._id,
            channel:channelId
        }
    )
    
    if(ChannelSubcribed)
    {
        await Like.findByIdAndDelete(ChannelSubcribed?._id)
        return res.status(200).json(new ApiResponse(200,"Channel unsubscribed successfully"))
    }

    await Subscription.create({
        subcriber:req.user?._id,
        channel:channelId
    })
    return res.status(200).json(new ApiResponse(200,"Channel subscribed successfully"))

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  let { channelId } = req.params;

  channelId = new mongoose.Types.ObjectId(channelId);

  const channelSubscribers = await Subscription.aggregate([
    {
      $match: {
        channel: channelId,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriber",
        pipeline: [
          {
            $lookup: {
              from: "subscriptions",
              localField: "_id", //subscriber's id
              foreignField: "channel",
              as: "subscribedToSubscriber",
            },
          },
          {
            $addFields: {
              subscribedToSubscriber: {
                $cond: {
                  if: {
                    $in: [channelId, "$subscribedToSubscriber.subscriber"],
                  },
                  then: true,
                  else: false,
                },
              },
              subscribersCount: {
                $size: "$subscribedToSubscriber",
              },
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$subscriber",
        preserveNullAndEmptyArrays: true, // Keep the array empty if no subscribers
      },
    },
    {
      $project: {
        _id: 0,
        subscriber: {
          _id: 1,
          username: 1,
          fullName: 1,
          "avatar.url": 1,
          subscribedToSubscriber: 1,
          subscribersCount: 1,
        },
      },
    },
  ]);

  // Always return an empty array if no subscribers are found
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        channelSubscribers || [], // Ensure an empty array is returned
        "User Channel Subscribers fetched Successfully"
      )
    );
});

  

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!isValidObjectId(subscriberId)) {
      throw new ApiError(400, "Subscriber-ID is wrong");
  }

  const subscribedChannels = await Subscription.aggregate([
      {
          $match: {
              subscriber: new mongoose.Types.ObjectId(subscriberId)
          }
      },
      {
          $lookup: {
              from: "users",
              localField: "channel",
              foreignField: "_id",
              as: "subscribedChannel"
          }
      },
      {
          $unwind: "$subscribedChannel"
      },
      {
          $project: {
              _id: "$subscribedChannel._id",
              fullName: "$subscribedChannel.fullName",
              username: "$subscribedChannel.username",
              avatar: "$subscribedChannel.avatar"
          }
      }
  ]);

  if (subscribedChannels.length === 0) {
      return res.status(200).json(new ApiResponse(200, null, "No channels subscribed"));
  }

  return res.status(200).json(new ApiResponse(200, subscribedChannels, "Subscribed channels fetched successfully"));
});


export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}