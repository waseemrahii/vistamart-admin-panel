// import React, { useState } from 'react';

// const WebsiteHeaderLogoCard = () => {
//   const [logo, setLogo] = useState(
//     '/vistalogo.png'
//   );

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const fileURL = URL.createObjectURL(file);
//       setLogo(fileURL);
//     }
//   };

//   return (
//     <div className="border border-gray-300 rounded-lg shadow-lg h-[49vh] w-full md:w-2/4">
//       <div className="p-3 bg-white shadow-md rounded-t-md flex items-center gap-2">
//         <h5 className="mb-0 text-sm font-bold flex items-center gap-2 capitalize">
//           <img src="https://6valley.6amtech.com/public/assets/back-end/img/header-logo.png" alt="Website Header Logo" />
//           Website Header Logo
//         </h5>
//         <span className="ml-auto bg-blue-100 text-blue-600 px-2 py-1 text-nowrap text-xs rounded">
//           (1000 x 308 px)
//         </span>
//       </div>
//       <div className="p-4 flex flex-col justify-around mt-4">
//         {/* Logo Preview */}
//         <div className="flex justify-between items-center ml-14 md:ml-32 w-40 h-20">
//           <img height="60" id="view-website-logo" alt="Website Logo" src={logo} />
//         </div>
        
//         {/* File Input */}
//         <div className="mt-4 relative">
//           <input
//             type="file"
//             name="company_web_logo"
//             id="website-logo"
//             accept=".webp, .jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
//             onChange={handleFileChange}
//             className="absolute  inset-0 opacity-0 cursor-pointer"
//           />
//           <label
//             htmlFor="website-logo"
//             className="block w-full bg-gray-200 text-center text-gray-700 py-2 rounded-md cursor-pointer capitalize "          >
//             Choose file
//           </label>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WebsiteHeaderLogoCard;


// React Component for WebsiteHeaderLogoCard


import React, { useState } from "react";
import { FaUpload } from "react-icons/fa";
import { getUploadUrl, uploadImageToS3 } from "../../../../utils/helpers";

const WebsiteHeaderLogoCard = ({ headerLogo, onImageChange }) => {
  const [logo, setLogo] = useState(headerLogo || "/default-header-logo.png");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (event) => {
    if (!event?.target?.files || event.target.files.length === 0) {
      console.error("No file selected or event.target.files is undefined.");
      return;
    }

    const file = event.target.files[0];
    console.log("Selected file:", file); // Log the selected file
    setSelectedFile(file);
    setLogo(URL.createObjectURL(file)); // Temporarily show the image locally
  };

  // Handle file upload

  const handleSave = async () => {
    if (!selectedFile) {
      console.error("No file selected for upload.");
      return;
    }
  
    let imageKey;
  
    try {
      setLoading(true);
  
      // Get the S3 upload URL for the business folder
      const uploadConfig = await getUploadUrl(selectedFile.type, "business");
      console.log("Upload Config:", uploadConfig);
  
      if (!uploadConfig || !uploadConfig.url) {
        throw new Error("Failed to get a valid upload URL.");
      }
  
      console.log("Uploading file to:", uploadConfig.url);
  
      // Upload the file to S3
      const uploadSuccessful = await uploadImageToS3(uploadConfig.url, selectedFile);
      console.log("AWS S3 Upload Response:", uploadSuccessful);
  
      // Directly retrieve the image key from uploadConfig
      imageKey = uploadConfig.key;
  
      if (uploadSuccessful && imageKey) {
        console.log("Uploaded Image Key:", imageKey);
  
        // You can now directly use the imageKey for further processing
        // Assuming the baseUrl is not required here anymore
        setLogo(imageKey); // Updating the logo state with the uploaded image key
  
        // Notify parent component of the new image key
        if (onImageChange) {
          onImageChange(imageKey);
        }
      } else {
        throw new Error("Failed to retrieve image key from upload.");
      }
    } catch (error) {
      console.error("Error during image upload:", error.message);
    } finally {
      setLoading(false);
    }
  };
  
  
  return (
    <div className="border border-gray-300 rounded-lg shadow-lg h-[49vh] w-full md:w-2/4">
      <div className="p-3 bg-white shadow-md rounded-t-md flex items-center gap-2">
        <h5 className="mb-0 text-sm font-bold flex items-center gap-2 capitalize">
          <img src="/default-header-logo.png" alt="Website Header Logo" />
          Website Header Logo
        </h5>
        <span className="ml-auto bg-blue-100 text-blue-600 px-2 py-1 text-nowrap text-xs rounded">
          (1000 x 308 px)
        </span>
      </div>
      <div className="p-4 flex flex-col justify-around mt-4">
        <div className="flex justify-between items-center ml-14 md:ml-32 w-40 h-20">
          <img
            height="60"
            id="view-website-logo"
            alt="Website Logo"
            src={logo}
          />
        </div>
        <div className="mt-4 relative">
          <input
            type="file"
            name="company_web_logo"
            id="website-logo"
            accept="image/*"
            onChange={handleFileChange} // Set selected file
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <label
            htmlFor="website-logo"
            className="block w-full bg-gray-200 text-center text-gray-700 py-2 rounded-md cursor-pointer capitalize"
          >
            Choose file
          </label>
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
        >
          {loading ? "Uploading..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default WebsiteHeaderLogoCard;
