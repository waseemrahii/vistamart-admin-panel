// import React, { useState, useEffect, Suspense, lazy } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import Swal from "sweetalert2";
// import FilterForm from "./FilterForm";
// import {
//   deleteProduct,
//   fetchProducts,
//   toggleFeatured,
//   updateProductStatus,
// } from "../../../../../redux/slices/admin/productSlice";
// import {
//   fetchBrands,
//   fetchCategories,
// } from "../../../../../redux/slices/admin/categorybrandSlice";
// import LoadingSpinner from "../../../../../components/LoodingSpinner/LoadingSpinner";
// import Pagination from "../../../../../components/Pagination";

// // Lazy load the ProductTable component
// const ProductTable = lazy(() => import("./productTable"));

// const InHouseProductList = ({
//   initialTitle = "In House Product List",
//   initialFilters = {},
// }) => {
//   const dispatch = useDispatch();

//   const { loading, error, status, cached, results,pagination, products } = useSelector(
//     (state) => state.product
//   );
//   const [currentPage, setCurrentPage] = useState(1); // Set the initial current page
//   const totalPages = pagination?.totalPages || 1; // Get the total pages from the pagination data


//   const { categories, brands } = useSelector((state) => state.category);
//   const [filters, setFilters] = useState({
//     brand: initialFilters.brand || "",
//     category: initialFilters.category || "",
//     searchValue: initialFilters.searchValue || "",
//     userType: initialFilters.userType || "", // Default userType to 'vendor'
//     status: initialFilters.status || "", // Default status
//     vendorNew4Days: initialFilters.vendorNew4Days || false,
//     minPrice: initialFilters.minPrice || "",
//     maxPrice: initialFilters.maxPrice || "",
//   });

//   useEffect(() => {
//     const cleanFilters = {
//       ...filters,
//       brand: filters.brand || undefined,
//       category: filters.category || undefined,
//       searchValue: filters.searchValue || undefined,
//       userType: filters.userType || undefined,
//       status: filters.status || undefined,
//       vendorNew4Days: filters.vendorNew4Days || undefined,
//       minPrice: filters.minPrice || undefined,
//       maxPrice: filters.maxPrice || undefined,
//     };
//     // console.log("Fetching products with cleaned filters:", cleanFilters);
//    // Fetch products with the current filters and page number
//    dispatch(fetchProducts({ ...cleanFilters, page: currentPage }));
//    dispatch(fetchCategories());
//    dispatch(fetchBrands());
//  }, [filters, currentPage, dispatch]);

//  const handlePageChange = (page) => {
//   //  console.log("Changing page to:", page);
//    setCurrentPage(page); // Update the current page in state
//  };


//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       [name]: value,
//     }));
//   };

//   const handleToggleFeatured = async (product) => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: `Do you want to ${
//         product.isFeatured ? "remove" : "add"
//       } this product as featured?`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes",
//       cancelButtonText: "No",
//     });
//     if (result.isConfirmed) {
//       try {
//         await dispatch(
//           toggleFeatured({
//             productId: product._id,
//             isFeatured: !product.isFeatured,
//           })
//         ).unwrap();
//         Swal.fire("Success", "Product status updated successfully!", "success");
//       } catch (error) {
//         Swal.fire("Error", error.message, "error");
//       }
//     }
//   };

//   const handleUpdateStatus = async (product) => {
//     const result = await Swal.fire({
//       title: "Update Product Status",
//       input: "select",
//       inputOptions: {
//         pending: "Pending",
//         approved: "Approved",
//         rejected: "Rejected",
//       },
//       inputPlaceholder: "Select status",
//       showCancelButton: true,
//       confirmButtonText: "Update",
//       cancelButtonText: "Cancel",
//     });

//     if (result.isConfirmed) {
//       const selectedStatus = result.value; // 'pending', 'approved', or 'rejected'

//       try {
//         await dispatch(
//           updateProductStatus({
//             productId: product._id,
//             status: selectedStatus,
//           })
//         ).unwrap();
//         Swal.fire(
//           "Success",
//           `Product status updated to ${selectedStatus}!`,
//           "success"
//         );
//       } catch (error) {
//         Swal.fire("Error", error.message, "error");
//       }
//     }
//   };

//   const handleDeleteProduct = async (productId) => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: "Do you want to delete this product?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, delete it!",
//       cancelButtonText: "No",
//     });

//     if (result.isConfirmed) {
//       try {
//         await dispatch(deleteProduct(productId)).unwrap();
//         Swal.fire("Deleted!", "Product has been deleted.", "success");
//       } catch (error) {
//         Swal.fire("Error", error.message, "error");
//       }
//     }
//   };

