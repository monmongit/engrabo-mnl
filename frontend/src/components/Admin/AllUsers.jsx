import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDelete, AiOutlineSearch } from "react-icons/ai";
import Loader from "../Layout/Loader";
import { getAllUsers, deleteUser } from "../../redux/action/user";

const AllUsers = () => {
  const { usersList, isLoading } = useSelector((state) => state.user);
  const { admin } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getAllUsers(admin._id));
  }, [dispatch, admin._id]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  const filteredUsers = usersList.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { field: "id", headerName: "User ID", minWidth: 100, flex: 1 },
    { field: "name", headerName: "User Name", minWidth: 100, flex: 1 },
    { field: "email", headerName: "User Email", minWidth: 150, flex: 1 },
    {
      field: "phonenumber",
      headerName: "User Phone Number",
      type: "string",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 130,
      flex: 0.5,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleDelete(params.row.id)}
        >
          <AiOutlineDelete size={20} />
          Delete
        </Button>
      ),
    },
  ];

  const rows = filteredUsers.map((user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    phonenumber: user.phoneNumber,
  }));

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div
          className="w-full px-0 sm:px-8 pt-1 mt-10 bg-white overflow-x-auto"
          style={{ marginBottom: "60px", borderRadius: "10px" }}
        >
          <div className="mx-4">
            <div className="w-full flex justify-end items-center mb-4">
              <div className="relative w-full sm:w-[40%] mt-5">
                <input
                  type="text"
                  placeholder="Search Users..."
                  className="h-10 sm:h-[45px] pl-4 pr-10 w-full  border-2 border-solid border-[#ff9800] rounded-md placeholder-[#9e8a4f] shadow-md transition ease-in-out duration-300  focus:outline-none hover:border-[#ff9800] hover:ring-[#ff9800] hover:ring-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <AiOutlineSearch
                  size={30}
                  className="absolute right-2 top-1.5 cursor-pointer"
                />
              </div>
            </div>
            <div className="w-full overflow-x-auto mb-10">
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                disableSelectionOnClick
                autoHeight
                className="data-grid"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllUsers;
