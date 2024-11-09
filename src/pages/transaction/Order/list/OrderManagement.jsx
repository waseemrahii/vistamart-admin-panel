import React, { useState, useEffect } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaDownload,
  FaEye,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  deleteOrder,
  fetchOrder,
} from "../../../../redux/slices/transaction/orderSlice";
import LoadingSpinner from "../../../../components/LoodingSpinner/LoadingSpinner";
import ExportButton from "../../../../components/ActionButton/Export";
import ActionButton from "../../../../components/ActionButton/Action";

const OrderManagement = ({ status, title }) => {
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const dispatch = useDispatch();
  const {
    orders = [],
    loading,
    error,
  } = useSelector((state) => state.vendorOrder || {});

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc"); // Sorting state
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchOrder({ status }));
  }, [dispatch, status]);

  // Filtering orders based on search query
  const filteredOrders = orders.filter(
    (order) =>
      (order.orderId &&
        order.orderId
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      order.customer?.firstName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      order.customer?.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sorting orders by Order ID
  const sortedOrders = filteredOrders.sort((a, b) => {
    const orderIdA = String(a.orderId); // Ensure orderId is treated as a string
    const orderIdB = String(b.orderId); // Ensure orderId is treated as a string

    if (sortOrder === "asc") {
      return orderIdA.localeCompare(orderIdB);
    } else {
      return orderIdB.localeCompare(orderIdA);
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteOrder = (orderId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteOrder(orderId))
          .then(() => toast.success("Order deleted successfully!"))
          .catch((err) =>
            toast.error(`Failed to delete order: ${err.message}`)
          );
      }
    });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  // Calculate the range of page numbers to display
  const pageRange = 5;
  let startPage = Math.max(1, currentPage - Math.floor(pageRange / 2));
  let endPage = Math.min(totalPages, currentPage + Math.floor(pageRange / 2));

  // Ensure that we always display `pageRange` number of buttons if possible
  if (endPage - startPage < pageRange - 1) {
    if (startPage > 1) {
      startPage = Math.max(1, endPage - pageRange + 1);
    } else {
      endPage = Math.min(totalPages, startPage + pageRange - 1);
    }
  }

  return (
    <div className="content container-fluid py-10">
      <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
        <h2 className="h1 mb-0 flex">
          <img src="/all-orders.png" className="mb-1 mr-1" alt="" />
          <span className="page-header-title">{title}</span> Orders
        </h2>
        <span className="badge badge-soft-dark radius-50 fz-14">
          {orders.length}
        </span>
      </div>
      <div className="">
        {/* <form id="form-data" method="GET">
            <div className="row gx-2">
              <div className="col-12 mb-3">
                <h4 className="mb-3 text-capitalize">Filter order</h4>
              </div>
            </div>
          </form> */}
        <div className="card mt-3">
          <div className="p-4 border-0">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 ">
              <div className="">
                <h5 className="form-label text-[1rem] font-semibold space-x-2 mb-0">
                  {title} Order Table
                  <span className="badge badge-soft-dark radius-50 fz-12 ml-1">
                    {orders.length}
                  </span>
                </h5>
              </div>
              <div className="flex flex-col md:flex-row items-end gap-4">
                <form className="mr-2">
                  <div className="input-group input-group-merge input-group-custom border border-primary">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <FaSearch />
                      </div>
                    </div>
                    <input
                      type="search"
                      name="searchValue"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="form-control outline-none border border-primary"
                      placeholder="Search by Order ID, Customer"
                    />
                    <button
                      type="submit"
                      className="rounded-r-md px-4 py-2 bg-primary text-white hover:bg-primary-dark"
                      style={{ color: "white" }}
                    >
                      Search
                    </button>
                  </div>
                </form>
                <ExportButton
                  data={paginatedOrders}
                  filename="OrderManagement"
                  icon={FaDownload}
                  label="Export"
                  className="bg-primary text-white hover:bg-primary-dark"
                  style={{ color: "white" }}
                />
              </div>
            </div>
          </div>
          <div className="overflow-auto mt-4">
            <table className="table table-striped text-nowrap">
              <thead className="bg-secondary">
                <tr>
                  <th>SL</th>
                  <th className="text-center">
                    <span
                      className="cursor-pointer"
                      onClick={() =>
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                      }
                    >
                      Order ID {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  </th>
                  <th>Order Date</th>
                  <th>C_Info</th>
                  <th>
                    <span
                      className="cursor-pointer"
                      onClick={() =>
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                      }
                    >
                      Amount {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  </th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders?.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  paginatedOrders?.map((order, index) => (
                    <tr key={order?._id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="text-center">{order?.orderId}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>
                        {order?.customer?.firstName} {order?.customer?.lastName}
                      </td>
                      <td>${order?.totalAmount}</td>
                      <td>
                        <span
                          className={`badge ${
                            order?.status === "pending"
                              ? "border-yellow-500"
                              : ""
                          }`}
                          style={{
                            padding: "0.3rem 0.7rem",
                            border: "1px solid rgb(221 196 23)",
                            color: "rgb(219 187 29)",
                            borderRadius: "10px",
                          }}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="text-center flex gap-2">
                        <ActionButton
                          to={`/orderdetail/${order?._id}`}
                          icon={FaEye}
                        />
                        {/* <ActionButton
                            onClick={() => handleDeleteOrder(order?._id)}
                            icon={FaTrash}
                            label="Delete"
                          /> */}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="flex items-center justify-center gap-3 my-6">
              {/* Previous Button */}
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-6 h-6 flex items-center justify-center rounded-full transition-all ${
                  currentPage === 1
                    ? "bg-black text-white cursor-not-allowed"
                    : "bg-primary hover:bg-primary-dark text-white"
                }`}
                style={{ color: "white" }}
              >
                <FaChevronLeft />
              </button>

              {/* Page Numbers */}
              {[...Array(endPage - startPage + 1)].map((_, index) => {
                const page = startPage + index;
                return (
                  <button
                    key={page}
                    onClick={() => paginate(page)}
                    className={`w-6 h-6 flex items-center justify-center rounded-full font-medium transition-all ${
                      currentPage === page
                        ? "bg-primary text-white shadow-md"
                        : "bg-primary-dark hover:bg-primary text-white"
                    }`}
                    style={{ color: "white" }}
                  >
                    {page}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`w-6 h-6 flex items-center justify-center rounded-full transition-all ${
                  currentPage === totalPages
                    ? "bg-black cursor-not-allowed"
                    : "bg-primary hover:bg-primary-dark text-white"
                }`}
                style={{ color: "white" }}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;

// import React, { useState, useEffect } from "react";
// import {
//   FaDownload,
//   FaEye,
//   FaSearch,
//   FaTrash,
//   FaTrashAlt,
// } from "react-icons/fa";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import Swal from "sweetalert2";
// import {
//   deleteOrder,
//   fetchOrder,
//   updateOrderStatus,
// } from "../../../../redux/slices/transaction/orderSlice";
// import LoadingSpinner from "../../../../components/LoodingSpinner/LoadingSpinner";
// import ExportButton from "../../../../components/ActionButton/Export";
// import ActionButton from "../../../../components/ActionButton/Action";

// const OrderManagement = ({ status, title }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const {
//     orders = [],
//     loading,
//     error,
//   } = useSelector((state) => state.vendorOrder || {});

//   const [searchQuery, setSearchQuery] = useState("");
//   const [category, setCategory] = useState("");
//   const [subCategory, setSubCategory] = useState("");
//   const [brand, setBrand] = useState("");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [dateType, setDateType] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   useEffect(() => {
//     dispatch(
//       fetchOrder({
//         status: status,
//       })
//     );
//   }, [dispatch, status]);

//   console.log;
//   const paginatedOrders = orders.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   // const handleUpdateStatus = (orderId, status) => {
//   //   dispatch(updateOrderStatus({ orderId, status }))
//   //     .then(() => toast.success("Order status updated successfully!"))
//   //     .catch((err) => toast.error(`Failed to update status: ${err.message}`));
//   // };

//   const handleDeleteOrder = (orderId) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         dispatch(deleteOrder(orderId))
//           .then(() => toast.success("Order deleted successfully!"))
//           .catch((err) =>
//             toast.error(`Failed to delete order: ${err.message}`)
//           );
//       }
//     });
//   };

//   const totalPages = Math.ceil(orders.length / itemsPerPage);

//   if (loading)
//     return (
//       <div>
//         <LoadingSpinner />
//       </div>
//     );
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="content container-fluid py-10">
//       <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
//         <h2 className="h1 mb-0 flex">
//           <img src="/all-orders.png" className="mb-1 mr-1" alt="" />
//           <span className="page-header-title">{title}</span> Orders
//         </h2>
//         <span className="badge badge-soft-dark radius-50 fz-14">
//           {orders.length}
//         </span>
//       </div>
//       <div className="card">
//         <div className="card-body">
//           <form id="form-data" method="GET">
//             <div className="row gx-2">
//               <div className="col-12 mb-3">
//                 <h4 className="mb-3 text-capitalize">Filter order</h4>
//               </div>
//               <div className="col-sm-6 col-lg-4 col-xl-3">
//                 <div className="form-group">
//                   <label className="title-color" htmlFor="from_date">
//                     Start date
//                   </label>
//                   <input
//                     type="date"
//                     name="from_date"
//                     value={fromDate}
//                     onChange={(e) => setFromDate(e.target.value)}
//                     id="from_date"
//                     className="form-control"
//                   />
//                 </div>
//               </div>
//               <div className="col-sm-6 col-lg-4 col-xl-3">
//                 <div className="form-group">
//                   <label className="title-color" htmlFor="to_date">
//                     End date
//                   </label>
//                   <input
//                     type="date"
//                     value={toDate}
//                     onChange={(e) => setToDate(e.target.value)}
//                     name="to_date"
//                     id="to_date"
//                     className="form-control"
//                   />
//                 </div>
//               </div>
//             </div>
//           </form>
//           <div className="card mt-3">
//             <div className="p-4 border-0">
//               <div className="flex flex-col md:flex-row justify-between items-center gap-4 ">
//                 <div className=" ">
//                   <h5 className="form-label text-[1rem] font-semibold space-x-2 mb-0">
//                     {title} Order Table
//                     <span className="badge badge-soft-dark radius-50 fz-12 ml-1">
//                       {orders.length}
//                     </span>
//                   </h5>
//                 </div>
//                 <div className=" flex flex-col md:flex-row items-end  gap-4">
//                   <form className="mr-2">
//                     <div className="input-group input-group-merge input-group-custom border border-primary">
//                       <div className="input-group-prepend">
//                         <div className="input-group-text">
//                           <FaSearch />
//                         </div>
//                       </div>
//                       <input
//                         type="search"
//                         name="searchValue"
//                         className="form-control outline-none border border-primary"
//                         placeholder="Search by Title, Code, or Customer"
//                         // value={searchValue}
//                         // onChange={handleSearchChange}
//                       />
//                       <button
//                         type="submit"
//                         className=" rounded-r-md px-4 py-2 bg-primary text-white hover:bg-primary-dark"
//                         style={{ color: "white" }}
//                       >
//                         Search
//                       </button>
//                     </div>
//                   </form>
//                   <div>
//                     {/* <button
//                       type="button"
//                       className="btn btn-outline-primary flex justify-center align-items-center gap-2 bg-green-400 text-white"
//                       onClick={() => navigate("/orders")}
//                     >
//                       <FaEye /> All Orders
//                     </button> */}
//                     <ExportButton
//                       data={paginatedOrders} // Pass the data to export
//                       filename="OrderManagment" // Optional filename for the exported file
//                       icon={FaDownload} // Icon for the button
//                       label="Export " // Button label
//                       className="bg-primary text-white hover:bg-primary-dark" // Tailwind classes for styling
//                       style={{ color: "white" }} // Optional inline styles
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="table-responsive mt-4">
//               <table className="table table-striped">
//                 <thead className="bg-secondary">
//                   <tr>
//                     <th>SL</th>
//                     <th className="text-center">Order ID</th>
//                     <th>Order Date</th>
//                     {/* <th>Product Name</th> */}
//                     <th>C_Info</th>
//                     <th>Amount</th>
//                     <th>Status</th>
//                     <th className="text-center">Actions</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {loading ? (
//                     <tr>
//                       <td colSpan="5" className="text-center">
//                         Loading...
//                       </td>
//                     </tr>
//                   ) : error ? (
//                     <tr>
//                       <td colSpan="5" className="text-center text-danger">
//                         {error}
//                       </td>
//                     </tr>
//                   ) : paginatedOrders.length === 0 ? (
//                     <tr>
//                       <td colSpan="5" className="text-center">
//                         No orders found
//                       </td>
//                     </tr>
//                   ) : (
//                     paginatedOrders.map((order) => (
//                       <tr key={order._id}>
//                         <td>1</td>
//                         <td className="text-center">
//                           {order?.orderId}
//                         </td>

//                         <td>
//                           {new Date(order.createdAt).toLocaleDateString()}
//                         </td>
//                         {/* <td>
//                           {order?.products
//                             .map((product) => product?.name)
//                             .join(", ")}
//                         </td> */}
//                         <td>
//                           {order.customer?.firstName} {order.customer?.lastName}
//                         </td>
//                         <td>${order.totalAmount}</td>
//                         <td>
//                           <span
//                             className={`badge
//                           ${
//                             order.status === "pending"
//                               ? "border-yellow-500"
//                               : ""
//                           }`}
//                             style={{
//                               padding: "0.3rem 0.7rem",
//                               border: "1px solid rgb(221 196 23)",
//                               color: "rgb(219 187 29)",
//                               borderRadius: "10px",
//                             }}
//                           >
//                             {order.status}
//                           </span>
//                         </td>

//                         <td className="text-center flex gap-2">
//                           {/* <button
//                           onClick={() => handleUpdateStatus(order._id, order.orderStatus === 'pending' ? 'confirmed' : 'pending')}
//                           className="btn btn-success btn-sm mx-2"
//                         >
//                           <PiStackSimpleBold />
//                         </button> */}

//                           <ActionButton
//                             to={`/orderdetail/${order._id}`}
//                             icon={FaEye} // Pass dynamic icon
//                             className="ml-4"

//                           />
//                           {/* <button
//                             onClick={() => handleDeleteOrder(order._id)}
//                             className="btn  border-red-500 text-red-500 btn-sm hover:bg-red-500 hover:text-white red-color"
//                           >
//                             <FaTrashAlt />
//                           </button> */}
//                           <ActionButton
//                             onClick={() => handleDeleteOrder(order._id)}
//                             icon={FaTrash} // Pass dynamic icon
//                             className="ml-4"
//                             label="Delete"
//                           />
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderManagement;
