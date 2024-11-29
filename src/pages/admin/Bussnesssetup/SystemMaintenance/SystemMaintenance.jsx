// // import React from "react";
// // import Switcher from "../../../../components/FormInput/Switcher";
// // import CompanyInformationForm from "../Company information/companyInformation";
// // import BusinessInformationCard from "../BussinessInformation/bussinessInformation";
// // import AppDownloadInfoCard from "../appCard/appCard";
// // import WebsiteColorCard from "../appCard/colourCard";
// // import WebsiteHeaderLogoCard from "../appCard/headerLogoCard";
// // import WebsiteFooterLogoCard from "../appCard/footerCard";
// // import WebsiteFaviconCard from "../appCard/FaviconCard";
// // import LoadingGifCard from "../appCard/loadingGifCard";
// // import AppLogoHeader from "../appCard/appLogoCard";

// // const MaintenanceCard = () => {
// //   return (
// //     <>
// //     <div className="border mb-2 rounded-lg shadow-sm">
// //       <div className=" p-3 shadow-lg rounded-t-lg">
// //         <h5 className="text-lg font-medium flex items-center mb-0">
// //           <h1 className="  text-sm font-bold"> System Maintenance</h1> {/* Replace with the relevant icon */}
         
// //         </h5>
// //       </div>
// //       <div className="p-4">
// //         <div className="flex flex-col md:flex-row gap-4 items-center">
// //           <div className="md:w-2/3 xl:w-3/4">
// //             <p className="m-0">
// //               *By turning on maintenance mode, control all your system & functions.
// //             </p>
// //           </div>
// //           <div className="md:w-1/3 xl:w-1/4">
// //             <div className="flex justify-between items-center border rounded px-3 py-2 ">
// //               <h5 className="text-md font-semibold mb-0">Maintenance Mode</h5>
// //               <label className="switch ml-2 mb-0">
// //                 <input
// //                   type="checkbox"
// //                   id="maintenanceModeSwitch"
// //                   data-status="off"
// //                   className="switcher_input maintenance-mode-show"
// //                   data-warning="Do you want to turn off the maintenance mode?"
// //                   data-route="https://6valley.6amtech.com/admin/business-settings/maintenance-mode"
// //                 />
// //                 <span className=""><Switcher/></span>
// //               </label>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //     <CompanyInformationForm/>
// //     <BusinessInformationCard/>
// //     <AppDownloadInfoCard/>
// // <div className="flex flex-col md:flex-row gap-4"> 
// //     <WebsiteColorCard/>
// //     < WebsiteHeaderLogoCard/>
// //     </div>
// //     <div className="flex flex-col md:flex-row gap-4 mt-3">
// //     <WebsiteFooterLogoCard/>
// //     <WebsiteFaviconCard/>
// //     </div>
// //     <div className="flex flex-col md:flex-row gap-4 mt-3">
// //     <LoadingGifCard/>
// //     <AppLogoHeader/>
// //     </div>
// //     <div className="flex justify-end">
// //   <button 
// //     className="px-4 py-3 bg-primary hover:bg-primary-dark mt-3 rounded-md" 
// //     style={{ color: "white" }}
// //   >
// //     Save Information
// //   </button>
// // </div>

// //     </>
// //   );
// // };

// // export default MaintenanceCard;




// import React, { useState, useEffect } from "react";
// import Switcher from "../../../../components/FormInput/Switcher";
// import CompanyInformationForm from "../Company information/companyInformation";
// import BusinessInformationCard from "../BussinessInformation/bussinessInformation";
// import AppDownloadInfoCard from "../appCard/appCard";
// import WebsiteColorCard from "../appCard/colourCard";
// import WebsiteHeaderLogoCard from "../appCard/headerLogoCard";
// import WebsiteFooterLogoCard from "../appCard/footerCard";
// import WebsiteFaviconCard from "../appCard/FaviconCard";
// import LoadingGifCard from "../appCard/loadingGifCard";
// import AppLogoHeader from "../appCard/appLogoCard";
// import axios from "axios";
// import apiConfig from "../../../../config/apiConfig";

// const MaintenanceCard = () => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [maintenanceMode, setMaintenanceMode] = useState(false);

//   useEffect(() => {
//     const fetchBusinessData = async () => {
//       try {
//         const response = await axios.get(`${apiConfig.admin}/businessgeneral`);
//         if (response.data.status === "success" && response.data.doc.length) {
//           setData(response.data.doc[0]);
//         }
//       } catch (error) {
//         console.error("Error fetching business data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBusinessData();
//   }, []);

