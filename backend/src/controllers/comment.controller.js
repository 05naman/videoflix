import mongoose,{isValidObjectId} from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {User} from "../models/user.model.js"
import {Video} from "../models/video.model.js"


const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const commentsAggregate = Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
            },
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "comment",
                as: "likes",
            },
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$likes",
                },
                owner: {
                    $first: "$owner",
                },
                isLiked: {
                    $cond: {
                        if: {$in: [req.user?._id, "$likes.likedBy"]},
                        then: true,
                        else: false
                    }
                }
            },
        },
        {
            $project: {
                content: 1,
                createdAt: 1,
                likesCount: 1,
                owner: {
                    username: 1,
                    fullName: 1,
                    "avatar.url": 1,
                },
                isLiked: 1
            },
        },
    ]);

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    };

    const comments = await Comment.aggregatePaginate(
        commentsAggregate,
        options
    );

    return res
        .status(200)
        .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});


const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {content}=req.body
    const { videoId } = req.params

    if(!content)
    {
        throw new ApiError(400,"Comment required")
    }

    if(!isValidObjectId(videoId))
    {
        throw new ApiError(404,"Video-Id not found")
    }
    
    const video = await Video.findById(videoId)

    if(!video)
    {
        throw new ApiError(404,"No video found by this Id")
    }

    const comment=await Comment.create({
        content,
        videoId,
        owner:req.user?._id
        })

     if(!comment)
     {
        throw new ApiError(500,"Something went worng while creating comment")
     }

    return res.status(200).json(new ApiResponse(200,comment,"Comment added successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {content} = req.body
    const {commentID} = req.params

    if(!content)
    {
        throw new ApiError(400,"Comment required")
    }

   if(!isValidObjectId(commentID))
   {
    throw new ApiError(400,"Something went worng while getting Comment-Id")
   }

   const comment=await Comment.findById(commentID)
    
   if(!comment)
   {
    throw new ApiError(400,"Comment not found")
   }

   if (comment?.owner.toString() !== req.user?._id.toString()) 
   {
    throw new ApiError(400, "You are not authorized to update someone else comment")
   }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentID,
        {
            $set: {
                content
            }
        },
        {new: true}

    )

    if(!updatedComment){
        throw new ApiError(400,"Comment cannot be updated")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated successfully"))
});


const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentID} = req.params

   
   if(!isValidObjectId(commentID))
   {
    throw new ApiError(400,"Something went worng while getting comment-Id")
   }

   const comment=await Comment.findById(commentID)
    
   if(!comment)
   {
    throw new ApiError(404,"Comment not found")
   }

   if (comment?.owner.toString() !== req.user?._id.toString()) 
   {
    throw new ApiError(400, "You are not authorized to update someone else comment")
   }
   
   const deletedComment=await Comment.findByIdAndDelete(commentID)

   if(!deletedComment)
   {
        throw new ApiError(400,"Comment cannot be deleted")
   }

    return res
    .status(200)
    .json(new ApiResponse(200,deletedComment, "Comment deleted successfully"))

})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
    }