//   const handleResetFilters = () => {
//     setFilters({
//       brand: "",
//       category: "",
//       searchValue: "",
//       userType: "",
//       status: "",
//       vendorNew4Days: false,
//       minPrice: "",
//       maxPrice: "",
//     });
//   };
//   {loading && <LoadingSpinner />}

//   // const handlePageChange = (page) => {
//   //   console.log("Changing page to:", page);
//   //   dispatch(fetchProducts({ ...filters, page }));
//   // };

//   return (
//     <>
//     <div className="content container-fluid">
//       <div className="mb-3">
//         <h2 className="h1 mb-0 text-capitalize d-flex gap-2">
//           <img src="/inhouse-product-list.png" alt="In House Product List" />
//           {initialTitle}
//           <span className="badge badge-soft-dark radius-50 fz-14 ml-1">
//             {results}
//           </span>
//         </h2>
//       </div>

//       {categories.length > 0 && brands.length > 0 && (
//         <FilterForm
//         filters={filters}
//         onInputChange={(e) => {
//           const { name, value } = e.target;
//           setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
//         }}
//         onReset={() => setFilters({})}
//         categories={categories}
//         brands={brands}
//         />
//       )}

//       {loading && <LoadingSpinner />}

//       <Suspense >
//         <ProductTable
//           products={products}
//           onToggleFeatured={handleToggleFeatured}
//           onUpdateStatus={handleUpdateStatus}
//           onDeleteProduct={handleDeleteProduct}
//           results={results}
//         />
//       </Suspense>

//       {/* Conditionally render pagination only if not loading */}
//       {!loading && (
//         <Pagination
//           currentPage={currentPage}
//           totalPages={totalPages}
//           paginate={handlePageChange}
//         />
//       )}
//     </div>
//   </>
//   );
// };

// export default InHouseProductList;




