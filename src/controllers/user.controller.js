import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {

    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const { username, email, password, fullName } = req.body
    console.log(username, email, password, fullName)

    if (
        [username, email, password, fullName].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400,"All fields are requied")
    }

    const existedUser = await User.findOne({
        $or: [{username},{email}]
    })

    if (existedUser) {
        throw new ApiError(400, "User with email or gmail is already exist")
    }
    
    const avatarLocalPath = req.files?.avater[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path
    
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    const user = await User.create({
        username: username.toLowerCase(),
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        fullName
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "Somthing went wrong while registerind user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User is created Successfully")
    )
    
});

export {registerUser};