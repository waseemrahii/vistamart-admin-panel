import React, { useState, useEffect, Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import FilterForm from "./FilterForm";
import { deleteProduct, fetchProducts, toggleFeatured, updateProductStatus } from "../../../../../redux/slices/admin/productSlice";
import { fetchBrands, fetchCategories } from "../../../../../redux/slices/admin/categorybrandSlice";
import LoadingSpinner from "../../../../../components/LoodingSpinner/LoadingSpinner";
import Pagination from "../../../../../components/Pagination";
import TableList from "./TableList";
import { Link } from "react-router-dom";
import apiConfig from "../../../../../config/apiConfig";
import Switcher from "../../../../../components/FormInput/Switcher";
import { FiEdit, FiEye, FiTrash } from "react-icons/fi";
import usePagination from "../../../../../hooks/usePagination";
const InHouseProductList = ({ initialTitle = 'Product List', initialFilters = {} }) => {
  const dispatch = useDispatch();
  const { loading, error, products, results, totalPages, currentPage } = useSelector((state) => state.product);
  const { categories, brands } = useSelector((state) => state.category);

  const { pagination, setPage } = usePagination(); // Defaults are now managed centrally

  const [filters, setFilters] = useState({
    brand: initialFilters.brand || "",
    category: initialFilters.category || "",
    searchValue: initialFilters.searchValue || '',
    userType: initialFilters.userType || '',
    userId: initialFilters.userId || '',
    status: initialFilters.status || '',
    vendorNew4Days: initialFilters.vendorNew4Days || false,
    minPrice: initialFilters.minPrice || '', 
    maxPrice: initialFilters.maxPrice || '',
    // page: 2, // Default page
    page: pagination.page, // Use the centralized pagination state
    limit: pagination?.limit, // Default limit per page
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
  }, [filters, dispatch]);

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page })); // Update the page number
  };
      // Rest of the component remains the same
      // const handlePageChange = (page) => setPage(page);
    

  return (
    <div className="content container-fluid">
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
                  render: (product) => `PKR ${product?.price}`,
                },
                {
                  key: 'brand',
                  label: 'Brand',
                  render: (product) => `${product?.brand?.name}`,
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
              itemsPerPage={filters.limit}
            />
          </Suspense>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={handlePageChange}
      />
    </div>
  );
};

export default InHouseProductList;
