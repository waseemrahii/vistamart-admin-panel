import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrandById, updateBrand } from '../../../redux/slices/admin/brandSlice'; // Adjust import path as necessary
import { toast } from 'react-toastify';
import { getUploadUrl, uploadImageToS3 } from '../../../utils/helpers'; // Adjust the import as necessary
import apiConfig from '../../../config/apiConfig';

const BrandUpdate = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentBrand, loading, error } = useSelector((state) => state.brand);

  const [brandName, setBrandName] = useState("");
  const [brandImage, setBrandImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    dispatch(fetchBrandById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentBrand) {
      setBrandName(currentBrand.name);
      // setBrandImage(currentBrand.logo); // Assuming `currentBrand.logo` is already a valid URL
      setBrandImage(`${apiConfig.bucket}/${currentBrand?.logo}`); // Set initial preview URL

    }
  }, [currentBrand]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let logoKey = brandImage; // Keep existing logo if no new file is uploaded

    if (imageFile) {
      try {
        // Ensure to get the correct upload URL
        const uploadConfig = await getUploadUrl(imageFile.type, "brand");
        const { url, key } = uploadConfig; // Extract the URL and key
        await uploadImageToS3(url, imageFile); // Pass only the URL and the file
        logoKey = key; // Use the key from the uploadConfig
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image"); // Show error toast
        return; // Exit if image upload fails
      }
    }

    const brandData = {
      name: brandName,
      logo: logoKey, // Use the new logo key from upload or existing
    };

    try {
      await dispatch(updateBrand({ brandId: id, brandData }));
      toast.success("Brand updated successfully!"); // Show success toast
      navigate(`/brandlist`); // Navigate after successful update
    } catch (error) {
      console.error("Error updating brand:", error);
      toast.error(`Failed to update brand: ${error.message}`); // Show error toast
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    toast.error(`Error: ${error}`);
  }
  return (
    <div className="content container-fluid snipcss-BVBoO">
      <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
        <h2 className="h1 mb-0 align-items-center d-flex gap-2">
          <img width="20" src="\brand.png" alt="" /> Brand Update
        </h2>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body text-start">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className='row'>
                  <div className='col-lg-6 p-4'>
                    <div className="form-group">
                      <label className="title-color" htmlFor="name">Brand Name</label>
                      <input
                        type="text"
                        name="name"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        className="form-control"
                        id="name"
                        placeholder="Ex : LUX"
                        required
                      />
                    </div>
                  </div>
                  <div className='col-lg-6 p-4'>
                    <div className="text-center flex justify-center">
                      {brandImage && (
                        <img className="upload-img-view" src={brandImage} alt="Brand Preview" />
                      )}

                    </div>
                    <div className="form-group">
                      <label className="title-color" htmlFor="brand">Brand Logo</label>
                      <span className="ml-2 text-info"> Ratio 1:1 (500 x 500 px) </span>
                      <div className="custom-file text-left">
                        <input
                          type="file"
                          name="image"
                          id="brand-image"
                          className="custom-file-input"
                          accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                          onChange={(e) => {
                            setImageFile(e.target.files[0]);
                            setBrandImage(URL.createObjectURL(e.target.files[0]));
                          }}
                        />
                        <label className="custom-file-label" htmlFor="brand-image">Choose file</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-end gap-3 mt-4">
                  <button type="submit" className="btn bg-primary text-white px-4"  style={{color:"white"}}>Update</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandUpdate;
