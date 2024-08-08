import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Video} from "../models/video.model.js"
import {Comment} from "../models/comment.model.js"
import {Tweet} from "../models/tweet.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video


    if(!isValidObjectId(videoId))
    {
        throw new ApiError(400,"Video-ID is wrong")
    }

    const video=await Video.findById(videoId)

    if(!video)
    {
        throw new ApiError(400,"No video found with the given id")
    }

    const likedVideo=await Like.findOne(
        {
            video:videoId,
            likedBy:req.user?._id
        }
    )
    
    if(likedVideo)
    {
        await Like.findByIdAndDelete(likedVideo?._id)
        return res.status(200).json(new ApiResponse(200,"Video unliked successfully"))
    }

    await Like.create({
        video:videoId,
        likedBy:req.user?._id
    })
    return res.status(200).json(new ApiResponse(200,"Video liked successfully"))

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if(!isValidObjectId(commentId))
    {
        throw new ApiError(400,"Comment-ID is wrong")
    }

    const comment=await Comment.findById(commentId)

    if(!comment)
    {
        throw new ApiError(400,"No comment found with the given id")
    }

    const likedComment= await Like.findOne({
        comment:commentId,
        likedBy:req.user?._id
    })
 
     
    if(likedComment)
    {
        await Like.findByIdAndDelete(likedComment?._id)
        return res.status(200).json(new ApiResponse(200,"Comment unliked successfully"))
    }

    await Like.create({
        comment:commentId,
        likedBy:req.user?._id
    })
    return res.status(200).json(new ApiResponse(200,"Comment liked successfully"))

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if(!isValidObjectId(tweetId))
    {
        throw new ApiError(400,"Tweet-ID is wrong")
    }

    const tweet=await Tweet.findById(tweetId)

    if(!tweet)
    {
        throw new ApiError(400,"No tweet found with the given id")
    }

    const likedTweet=await Like.findOne(
        {
            content:tweetId,
            likedBy:req.user?._id
        }
    )
    
    if(likedTweet)
    {
        await Like.findByIdAndDelete(likedTweet?._id)
        return res.status(200).json(new ApiResponse(200,"Tweet unliked successfully"))
    }

    await Like.create({
        content:tweetId,
        likedBy:req.user?._id
    })
    return res.status(200).json(new ApiResponse(200,"Tweet liked successfully"))

})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const likedVideos=await Like.aggregate([
        {
            $match:{
                likedBy:new mongoose.Types.ObjectId(req.user?._id),
                video:{$exists:true}
            }
        },
        {
            $lookup:{
                from : "video",
                localField:"video",
                foreignField:"_id",
                as:"LikedVideos",
                pipeline:[
                    {
                        $lookup:
                        {
                           from:"user",
                           localField:"owner",
                           foreignField:"_id",
                           as:"UserDetails"
                        }
                    }
                ]

            }

        },
        {
            $project:{

                likedVideos:{
                    title:1,
                    description:1,
                    duration:1,
                    views:1,
                   "video.url":1,
                   "thumbNail.url":1,
                   userDetails:{
                    fullNsme:1,
                    username:1,
                    email:1,
                    avatar:1

                   }
                }
            }
        }

    ])

    if(likedVideos.length === 0)
    {
        return res.status(404).json(new ApiResponse(404,null,"No liked video found for the user"))
    }

    return res.status(200).json(new ApiResponse(200,likedVideos,"Liked Videos fetched successfully"))

})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}


