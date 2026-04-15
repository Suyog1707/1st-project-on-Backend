import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body

    if (!content) {
        throw new ApiError(400, "Required Tweet")
    }

    const owner = await User.findById(req.user?._id).select("-password -refreshToken -email -coverImage -watchHistory")

    const tweet = await Tweet.create({
        owner,
        content
    })

    return res
        .status(200)
        .json(
            new ApiResponse(200, tweet, "tweet was created Successfully")
        )
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
})

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const { content } = req.body

    const tweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content
            }
        },
        { new: true }
    )

    if (!tweet) {
        throw new ApiError(404, "Tweet not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, tweet, "Tweet updated successfully")
        )
})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params

    const tweet = await Tweet.findById(tweetId)

    if (!tweet) {
        throw new ApiError(404, "Tweet not found")
    }

    await Tweet.findByIdAndDelete(tweetId)

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Tweet is deleted")
        )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
