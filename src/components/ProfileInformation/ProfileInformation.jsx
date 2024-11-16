import React, { useEffect, useState, useRef } from "react";
import { HiEyeDropper } from "react-icons/hi2";
import { IoIosLock } from "react-icons/io";
import { IoHomeSharp, IoPerson } from "react-icons/io5";
import { MdSettingsApplications } from "react-icons/md";
import { Link } from "react-router-dom";
import apiConfig from "../../config/apiConfig";
import { getAuthData } from "../../utils/authHelper";
import { FaEdit, FaPen } from "react-icons/fa";

const ProfileInformation = () => {
  const [profileData, setProfileData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    bannerImage: "",
    vendorImage: "", // New state for vendor image
  });
   const  {user} = getAuthData();
  // Create a ref for the password section
  const passwordSectionRef = useRef(null);

  
  const handleScrollToPassword = () => {
    if (passwordSectionRef.current) {
      passwordSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row bottom-0 justify-between items-center mx-4 md:mx-16 my-10">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <IoPerson className="text-2xl font-semibold" />
          <h1 className="font-bold text-xl">Profile Information</h1>
        </div>
        <div className="px-3 py-2 rounded bg-green-400 hover:bg-green-600 text-white">
          <Link to={"/"} className="flex gap-2 md:gap-4 items-center">
            <IoHomeSharp className="font-semibold hover:text-green-500" />
            <h1 className="text-white font-semibold">Dashboard</h1>
          </Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row mx-4 md:mx-16 gap-1">

        <div className="w-full lg:h-[31vh] md:w-1/4 bg-white shadow-md p-4 rounded mb-4 md:mb-0">
       
          <img src={`${apiConfig.bucket}/${user?.image}`} alt="" />
        </div>

        <div className="w-full md:w-3/4 rounded">
          <div className="relative bg-white px-5 py-3 border border-gray-300 shadow rounded">
            
            <div className="pt-6 pb-6 flex justify-between flex-wrap items-center w-full">
              
           <div className="pt-6 pb-6 flex justify-between flex-wrap items-center w-full">
               {/* Push content down to account for avatar */}
              <div className="flex items-center gap-2 px-4 py-3">
                <IoPerson className="font-bold text-xl" />
                <h1 className="font-bold text-md">Basic Information</h1>
              </div>
                <div className="flex items-center gap-2 px-4 py-3">
                <Link
                        to={`/employeesdit/${user?._id}`}
                        className="btn border border-primary text-primary"
                        title="Edit info"
                      >
                                            <FaEdit  className="text-primary" style={{color:"green"}}/>
                                        </Link >
                </div>
              </div>
              <form
                action=""
                className="grid grid-cols-1 md:grid-cols-2 gap-5 px-5"
              >
                <div className="">
                  <label htmlFor="">Full Name</label>
                  <input
                    type="text"
                    value={user?.name}
                    className="px-3 py-2 rounded border-gray-400 border w-full"
                    readOnly
                  />
                </div>

                <div className="">
                  <label htmlFor="">Email</label>
                  <input
                    type="text"
                    value={user?.email}
                    className="px-3 py-2 rounded border-gray-400 border w-full"
                    readOnly
                  />
                </div>
              </form>
            </div>
         
          </div>

  
        </div>
      </div>
    </>
  );
};

export default ProfileInformation;
