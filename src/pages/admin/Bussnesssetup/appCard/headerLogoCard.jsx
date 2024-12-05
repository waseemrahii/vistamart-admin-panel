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
  const [logo, setLogo] = useState(headerLogo || '/default-header-logo.png');
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);

      // Fetch the upload URL configuration from the server
      const uploadConfig = await getUploadUrl(file.type, "business");

      if (!uploadConfig || !uploadConfig.url) {
        throw new Error("Failed to get a valid upload URL.");
      }

      // Upload the image to S3 using the provided upload URL
      const uploadResponse = await uploadImageToS3(uploadConfig.url, file);

      if (uploadResponse) {
        // Construct the uploaded URL using the S3 file key
        const uploadedUrl = `${uploadConfig.baseUrl}/${uploadResponse.key}`;
        setLogo(uploadedUrl);

        // Notify the parent component about the change
        if (onImageChange) {
          onImageChange(uploadedUrl);
        }
      } else {
        throw new Error("Failed to upload image.");
      }
    } catch (error) {
      console.error("Error uploading image:", error.message);
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
          <img height="60" id="view-website-logo" alt="Website Logo" src={logo} />
        </div>
        <div className="mt-4 relative">
          <input
            type="file"
            name="company_web_logo"
            id="website-logo"
            accept="image/*"
            onChange={handleFileChange}
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
      {loading && <div className="mt-2 text-center">Uploading...</div>}
    </div>
  );
};

export default WebsiteHeaderLogoCard;