//   const handleSave = () => {
//     // Add save functionality (e.g., send updated data to API)
//     console.log("Save data:", { data, maintenanceMode });
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <div className="border mb-2 rounded-lg shadow-sm">
//         <div className="p-3 shadow-lg rounded-t-lg">
//           <h5 className="text-lg font-medium flex items-center mb-0">
//             <h1 className="text-sm font-bold">System Maintenance</h1>
//           </h5>
//         </div>
//         <div className="p-4">
//           <div className="flex flex-col md:flex-row gap-4 items-center">
//             <div className="md:w-2/3 xl:w-3/4">
//               <p className="m-0">
//                 *By turning on maintenance mode, control all your system & functions.
//               </p>
//             </div>
//             <div className="md:w-1/3 xl:w-1/4">
//               <div className="flex justify-between items-center border rounded px-3 py-2">
//                 <h5 className="text-md font-semibold mb-0">Maintenance Mode</h5>
//                 <label className="switch ml-2 mb-0">
//                   <input
//                     type="checkbox"
//                     id="maintenanceModeSwitch"
//                     checked={maintenanceMode}
//                     onChange={() => setMaintenanceMode(!maintenanceMode)}
//                   />
//                   <span>
//                     <Switcher />
//                   </span>
//                 </label>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {data && (
//         <>
//           <CompanyInformationForm companyInfo={data} />
//           <BusinessInformationCard businessInfo={data} />
//           <AppDownloadInfoCard appLinks={data} />
//           <div className="flex flex-col md:flex-row gap-4"> 
//             <WebsiteColorCard primaryColor={data.primaryColor} secondaryColor={data.secondaryColor} />
//             <WebsiteHeaderLogoCard headerLogo= {data.headerLogo} />
//           </div>
//           <div className="flex flex-col md:flex-row gap-4 mt-3">
//             <WebsiteFooterLogoCard footerLogo= {data.footerLogo} />
//             <WebsiteFaviconCard favicon={data.favicon} />
//           </div>
//           <div className="flex flex-col md:flex-row gap-4 mt-3">
//             <LoadingGifCard loadingGif={data.loadingGif} />
//             <AppLogoHeader logo={data.appLogo} />
//           </div>
//         </>
//       )}
//       <div className="flex justify-end">
//         <button
//           onClick={handleSave}
//           className="px-4 py-3 bg-primary hover:bg-primary-dark mt-3 rounded-md"
//           style={{ color: "white" }}
//         >
//           Save Information
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MaintenanceCard;



import React, { useState, useEffect } from "react";
import Switcher from "../../../../components/FormInput/Switcher";
import CompanyInformationForm from "../Company information/companyInformation";
import BusinessInformationCard from "../BussinessInformation/bussinessInformation";
import AppDownloadInfoCard from "../appCard/appCard";
import WebsiteColorCard from "../appCard/colourCard";
import WebsiteHeaderLogoCard from "../appCard/headerLogoCard";
import WebsiteFooterLogoCard from "../appCard/footerCard";
import WebsiteFaviconCard from "../appCard/FaviconCard";
import LoadingGifCard from "../appCard/loadingGifCard";
import AppLogoHeader from "../appCard/appLogoCard";
import axios from "axios";
import apiConfig from "../../../../config/apiConfig";
import { toast } from "react-toastify";
import { deleteUploadedImages, uploadImageToS3, getUploadUrl } from "../../../seller/vendor/add/addVender/helpers";
import { getAuthData } from "../../../../utils/authHelper";

