import mongoose from "mongoose"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Comment } from "../models/comment.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

})

const addComment = asyncHandler(async (req, res) => {
    const { content } = req.body
    const { videoId } = req.params

    if (!content) {
        throw new ApiError(400, "Required comment")
    }

    const owner = await User.findById(req.user?._id).select("-password -refreshToken -email -coverImage -watchHistory")

    const comment = await Comment.create({
        content,
        video: videoId,
        owner,
    })

    return res
        .status(200)
        .json(
            new ApiResponse(200, comment, "Comment added Successfully")
        )
})

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const { content } = req.body

    if (!content) {
        throw new ApiError(400, "Reuired comment")
    }

    const comment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content
            }
        },
        { new: true }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, comment, "Comment Updated Successfully")
        )
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    await Comment.findByIdAndDelete(commentId)

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Comment Deleted Successfully")
        )
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}
