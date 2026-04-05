import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
import { deleteImageFromCloudinary, deleteVideoFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body

    if ([title, description].some((field) => field?.trim() === "")) {
        throw new ApiError(402, "All fields are Required")
    }

    const videoLocalPath = req.files?.video[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path

    const videoFile = await uploadOnCloudinary(videoLocalPath, "videos/video")
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath, "videos/thumbnail")

    if (!videoFile || !thumbnail) {
        throw new ApiError(500, "Error while uploading video on cloudinary")
    }

    const owner = await User.findById(req.user?._id).select("-password -refreshToken -email -coverImage -watchHistory")

    const video = await Video.create({
        title,
        description,
        videoFile: {
            url: videoFile?.url,
            secure_url: videoFile?.secure_url,
            public_id: videoFile?.public_id
        },
        duration: videoFile?.duration,
        thumbnail: {
            url: thumbnail?.url,
            secure_url: thumbnail?.secure_url,
            public_id: thumbnail?.public_id
        },
        owner
    })

    return res
        .status(200)
        .json(
            new ApiResponse(200, video, "Video is uploaded successfully")
        )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const video = await Video.findById(videoId)

    if (video === null) {
        throw new ApiError(404, "Video not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, video, "Video fetched successfully")
        )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
