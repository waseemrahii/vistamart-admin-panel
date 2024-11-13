import React, { useState, useEffect } from "react";
import { FiUserPlus, FiInfo, FiImage, FiMail } from "react-icons/fi";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuthData } from "../../../../../utils/authHelper";
import FormSection from "../../../../../components/FormInput/FormSection";
import FormInput from "../../../../../components/FormInput/FormInput";
import PreviewImage from "../../../../../components/FormInput/PreviewImage";
import FileUpload from "../../../../../components/FormInput/FileUpload";
import FormTextArea from "../../../../../components/FormInput/FormTextArea";
import {
  deleteUploadedImages,
  getUploadUrl,
  uploadImageToS3,
} from "./helpers";
import apiConfig from "../../../../../config/apiConfig";
import axiosInstance from "../../../../../utils/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";

const UpdateVendor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const backendUrl = apiConfig.bucket;

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

  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [vendorPreview, setVendorPreview] = useState(null);
  const [loading, setLoading] = useState(false);

//   const validatePassword = (password) => {
//     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//     return passwordRegex.test(password);
//   };

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const { token } = getAuthData();
        const response = await axiosInstance.get(
          `${apiConfig.seller}/vendors/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data) {
          const vendor = response.data.doc;
          setFormData(vendor);
          setLogoPreview(`${backendUrl}/${vendor.logo}`);
          setBannerPreview(`${backendUrl}/${vendor.banner}`);
          setVendorPreview(`${backendUrl}/${vendor.vendorImage}`);
        }
      } catch (error) {
        toast.error("Failed to load vendor data.");
      }
    };
    fetchVendor();
  }, [id, backendUrl]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Start loading when form is submitted
    const uploadedKeys = [];
  
    // // Validate password
    // if (!validatePassword(formData.password)) {
    //   toast.error("Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character (e.g., 123Abs@)");
    //   setLoading(false); // Stop loading on validation failure
    //   return;
    // }
  
    const { token } = getAuthData();
    // Get files from formData
    const logoFile = formData.logo || null;
    const bannerFile = formData.banner || null;
    const vendorFile = formData.vendorImage || null;
  
    console.log("logoFile", logoFile);
    console.log("bannerFile", bannerFile);
    console.log("vendorFile", vendorFile);
  
    try {
      // Check if the files are valid before calling getUploadUrl
      const filesToUpload = [
        { file: logoFile, name: 'logo' },
        { file: bannerFile, name: 'banner' },
        { file: vendorFile, name: 'vendorImage' },
      ];
  
      // Filter out null or undefined files
      const validFiles = filesToUpload.filter(fileObj => fileObj.file);
  
      // If there are no valid files, do not proceed
      if (validFiles.length === 0) {
        toast.error("No valid images to upload.");
        setLoading(false);
        return;
      }
  
      // Get upload URLs for each valid file
      const uploadConfigs = await Promise.all(validFiles.map(fileObj =>
        getUploadUrl(fileObj.file?.type, "vendors")
      ));
  
      // Upload files
      for (let i = 0; i < validFiles.length; i++) {
        const uploadConfig = uploadConfigs[i];
        const file = validFiles[i].file;
        const uploadedKey = await uploadImageToS3(uploadConfig, file);
        uploadedKeys.push(uploadedKey);
      }
  
      const successfulUploads = uploadedKeys.filter((key) => key !== null);
  
      if (successfulUploads.length < validFiles.length) {
        await deleteUploadedImages(successfulUploads);
        toast.error("Image upload failed, deleted previously uploaded images.");
        setLoading(false);
        return;
      }
  
      const vendorData = {
        ...formData,
        logo: successfulUploads[0] || formData.logo,
        banner: successfulUploads[1] || formData.banner,
        vendorImage: successfulUploads[2] || formData.vendorImage,
      };
  
      const response = await axiosInstance.put(
        `${apiConfig.seller}/vendors/${id}`,
        vendorData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.doc) {
        toast.success("Vendor updated successfully!");
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
        setLogoPreview(null);
        setBannerPreview(null);
        setVendorPreview(null);
        event.target.reset();
        navigate("/venderlist"); // Redirect after success
      }
    } catch (error) {
      console.error("Error updating vendor:", error);
      const errorMessage = error.response?.data?.message || "Failed to update vendor!";
      toast.error(errorMessage);
    } finally {
      setLoading(false); // Stop loading after submission
    }
  };
  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;
    if (!file) return;

    const previewMap = {
      logo: setLogoPreview,
      banner: setBannerPreview,
      vendorImage: setVendorPreview,
    };

    const setPreview = previewMap[name];
    if (setPreview) setPreview(URL.createObjectURL(file));

    setFormData({ ...formData, [name]: file });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };



  return (
    <div className="content container-fluid main-card ltr ">
      <div className="mb-4">
        <h2 className="h1 mb-0 text-capitalize text-[1rem] font-semibold d-flex align-items-center gap-2">
          <FiUserPlus className="mb-1" /> Update Vendor
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
              <div className="form-group ">
                <label
                  htmlFor="exampleInputPhone"
                  className="title-color d-flex gap-1 align-items-center "
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
                label="Vendor Image "
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
              <PreviewImage image={logoPreview} altText="Shop Logo" />
              <FileUpload
                name="logo"
                label="Shop Logo"
                accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                onChange={handleImageChange}
              />
              <PreviewImage image={bannerPreview} altText="Shop Banner" />
              <FileUpload
                name="banner"
                label="Shop Banner"
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
            disabled={loading} // Disable button when loading
          >
            {loading ? "Submitting..." : "Add Vendor"}{" "}
            {/* Change button text based on loading state */}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default UpdateVendor;
