import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllEventsAdmin, deleteEvent } from "../../redux/action/event";
import { Link } from "react-router-dom";
import { AiOutlineDelete, AiOutlineEye, AiOutlineSearch } from "react-icons/ai";
import Button from "@mui/material/Button";
import Loader from "../Layout/Loader";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import CreateEvent from "./CreateEvent";
import styles from "../../styles/style";
import { VscNewFile } from "react-icons/vsc";

const AllEvents = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { events, isLoading } = useSelector((state) => state.events);
  const { admin } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllEventsAdmin(admin._id));
  }, [dispatch, admin._id]);

  const handleDelete = (id) => {
    dispatch(deleteEvent(id));
    toast.success("Product event deleted successfully");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const getFilteredProducts = () => {
    return events.filter((event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 100,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "discount",
      headerName: "Discounted price",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "stock",
      headerName: "Stock",
      minWidth: 80,
      flex: 0.5,
    },
    {
      field: "sold",
      headerName: "Sold out",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "Preview",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        const d = params.row.name;
        const product_name = d.replace(/\s+/g, "-");
        return (
          <>
            <Link to={`/product/${product_name}`}>
              <Button variant="contained" color="primary">
                <AiOutlineEye size={20} />
                View
              </Button>
            </Link>
          </>
        );
      },
    },
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 130,
      headerName: "Delete",
      type: "number",
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          onClick={() => handleDelete(params.row.id)}
        >
          <AiOutlineDelete size={20} />
          Delete
        </Button>
      ),
    },
  ];

  const rows = getFilteredProducts().map((item) => ({
    id: item._id,
    name: item.name,
    price: "₱ " + item.originalPrice,
    discount: "₱ " + item.discountPrice,
    stock: item.stock,
    sold: item.sold_out, // Assuming sold count is static for demonstration
  }));

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div
          className="w-full sm:px-8 pt-1 mt-10 bg-white overflow-x-auto"
          style={{ marginBottom: "100px", borderRadius: "10px" }}
        >
          <div className="w-full flex justify-end items-center mb-4">
            <div className="relative mr-3 w-[40%]">
              <input
                type="text"
                placeholder="Search Products..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="h-10 sm:h-[45px] pl-4 pr-10 w-full  border-2 border-solid border-[#ff9800] rounded-md placeholder-[#9e8a4f] shadow-md transition ease-in-out duration-300  focus:outline-none hover:border-[#ff9800] hover:ring-[#ff9800] hover:ring-2"
              />
              <AiOutlineSearch
                size={30}
                className="absolute right-2 top-1.5 cursor-pointer"
              />
            </div>

            {/* Create Button */}
            <div
              className={`${styles.button} w-max h-10 px-4 rounded-md mb-3 ml-2 bg-[#ff9800] hover:bg-[#e68900] text-white flex items-center justify-center transition ease-in-out duration-300 cursor-pointer mr-3`}
              onClick={() => setOpen(true)}
            >
              <span className="text-white flex items-center justify-center">
                <VscNewFile size={20} className="mr-2" />
                Create Events
              </span>
            </div>
          </div>
          <div className="w-full overflow-x-auto mb-10">
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              disableSelectionOnClick
              autoHeight
            />
            {open && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <CreateEvent setOpen={setOpen} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AllEvents;
