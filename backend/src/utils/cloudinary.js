import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import { ApiError } from "./ApiError.js";
import dotenv from "dotenv"
dotenv.config();

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (localFilePath) =>{
    try {
        if (!localFilePath) return null

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        if (response) fs.unlinkSync(localFilePath);
        return response;
        
    } catch (error) {
        // fs.unlinkSync(localFilePath) 
        return null
    }
}

const deleteFromCloudinary = async(localFilePath) =>{
    try {
        
        if (!localFilePath){
            throw new ApiError(400, "File path missing")
        }

        const response = await cloudinary.uploader.destroy(localFilePath)
        console.log("File deleted from cloudinary successfully")
        return response
    } catch (error) {
        throw new ApiError(500, error?.message || "Error while deleting file")
    }
}



export {uploadOnCloudinary, deleteFromCloudinary}