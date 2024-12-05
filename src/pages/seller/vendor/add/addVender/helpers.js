import axios from "axios";
import { getAuthData } from "../../../../../utils/authHelper";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// // Function to get a pre-signed upload URL
// export const getUploadUrl = async (type, folder) => {
// 	try {
// 		const query = {
// 			fileType: type.split("/")[1],
// 			folder,
// 		};
// 		const response = await axios.get(`${BASE_URL}/api/v1/image/upload`, {
// 			params: query,
// 		});

// 		return response.data; // Contains the URL and the key for S3 storage
// 	} catch (error) {
// 		console.error("Error fetching upload URL: ", error);
// 		throw new Error("Failed to get upload URL");
// 	}
// };


export const getProductUploadUrl = async (type, folder) => {
     console.log("file ", type)
     console.log("folder to uplaod", folder)
	try {
        const query = {
            fileType: type.split("/")[1],
            folder, // Include the folder in the query
        };

        const { token } = getAuthData();

        const response = await axios.get(
            `${BASE_URL}/api/v1/image/upload/`,
            {
                params: query,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data; // Contains the URL and the key for S3 storage
    } catch (error) {
        console.error("Error fetching upload URL: ", error);
        throw new Error("Failed to get upload URL");
    }
};

// // Function to upload an image to S3
// export const uploadImageToS3 = async (uploadUrl, file) => {
// 	try { 
// 		console.log("upload Url=====", uploadUrl)
// 		console.log("upload file=====", file)
// 		await axios.put(uploadUrl, file, {
// 			headers: {
// 				"Content-Type": file.type,
// 			},
// 		});

// 	} catch (error) {
// 		console.error("Error uploading image", error);
// 		throw new Error("Failed to upload image");
// 	}
// };

export const deleteUploadedImages = async (keys) => {
	try {
		await axios.delete(`${BASE_URL}/api/v1/image/delete-images`, {
			data: { keys },
		});
	} catch (error) {
		console.error("Error deleting images", error);
		throw new Error("Failed to delete images");
	}
};

export const formatPrice = (value) => {
	return Number(value).toLocaleString("en-PK", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
};




// Function to get a pre-signed upload URL
export const getUploadUrl = async (type, folder) => {
    try {
        const query = {
            fileType: type.split("/")[1],
            folder,
        };

        // Make the GET request to fetch the upload URL from your backend
        const response = await axios.get(`${BASE_URL}/api/v1/image/upload`, { params: query });

        // Log the entire response to check if we have the correct data
        console.log("API Response for Upload URL:", response.data);

        if (!response.data.uploadUrl || !response.data.baseUrl) {
            throw new Error("Failed to get valid upload URL or baseUrl from the API.");
        }

        // Return the config with the URL and key for S3 storage
        return response.data;
    } catch (error) {
        console.error("Error fetching upload URL:", error);
        throw new Error("Failed to get upload URL");
    }
};

// Function to upload an image to S3
export const uploadImageToS3 = async (uploadConfig, file) => {
    try {
        console.log("Upload URL from config:", uploadConfig.uploadUrl);  // Log the upload URL
        console.log("File to upload:", file);

        // Check if uploadUrl is available in the config
        if (!uploadConfig.uploadUrl) {
            throw new Error('Missing upload URL in the configuration');
        }

        // Perform the actual upload using PUT request
        const response = await axios.put(uploadConfig.uploadUrl, file, {
            headers: {
                "Content-Type": file.type,  // Ensure file's MIME type is being passed correctly
            },
        });

        // Log the successful response from S3
        console.log("File uploaded successfully:", response);

        // Return the response if successful
        return response;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw new Error("Failed to upload image");
    }
};