const MaintenanceCard = () => {
  const [loading, setLoading] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [updatedImages, setUpdatedImages] = useState({
    headerLogo: null,
    footerLogo: null,
    favicon: null,
  });

  // Initial state for the form data
  const [data, setData] = useState({
    companyName: "",
    phone: "",
    email: "",
    country: "",
    timezone: "",
    language: "",
    companyAddress: "",
    latitude: "",
    longitude: "",
    currencyPosition: "",
    forgotPasswordVerification: "",
    businessModel: "",
    pagination: false,
    companyCopyrightText: "",
    appleStoreLink: "null",
    googlePlayStoreLink: "",
    primaryColor: "",
    secondaryColor: "",
    headerLogo: "",
    footerLogo: "",
    favicon: "",
    loadingGif: "",
    appLogo: "",
  });

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const response = await axios.get(`${apiConfig.admin}/businessgeneral`);
        if (response.data.status === "success" && response.data.doc.length) {
          setData(response.data.doc[0]);
            setMaintenanceMode(response.data.doc[0].maintenanceMode); // Set the maintenance mode based on fetched data
        }
      } catch (error) {
        console.error("Error fetching business data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, []);

  // Handle input change for each field
  const handleInputChange = (name, value) => {
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (event, imageType) => {
    const file = event.target.files[0];
    if (file) {
      setUpdatedImages((prev) => ({ ...prev, [imageType]: file }));
    }
  };

  const handleDeleteImage = async (imageType) => {
    try {
      const uploadConfig = await getUploadUrl("", "business");
      await deleteUploadedImages(uploadConfig, data[imageType]);
      setUpdatedImages((prev) => ({ ...prev, [imageType]: null }));
      toast.success(`${imageType} deleted successfully!`);
    } catch (error) {
      console.error(`Error deleting ${imageType}:`, error);
      toast.error(`Failed to delete ${imageType}`);
    }
  };
  const handleColorChange = ({ primaryColor, secondaryColor }) => {
    setData((prevData) => ({
      ...prevData,
      primaryColor,
      secondaryColor,
    }));
  };
  

  const handleSave = async () => {
    setLoading(true);
    const uploadedKeys = { ...data };
  
    // Log the current state of data before proceeding
    console.log("Data before save:", uploadedKeys);
  
    // Get the token and user from auth
    const { user, token } = getAuthData();
    
    // Log token and user data for debugging
  
    try {
      const imageTypes = ["headerLogo", "footerLogo", "favicon"];
      const uploadPromises = imageTypes.map(async (type) => {
        if (updatedImages[type]) {
          // Log before the upload process for each image
          console.log(`Uploading ${type}...`);
  
          const uploadConfig = await getUploadUrl(updatedImages[type].type, "business");
          console.log("Upload Config for", type, uploadConfig);
  
          const uploadedKey = await uploadImageToS3(uploadConfig, updatedImages[type]);
          console.log(`Upload result for ${type}:`, uploadedKey);
  
          if (uploadedKey) {
            uploadedKeys[type] = uploadedKey;
          } else {
            throw new Error(`Failed to upload ${type}`);
          }
        }
      });
  
      await Promise.all(uploadPromises);
  
      // Log the final payload before the API call
      const payload = {
        ...uploadedKeys,
        maintenanceMode,
      };
      console.log("Payload to be sent:", payload);
  
      // Make the API request
      const response = await axios.put(
        `${apiConfig.admin}/businessgeneral/${data._id}`, // Pass the ID here
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,  // Pass the token in the headers
          },
        }
      );
  
      // Log the response from the API
      console.log("API Response:", response);
  
      if (response.data.status === "success") {
        toast.success("Business information updated successfully!");
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      // Log the error for debugging
      console.error("Error saving data:", error);
      toast.error("Failed to save information");
      console.log("Error details:", error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };
  

  const handleMaintenanceModeChange = () => {
    setMaintenanceMode(!maintenanceMode);
  };

  if (loading) {
    return <div>Loading....</div>;
  }

  return (
    <div>
      <div className="border mb-2 rounded-lg shadow-sm">
        <div className="p-3 shadow-lg rounded-t-lg">
          <h5 className="text-lg font-medium flex items-center mb-0">
            <h1 className="text-sm font-bold">System Maintenance</h1>
          </h5>
        </div>
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="md:w-2/3 xl:w-3/4">
              <p className="m-0">
                *By turning on maintenance mode, control all your system & functions.
              </p>
            </div>
            <div className="md:w-1/3 xl:w-1/4">
              <div className="flex justify-between items-center border rounded px-3 py-2">
                <h5 className="text-md font-semibold mb-0">Maintenance Mode</h5>
                <label className="switch ml-2 mb-0">
                  <span>
                    <Switcher
                      checked={maintenanceMode}
                      onChange={handleMaintenanceModeChange}
                    />
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {data && (
        <>
          <CompanyInformationForm companyInfo={data} onInputChange={handleInputChange} />
          <BusinessInformationCard businessInfo={data} onInputChange={handleInputChange} />
          <AppDownloadInfoCard appLinks={data}  onInputChange={handleInputChange}/>
          <div className="flex flex-col md:flex-row gap-4">
          <WebsiteColorCard
  primaryColor={data.primaryColor}
  secondaryColor={data.secondaryColor}
  onColorChange={handleColorChange}  // Corrected prop
/>

            <WebsiteHeaderLogoCard
              headerLogo={data.headerLogo}
              onImageChange={(e) => handleImageChange(e, "headerLogo")}
              onDelete={() => handleDeleteImage("headerLogo")}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4 mt-3">
            <WebsiteFooterLogoCard
              footerLogo={data.footerLogo}
              onImageChange={(e) => handleImageChange(e, "footerLogo")}
              onDelete={() => handleDeleteImage("footerLogo")}
            />
            <WebsiteFaviconCard
              favicon={data.favicon}
              onImageChange={(e) => handleImageChange(e, "favicon")}
              onDelete={() => handleDeleteImage("favicon")}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4 mt-3">
            <LoadingGifCard loadingGif={data.loadingGif}  onInputChange={handleInputChange}/>
            <AppLogoHeader logo={data.appLogo} onInputChange={handleInputChange} />
          </div>
        </>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-4 py-3 bg-primary hover:bg-primary-dark mt-3 rounded-md"
          style={{ color: "white" }}
        >
          Save Information
        </button>
      </div>
    </div>
  );
};

export default MaintenanceCard;
