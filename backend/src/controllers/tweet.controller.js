import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content}=req.body

    if(!content)
    {
        throw new ApiError(400,"Tweet required")
    }

    const tweet=await Tweet.create({
        content,
        owner:req.user?._id
        })

     if(!tweet)
     {
        throw new ApiError(500,"Something went worng while creating Tweet")
     }

    return res.status(200).json(new ApiResponse(200,tweet,"Tweet created"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    
    const {userID}=req.params

    if(!userID)
    {
        throw new ApiError(400,"User details are required")
    }

    const user = await User.findById(userID)

    if(!user)
    {
        throw new ApiError(400,"User not found")
    }

    const userTweets=await Tweet.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(userID)
            }
        },
        {
            $project:{
                content:1,
                User:{
                    fullname:1,
                    avatar:1,
                    email:1,
                    username:1
                }
            }
        }
    ])
    if(!userTweets)
    {
        throw new ApiError(400,"No tweets of the user existed")
    }


    return res.status(200).json(new ApiResponse(200,userTweets,"User Tweets"))

})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {content} = req.body
    const {tweetID} = req.params

    if(!content)
    {
        throw new ApiError(400,"Tweet required")
    }

   if(!isValidObjectId(tweetID))
   {
    throw new ApiError(400,"Something went worng while getting Tweet-Id")
   }

   const tweet=await Tweet.findById(tweetID)
    
   if(!tweet)
   {
    throw new ApiError(400,"Tweet not found")
   }

   if (tweet?.owner.toString() !== req.user?._id.toString()) 
   {
    throw new ApiError(400, "You are not authorized to update someone else Tweet")
   }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetID,
        {
            $set: {
                content
            }
        },
        {new: true}

    )

    if(!updatedTweet){
        throw new ApiError(400,"Tweet cannot be updated")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"))
});


const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetID} = req.params

   
   if(!isValidObjectId(tweetID))
   {
    throw new ApiError(400,"Something went worng while getting Tweet-Id")
   }

   const tweet=await Tweet.findById(tweetID)
    
   if(!tweet)
   {
    throw new ApiError(404,"Tweet not found")
   }

   if (tweet?.owner.toString() !== req.user?._id.toString()) 
   {
    throw new ApiError(400, "You are not authorized to update someone else Tweet")
   }
   
   const deletedTweet=await Tweet.findByIdAndDelete(tweetID)

   if(!deletedTweet){
        throw new ApiError(400,"Tweet cannot be deleted")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,deletedTweet, "Tweet deleted successfully"))

})
const getAllTweets = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const isGuest = req.query.guest === "true";
  
    const aggregationPipeline = [
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "ownerDetails",
          pipeline: [
            {
              $project: {
                username: 1,
                "avatar.url": 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "tweet",
          as: "likeDetails",
          pipeline: [
            {
              $project: {
                likedBy: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          likesCount: {
            $size: "$likeDetails",
          },
          ownerDetails: {
            $first: "$ownerDetails",
          },
          isLiked: {
            $cond: {
              if: isGuest,
              then: false,
              else: {
                $cond: {
                  if: { $in: [req.user?._id, "$likeDetails.likedBy"] },
                  then: true,
                  else: false,
                },
              },
            },
          },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          content: 1,
          ownerDetails: 1,
          likesCount: 1,
          createdAt: 1,
          isLiked: 1,
        },
      },
    ];
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      };
    
      const tweets = await Tweet.aggregatePaginate(
        Tweet.aggregate(aggregationPipeline),
        options
      );
    
      return res
        .status(200)
        .json(new ApiResponse(200, tweets, "Tweets fetched successfully"));
    });

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet,
    getAllTweets
}