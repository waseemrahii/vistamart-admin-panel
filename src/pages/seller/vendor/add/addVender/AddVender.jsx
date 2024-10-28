import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { FiUserPlus, FiInfo, FiImage, FiMail } from "react-icons/fi";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { createVendor } from "../../../../../redux/slices/seller/vendorSlice";
import FormSection from "../../../../../components/FormInput/FormSection";
import FormInput from "../../../../../components/FormInput/FormInput";
import PreviewImage from "../../../../../components/FormInput/PreviewImage";
import FileUpload from "../../../../../components/FormInput/FileUpload";
import FormTextArea from "../../../../../components/FormInput/FormTextArea";
import {
	deleteUploadedImages,
	getUploadUrl,
	uploadImageToS3,
} from "../../../../../utils/helpers";

const AddVendorForm = () => {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		phoneNumber: "",
		email: "",
		password: "",
		shopName: "",
		address: "",
		vendorImage: null,
		logo: null,
		banner: null,
	});

	const [logoPrview, setLogoPreview] = useState([]);
	const [bannerPreview, setBannerPreview] = useState([]);
	const [vendorPreview, setVendorPreview] = useState([]);
	const dispatch = useDispatch();

	async function uploadImage(uploadConfig, file) {
		try {
			await uploadImageToS3(uploadConfig.url, file);
			return uploadConfig.key; // Return the key if successful
		} catch (error) {
			console.error(`Failed to upload ${file.name}:`, error);
			return null; // Return null on failure
		}
	}

	const handleSubmit = async (event) => {
		event.preventDefault();

		const uploadedKeys = []; // Store successfully uploaded image keys

		// Extract files or use default values
		const logoFile = formData.logo || null;
		const bannerFile = formData.banner || null;
		const vendorFile = formData.vendorImage || null;

		// Step 1: Get upload URLs for the three images
		const [logoUploadConfig, bannerUploadConfig, vendorUploadConfig] =
			await Promise.all([
				getUploadUrl(logoFile.type, "vendors"),
				getUploadUrl(bannerFile.type, "vendors"),
				getUploadUrl(vendorFile.type, "vendors"),
			]);

		// Step 2: Upload images to S3 using the uploadImage helper function
		uploadedKeys.push(await uploadImage(logoUploadConfig, logoFile));
		uploadedKeys.push(await uploadImage(bannerUploadConfig, bannerFile));
		uploadedKeys.push(await uploadImage(vendorUploadConfig, vendorFile));

		// Step 3: Check if any image failed to upload
		const successfulUploads = uploadedKeys.filter((key) => key !== null);

		if (successfulUploads.length < 3) {
			// If not all images were uploaded, delete the successfully uploaded ones
			await deleteUploadedImages(successfulUploads);
			toast.error("Image upload failed, deleted previously uploaded images.");
			return;
		}

		try {
			const finalData = {
				...formData,
				logo: successfulUploads[0],
				banner: successfulUploads[1],
				vendorImage: successfulUploads[2],
			};

			console.log(finalData);

			const actionResult = await dispatch(createVendor(finalData));

			if (createVendor.fulfilled.match(actionResult)) {
				toast.success("Vendor added successfully!");
				setFormData({
					firstName: "",
					lastName: "",
					phoneNumber: "",
					email: "",
					password: "",
					shopName: "",
					address: "",
					vendorImage: null,
					logo: null,
					banner: null,
				});
				setImagePreview(null); // Reset image preview
				event.target.reset(); // Reset form fields
			} else {
				throw new Error(actionResult.error.message || "Failed to add vendor!");
			}
		} catch (error) {
			console.error("Error adding vendor:", error);
			toast.error(error.message || "Failed to add vendor!");
		}
	};

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		const name = e.target.name;
		if (!file) return;

		// Dynamically set preview state
		const previewMap = {
			logo: setLogoPreview,
			banner: setBannerPreview,
			vendorImage: setVendorPreview,
		};

		const setPreview = previewMap[name];
		if (setPreview) {
			const objectUrl = URL.createObjectURL(file);
			setPreview(objectUrl); // Set preview dynamically
		}

		// Store file in formData
		setFormData((prevData) => ({
			...prevData,
			[name]: file,
		}));
	};

	return (
		<div className="content container-fluid main-card ltr snipcss-B2K3K">
			<div className="mb-4">
				<h2 className="h1 mb-0 text-capitalize text-[1rem] font-semibold d-flex align-items-center gap-2">
					<FiUserPlus className="mb-1" /> Add new Vendor
				</h2>
			</div>
			<form
				className="user"
				onSubmit={handleSubmit}
				encType="multipart/form-data"
				id="add-vendor-form"
			>
				<FormSection
					icon={<FiInfo className="mb-1" />}
					title="Vendor information"
				>
					<div className="row align-items-center p-4">
						<div className="col-lg-6 mb-4 mb-lg-0">
							<FormInput
								label="First name"
								name="firstName"
								type="text"
								placeholder="Ex: John"
								value={formData.firstName}
								onChange={handleInputChange}
								required
							/>
							<FormInput
								label="Last name"
								name="lastName"
								type="text"
								placeholder="Ex: Doe"
								value={formData.lastName}
								onChange={handleInputChange}
								required
							/>
							<div className="form-group">
								<label
									htmlFor="exampleInputPhone"
									className="title-color d-flex gap-1 align-items-center"
								>
									Phone
								</label>
								<PhoneInput
									inputProps={{
										name: "phoneNumber",
										required: true,
										autoFocus: false,
										placeholder: "Enter phone number",
										autoComplete: "off",
									}}
									country={"us"}
									value={formData.phoneNumber}
									onChange={(value) =>
										handleInputChange({
											target: { name: "phoneNumber", value },
										})
									}
								/>
							</div>
						</div>
						<div className="col-lg-6 ">
							<PreviewImage
								image={vendorPreview} // Use imagePreview for preview
								altText="Vendor image"
								style={{ width: "200px" }}
							/>
							<FileUpload
								name="vendorImage"
								label="Vendor Image (Ratio 1:1)"
								accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
								onChange={handleImageChange}
							/>
						</div>
					</div>
				</FormSection>

				<FormSection
					icon={<FiMail className="mb-1" />}
					title="Account information"
				>
					<div className="row p-4">
						<div className="col-lg-4">
							<FormInput
								label="Email"
								name="email"
								type="email"
								placeholder="Ex: John@company.com"
								value={formData.email}
								onChange={handleInputChange}
								required
							/>
						</div>
						<div className="col-lg-4">
							<FormInput
								label="Password"
								name="password"
								type="password"
								placeholder="Password minimum 8 characters"
								value={formData.password}
								onChange={handleInputChange}
								required
							/>
						</div>
					</div>
				</FormSection>

				<FormSection
					icon={<FiImage className="mb-1" />}
					title="Shop information"
				>
					<div className="row p-4">
						<div className="col-lg-6">
							<FormInput
								label="Shop name"
								name="shopName"
								type="text"
								placeholder="Shop name"
								value={formData.shopName}
								onChange={handleInputChange}
								required
							/>
							<FormTextArea
								label="Address"
								name="address"
								placeholder="Enter shop address"
								value={formData.address}
								onChange={handleInputChange}
								required
							/>
						</div>
						<div className="col-lg-6">
							<PreviewImage image={logoPrview} altText="Shop Logo" />
							<FileUpload
								name="logo"
								label="Shop Logo (Ratio 2:1)"
								accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
								onChange={handleImageChange}
							/>
							<PreviewImage image={bannerPreview} altText="Shop Banner" />
							<FileUpload
								name="banner"
								label="Shop Banner (Ratio 5:1)"
								accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
								onChange={handleImageChange}
							/>
						</div>
					</div>
				</FormSection>

				<div className="form-group col-lg-12 text-right">
					<button
						type="submit"
						className="btn bg-primary hover:bg-primary-dark hover:text-white mt-3 text-white"
						style={{ color: "white" }}
					>
						Add Vendor
					</button>
				</div>
			</form>
			<ToastContainer />
		</div>
	);
};

export default AddVendorForm;
