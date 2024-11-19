import React, { useState, useEffect } from "react";
import { FiUserPlus, FiInfo, FiImage, FiMail } from "react-icons/fi";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormSection from "../../../../components/FormInput/FormSection";
import FormInput from "../../../../components/FormInput/FormInput";
import PreviewImage from "../../../../components/FormInput/PreviewImage";
import FileUpload from "../../../../components/FormInput/FileUpload";
import FormSelect from "../../../../components/FormInput/FormSelect"; // Import your FormSelect component
import axios from "axios";
import { getUploadUrl, uploadImageToS3 } from "../../../../utils/helpers";
import { getAuthData } from "../../../../utils/authHelper";
import apiConfig from "../../../../config/apiConfig";

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    identifyType: "",
    identifyNumber: "",
    identityImage: null,
    roleId: "", // Add roleId to form data
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [identityImagePreview, setIdentityImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedIdentityFile, setSelectedIdentityFile] = useState(null);
  const [roles, setRoles] = useState([]); // State for roles
  const [loadingRoles, setLoadingRoles] = useState(true); // Loading state for roles
  const API_URL = `${apiConfig.admin}/roles`;
  const API_EMP = `${apiConfig.admin}/employees`;
     // Password validation regex: 8-16 characters, uppercase, lowercase, number, special character
     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;

 // Fetch roles with token
 useEffect(() => {
  const fetchRoles = async () => {

    const { token } = getAuthData(); // Retrieve the token

    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the request
        },
      });
      if (response.status === 200) {
        const formattedRoles = response.data.doc.map(role => ({
          value: role._id,
          label: role.name,
        }));
        setRoles(formattedRoles);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Failed to fetch roles!");
    } finally {
      setLoadingRoles(false);
    }
  };

  fetchRoles();
}, []);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!passwordRegex.test(formData.password)) {
      toast.error(
        "Password must be 8-16 characters long and include uppercase, lowercase, number, and special character."
      );
      return;
    }
    try {
      const employeeData = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        identifyType: formData.identifyType,
        identifyNumber: formData.identifyNumber,
        role: formData.roleId, // Include roleId in employee data
      };

      let imageKey = null;
      if (selectedFile) {
        const uploadUrlResponse = await getUploadUrl(selectedFile.type, 'employees');
        imageKey = uploadUrlResponse.key;
        await uploadImageToS3(uploadUrlResponse.url, selectedFile);
      }

      if (selectedIdentityFile) {
        const identityUploadUrlResponse = await getUploadUrl(selectedIdentityFile.type, 'identity');
        const identityImageKey = identityUploadUrlResponse.key;
        await uploadImageToS3(identityUploadUrlResponse.url, selectedIdentityFile);
        employeeData.identityImage = identityImageKey;
      }

      if (imageKey) {
        employeeData.image = imageKey;
      }

      const { token } = getAuthData();

      const response = await axios.post(
        API_EMP,
        employeeData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log("response=====", response)
      if (response.status === 201) {
        toast.success("Employee added successfully!");
        setFormData({
          name: "",
          email: "",
          phoneNumber: "",
          password: "",
          identifyType: "",
          identifyNumber: "",
          identityImage: null,
          role: "", // Reset roleId
        });
        setImagePreview(null);
        setIdentityImagePreview(null);
        event.target.reset();
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error(error.response?.data?.message || "Failed to add employee!");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      setSelectedFile(file);
    }
  };

  const handleIdentityImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setIdentityImagePreview(objectUrl);
      setSelectedIdentityFile(file);
    }
  };

  return (
    <div className="content container-fluid main-card ltr snipcss-B2K3K">
      <div className="mb-4">
        <h2 className="h1 mb-0 text-capitalize text-[1rem] font-semibold d-flex align-items-center gap-2">
          <FiUserPlus className="mb-1" /> Add New Employee
        </h2>
      </div>
      <form
        className="user"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        id="add-employee-form"
      >
        <FormSection icon={<FiInfo className="mb-1" />} title="Employee Information">
          <div className="row align-items-center p-4">
            <div className="col-lg-6 mb-4 mb-lg-0">
            <FormInput
  label="Name"
  name="name"
  type="text"
  placeholder="Enter full name"
  value={formData.name}
  onChange={handleInputChange}
  onKeyPress={(event) => {
    const isValid = /^[a-zA-Z\s]*$/.test(event.key);
    if (!isValid) {
      event.preventDefault();
    }
  }}
  required
/>


              <FormInput
                label="Email"
                name="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <div className="form-group">
                <label htmlFor="exampleInputPhone" className="title-color d-flex gap-1 align-items-center">
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
            <div className="col-lg-6">
              <PreviewImage
                image={imagePreview}
                altText="Employee Image"
                style={{ width: "200px" }}
              />
              <FileUpload
                name="image"
                label="Upload Employee Image"
                accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>
        </FormSection>

        <FormSection icon={<FiMail className="mb-1" />} title="Account Information">
          <div className="row align-items-center p-4">
            <div className="col-lg-6 mb-4 mb-lg-0">
            <FormSelect
                label="Select Role"
                name="roleId"
                value={formData.roleId}
                onChange={handleInputChange}
                options={roles}
                isLoading={loadingRoles}
                required
              />
            </div>
             
            <div className="col-lg-6 mb-4 mb-lg-0">
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

        <FormSection icon={<FiInfo className="mb-1" />} title="Identification">
          <div className="row p-4">
            <div className="col-lg-6">
            <FormSelect
                label="Identification Type"
                name="identifyType"
                value={formData.identifyType}
                onChange={handleInputChange}
                options={[
                  { value: "nid", label: "NID" },
                  { value: "passport", label: "Passport" },
                ]}
                required
              />
              <FormInput
                label="Identification Number"
                name="identifyNumber"
                type="text"
                placeholder="Enter ID number"
                value={formData.identifyNumber}
                onChange={handleInputChange}
                required
              />
             
            </div>
            <div className="col-lg-6">
              <PreviewImage
                image={identityImagePreview}
                altText="Identity Image"
                style={{ width: "200px" }}
              />
              <FileUpload
                name="identityImage"
                label="Upload Identity Image"
                accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                onChange={handleIdentityImageChange}
              />
            </div>
          </div>
        </FormSection>

        <div className="d-flex justify-content-end align-items-center p-4">
          <button
            type="submit"
            className="btn bg-primary text-white"
            style={{color:"white"}}
          >
            Add Employee
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddEmployee;





