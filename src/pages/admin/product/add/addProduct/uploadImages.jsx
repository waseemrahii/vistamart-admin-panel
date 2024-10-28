import { toast } from "react-toastify";
import {
	deleteUploadedImages,
	getProductUploadUrl,
	uploadImageToS3,
} from "../../../../../utils/helpers";

async function uploadImage(uploadConfig, file) {
	try {
		await uploadImageToS3(uploadConfig.url, file);
		return uploadConfig.key; // Return the key if successful
	} catch (error) {
		console.error(`Failed to upload ${file.name}:`, error);
		return null; // Return null on failure
	}
}

const uploadProductImagesToS3 = async (thumbnail, images, maxRetries = 3) => {
	let thumbnailKey = null; // Key for uploaded thumbnail
	const imageKeys = []; // Keys for successfully uploaded additional images
	const imageUploadConfigs = [];
	const retryDelays = [500, 1000, 2000]; // Delay increments for retries

	// Step 1: Prepare upload configurations for thumbnail and additional images
	if (thumbnail && thumbnail.file) {
		const thumbnailConfig = await getProductUploadUrl(thumbnail.file.type);
		imageUploadConfigs.push({
			type: "thumbnail",
			config: thumbnailConfig,
			file: thumbnail.file,
		});
	}

	images.forEach((img) => {
		if (img.file) {
			const imageConfig = getProductUploadUrl(img.file.type);
			imageUploadConfigs.push({
				type: "image",
				config: imageConfig,
				file: img.file,
			});
		}
	});

	const uploadWithRetry = async (config, file, retries = 0) => {
		try {
			return await uploadImage(config, file); // Attempt upload
		} catch (error) {
			if (retries < maxRetries) {
				console.warn(
					`Retrying upload for ${file.name}, attempt ${retries + 1}`
				);
				await new Promise((resolve) =>
					setTimeout(resolve, retryDelays[retries])
				); // Wait before retry
				return uploadWithRetry(config, file, retries + 1); // Retry with increased count
			}
			console.error(
				`Failed to upload ${file.name} after ${maxRetries} attempts.`
			);
			return null; // Return null if retries exhausted
		}
	};

	try {
		// Step 2: Execute uploads with concurrency control
		const uploadResults = await Promise.all(
			imageUploadConfigs.map(async ({ type, config, file }) => {
				const key = await uploadWithRetry(config, file);
				if (key) {
					type === "thumbnail" ? (thumbnailKey = key) : imageKeys.push(key);
				}
				return { key, type };
			})
		);

		console.log({ uploadResults });

		// Step 3: Verify successful uploads
		const failedUploads = uploadResults.filter((result) => result.key === null);

		if (failedUploads.length) {
			// Delete successfully uploaded images if any upload failed
			const successfulKeys = uploadResults
				.filter(({ key }) => key)
				.map(({ key }) => key);
			await deleteUploadedImages(successfulKeys);
			toast.error("Image upload failed. Deleted previously uploaded images.");
			return null;
		}

		// Step 4: Confirm success and return image keys
		console.log("Successfully uploaded images:", { thumbnailKey, imageKeys });
		return { thumbnailKey, imageKeys };
	} catch (error) {
		console.error("Unexpected error during image upload:", error);
		await deleteUploadedImages([thumbnailKey, ...imageKeys]); // Cleanup on unexpected error
		toast.error("An error occurred. Deleted previously uploaded images.");
		return null;
	}
};

export default uploadProductImagesToS3;
