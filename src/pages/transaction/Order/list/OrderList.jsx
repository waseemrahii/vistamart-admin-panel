import React, { useState, useEffect } from "react";
import { FaEye, FaDownload, FaSearch, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  deleteOrder,
  fetchOrder,
  updateOrderStatus,
} from "../../../../redux/slices/transaction/orderSlice";
import LoadingSpinner from "../../../../components/LoodingSpinner/LoadingSpinner";
import ExportButton from "../../../../components/ActionButton/Export";
import ActionButton from "../../../../components/ActionButton/Action";

const OrderList = () => {
  const dispatch = useDispatch();
  const {
    orders = [],
    loading,
    error,
  } = useSelector((state) => state.vendorOrder || {});

  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(3);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    dispatch(fetchOrder());
  }, [dispatch]);

  const handleUpdateStatus = (orderId, status) => {
    dispatch(updateOrderStatus({ orderId, status }));
    toast.success("Order status updated successfully!");
  };

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
        dispatch(deleteOrder(orderId));
        toast.success("Order deleted successfully!");
      }
    });
  };

  // Sort orders
  const sortedOrders = [...orders].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Search Logic
  const filteredOrders = sortedOrders.filter((order) => {
    const searchTerm = searchValue.toLowerCase();
    return (
      String(order?.orderId || "").toLowerCase().includes(searchTerm) ||
      String(order?.customer?.firstName || "").toLowerCase().includes(searchTerm) ||
      String(order?.customer?.lastName || "").toLowerCase().includes(searchTerm) ||
      String(order?.totalAmount || "").toLowerCase().includes(searchTerm)
    );
  });
  

  // Pagination Logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalOrders = filteredOrders.length;
  const totalPages = Math.ceil(totalOrders / ordersPerPage); // Calculate total pages

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort />;
  };

  if (loading)
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="content container-fluid">
      <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
        <h2 className="h1 mb-0 flex">
          <img src="/all-orders.png" className="mb-1 mr-1" alt="Orders" />
          <span className="page-header-title">All Orders</span>
        </h2>
        <span className="badge badge-soft-dark radius-50 fz-14">
          {orders.length}
        </span>
      </div>
      <div className="card mt-3">
        <div className="card-body">
          <div className="px-3 py-4 light-bg">
            <div className="flex flex-col md:flex-row items-center gap-4 justify-between align-items-center">
              <h5 className="mb-0 text-capitalize font-bold d-flex gap-2 mr-auto">
                Order List
                <span className="badge badge-soft-dark radius-50 fz-12 ml-1">
                  {orders.length}
                </span>
              </h5>
              <div className="flex flex-col md:flex-row items-end gap-4">
                <div className="input-group input-group-merge input-group-custom border border-primary">
                  <div className="input-group-prepend">
                    <div className="input-group-text">
                      <FaSearch />
                    </div>
                  </div>
                  <input
                    type="search"
                    name="searchValue"
                    className="form-control outline-none border border-primary"
                    placeholder="Search by Title, Code, or Customer"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="rounded-r-md px-4 py-2 bg-primary text-white hover:bg-primary-dark"
                    style={{ color: "white" }}
                  >
                    Search
                  </button>
                </div>
                <ExportButton
                  data={orders}
                  filename="OrderList"
                  icon={FaDownload}
                  label="Export"
                  className="bg-primary text-white hover:bg-primary-dark"
                  style={{ color: "white" }}
                />
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light bg-secondary">
                <tr className="w-full">
                  <th onClick={() => requestSort("orderId")} scope="flex">
                    Order ID {getSortIcon("orderId")}
                  </th>
                  <th onClick={() => requestSort("createdAt")} scope="flex">
                    Date {getSortIcon("createdAt")}
                  </th>
                  <th onClick={() => requestSort("customerName")} scope="flex">
                    Customer Name {getSortIcon("customerName")}
                  </th>
                  <th onClick={() => requestSort("store")} scope="flex">
                    Store {getSortIcon("store")}
                  </th>
                  <th onClick={() => requestSort("totalAmount")} scope="flex">
                    Amount {getSortIcon("totalAmount")}
                  </th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="text-truncate" style={{ maxWidth: "150px" }}>
                      {order?.orderId}
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : "Unknown Customer"}</td>
                    <td>{order.vendors?.[0]?.shopName || "Unknown Store"}</td>
                    <td>{order.totalAmount}</td>
                    <td>
                      {(() => {
                        const statusClass = {
                          pending: "bg-primary",
                          confirmed: "bg-blue-300",
                          packaging: "bg-yellow-300",
                          out_for_delivery: "bg-orange-300",
                          delivered: "bg-primary",
                          failed_to_deliver: "bg-red-500",
                          returned: "bg-gray-500",
                          canceled: "bg-red-300",
                        }[order.status] || "bg-gray-400";
                        return <span className={`badge ${statusClass} text-white`}>{order.status}</span>;
                      })()}
                    </td>
                                          <td>
                        {/* <Link
                        to={`/orderdetail/${order._id}`}
                          className="btn border-green-300 text-green-500 btn-sm"
                        >
                          <FaEye size={18} />
                        </Link>  */}
                        <ActionButton
                          to={`/orderdetail/${order._id}`}
                          icon={FaEye} // Pass dynamic icon
                          className="ml-4"
                       
                        />
                        {/* <button
                          className="btn bg-red-300 text-white btn-sm ml-2"
                          onClick={() => handleDeleteOrder(order._id)}
                        >
                          <FaTrashAlt size={18} />
                        </button>  */}
                      </td>

                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination-container">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn btn-outline-secondary"
            >
              Previous
            </button>
            <span className="mx-2">{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn btn-outline-secondary"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;








// import React, { useState, useEffect } from "react";
// import { FaEye, FaDownload, FaSearch } from "react-icons/fa";
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

// const OrderList = () => {
//   const dispatch = useDispatch();
//   const {
//     orders = [],
//     loading,
//     error,
//   } = useSelector((state) => state.vendorOrder || {});

//   // State for pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [ordersPerPage, setOrdersPerPage] = useState(10);

//   useEffect(() => {
//     dispatch(fetchOrder());
//   }, [dispatch]);

//   const handleUpdateStatus = (orderId, status) => {
//     dispatch(updateOrderStatus({ orderId, status }));
//     toast.success("Order status updated successfully!");
//   };

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
//         dispatch(deleteOrder(orderId));
//         toast.success("Order deleted successfully!");
//       }
//     });
//   };

//   // Pagination Logic
//   const indexOfLastOrder = currentPage * ordersPerPage;
//   const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
//   const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
//   const totalOrders = orders.length;

//   // Change Page
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   if (loading)
//     return (
//       <div>
//         <LoadingSpinner />
//       </div>
//     );
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="content container-fluid">
//       <div>
//         <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
//           <h2 className="h1 mb-0 flex">
//             <img src="/all-orders.png" className="mb-1 mr-1" alt="Orders" />
//             <span className="page-header-title">All Orders</span>
//           </h2>
//           <span className="badge badge-soft-dark radius-50 fz-14">
//             {orders.length}
//           </span>
//         </div>
//         <div className="card mt-3">
//           <div className="card-body">
//             <div className="px-3 py-4 light-bg">
//               <div className="flex flex-col md:flex-row items-center gap-4 justify-between  align-items-center">
//                 <h5 className="mb-0 text-capitalize font-bold d-flex gap-2 mr-auto">
//                   Order List
//                   <span className="badge badge-soft-dark radius-50 fz-12 ml-1">
//                     {orders.length}
//                   </span>
//                 </h5>
//                 <div className="flex flex-col md:flex-row items-end gap-4">
//                   <div className="input-group input-group-merge input-group-custom border border-primary">
//                     <div className="input-group-prepend">
//                       <div className="input-group-text">
//                         <FaSearch />
//                       </div>
//                     </div>
//                     <input
//                       type="search"
//                       name="searchValue"
//                       className="form-control outline-none border border-primary"
//                       placeholder="Search by Title, Code, or Customer"
//                       // value={searchValue}
//                       // onChange={handleSearchChange}
//                     />
//                     <button
//                       type="submit"
//                       className=" rounded-r-md px-4 py-2 bg-primary text-white hover:bg-primary-dark"
//                       style={{ color: "white" }}
//                     >
//                       Search
//                     </button>
//                   </div>
//                   <ExportButton
//                     data={orders} // Pass the data to export
//                     filename="OrderList" // Optional filename for the exported file
//                     icon={FaDownload} // Icon for the button
//                     label="Export " // Button label
//                     className="bg-primary text-white hover:bg-primary-dark" // Tailwind classes for styling
//                     style={{ color: "white" }} // Optional inline styles
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="table-responsive">
//               <table className="table table-hover mb-0">
//                 <thead className="table-light bg-secondary">
//                   <tr>
//                     <th scope="col">Order ID</th>
//                     <th scope="col">Date</th>
//                     <th scope="col">Customer Name</th>
//                     <th scope="col">Store</th>
//                     <th scope="col">Amount</th>
//                     <th scope="col">Status</th>
//                     <th scope="col">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {currentOrders.map((order) => (
//                     <tr key={order._id}>
//                       <td
//                         className="text-truncate"
//                         style={{ maxWidth: "150px" }}
//                       >
//                         {order?.orderId}
//                         {/* Display first 6 characters of order ID */}
//                       </td>
//                       <td>{new Date(order.createdAt).toLocaleDateString()}</td>
//                       <td>
//   {order.customer
//     ? `${order?.customer?.firstName} ${order?.customer?.lastName}`
//     : "Unknown Customer"}
// </td>
// <td>
//   {order.vendors && order.vendors.length > 0 && order.vendors[0] // Check if vendors exist and have at least one entry
//     ? order.vendors[0].shopName // Access shopName safely
//     : "Unknown Store"}
// </td>


//                       <td>{order.totalAmount}</td>
//                       <td>
//                         {(() => {
//                           switch (order.status) {
//                             case "pending":
//                               return (
//                                 <span className="badge bg-primary text-white">
//                                   Pending
//                                 </span>
//                               );
//                             case "confirmed":
//                               return (
//                                 <span className="badge bg-blue-300 text-white">
//                                   Confirmed
//                                 </span>
//                               );
//                             case "packaging":
//                               return (
//                                 <span className="badge bg-yellow-300 text-white">
//                                   Packaging
//                                 </span>
//                               );
//                             case "out_for_delivery":
//                               return (
//                                 <span className="badge bg-orange-300 text-white">
//                                   Out for Delivery
//                                 </span>
//                               );
//                             case "delivered":
//                               return (
//                                 <span className="badge bg-primary text-white">
//                                   Delivered
//                                 </span>
//                               );
//                             case "failed_to_deliver":
//                               return (
//                                 <span className="badge bg-red-500 text-white">
//                                   Failed to Deliver
//                                 </span>
//                               );
//                             case "returned":
//                               return (
//                                 <span className="badge bg-gray-500 text-white">
//                                   Returned
//                                 </span>
//                               );
//                             case "canceled":
//                               return (
//                                 <span className="badge bg-red-300 text-white">
//                                   Canceled
//                                 </span>
//                               );
//                             default:
//                               return (
//                                 <span className="badge bg-gray-400 text-white">
//                                   Unknown
//                                 </span>
//                               );
//                           }
//                         })()}
//                       </td>
//                       <td>
//                         {/* <Link
//                           to={`/orderdetail/${order._id}`}
//                           className="btn border-green-300 text-green-500 btn-sm"
//                         >
//                           <FaEye size={18} />
//                         </Link> */}
//                         <ActionButton
//                           to={`/orderdetail/${order._id}`}
//                           icon={FaEye} // Pass dynamic icon
//                           className="ml-4"
                       
//                         />
//                         {/* <button
//                           className="btn bg-red-300 text-white btn-sm ml-2"
//                           onClick={() => handleDeleteOrder(order._id)}
//                         >
//                           <FaTrashAlt size={18} />
//                         </button>  */}
//                       </td>
//                     </tr>
//                   ))}
//                   {currentOrders.length === 0 && (
//                     <tr>
//                       <td colSpan="7" className="text-center py-4">
//                         No orders found.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination Controls */}
//             <nav>
//               <ul className="pagination justify-content-center">
//                 {[...Array(Math.ceil(totalOrders / ordersPerPage))].map(
//                   (_, index) => (
//                     <li
//                       key={index}
//                       className={`page-item ${
//                         currentPage === index + 1 ? "active" : ""
//                       }`}
//                     >
//                       <button
//                         className="page-link"
//                         onClick={() => paginate(index + 1)}
//                       >
//                         {index + 1}
//                       </button>
//                     </li>
//                   )
//                 )}
//               </ul>
//             </nav>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderList;





