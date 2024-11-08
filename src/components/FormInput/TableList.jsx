import React, { useEffect, useState, lazy, memo } from "react";
import { FiSearch } from "react-icons/fi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai"; // Import sorting icons
import TableHeader from "./TableHeader";

const ExportButton = lazy(() => import("../ActionButton/Export"));

const TableList = memo(
	({
		title,
		tableTitle,
		listData = [],
		columns = [],
		exportFileName = "listData",
		searchPlaceholder = "Search...",
		itemKey = "_id",
		itemsPerPage = 7,
		imageSrc = "",
		headerActions,
	}) => {
		const [searchQuery, setSearchQuery] = useState("");
		const [filteredData, setFilteredData] = useState([]);
		const [currentPage, setCurrentPage] = useState(1);
		const [itemsPerPageState, setItemsPerPageState] = useState(itemsPerPage);
		const [sortConfig, setSortConfig] = useState({
			key: "",
			direction: "descending",
		}); // default to descending

		useEffect(() => {
			const filtered = searchQuery
				? listData.filter((item) =>
						item.name?.toLowerCase().includes(searchQuery.toLowerCase())
				  )
				: listData;

			// Sorting filtered data
			let sortedData = [...filtered];
			if (sortConfig.key) {
				sortedData.sort((a, b) => {
					if (a[sortConfig.key] < b[sortConfig.key]) {
						return sortConfig.direction === "ascending" ? -1 : 1;
					}
					if (a[sortConfig.key] > b[sortConfig.key]) {
						return sortConfig.direction === "ascending" ? 1 : -1;
					}
					return 0;
				});
			}

			setFilteredData(sortedData);
			setCurrentPage(1); // Reset to the first page when the data changes
		}, [listData, searchQuery, sortConfig]);

		const handleSearchChange = (e) => {
			setSearchQuery(e.target.value);
		};

		const indexOfLastItem = currentPage * itemsPerPageState;
		const indexOfFirstItem = indexOfLastItem - itemsPerPageState;
		const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

		const paginate = (pageNumber) => setCurrentPage(pageNumber);

		const totalPages = Math.ceil(filteredData.length / itemsPerPageState);

		const handleSort = (key) => {
			let direction = "descending"; // default to descending
			if (sortConfig.key === key && sortConfig.direction === "descending") {
				direction = "ascending"; // toggle direction
			}
			setSortConfig({ key, direction });
		};

		const generatePagination = (currentPage, totalPages) => {
			const range = [];
			const delta = 2;
			let left = Math.max(2, currentPage - delta);
			let right = Math.min(totalPages - 1, currentPage + delta);

			if (currentPage - delta > 2) {
				range.push(1, "...");
			} else {
				left = 1;
			}

			for (let i = left; i <= right; i++) {
				range.push(i);
			}

			if (currentPage + delta < totalPages - 1) {
				range.push("...", totalPages);
			} else {
				right = totalPages;
				range.push(totalPages);
			}

			return range;
		};

		const paginationNumbers = generatePagination(currentPage, totalPages);

		return (
			<div className="mt-3 bg-[#F9F9FB] pr-2 md:p-2 w-full">
				<ToastContainer />
				<TableHeader imageSrc={imageSrc} title={title} />
				<div className="card bg-white shadow-lg rounded-lg">
					<div className="flex items-start justify-between flex-col md:flex-row gap-4 px-3 py-4">
						<div className="flex gap-3 justify-center items-center">
							<h4 className="font-semibold text-lg">{tableTitle}</h4>
							<span className="badge badge-soft-dark ml-2 flex justify-center items-center">
								{filteredData.length}
							</span>
						</div>
						<div className="flex flex-col md:flex-row items-end gap-4">
							<form onSubmit={(e) => e.preventDefault()} className="flex-grow">
								<div className="flex border rounded-lg overflow-hidden">
									<div className="flex items-center justify-center px-3 ">
										<FiSearch />
									</div>
									<input
										type="search"
										value={searchQuery}
										onChange={handleSearchChange}
										className="form-control border-none outline-none  py-2 w-full md:w-48"
										placeholder={searchPlaceholder}
									/>
									<button
										type="submit"
										title="Search"
										className="bg-primary hover:bg-primary-dark text-white px-3 py-2 rounded-r-md"
									  style={{color:"white"}}
									>
										Search
									</button>
								</div>
							</form>

							{headerActions}

							<ExportButton
								data={filteredData}
								filename={exportFileName}
								title="Export"
								className="bg-primary text-white hover:bg-primary-dark px-4 py-2 rounded-md"
								label="Export"
							/>
						</div>
					</div>

					<div className="overflow-x-auto">
						<table className="min-w-full bg-white shadow-md rounded-lg">
							<thead className="bg-[#F7FAFF] text-white">
								<tr>
									{columns.map((col) => (
										<th
											key={col.key}
											onClick={() => handleSort(col.key)}
											className="px-4 py-3 text-center text-[#57596C] cursor-pointer"
										>
											<div className="flex items-center justify-center">
												<span>{col.label}</span>
												{/* Show arrow even if not sorted yet */}
												<span className="ml-2">
													{sortConfig.key === col.key ? (
														sortConfig.direction === "ascending" ? (
															<AiOutlineArrowUp
																className="text-gray-400"
																size={16}
															/>
														) : (
															<AiOutlineArrowDown
																className="text-gray-400"
																size={16}
															/>
														)
													) : (
														<AiOutlineArrowDown
															className="text-gray-400"
															size={16}
														/>
													)}
												</span>
											</div>
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{currentItems.map((item, index) => (
									<tr key={item[itemKey] || index} className="hover:bg-gray-50">
										{columns.map((col) => (
											<td
												key={col.key}
												className="px-4 py-3 text-center text-[#57596C]"
											>
												{col.render
													? col.render(
															item,
															index,
															currentPage,
															itemsPerPageState
													  )
													: item[col.key]}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Display Current Page and Total Pages */}
					<div className="flex justify-between items-center mx-4 text-black">
						<span>
							Page {currentPage} of {totalPages}
						</span>
						{/* Pagination */}
						<div className="flex justify-center md:justify-end m-4 space-x-1">
							<button
								onClick={() => paginate(currentPage - 1)}
								style={{ color: "white" }}
								disabled={currentPage === 1}
								className={`px-2 py-1 mx-1 rounded-lg transition-colors duration-300 ${
									currentPage === 1
										? "bg-green-300 text-white cursor-not-allowed"
										: "bg-green-300 hover:bg-gray-400 text-white"
								}`}
							>
								❮ {/* Previous Icon */}
							</button>

							<nav>
								<ul className="flex space-x-2">
									{paginationNumbers.map((pageNumber, index) => (
										<li key={index} className="mx-1">
											{pageNumber === "..." ? (
												<span className="px-2 py-1 text-gray-500 cursor-default">
													...
												</span>
											) : (
												<button
													onClick={() => paginate(pageNumber)}
													style={{ color: "white" }}
													className={`px-2 py-1 rounded-lg transition-all duration-300 ease-in-out ${
														currentPage === pageNumber
															? "bg-primary text-white font-bold shadow-md"
															: "bg-green-300 text-gray-800 hover:bg-green-300 hover:text-black"
													}`}
												>
													{pageNumber}
												</button>
											)}
										</li>
									))}
								</ul>
							</nav>

							<button
								onClick={() => paginate(currentPage + 1)}
								disabled={currentPage === totalPages}
								style={{ color: "white" }}
								className={`px-2 py-1 mx-1 rounded-lg transition-colors duration-300 ${
									currentPage === totalPages
										? "bg-green-300 text-gray-400 cursor-not-allowed"
										: "bg-green-300 hover:bg-green-400 text-white"
								}`}
							>
								❯ {/* Next Icon */}
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
);

export default TableList;
