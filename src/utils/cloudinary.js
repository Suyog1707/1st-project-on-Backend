import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null;
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        fs.unlinkSync(localFilePath)

        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null
    }
}

export const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) {
            return null;
        }

        console.log(publicId);

        const response = await cloudinary.uploader.destroy(publicId,{resource_type: 'image'})

        return response;
    } catch (error) {
        throw new ApiError(500, "Error while deleting the File")
    }
}