import React, { useState, useEffect, Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import FilterForm from "./FilterForm";
import { deleteProduct, fetchProducts, toggleFeatured, updateProductStatus } from "../../../../../redux/slices/admin/productSlice";
import { fetchBrands, fetchCategories } from "../../../../../redux/slices/admin/categorybrandSlice";
import LoadingSpinner from "../../../../../components/LoodingSpinner/LoadingSpinner";
import Pagination from "../../../../../components/Pagination";
import TableList from "../../../../../components/FormInput/TableList";
import { Link } from "react-router-dom";
import apiConfig from "../../../../../config/apiConfig";
import Switcher from "../../../../../components/FormInput/Switcher";
import { FiEdit, FiEye, FiTrash } from "react-icons/fi";

const InHouseProductList = ({ initialTitle = 'Product List', initialFilters = {} }) => {
  const dispatch = useDispatch();
  const { loading, error, products, results } = useSelector((state) => state.product);
  const { categories, brands } = useSelector((state) => state.category);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
 
  const [filters, setFilters] = useState({
    brand: initialFilters.brand || "",
    category: initialFilters.category || "",
    searchValue: initialFilters.searchValue || '',
    userType: initialFilters.userType || '',
    userId : initialFilters.userId || '',
    status: initialFilters.status || '',
    vendorNew4Days: initialFilters.vendorNew4Days || false,
    minPrice: initialFilters.minPrice || '', 
    maxPrice: initialFilters.maxPrice || ''
  });


  useEffect(() => {
    const cleanFilters = {
      ...filters,
      brand: filters.brand || undefined,
      category: filters.category || undefined,
      searchValue: filters.searchValue || undefined,
      userType: filters.userType || undefined,
      status: filters.status || undefined,
      userId: filters.userId || undefined,
      vendorNew4Days: filters.vendorNew4Days || undefined,
      minPrice: filters.minPrice || undefined,
      maxPrice: filters.maxPrice || undefined,
    };
  
    dispatch(fetchProducts(cleanFilters));
    dispatch(fetchCategories());
    dispatch(fetchBrands());
  }, [filters, sortBy, sortOrder, dispatch]);
  
   
 
 

  const handleSort = (field) => {
    const order = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(field);
    setSortOrder(order);
  };

  const handleToggleFeatured = async (product) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${product.isFeatured ? 'remove' : 'add'} this product as featured?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });
    if (result.isConfirmed) {
      try {
        await dispatch(toggleFeatured({ productId: product._id, isFeatured: !product.isFeatured })).unwrap();
        Swal.fire('Success', 'Product status updated successfully!', 'success');
      } catch (error) {
        Swal.fire('Error', error.message, 'error');
      }
    }
  };

  const handleDeleteProduct = async (productId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this product?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No',
    });
    if (result.isConfirmed) {
      try {
        await dispatch(deleteProduct(productId)).unwrap();
        Swal.fire('Deleted!', 'Product has been deleted.', 'success');
      } catch (error) {
        Swal.fire('Error', error.message, 'error');
      }
    }
  };

  return (
    <div className="content container-fluid ">
      <div className="mb-3">
        <h2 className="h1 mb-0 text-capitalize d-flex gap-2">
          <img src="/inhouse-product-list.png" alt="In House Product List" />
          {initialTitle}
          <span className="badge badge-soft-dark radius-50 fz-14 ml-1">{results}</span>
        </h2>
      </div>

      {categories.length > 0 && brands.length > 0 && (
        <FilterForm
          filters={filters}
          onInputChange={(e) => {
            const { name, value } = e.target;
            setFilters((prev) => ({ ...prev, [name]: value }));
          }}
          categories={categories}
          brands={brands}
        />
      )}

      <div className="product-table-container">
        {error ? (
          <div>{typeof error === 'object' && error !== null ? JSON.stringify(error) : error}</div>
        ) : (
          <Suspense fallback={<LoadingSpinner />}>
            <TableList
              title="Product List"
              tableTitle="Products"
              listData={products}
              columns={[
                { key: 'SL', label: 'SL', render: (_, index) => index + 1 },
                {
                  key: 'name',
                  label: 'Product Name',
                  sortable: true,
                  onClick: () => handleSort('name'),
                  render: (product) => (
                    <Link to="#" className="media align-items-center gap-2">
                      <img
                        src={`${apiConfig.bucket}/${product?.thumbnail}`}
                        className="avatar border"
                        alt={product?.name}
                      />
                      <span className="hover-c1">{product?.name}</span>
                    </Link>
                  ),
                },
                { key: 'productType', label: 'Product Type', textAlign: 'center' },
                {
                  key: 'price',
                  label: 'Unit Price',
                  sortable: true,
                  onClick: () => handleSort('price'),
                  render: (product) => `PKR ${product?.price}`,
                },
                {
                  key: 'isFeatured',
                  label: 'Show as Featured',
                  textAlign: 'center',
                  render: (product) => (
                    <Switcher
                      checked={product?.isFeatured}
                      onChange={() => handleToggleFeatured(product)}
                    />
                  ),
                },
                {
                  key: 'actions',
                  label: 'Actions',
                  textAlign: 'center',
                  render: (product) => (
                    <div className="btn-group flex gap-3">
                      <Link
                        to={`/products/${product?._id}`}
                        className="btn border-primary text-primary"
                        title="View"
                      >
                        <FiEye />
                      </Link>
                      <Link
                        to={`/product/${product?._id}`}
                        className="btn border-primary text-primary"
                        title="Edit"
                      >
                        <FiEdit />
                      </Link>
                      <button
                        className="btn btn-sm border-red-400 text-red-400 hover:bg-red-500 hover:text-white"
                        onClick={() => handleDeleteProduct(product?._id)}
                        title="Delete"
                      >
                        <FiTrash />
                      </button>
                    </div>
                  ),
                },
              ]}
              searchPlaceholder="Search products..."
              itemsPerPage={10}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default InHouseProductList;


// import { useDispatch, useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import { fetchProducts, toggleFeatured, deleteProduct } from '../../../../../redux/slices/seller/productSlice';
// import { fetchCategories, fetchBrands } from '../../../../../redux/slices/admin/categorybrandSlice';
// import Swal from 'sweetalert2';
// import { FiEye, FiTrash } from 'react-icons/fi';
// import FilterForm from '../../../transactionReport/EarnReport/FilterForm';
// import LoadingSpinner from '../../../../../components/LoodingSpinner/LoadingSpinner';
// import TableList from '../../../../../components/FormInput/TableList';
// import Switcher from '../../../../../components/FormInput/Switcher';

// const InHouseProductList = ({ initialTitle = 'In House Product List', initialFilters = {} }) => {
//   const dispatch = useDispatch();
//   const { loading, error, products, results } = useSelector((state) => state.product);
//   const { categories, brands } = useSelector((state) => state.category);
//   const [sortBy, setSortBy] = useState('name');
//   const [sortOrder, setSortOrder] = useState('asc');
 
//   const [filters, setFilters] = useState({
//     brand: initialFilters.brand || "",
//     category: initialFilters.category || "",
//     searchValue: initialFilters.searchValue || '',
//     userType: initialFilters.userType || '',
//     userId : initialFilters.userId || '',
//     status: initialFilters.status || '',
//     vendorNew4Days: initialFilters.vendorNew4Days || false,
//     minPrice: initialFilters.minPrice || '', 
//     maxPrice: initialFilters.maxPrice || ''
//   });


//   useEffect(() => {
//     const cleanFilters = {
//       ...filters,
//       brand: filters.brand || undefined,
//       category: filters.category || undefined,
//       searchValue: filters.searchValue || undefined,
//       userType: filters.userType || undefined,
//       status: filters.status || undefined,
//       userId: filters.userId || undefined,
//       vendorNew4Days: filters.vendorNew4Days || undefined,
//       minPrice: filters.minPrice || undefined,
//       maxPrice: filters.maxPrice || undefined,
//     };
  
//     dispatch(fetchProducts(cleanFilters));
//     dispatch(fetchCategories());
//     dispatch(fetchBrands());
//   }, [filters, sortBy, sortOrder, dispatch]);
  
   
 
 

//   const handleSort = (field) => {
//     const order = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
//     setSortBy(field);
//     setSortOrder(order);
//   };

//   const handleToggleFeatured = async (product) => {
//     const result = await Swal.fire({
//       title: 'Are you sure?',
//       text: `Do you want to ${product.isFeatured ? 'remove' : 'add'} this product as featured?`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes',
//       cancelButtonText: 'No',
//     });
//     if (result.isConfirmed) {
//       try {
//         await dispatch(toggleFeatured({ productId: product._id, isFeatured: !product.isFeatured })).unwrap();
//         Swal.fire('Success', 'Product status updated successfully!', 'success');
//       } catch (error) {
//         Swal.fire('Error', error.message, 'error');
//       }
//     }
//   };

//   const handleDeleteProduct = async (productId) => {
//     const result = await Swal.fire({
//       title: 'Are you sure?',
//       text: 'Do you want to delete this product?',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, delete it!',
//       cancelButtonText: 'No',
//     });
//     if (result.isConfirmed) {
//       try {
//         await dispatch(deleteProduct(productId)).unwrap();
//         Swal.fire('Deleted!', 'Product has been deleted.', 'success');
//       } catch (error) {
//         Swal.fire('Error', error.message, 'error');
//       }
//     }
//   };

//   return (
//     <div className="content container-fluid ">
//       <div className="mb-3">
//         <h2 className="h1 mb-0 text-capitalize d-flex gap-2">
//           <img src="/inhouse-product-list.png" alt="In House Product List" />
//           {initialTitle}
//           <span className="badge badge-soft-dark radius-50 fz-14 ml-1">{results}</span>
//         </h2>
//       </div>

//       {categories.length > 0 && brands.length > 0 && (
//         <FilterForm
//           filters={filters}
//           onInputChange={(e) => {
//             const { name, value } = e.target;
//             setFilters((prev) => ({ ...prev, [name]: value }));
//           }}
//           categories={categories}
//           brands={brands}
//         />
//       )}

//       {loading && <LoadingSpinner />}
//       {console.log("product filetre ========", products)}
//       <div className="product-table-container">
//         {error ? (
//           <div>{typeof error === 'object' && error !== null ? JSON.stringify(error) : error}</div>
//         ) : (
//           <Suspense fallback={<LoadingSpinner />}>
//             <TableList
//               title="Product List"
//               tableTitle="Products"
//               listData={products}
//               columns={[
//                 { key: 'SL', label: 'SL', render: (_, index) => index + 1 },
//                 {
//                   key: 'name',
//                   label: 'Product Name',
//                   sortable: true,
//                   onClick: () => handleSort('name'),
//                   render: (product) => (
//                     <Link to="#" className="media align-items-center gap-2">
//                       <img
//                         src={`${apiConfig.bucket}/${product.thumbnail}`}
//                         className="avatar border"
//                         alt={product.name}
//                       />
//                       <span className="hover-c1">{product.name}</span>
//                     </Link>
//                   ),
//                 },
//                 { key: 'productType', label: 'Product Type', textAlign: 'center' },
//                 {
//                   key: 'price',
//                   label: 'Unit Price',
//                   sortable: true,
//                   onClick: () => handleSort('price'),
//                   render: (product) => `PKR ${product.price}`,
//                 },
//                 {
//                   key: 'isFeatured',
//                   label: 'Show as Featured',
//                   textAlign: 'center',
//                   render: (product) => (
//                     <Switcher
//                       checked={product.isFeatured}
//                       onChange={() => handleToggleFeatured(product)}
//                     />
//                   ),
//                 },
//                 {
//                   key: 'actions',
//                   label: 'Actions',
//                   textAlign: 'center',
//                   render: (product) => (
//                     <div className="btn-group flex gap-3">
//                       <Link
//                         to={`/products/${product._id}`}
//                         className="btn border-primary text-primary"
//                         title="View"
//                       >
//                         <FiEye />
//                       </Link>
//                       <button
//                         className="btn btn-sm border-red-400 text-red-400 hover:bg-red-500 hover:text-white"
//                         onClick={() => handleDeleteProduct(product._id)}
//                         title="Delete"
//                       >
//                         <FiTrash />
//                       </button>
//                     </div>
//                   ),
//                 },
//               ]}
//               searchPlaceholder="Search products..."
//               itemsPerPage={10}
//             />
//           </Suspense>
//         )}
//       </div>
//     </div>
//   );
// };

// export default InHouseProductList;