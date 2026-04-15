import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath, folder) => {
    try {
        if (!localFilePath) {
            return null;
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            folder: `${folder}`,
            resource_type: "auto"
        })

        fs.unlinkSync(localFilePath)

        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null
    }
}

export const deleteImageFromCloudinary = async (publicId) => {
    try {
        if (!publicId) {
            return null;
        }

        const response = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' })

        return response;
    } catch (error) {
        throw new ApiError(500, "Error while deleting the File")
    }
}

export const deleteVideoFromCloudinary = async (publicId) => {
    try {
        if (!publicId) {
            return null;
        }

        const response = await cloudinary.uploader.destroy(publicId, { resource_type: 'video' })

        return response;
    } catch (error) {
        throw new ApiError(500, "Error while deleting the File")
    }
}
