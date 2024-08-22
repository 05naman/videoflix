import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User} from "../models/user.model.js"
import {Video} from "../models/video.model.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist

    if(!name && !description)
    {
        throw new ApiError(400, "Name or description is required")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner:req.user?._id
    })

    if(!playlist)
    {
        throw new ApiError(404, "Something went wrong while creating the playlist")
    }

    return res.status(201).json(new ApiResponse(200, playlist, "Playlist created successfully"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(400, "Something went wrong while getting user ID");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "No user existed by this Id");
    }

    const playlists = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
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
            $addFields: {
                totalVideos: {
                    $size: "$videos",
                },
                totalViews: {
                    $sum: "$videos.views",
                },
                owner: {
                    $first: "$owner",
                },
            },
        },
        {
            $project: {
                name: 1,
                description: 1,
                createdAt: 1,
                updatedAt: 1,
                totalVideos: 1,
                totalViews: 1,
                videos: {
                    _id: 1,
                    "videoFile.url": 1,
                    "thumbnail.url": 1,
                    title: 1,
                    description: 1,
                    duration: 1,
                    createdAt: 1,
                    views: 1,
                },
                owner: {
                    username: 1,
                    fullName: 1,
                    avatar: 1,
                },
            },
        },
    ]);

    if (!playlists) {
        throw new ApiError(500, "Something went wrong while getting user playlist");
    }

    if (playlists.length === 0) {  // Changed playlists.length() to playlists.length
        return res.status(200).json(new ApiResponse(200, "User has no playlists"));
    }

    return res.status(200).json(new ApiResponse(200, playlists, "Playlists fetched successfully"));
});


const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid PlaylistId");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    const playlistVideos = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
            }
        },
        {
            $match: {
                "videos.isPublished": true
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
            }
        },
        {
            $addFields: {
                totalVideos: {
                    $size: "$videos"
                },
                totalViews: {
                    $sum: "$videos.views"
                },
                owner: {
                    $first: "$owner"
                }
            }
        },
        {
            $project: {
                name: 1,
                description: 1,
                createdAt: 1,
                updatedAt: 1,
                totalVideos: 1,
                totalViews: 1,
                videos: {
                    _id: 1,
                    "videoFile.url": 1,
                    "thumbnail.url": 1,
                    title: 1,
                    description: 1,
                    duration: 1,
                    createdAt: 1,
                    views: 1
                },
                owner: {
                    username: 1,
                    fullName: 1,
                    avatar: 1
                }
            }
        }
        
    ]);

    return res.status(200).json(new ApiResponse(200, playlistVideos[0], "playlist fetched successfully"));
});


const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if(!isValidObjectId(playlistId))
    {
        throw new ApiError(404,"Playlist-Id not found")
    }

    if(!isValidObjectId(videoId))
    {
        throw new ApiError(404,"Video-Id not found")
    }

    const playlist = await Playlist.findById(playlistId)
    const video = await Video.findById(videoId)

    if(!playlist)
    {
        throw new ApiError(404,"No playlist found by this Id")
    }

    if(!video)
    {
        throw new ApiError(404,"No video found by this Id")
    }

    if(playlist.owner.toString() !== req.user?._id.toString())
    {
        throw new ApiError(400,"Playlist owner is only allowed to do changes")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $addToSet:{
                videos : videoId
            }
        },
        {
            new : true
        }
    )

    if(!updatedPlaylist)
    {
        throw new ApiError(400,"Something went wrong while updating the playlist")
    }

    return res.status(200).json(200,updatedPlaylist,"Playlist updated successfully")
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    if(!isValidObjectId(playlistId))
    {
        throw new ApiError(404,"Playlist-Id not found")
    }

    if(!isValidObjectId(videoId))
    {
        throw new ApiError(404,"Video-Id not found")
    }

    const playlist = await Playlist.findById(playlistId)
    const video = await Video.findById(videoId)

    if(!playlist)
    {
        throw new ApiError(404,"No playlist found by this Id")
    }

    if(!video)
    {
        throw new ApiError(404,"No video found by this Id")
    }

    if(playlist.owner.toString() && video.owner.toString() !== req.user?._id.toString())
    {
        throw new ApiError(400,"Playlist owner is only allowed to do changes")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull:{
                videos : videoId
            }
        },
        {
            new : true
        }
    )

    if(!updatedPlaylist)
    {
        throw new ApiError(400,"Something went wrong while removing the video from the playlist")
    }

    return res.status(200).json(200,updatedPlaylist,"Removed video from playlist successfully")
})


const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!isValidObjectId(playlistId))
    {
        throw new ApiError(404,"Playlist-Id not found")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist)
    {
        throw new ApiError(303,"Playlist not found")
    }
    
    const deletePlaylist = await Playlist.findByIdAndDelete(playlistId)

    if(!deletePlaylist)
    {
        throw new ApiError(500, "Something went wrong while deleting the playlist")  
    }

    return res.status(200).json(200,{},"Playlist deleted successfully")
    
})


const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if(!isValidObjectId(playlistId))
    {
        throw new ApiError(404,"Playlist-Id not found")
    }

    if(!name && !description)
    {
        throw new ApiError(404,"Name or description required")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist)
    {
        throw new ApiError(404,"No playlist found by this Id")
    }

    if(playlist.owner.toString() !== req.user?._id.toString())
    {
        throw new ApiError(400,"Playlist owner is only allowed to do changes")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set:{
                name,
                description
            }
        },
        {
            new : true
        }
    )

    if(!updatedPlaylist)
    {
        throw new ApiError(400,"Something went wrong while updating the playlist")
    }

    return res.status(200).json(200,updatedPlaylist,"Playlist updated successfully")
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
